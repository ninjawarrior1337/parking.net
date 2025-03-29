using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ParkingModel;

namespace ParkingServer.Controllers;

[ApiController]
[Route("[controller]")]
public class SeedController(UserManager<ParkingUser> userManager) : ControllerBase
{
    [HttpPost("SeedUser")]
    public async Task SeedUser()
    {
        await userManager.CreateAsync(new () {
            UserName = "user",
            SecurityStamp = Guid.NewGuid().ToString(),
            Email = "user@example.com"
        }, "Passw0rd!");
    }
}
