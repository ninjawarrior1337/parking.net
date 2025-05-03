using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ParkingModel;
using ParkingServer.Dtos;

namespace ParkingServer.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class ParkingLotInfoController(ParkingContext context) : ControllerBase
{
    [HttpGet("GetAllLots")]
    public async Task<ActionResult<IEnumerable<LotDto>>> GetAllLots()
    {
        return await context.Lots.Select(l => new LotDto {
            LotId = l.LotId,
            LotName = l.LotName,
            SpacesCount = l.SpacesCount
        }).ToListAsync();
    }

    [HttpGet("GetLotById")]
    public async Task<ActionResult<LotDto>> GetLotById(Guid lotId)
    {
        var lot = await context.Lots.Where(l => l.LotId == lotId).Select(l => new LotDto {
            LotId = l.LotId,
            LotName = l.LotName,
            SpacesCount = l.SpacesCount
        }).FirstOrDefaultAsync();

        if(lot == null) {
            return NotFound();
        } else {
            return lot;
        }
    }
}