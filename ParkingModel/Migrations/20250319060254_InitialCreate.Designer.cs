﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ParkingModel.Migrations
{
    [DbContext(typeof(ParkingContext))]
    [Migration("20250319060254_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("ParkingLot", b =>
                {
                    b.Property<string>("LotId")
                        .HasColumnType("text");

                    b.Property<int>("SpacesCount")
                        .HasColumnType("integer");

                    b.HasKey("LotId");

                    b.ToTable("Lots");
                });

            modelBuilder.Entity("ParkingModel.ParkingLotMeasurement", b =>
                {
                    b.Property<DateTimeOffset>("Timestamp")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("ParkingLotId")
                        .HasColumnType("text");

                    b.Property<int>("AvailableSpaces")
                        .HasColumnType("integer");

                    b.HasKey("Timestamp", "ParkingLotId");

                    b.HasIndex("ParkingLotId");

                    b.ToTable("Measurements");
                });

            modelBuilder.Entity("ParkingModel.ParkingLotMeasurement", b =>
                {
                    b.HasOne("ParkingLot", "ParkingLot")
                        .WithMany("Measurements")
                        .HasForeignKey("ParkingLotId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ParkingLot");
                });

            modelBuilder.Entity("ParkingLot", b =>
                {
                    b.Navigation("Measurements");
                });
#pragma warning restore 612, 618
        }
    }
}
