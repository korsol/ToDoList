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
      
      todolists: [],
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

  editTask(id){
    this.setState({updateTask : id});
  }


  addProject(){
    this.setState({addProject : true});
    this.setState({updateProject: false});
  }

  createTask(projectId, name) {
      let project = {
        id: projectId,
        projectName: name,
        tasks: [
          {
            deadline: this.state.dateInputValue,
            projectId: projectId,
            project: name,
            taskName: this.state.createTaskInput,
            taskStatus: 0,
            taskPriority: 0
          }
        ]
      } 
    if(this.validateText(this.state.createTaskInput) && this.validateDate(this.state.dateInputValue)){
      this.postData(project);
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

  deleteTask(TaskId){
    let project = {
      id: 0,
      projectName: '',
      tasks: [
        {
          id: TaskId,
          deadline: "2020-06-20T00:00:00",
          projectId: 0,
          project: '',
          taskName: '',
          taskStatus: 0,
          taskPriority: 0
        }
      ]
    }
    this.deleteData(project);
  }

  changeTaskStatus(TaskId, projectId, name, status, deadline){  
    status === 0? status = 1: status = 0
      let project = {
        id: 0,
        projectName: '',
        tasks: [
          {
            id: TaskId,
            deadline: deadline,
            projectId: projectId,
            project: '',
            taskName: name,
            taskStatus: status,
            taskPriority: 0
          }
        ]
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

  updateTask(taskId, projectId, status){
    let project = {
      id: projectId,
      projectName: '',
      tasks: [
        {
          id: taskId,
          deadline: this.editDateInput.value,
          projectId: projectId,
          project: '',
          taskName: this.editTaskInput.value,
          taskStatus: status,
          taskPriority: 0
        }
      ]
    }   
    if(
      this.validateText(this.state.editTaskInput) && this.validateDate(this.state.dateEditValue) 
      || this.validateText(this.editTaskInput.value) && this.validateDate(this.editDateInput.value)
    ){
      this.updateData(project);
      this.setState({updateTask : false});
    }
  }

//RENDERING------------------------------------------/
  rendTaskStatus(status, taskId, projectId, name, deadline){
      return (
        <input type="checkbox" checked={status === 0? "":"checked"}
        onChange={this.changeTaskStatus.bind(this, taskId, projectId, name, status, deadline)}
        />  
      );
  }
  
  rendTask(id, projectId, name, deadline, status){
      if (this.state.updateTask === id) {
        return(
          <div className="task-edit-form-container">
              <input type="text" onChange={this.handleTaskEditChange}
                ref={(input) => {this.editTaskInput = input}}
                className="task-form-input"
                defaultValue={name}
              />
              <input type="date" onChange={this.handleDateEditChange}
                ref={(input) => {this.editDateInput = input}}
                defaultValue={deadline.slice(0, -9)}
                className="task-form-date"
              />
              <div onClick={this.updateTask.bind(this, id, projectId, status)} className="task-edit-form-btn">
                <i className="fas fa-check"></i>
              </div>
          </div>
        );
      }else{
        return(
          <div className="task-container">
          <div className="task-checkbox-container">
            {this.rendTaskStatus(status, id, projectId, name, deadline)}
          </div>
          <div className={status === 0?"task-name": "task-name task-done"}>{name}</div>
          <div className={this.validateDate(deadline)? "task-deadline":"task-deadline notValidData" }>
            {deadline.slice(0, -9)}
          </div>
          <div className="task-nav">
            <div onClick={this.editTask.bind(this, id)} className="task-nav-edit-btn">
              <i className="fas fa-pencil-alt"></i>
            </div>
            <div onClick={this.deleteTask.bind(this, id)} className="task-nav-delete-btn">
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

  renderProjects(todolists) {
    return (
      <div>
        {todolists.map(todolist =>
            <div key={todolist.id} className="project-card">
              {this.rendProject(todolist.id, todolist.projectName)}
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
                  <button onClick={this.createTask.bind(this, todolist.id, todolist.name)}
                    className="task-form-btn">
                    Add Task
                  </button>
                </div>
              </div>
              <div className="task-list-container">
                {todolist.tasks.map(task =>
                  <li key={task.id} className="task-list-item">
                    {this.rendTask(task.id, task.projectId, task.taskName, task.deadline, task.taskStatus)}
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
      : this.renderProjects(this.state.todolists);

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
      this.setState({ todolists: data, loading: false });
    }

    async postData(project){
      let response = await fetch('ToDoList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(project)
      })
      let result = await response.json();
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
      let result = await response.json();
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
      let result = await response.json();
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
