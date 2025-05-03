namespace ParkingServer.Dtos;

public class LotDto() {
    public required Guid LotId {get; set;}

    public required string LotName {get; set;}

    public required int SpacesCount {get; set;}
}