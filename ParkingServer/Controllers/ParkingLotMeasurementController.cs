using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
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
    public async Task<ActionResult<LotMeasurementDto>> GetLatest(Guid lotId)
    {
        var res = await context.Measurements.Where(l => l.ParkingLotId == lotId).OrderByDescending(l => l.Timestamp).Select(l => new LotMeasurementDto
        {
            Timestamp = l.Timestamp,
            AvailableSpaces = l.AvailableSpaces
        }).FirstOrDefaultAsync();

        if (res != null)
        {
            return res;
        }
        else
        {
            return NotFound();
        }
    }

    [HttpGet("GetHistory")]
    public async Task<ActionResult<LotMeasurementsDto>> GetHistory(Guid lotId, int hours = 0, int days = 0)
    {
        if (hours == 0 && days == 0) {
            return BadRequest();
        }

        var sinceDateTime = DateTimeOffset.Now.Subtract(new TimeSpan(days, hours, 0, 0)).ToUniversalTime();

        var pl = await context.Lots
            .Where(l => l.LotId == lotId)
            .Include(pl => pl.Measurements
                .Where(m => m.Timestamp > sinceDateTime)
                .OrderBy(l => l.Timestamp))
            .FirstOrDefaultAsync();

        if (pl == null)
        {
            return NotFound();
        }

        var measurements = pl.Measurements
            .Select(l => new LotMeasurementDto
            {
                Timestamp = l.Timestamp,
                AvailableSpaces = l.AvailableSpaces
            });

        return new LotMeasurementsDto
        {
            LotId = pl.LotId,
            Measurements = measurements
        };
    }

    [HttpPost("AddMeasurement")]
    [Authorize(Roles = Roles.Roles.Admin)]
    public async Task<ActionResult> AddMeasurement(AddMeasurementDto addMeasurementDto)
    {
        var pl = await context.Lots.Where(l => l.LotId == addMeasurementDto.LotId).FirstOrDefaultAsync();
        if (pl == null)
        {
            return BadRequest($"Unknown lot {addMeasurementDto.LotId}");
        }
        ParkingLotMeasurement m = new()
        {
            ParkingLot = pl,
            AvailableSpaces = addMeasurementDto.AvailableSpaces,
            Timestamp = DateTimeOffset.Now.ToUniversalTime()
        };

        await context.Measurements.AddAsync(m);
        await context.SaveChangesAsync();

        await measurementsHub.Clients.All.SendAsync("OnMeasurement", new LotMeasurementEvent()
        {
            AvailableSpaces = m.AvailableSpaces,
            LotId = m.ParkingLotId,
            Timestamp = m.Timestamp
        });

        return Ok();
    }
}