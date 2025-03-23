using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ParkingModel;

[PrimaryKey(nameof(Timestamp), nameof(ParkingLotId))]
public class ParkingLotMeasurement
{
    public required DateTimeOffset Timestamp {get; set;}
    public ParkingLot ParkingLot {get; set;} = null!;
    public string ParkingLotId {get; set;} = null!;
    public required int AvailableSpaces {get; set;}
}
