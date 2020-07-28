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
            optionsBuilder.UseSqlServer(@"Data Source = SQL5063.site4now.net; Initial Catalog = DB_A64ECD_theKorsol; User Id = DB_A64ECD_theKorsol_admin; Password = _29tETdHr!SBW8V");
        }
        public ToDoListContext()
        {
            Database.EnsureCreated();
        }
    }
}
