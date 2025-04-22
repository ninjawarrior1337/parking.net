using Microsoft.AspNetCore.SignalR;
using ParkingServer.Dtos;
using Quartz;
using SignalRChat.Hubs;

public class ScrapeParkingDataJob(IHubContext<MeasurementsHub> hub) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        await hub.Clients.All.SendAsync("OnMeasurement", new LotMeasurementEvent() {
            Timestamp = DateTimeOffset.Now,
            LotId = "bruh",
            AvailableSpaces = 300
        });
    }
}       