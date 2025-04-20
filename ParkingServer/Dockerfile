FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy everything
COPY ./ParkingModel ./ParkingModel
COPY ./ParkingServer ./ParkingServer
# Restore as distinct layers
WORKDIR /app/ParkingServer

RUN dotnet restore
# Build and publish a release
RUN dotnet publish -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/ParkingServer/out .
ENTRYPOINT ["dotnet", "ParkingServer.dll"]