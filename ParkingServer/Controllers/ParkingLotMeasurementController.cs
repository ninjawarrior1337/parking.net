using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using ParkingModel;
using ParkingServer.Dtos;
using SignalRChat.Hubs;

namespace ParkingServer.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class ParkingLotMeasurementController(ParkingContext context, IHubContext<MeasurementsHub> measurementsHub) : ControllerBase
{
    [HttpGet("GetLatest")]
    public async Task<ActionResult<LotMeasurementDto>> GetLatest(string lotId)
    {
        var res = await context.Measurements.Where(l => l.ParkingLotId == lotId).OrderByDescending(l => l.Timestamp).Select(l => new LotMeasurementDto
        {
            Timestamp = l.Timestamp,
            AvailableSpaces = l.AvailableSpaces
        }).FirstOrDefaultAsync();

        if(res != null) {
            return res;
        } else {
            return NotFound();
        }
    }

    [HttpGet("GetPastDays")]
    public async Task<ActionResult<LotMeasurementsDto>> GetPastDays(string lotId, int days)
    {
        var sinceDateTime = DateTimeOffset.Now.Subtract(new TimeSpan(days, 0, 0, 0)).ToUniversalTime();
        var measurements = await context.Measurements
            .Where(l => l.ParkingLotId == lotId)
            .Where(l => l.Timestamp > sinceDateTime)
            .OrderBy(l => l.Timestamp)
            .Select(l => new LotMeasurementDto {
                Timestamp = l.Timestamp,
                AvailableSpaces = l.AvailableSpaces
            }).ToListAsync();

        if(measurements == null) {
            return new LotMeasurementsDto {
                LotId = lotId,
                Measurements = []
            };
        } else {
            return new LotMeasurementsDto {
                LotId = lotId,
                Measurements = measurements
            };
        }
    }

    [HttpPost("AddMeasurement")]
    [Authorize(Roles = Roles.Roles.Admin)]
    public async Task<ActionResult> AddMeasurement(AddMeasurementDto addMeasurementDto) {
        var pl = await context.Lots.Where(l => l.LotId == addMeasurementDto.LotId).FirstOrDefaultAsync();
        if(pl == null) {
            return BadRequest($"Unknown lot {addMeasurementDto.LotId}");
        }
        ParkingLotMeasurement m = new () {
            ParkingLot = pl,
            AvailableSpaces = addMeasurementDto.AvailableSpaces,
            Timestamp = DateTimeOffset.Now.ToUniversalTime()
        };

        await context.Measurements.AddAsync(m);
        await context.SaveChangesAsync();

        await measurementsHub.Clients.All.SendAsync("OnMeasurement", new LotMeasurementEvent() {
            AvailableSpaces = m.AvailableSpaces,
            LotId = m.ParkingLotId,
            Timestamp = m.Timestamp
        });

        return Ok();
    }
}