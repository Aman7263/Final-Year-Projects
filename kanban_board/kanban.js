let boardData = JSON.parse(localStorage.getItem("kanban")) || {
    todo: [],
    progress: [],
    done: []
};

let draggedTask = null;
let draggedFrom = null;

// Save data
function saveBoard() {
    localStorage.setItem("kanban", JSON.stringify(boardData));
}

// Render board
function renderBoard() {

    ["todo", "progress", "done"].forEach(column => {

        const columnElement = document.getElementById(column);
        columnElement.innerHTML = "";

        boardData[column].forEach((task, index) => {

            const taskElement = document.createElement("div");
            taskElement.className = "task";
            taskElement.draggable = true;
            taskElement.innerHTML = `
                ${task}
                <button class="delete-btn" onclick="deleteTask('${column}', ${index})">X</button>
            `;

            // Drag events
            taskElement.addEventListener("dragstart", () => {
                draggedTask = index;
                draggedFrom = column;
            });

            columnElement.appendChild(taskElement);
        });

        // Drop events
        columnElement.ondragover = (e) => e.preventDefault();

        columnElement.ondrop = () => {

            const task = boardData[draggedFrom][draggedTask];

            boardData[draggedFrom].splice(draggedTask, 1);
            boardData[column].push(task);

            saveBoard();
            renderBoard();
        };
    });
}

// Add task
function addTask(column) {

    const task = prompt("Enter task");

    if(task) {
        boardData[column].push(task);
        saveBoard();
        renderBoard();
    }
}

// Delete task
function deleteTask(column, index) {

    boardData[column].splice(index, 1);

    saveBoard();
    renderBoard();
}

// Initial render
renderBoard();