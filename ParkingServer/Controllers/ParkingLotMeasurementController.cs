using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ParkingModel;

namespace ParkingServer.Controllers;

[ApiController]
[Route("[controller]")]
public class ParkingLotMeasurementController(ParkingContext context) : ControllerBase
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

    [HttpGet("GetAllAfter")]
    public async Task<ActionResult<LotMeasurementsDto>> GetAllAfter(string lotId, DateTimeOffset dateTime)
    {
        var measurements = await context.Measurements.Where(l => l.ParkingLotId == lotId).Where(l => l.Timestamp > dateTime).Select(l => new LotMeasurementDto {
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
}