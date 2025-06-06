namespace ParkingServer.Dtos;

public class LotMeasurementDto() {
    public required DateTimeOffset Timestamp {get; set;}

    public required int AvailableSpaces {get; set;}
}

public class LotMeasurementEvent(): LotMeasurementDto {
    public required Guid LotId {get; set;}
}

public class LotMeasurementsDto() {
    public required IEnumerable<LotMeasurementDto> Measurements {get; set;}

    public required Guid LotId {get; set;}
}