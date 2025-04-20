using Microsoft.AspNetCore.Identity;
using ParkingModel;
using Quartz;
using Quartz.AspNetCore;
using SignalRChat.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ParkingContext>();
builder.Services.AddIdentity<ParkingUser, IdentityRole>().AddEntityFrameworkStores<ParkingContext>();
builder.Services.AddSignalR();

builder.Services.AddQuartz(q =>
{
    var key = new JobKey("scrapeParkingDataJob");
    q.AddJob<ScrapeParkingDataJob>(opts => { opts.WithIdentity(key); });

    q.AddTrigger(opts => opts.ForJob(key).WithSimpleSchedule(x => x
        .WithIntervalInSeconds(5).RepeatForever()));
});

builder.Services.AddQuartzServer(opts =>
{
    opts.WaitForJobsToComplete = true;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(options =>
{
    options.AllowAnyHeader();
    options.AllowAnyMethod();
    options.AllowAnyOrigin();
});

app.UseAuthorization();

app.MapControllers();
app.MapHub<MeasurementsHub>("/measurementsHub");
app.Run();
