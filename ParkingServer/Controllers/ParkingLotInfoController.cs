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
            SpacesCount = l.SpacesCount
        }).ToListAsync();
    }
}