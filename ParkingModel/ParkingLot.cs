using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using ParkingModel;

public class ParkingLot {
    [Key]
    public required string LotId {get; set;}

    public int SpacesCount {get; set;}

    public ICollection<ParkingLotMeasurement> Measurements {get;} = new List<ParkingLotMeasurement>();
}