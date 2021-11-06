var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");

var taskFormHandler = function(event) {
    event.preventDefault();
var taskNameInput = document.querySelector("input[name='task-name']").value;
var taskTypeInput = document.querySelector("select[name='task-type']").value;

if (!taskNameInput || !taskTypeInput) {
    alert("you need to fill out the task form");
    return false;
}
formEl.reset();
// make data a new object
var taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput
};

createTaskEl(taskDataObj);

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


pageContentEl.addEventListener("click", taskButtonHandler);

formEl.addEventListener("submit", taskFormHandler);