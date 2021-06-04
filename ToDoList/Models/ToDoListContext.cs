using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace ToDoList.Models
{
    public class ToDoListContext : DbContext
    {
        public DbSet<Task> Tasks { get; set; }
        public DbSet<Project> Projects { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Data Source = SQL5097.site4now.net; Initial Catalog = db_a75450_korsol; User Id = db_a75450_korsol_admin; Password = 172099ahs");
        }
        public ToDoListContext()
        {
            Database.EnsureCreated();
        }
    }
}
