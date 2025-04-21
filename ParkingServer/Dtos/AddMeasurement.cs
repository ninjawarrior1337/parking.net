namespace ParkingServer.Dtos;

public class AddMeasurementDto
{
    public required string LotId { get; set; }
    public required int AvailableSpaces { get; set; }
}