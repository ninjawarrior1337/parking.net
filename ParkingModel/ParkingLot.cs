using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace ParkingModel;

public class ParkingLot {
    [Key]
    public Guid LotId {get; set;}

    public required string LotName {get; set;}

    public int SpacesCount {get; set;}

    public ICollection<ParkingLotMeasurement> Measurements {get;} = new List<ParkingLotMeasurement>();
}