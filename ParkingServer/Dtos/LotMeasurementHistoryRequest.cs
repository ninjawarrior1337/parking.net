namespace ParkingServer.Dtos;

public abstract class LotMeasurementHistoryRequest
{
    private LotMeasurementHistoryRequest() { }
    public required Guid LotId { get; set; }

    public sealed class WithDays : LotMeasurementHistoryRequest
    {
        public int Days { get; set; }
    }

    public sealed class WithHours : LotMeasurementHistoryRequest
    {
        public int Hours { get; set; }
    }

}