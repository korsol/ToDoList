using System;
using ToDoList.Models;
using System.Text.Json.Serialization;

namespace ToDoList
{
    public class Task
    {
        public int Id { get; set; }
        public string TaskName { get; set; }
        public int TaskStatus { get; set; }
        public int TaskPriority { get; set; }
        public DateTime Deadline { get; set; }
        public int ProjectId { get; set; }
        [JsonIgnore]
        public Project Project { get; set; }

    }
}
