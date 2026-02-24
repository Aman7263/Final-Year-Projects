let boardData = JSON.parse(localStorage.getItem("kanban")) || {
    todo: [],
    progress: [],
    done: []
};

let savedTasks = JSON.parse(localStorage.getItem("savedTasks")) || [];
let score = parseInt(localStorage.getItem("score")) || 0;

let currentColumn = null;
let currentSaveIndex = null;

/* ================= SAVE ALL ================= */

function saveAll() {
    localStorage.setItem("kanban", JSON.stringify(boardData));
    localStorage.setItem("savedTasks", JSON.stringify(savedTasks));
    localStorage.setItem("score", score);
}

/* ================= RENDER BOARD ================= */

function renderBoard() {

    document.getElementById("scoreDisplay").innerText =
        "🏆 Score: " + score;

    ["todo", "progress", "done"].forEach(column => {

        const columnElement = document.getElementById(column);
        columnElement.innerHTML = "";

        boardData[column].forEach((task, index) => {

            const taskElement = document.createElement("div");
            taskElement.className = "task";

            if (task.hold) {
                taskElement.classList.add("hold-task");
            }

            if (column === "done") {
                taskElement.classList.add("completed");
            }

            let actions = "";

            if (column === "todo") {
                actions += `
                <button onclick="moveTask('todo', ${index}, 'progress')">
                    <i class="fa-solid fa-play"></i>
                </button>
                `;
            }

            if (column === "progress") {
                actions += `
                <button onclick="moveTask('progress', ${index}, 'done')">
                    <i class="fa-solid fa-check"></i>
                </button>
                <button onclick="toggleHold('progress', ${index})">
                    <i class="fa-solid fa-pause"></i>
                </button>
                `;
            }

            if (column === "done") {
                actions += `
                <button onclick="openRemarkModal(${index})">
                    <i class="fa-solid fa-floppy-disk"></i>
                </button>
                `;
            }

            if (column !== "done") {
                actions += `
                <button onclick="deleteTask('${column}', ${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
                `;
            }

            taskElement.innerHTML = `
                <div class="task-content">
                    <strong>${task.text}</strong>
                    <br/>
                    <span class="priority ${task.priority}">
                        ${task.priority.toUpperCase()}
                    </span>
                    ${task.hold ? '<div class="hold-label">ON HOLD</div>' : ''}
                </div>
                <div class="actions">
                    ${actions}
                </div>
            `;

            columnElement.appendChild(taskElement);
        });
    });

    renderSaved();
}

/* ================= MOVE TASK ================= */

function moveTask(from, index, to) {

    const task = boardData[from][index];

    boardData[from].splice(index, 1);

    task.hold = false;

    boardData[to].push(task);

    if (to === "done") {
        score++;
    }

    saveAll();
    renderBoard();
}

/* ================= HOLD SYSTEM ================= */

function toggleHold(column, index) {

    boardData[column][index].hold =
        !boardData[column][index].hold;

    saveAll();
    renderBoard();
}

/* ================= DELETE ================= */

function deleteTask(column, index) {
    boardData[column].splice(index, 1);
    saveAll();
    renderBoard();
}

/* ================= ADD TASK MODAL ================= */

function openModal(column) {
    currentColumn = column;
    document.getElementById("taskModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("taskModal").style.display = "none";
    document.getElementById("taskInput").value = "";
}

function addTask() {

    const text = document.getElementById("taskInput").value.trim();
    const priority = document.getElementById("prioritySelect").value;

    if (!text) return;

    boardData[currentColumn].push({
        text: text,
        priority: priority,
        hold: false
    });

    saveAll();
    closeModal();
    renderBoard();
}

/* ================= REMARK MODAL ================= */

function openRemarkModal(index) {

    currentSaveIndex = index;

    document.getElementById("remarkModal").style.display = "flex";
}

function closeRemarkModal() {
    document.getElementById("remarkModal").style.display = "none";
    document.getElementById("remarkInput").value = "";
}

/* ================= SAVE REMARK ================= */

function saveRemark() {

    const remark = document.getElementById("remarkInput").value.trim();

    if (!remark) return;

    const task = boardData.done[currentSaveIndex];

    savedTasks.push({
        task: task.text,
        remark: remark,
        date: new Date().toLocaleString()
    });

    closeRemarkModal();

    saveAll();
    renderBoard();
}

/* ================= RENDER SAVED ================= */

function renderSaved() {

    const container = document.getElementById("savedTasks");
    container.innerHTML = "";

    savedTasks.forEach((item, i) => {

        const div = document.createElement("div");
        div.className = "saved-item";

        div.innerHTML = `
            <b>${i + 1}. ${item.task}</b> : ${item.remark}
            <br/>
            <small>${item.date}</small>
        `;

        container.appendChild(div);
    });
}

function resetGame() {

    const confirmReset = confirm("Are you sure you want to reset the game?");

    if (!confirmReset) return;

    localStorage.removeItem("kanban");
    localStorage.removeItem("savedTasks");
    localStorage.removeItem("score");

    boardData = { todo: [], progress: [], done: [] };
    savedTasks = [];
    score = 0;

    saveAll();
    renderBoard();
}

/* INIT */
renderBoard();