using Microsoft.AspNetCore.SignalR;
using Quartz;
using SignalRChat.Hubs;

public class ScrapeParkingDataJob(IHubContext<MeasurementsHub> hub) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        // Code that sends a periodic email to the user (for example)
        // Note: This method must always return a value 
        // This is especially important for trigger listeners watching job execution
        // Console.WriteLine("hello 2 world");
        await hub.Clients.All.SendAsync("OnMeasurement", new ParkingModel.ParkingLotMeasurement() {
            Timestamp = DateTimeOffset.Now,
            ParkingLotId = "bruh",
            AvailableSpaces = 300
        });
    }
}       