import React, { Component } from 'react';

export class ToDoList extends Component {
    static displayName = ToDoList.name;

  constructor(props) {
    super(props);
    this.handleProjectInput = this.handleProjectInput.bind(this);

    this.handleTaskInputChange = this.handleTaskInputChange.bind(this);
    this.handleDateInputChange = this.handleDateInputChange.bind(this);

    this.handleTaskEditChange = this.handleTaskEditChange.bind(this);
    this.handleDateEditChange = this.handleDateEditChange.bind(this);
    
    this.state = {
      projectInput:"",
      createTaskInput: "",
      editTaskInput:"",
      dateInputValue:"",
      dateEditValue:"",
      
      projects: [],
        loading: true,
        updateProject: false,
        updateTask: false,
        addProject: false,
        taskInput:""
      };
  }

  componentDidMount() {
      this.populateData(); 
    }
  
  createProject() {
    let project ={
      projectName: this.state.projectInput,
    }
    if(this.validateText(this.state.projectInput)){
      this.postData(project);
      this.state.projectInput = "";
      this.setState({addProject: false})
    }
  }

  deleteProject(projectId){
    let project ={
      id: projectId
    }
    this.deleteData(project);
  }

  editProject(id){
    this.setState({updateProject : id});
    this.setState({addProject : false});
  }

  editTask(task){
    this.setState({updateTask : task.id});
  }


  addProject(){
    this.setState({addProject : true});
    this.setState({updateProject: false});
  }

  createTask(project) {
      let taskPr = project.tasks.length == 0 ? 0 : project.tasks[project.tasks.length - 1].taskPriority + 1
      let UpdatedProject = {
        id: project.id,
        projectName: project.projectName,
        tasks: [
          {
            deadline: this.state.dateInputValue,
            projectId: project.id,
            project: project.projectName,
            taskName: this.state.createTaskInput,
            taskStatus: 0,
            taskPriority: taskPr
          }
        ]
      } 
    if(this.validateText(this.state.createTaskInput) && this.validateDate(this.state.dateInputValue)){
      this.postData(UpdatedProject);
      this.setState({createTaskInput: ""}); 
    }
    else{
      
      this.populateData();
    }
  }

//HANDLERS----------------------------------------------------------------/
  handleProjectInput(event){
    this.setState({projectInput: event.target.value});
    if(this.validateText(event.target.value)){
      event.target.className ="project-edit-form-input"
      event.target.placeholder = "Start typing here to create new task"
    }
    else{
      event.target.className +=" notValid"
      event.target.placeholder = "Enter project name!"
    }
  }


  handleTaskInputChange(event){
    this.setState({createTaskInput: event.target.value});
    if(this.validateText(event.target.value)){
      event.target.className ="task-form-input"
      event.target.placeholder = "Start typing here to create new task"
    }
    else{
      event.target.className +=" notValid"
      event.target.placeholder = "Enter task name!"
    }
  }

  handleDateInputChange(event){
    this.setState({dateInputValue: event.target.value});

    this.validateDate(event.target.value)?
     event.target.className ="task-form-date"
    :event.target.className +=" notValid"    
  }

  handleTaskEditChange(event){
    this.setState({editTaskInput: event.target.value});
    if(this.validateText(event.target.value)){
      event.target.className ="task-form-input"
      event.target.placeholder = "Start typing here to create new task"
    }
    else{
      event.target.className +=" notValid"
      event.target.placeholder = "Enter task name!"
    }
  }

  handleDateEditChange(event){
    this.setState({dateEditValue: event.target.value});

    this.validateDate(event.target.value)?
     event.target.className ="task-form-date"
    :event.target.className +=" notValid"    
  }

//HANDLERS----------------------------------------------------------------/

  deleteTask(task){
    let project = {
      id: 0,
      projectName: '',
      tasks: [ task ]
    }
    this.deleteData(project);
  }

  changeTaskStatus(task){  
    task.taskStatus === 0? task.taskStatus = 1: task.taskStatus = 0
      let project = {
        id: 0,
        projectName: '',
        tasks: [ task ]
      }      
      this.updateData(project);
  }

  updateProject(id){
    let project = {
      id: id,
      projectName: this.editProjectInput.value,
    }      
    if(this.validateText(this.state.projectInput) || this.validateText(this.editProjectInput.value)){
      this.updateData(project);
      this.setState({updateProject : false});
    }
  }

  updateTask(task){
    task.deadline = this.editDateInput.value
    task.taskName = this.editTaskInput.value
    let project = {
      id: task.projectId,
      projectName: '',
      tasks: [ task ]
    }   
    if(
      this.validateText(this.state.editTaskInput) && this.validateDate(this.state.dateEditValue) 
      || this.validateText(this.editTaskInput.value) && this.validateDate(this.editDateInput.value)
    ){
      this.updateData(project);
      this.setState({updateTask : false});
    }
  }

  сhangeTaskPriority(task, changeVal){
    let project = this.state.projects.find((pr) => pr.id == task.projectId )
    let adjacentTask
    for (let i = 1; i <= project.tasks.length; i++) {
      let findedTask = project.tasks.find((tsk)=> tsk.taskPriority == (task.taskPriority + (changeVal * i)))
      console.log(changeVal * i)
      if (findedTask != undefined){
        adjacentTask = findedTask
        break
      }
    }
    
    if (adjacentTask != undefined){
      let taskPriorityBuffer = task.taskPriority
      task.taskPriority = adjacentTask.taskPriority
      adjacentTask.taskPriority = taskPriorityBuffer

      project.tasks = [task]
      this.updateData(project);
      project.tasks = [adjacentTask]
      this.updateData(project);
    }

  }

//RENDERING------------------------------------------/
  rendTaskStatus(task){
      return (
        <input type="checkbox" checked={task.taskStatus === 0? "":"checked"}
        onChange={this.changeTaskStatus.bind(this, task)}
        />  
      );
  }
  
  rendTask(task){
      if (this.state.updateTask === task.id) {
        return(
          <div className="task-edit-form-container">
              <input type="text" onChange={this.handleTaskEditChange}
                ref={(input) => {this.editTaskInput = input}}
                className="task-form-input"
                defaultValue={task.taskName}
              />
              <input type="date" onChange={this.handleDateEditChange}
                ref={(input) => {this.editDateInput = input}}
                defaultValue={task.deadline.slice(0, -9)}
                className="task-form-date"
              />
              <div onClick={this.updateTask.bind(this, task)} className="task-edit-form-btn">
                <i className="fas fa-check"></i>
              </div>
          </div>
        );
      }else{
        return(
          <div className="task-container">
          <div className="task-checkbox-container">
            {this.rendTaskStatus(task)}
          </div>
          <div className={task.taskStatus === 0?"task-name": "task-name task-done"}>{task.taskName}</div>
          <div className={this.validateDate(task.deadline)? "task-deadline":"task-deadline notValidData" }>
            {task.deadline.slice(0, -9)}
          </div>
          <div className="task-nav">
            <div className="task-nav-priority-container">
              <div onClick={this.сhangeTaskPriority.bind(this, task, -1)} className="task-nav-priority-btn" >
                <i className="fas fa-angle-up"></i>
              </div>
              <div onClick={this.сhangeTaskPriority.bind(this, task, 1)} className="task-nav-priority-btn">
                <i className="fas fa-angle-down"></i>
              </div>
            </div>
            <div onClick={this.editTask.bind(this, task)} className="task-nav-edit-btn">
              <i className="fas fa-pencil-alt"></i>
            </div>
            <div onClick={this.deleteTask.bind(this, task)} className="task-nav-delete-btn">
              <i className="fas fa-trash-alt"></i>
            </div>
          </div>
              
        </div>  
        );
      }   
  }

  rendProject(id, name){
    if(this.state.updateProject === id){
      return(
        <div className="project-header">
          <input type="text" onChange={this.handleProjectInput}
            ref={(input) => {this.editProjectInput = input}}
            className="project-edit-form-input" defaultValue={name}
          />
          <div onClick={this.updateProject.bind(this, id, name)} className="project-edit-form-input-btn">
            <i className="fas fa-check"></i>
          </div>
      </div>
      );
    } else{
      return(
        <div className="project-header">
          <i className="fas fa-clipboard-list"></i>
          <h3 className="project-header-name">{name}</h3>
          <div onClick={this.editProject.bind(this, id)} className="project-header-edit-btn">
            <i className="fas fa-pencil-alt"></i>
          </div>
          <div onClick={this.deleteProject.bind(this, id)} className="project-header-delete-btn">
            <i className="fas fa-trash-alt"></i>
          </div>
        </div>
      );
    }

  }

  rendProjectform(){
    if (this.state.addProject) {
      return(
        <div className="project-header">
            <input type="text" onChange={this.handleProjectInput}
              className="project-edit-form-input" placeholder="Enter new project"
            />
            <div onClick={this.createProject.bind(this)} className="project-edit-form-input-btn">
              <i className="fas fa-check"></i>
            </div>
        </div>
      );
    }else{
      return(
        <div onClick={this.addProject.bind(this)} className="add-project-btn">
          <i className="fas fa-plus add-project-icon"></i>
          Add TODO list
        </div>
      );
    }
  }

  renderProjects(projects) {
    return (
      <div>
        {projects.map(project =>
            <div key={project.id} className="project-card">
              {this.rendProject(project.id, project.projectName)}
              <div className="container mt-3">
                <div className="task-form-container">
                  <div className="task-form-input-container">
                    <i className="fas fa-plus"></i>
                    <input type="text" onChange={this.handleTaskInputChange}
                     className="task-form-input" placeholder="Start typing here to create new task"
                    />
                  </div>
                  <div className="task-form-date-container">
                    <input type="date" onChange ={this.handleDateInputChange}
                      className="task-form-date"
                    />
                  </div>
                  <button onClick={this.createTask.bind(this, project)}
                    className="task-form-btn">
                    Add Task
                  </button>
                </div>
              </div>
              <div className="task-list-container">
                {project.tasks.sort((firstTask, secondTask) => firstTask.taskPriority - secondTask.taskPriority )
                              .map(task =>
                  <li key={task.id} className="task-list-item">
                    {this.rendTask(task)}
                  </li>
                )}
              </div>
            </div>
        )}
      </div>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : this.renderProjects(this.state.projects);

    return (
      <div className="main-container">
        {contents}
        {this.rendProjectform()}
      </div>
    );
  }
//RENDERING------------------------------------------/

//ASYNC REQESTS------------------------------------------/
    async populateData() {       
      const response = await fetch('ToDoList');
      const data = await response.json();
      this.setState({ projects: data, loading: false });
    }

    async postData(project){
      let response = await fetch('ToDoList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(project)
      })
      this.populateData();
    }

    async deleteData(project){
      let response = await fetch('ToDoList', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(project)
      })
      this.populateData();
    }

    async updateData(project){
      let response = await fetch('ToDoList', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(project)
      })
      this.populateData();
    }
//ASYNC REQESTS------------------------------------------/

//VALIDATIONS---------------------------------------------/

validateText(text){
  if(text ===""){
    return false
  }
  else if (text.length > 2 && text.length < 41 ) {
      return true
    }
}

validateDate(date){
  let dateNow = new Date().toLocaleDateString("en-EN");
  let dateTask = new Date(date).toLocaleDateString("en-EN");  
  if(Number(new Date(dateNow)) > Number(new Date(dateTask))){
    return false
  }else{
    return true
  }
}
}