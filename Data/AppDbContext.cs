using Microsoft.EntityFrameworkCore;
using SimplePostApp.Models;

namespace SimplePostApp.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Message> Messages => Set<Message>();
}
