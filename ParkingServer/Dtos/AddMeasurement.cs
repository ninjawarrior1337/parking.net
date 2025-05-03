namespace ParkingServer.Dtos;

public class AddMeasurementDto
{
    public required Guid LotId { get; set; }
    public required int AvailableSpaces { get; set; }
}