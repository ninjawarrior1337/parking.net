using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ParkingModel;
using ParkingServer.Dtos;

namespace ParkingServer.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class AdminController(UserManager<ParkingUser> userManager, JwtHandler jwtHandler) : ControllerBase
{
    [HttpPost("Login")]
    public async Task<ActionResult<LoginResponse>> LoginAsync(Dtos.LoginRequest loginRequest)
    {
        ParkingUser? user = await userManager.FindByNameAsync(loginRequest.Username);

        if (user == null)
        {
            return Unauthorized();
        }

        bool success = await userManager.CheckPasswordAsync(user, loginRequest.Password);

        if (!success)
        {
            return Unauthorized();
        }

        var jwtToken = await jwtHandler.GetTokenAsync(user);

        string tokenString = new JwtSecurityTokenHandler().WriteToken(jwtToken);

        return Ok(new LoginResponse()
        {
            Success = true,
            Message = "Login successful",
            Token = tokenString
        });
    }
}