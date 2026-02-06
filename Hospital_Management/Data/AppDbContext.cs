using Microsoft.EntityFrameworkCore;
using Hospital_Management.Models;

namespace Hospital_Management.DAL
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Logins> Logins { get; set; }
        public DbSet<PatientDetails> PatientDetails { get; set; }

    }
}
