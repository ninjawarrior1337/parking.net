using Microsoft.EntityFrameworkCore;
using ParkingModel;

public class ParkingContext: DbContext {
    public DbSet<ParkingLot> Lots { get; set; }
    public DbSet<ParkingLotMeasurement> Measurements { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql($"Host=maru;Username=postgres;Database=csun_parking_dotnet");
    }
}