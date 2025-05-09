using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using ParkingModel;
using ParkingServer.Dtos;
using Quartz;
using SignalRChat.Hubs;

class ReadingFromAPI
{
    public required string LotName { get; set; }
    public int AvailableSpaces { get; set; }

    public static Dictionary<string, int> MaxSpacesDict = new Dictionary<string, int>();

    static ReadingFromAPI()
    {
        MaxSpacesDict.Add("B5", 1361);
        MaxSpacesDict.Add("B3", 2063);
        MaxSpacesDict.Add("G3", 1379);
        MaxSpacesDict.Add("G6", 1608);
    }

    public static ReadingFromAPI randomWithName(string name)
    {
        if (!MaxSpacesDict.ContainsKey(name))
        {
            throw new Exception();
        }

        var rng = new Random();
        return new ReadingFromAPI()
        {
            LotName = name,
            AvailableSpaces = rng.Next(0, MaxSpacesDict[name])
        };
    }
}

public class ScrapeParkingDataJob(IHubContext<MeasurementsHub> hub, ParkingContext db) : IJob
{
    // Imagine we had some way to get accurate parking data but only by polling some HTTP endpoint.
    // This was what this was for, imagine this HTTP endpoint somehow existed and the data was somehow gotten.
    // This would leave the responsibility of pushing the new measurements to the DB, and emitting them over signalr so that
    // People who are looking at the graph view on the frontend have the most up to date data.
    public async Task Execute(IJobExecutionContext context)
    {
        var readings = ReadingFromAPI.MaxSpacesDict.Keys.Select(ReadingFromAPI.randomWithName).AsEnumerable();

        foreach (var r in readings)
        {
            var lot = await db.Lots.Where(l => l.LotName == r.LotName).FirstAsync();

            lot.Measurements.Add(new ParkingLotMeasurement
            {
                Timestamp = DateTimeOffset.Now.ToUniversalTime(),
                AvailableSpaces = r.AvailableSpaces
            });

            await db.SaveChangesAsync();
            await hub.Clients.All.SendAsync("OnMeasurement", new LotMeasurementEvent()
            {
                Timestamp = DateTimeOffset.Now,
                LotId = lot.LotId,
                AvailableSpaces = r.AvailableSpaces
            });
        }
    }
}