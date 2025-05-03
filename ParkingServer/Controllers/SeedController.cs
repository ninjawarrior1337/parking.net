using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ParkingModel;

namespace ParkingServer.Controllers;

[ApiController]
[Route("[controller]")]
public class SeedController(UserManager<ParkingUser> userManager, RoleManager<IdentityRole> roleManager) : ControllerBase
{
    [HttpPost("SeedAccounts")]
    [Authorize(Roles = Roles.Roles.Admin)]
    public async Task SeedAccounts()
    {
        if(!await roleManager.RoleExistsAsync(Roles.Roles.Admin)) {
            await roleManager.CreateAsync(new IdentityRole(Roles.Roles.Admin));
        }
        
        if(!await roleManager.RoleExistsAsync(Roles.Roles.User)) {
            await roleManager.CreateAsync(new IdentityRole(Roles.Roles.User));
        }

        ParkingUser user = new () {
            UserName = "user",
            SecurityStamp = Guid.NewGuid().ToString(),
            Email = "user@example.com",
        };
        await userManager.CreateAsync(user, "Passw0rd!");
        await userManager.AddToRoleAsync(user, Roles.Roles.User);

        ParkingUser admin = new () {
            UserName = "admin",
            SecurityStamp = Guid.NewGuid().ToString(),
            Email = "admin@example.com",
        };
        await userManager.CreateAsync(admin, "Passw0rd!");
        await userManager.AddToRoleAsync(admin, Roles.Roles.Admin);
    }
}
