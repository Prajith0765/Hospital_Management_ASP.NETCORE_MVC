using Microsoft.EntityFrameworkCore;
using Hospital_Management.Models;

namespace Hospital_Management.DAL
{
    // The AppDbContext class is the Entity Framework Core database context for the hospital management system.
    // It manages the connection to the database and provides DbSet properties for accessing the Logins and PatientDetails tables.
    public class AppDbContext : DbContext
    {
        // Constructor to initialize the AppDbContext with options provided through dependency injection.
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        // DbSet properties represent the tables in the database.
        // allow to query and save instances of the Logins and PatientDetails entities.
        public DbSet<Logins> Logins { get; set; }
        public DbSet<PatientDetails> PatientDetails { get; set; }

    }
}
