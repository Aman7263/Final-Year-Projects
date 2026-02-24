let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {

    let text = document.getElementById("taskInput").value;
    let priority = document.getElementById("priority").value;
    let dueDate = document.getElementById("dueDate").value;

    if(text === "") return;

    tasks.push({
        text,
        priority,
        dueDate,
        completed:false
    });

    saveTasks();
    displayTasks();
}

function deleteTask(index) {
    tasks.splice(index,1);
    saveTasks();
    displayTasks();
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    displayTasks();
}

function displayTasks() {

    let list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((task,index)=>{

        let li = document.createElement("li");

        li.innerHTML = `
            <span onclick="toggleComplete(${index})"
            style="text-decoration:${task.completed ? 'line-through':''}">
            ${task.text} (${task.priority}) - ${task.dueDate}
            </span>

            <button onclick="deleteTask(${index})">Delete</button>
        `;

        list.appendChild(li);

    });
}

displayTasks();