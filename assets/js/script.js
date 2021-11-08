var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

var taskFormHandler = function(event) {
    event.preventDefault();
var taskNameInput = document.querySelector("input[name='task-name']").value;
var taskTypeInput = document.querySelector("select[name='task-type']").value;

if (!taskNameInput || !taskTypeInput) {
    alert("you need to fill out the task form");
    return false;
}
formEl.reset();

var isEdit = formEl.hasAttribute("data-task-id");

// checks for data-task-id on formEL to decide whether to create a new task or update existing task in "edit"
if(isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
}
else {
// make data a new object
var taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput,
    status: "to do"
};

createTaskEl(taskDataObj);

  }

};

var createTaskEl = function(taskDataObj) {
    
// create list item
var listItemEl = document.createElement("li");
listItemEl.className = "task-item" ;
// give a task id as an custom attribute
listItemEl.setAttribute("data-task-id", taskIdCounter);
// create div to hold task info add to list item
var taskInfoEl = document.createElement("div");
// give it a classname
taskInfoEl.className = "task-info";
// add HTML content to div
taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

listItemEl.appendChild(taskInfoEl);

// creeate id property for taskData object that is equal to the taskIdCounter
taskDataObj.id = taskIdCounter;

// push the task data object into our tasks array
tasks.push(taskDataObj);
saveTasks();

var taskActionsEl = createTaskActions(taskIdCounter);

listItemEl.appendChild(taskActionsEl);

// add entire list item to the list
tasksToDoEl.appendChild(listItemEl);

// increase the counter for the next unique id
taskIdCounter++;

};

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";
   
    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit"
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id" ,taskId);

    // append edit button to newly made div
    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);
    
    // create a select menu
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // apend to the select element
        statusSelectEl.appendChild(statusOptionEl);
    }
    return actionContainerEl;

}

var taskButtonHandler = function(event) {
    // get targe element from event
  var targetEl = event.target;
  var taskId = targetEl.getAttribute("data-task-id");
  // edit was clicked
  if(targetEl.matches(".edit-btn")) {
      
      editTask(taskId);
  }
  // delete button was clicked
  else if (targetEl.matches(".delete-btn")) {
      
      deleteTask(taskId);
  }

  
};

var deleteTask = function(taskId) {
   var taskSelected = document.querySelector(".task-item[data-task-id='"+ taskId +"']");
  taskSelected.remove();

  // create new array to hold an updated task list
  var updatedTaskArray =[];

  // loop through current tasks
  for (var i = 0; i < tasks.length; i++) {
      // if task[i].id doesnt match the value of taskId, lets keep that task
      if (tasks[i].id !== parseInt(taskId)) {
          updatedTaskArray.push(tasks[i]);
      }
  }
  // reassign tasks array to be the same as updatedTaskArray
  tasks = updatedTaskArray;
  saveTasks();
  
};

var editTask = function(taskId) {
    console.log("editing task #" + taskId);
    // get task list element
var taskSelected = document.querySelector(".task-item[data-task-id='"+ taskId +"']");

// get content from task name and type
var taskName = taskSelected.querySelector("h3.task-name").textContent;


var taskType = taskSelected.querySelector("span.task-type").textContent;
document.querySelector("input[name='task-name']").value = taskName;
document.querySelector("select[name='task-type']").value = taskType;
document.querySelector("#save-task").textContent = "Save Task";
formEl.setAttribute("data-task-id", taskId);
};

var completeEditTask= function  (taskName, taskType, taskId) {
    // find matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='"+ taskId + "']");


    // set new values 
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

// loop through tasks array and task object with new content
for(var i = 0; i < tasks.length; i++) {
    if(tasks[i].id === parseInt(taskId)) {
        tasks[i].name = taskName;
        tasks[i].type = taskType;
    }
};
saveTasks();

    alert("tassk now complete");

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";

};
var loadTasks = function() {
   
   var  savedTasks = localStorage.getItem("tasks");
  

    if (!savedTasks) {
        return false;
    }

    savedTasks = JSON.parse(savedTasks);
  for(var i = 0; i < savedTasks.length; i++) {
      // pass each task object into the createTaskEl() function
      createTaskEl(savedTasks[i]);
  }
   

};

var taskStatusChangeHandler = function(event) {
    
 // get the task item id
 var taskId = event.target.getAttribute("data-task-id");

 // get the currently selected options value and convert to lowercase
 var statusValue = event.target.value.toLowerCase();

 // find the parent task item element based on the id
 var taskSelected = document.querySelector(".task-item[data-task-id='"+ taskId +"']");

 if (statusValue === "to do") {
     tasksToDoEl.appendChild(taskSelected);
 }
 else if (statusValue === "in progress") {
     tasksInProgressEl.appendChild(taskSelected);
 }
 else if (statusValue === "completed") {
     tasksCompletedEl.appendChild(taskSelected);
 }
 // update task's in task array
 for (var i =0; i < tasks.length; i++) {
     if (tasks[i].id === parseInt(taskId)) {
         tasks[i].status = statusValue;
     }
 }
 saveTasks();
};

var saveTasks = function() {
localStorage.setItem("tasks", JSON.stringify(tasks));
};

pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("click", taskButtonHandler);

formEl.addEventListener("submit", taskFormHandler);

loadTasks();