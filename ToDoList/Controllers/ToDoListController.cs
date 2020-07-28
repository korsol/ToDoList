using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ToDoList.Models;

namespace ToDoList.Controllers
{
    
    [ApiController]
    [Route("[controller]")]
    public class ToDoListController : ControllerBase
    {
        ToDoListContext db = new ToDoListContext();

        private readonly ILogger<ToDoListController> _logger;

        public ToDoListController(ILogger<ToDoListController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<Project> Get()
        {
            var projects = db.Projects.Include(p => p.Tasks);
            var data = projects.ToArray();

            return data;
        }

        [HttpPost]
        public IActionResult Post (Project project)
        {
            if(project.Tasks.Count != 0)
            {
                var task = new Task();
                task = project.Tasks.FirstOrDefault() ;
                db.Tasks.Add(task);
                db.SaveChanges();
            }
            else
            {
                db.Projects.Add(project);
                db.SaveChanges();
            }

            return Ok(project);
        }

        [HttpDelete]
        public IActionResult Delete (Project project)
        {
            if (project.Tasks.Count != 0)
            {
                var proj = db.Tasks.FirstOrDefault(pr => pr.Id == project.Tasks.FirstOrDefault().Id);
                db.Tasks.Remove(proj);
                db.SaveChanges();
            }
            else
            {
                var proj = db.Projects.FirstOrDefault(pr => pr.Id == project.Id);
                db.Projects.Remove(proj);
                db.SaveChanges();
            }


            return Ok(project);
        }

        [HttpPut]
        public IActionResult Put(Project project)
        {
            if (project.Tasks.Count != 0)
            {
                var task = project.Tasks.FirstOrDefault();
                db.Tasks.Update(task);
                db.SaveChanges();

                return Ok(project);
            }
            else
            {
                db.Projects.Update(project);
                db.SaveChanges();

                return Ok(project);
            }


        }
    }
}
