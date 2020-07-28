using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ToDoList.Models;

namespace ToDoList.Models
{
    public class Project
    {
        public int Id { get; set; }
        public string ProjectName { get; set; }
        
        public ICollection<Task> Tasks { get; set; }

        public Project()
        {
            Tasks = new List<Task>();
        }

    }
}
