using Quartz;

public class ScrapeParkingDataJob : IJob
{
    public Task Execute(IJobExecutionContext context)
    {
        // Code that sends a periodic email to the user (for example)
        // Note: This method must always return a value 
        // This is especially important for trigger listeners watching job execution
        // Console.WriteLine("hello 2 world");
        
        return Task.CompletedTask;
    }
}       