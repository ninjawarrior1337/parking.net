using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ParkingModel;

[PrimaryKey(nameof(Timestamp), nameof(ParkingLotId))]
public class ParkingLotMeasurement
{
    public required DateTimeOffset Timestamp {get; set;}
    public ParkingLot ParkingLot {get; set;} = null!;
    public Guid ParkingLotId {get; set;}
    public required int AvailableSpaces {get; set;}
}
