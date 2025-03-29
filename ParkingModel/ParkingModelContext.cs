using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ParkingModel;

public class ParkingContext: IdentityDbContext<ParkingUser> {
    public DbSet<ParkingLot> Lots { get; set; }
    public DbSet<ParkingLotMeasurement> Measurements { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if(optionsBuilder.IsConfigured) {return;}
        var cfg = new ConfigurationBuilder().AddEnvironmentVariables().Build();
        optionsBuilder.UseNpgsql(cfg.GetConnectionString("postgres"));
    }
}