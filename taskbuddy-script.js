// ====== Get Elements ======
const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-task-button");
const taskList = document.getElementById("task-list");
const searchInput = document.getElementById("search-task");
const clearCompletedBtn = document.getElementById("clear-completed");
const clearAllBtn = document.getElementById("clear-all");
const messageBox = document.getElementById("input-message");
const emptyState = document.getElementById("empty-state");

messageBox.style.display = "none";

// ====== Load Tasks From LocalStorage ======
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(task => {
        createTask(task.text, task.completed);
    });

    checkEmpty();
}

// ====== Save Tasks To LocalStorage ======
function saveTasks() {
    const tasks = [];

    document.querySelectorAll("#task-list li").forEach(li => {
        tasks.push({
            text: li.querySelector(".task-text").textContent,
            completed: li.classList.contains("completed")
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ====== Create Task Element ======
function createTask(text, completed = false) {
    const li = document.createElement("li");
    if (completed) li.classList.add("completed");

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;
    checkbox.onclick = () => {
        li.classList.toggle("completed");
        saveTasks();
    };

    // Task Text
    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = text;

    // Buttons
    const btnDiv = document.createElement("div");
    btnDiv.className = "task-buttons";

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    editBtn.onclick = () => {
        const newText = prompt("Edit task:", span.textContent);
        if (newText && newText.trim()) {
            span.textContent = newText.trim();
            saveTasks();
        }
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => {
        li.remove();
        saveTasks();
        checkEmpty();
    };

    btnDiv.append(editBtn, deleteBtn);
    li.append(checkbox, span, btnDiv);
    taskList.appendChild(li);

    checkEmpty();
}

// ====== Add Task ======
function addTask() {
    const text = taskInput.value.trim();

    // Empty validation
    if (text === "") {
        messageBox.textContent = "Please enter a task ";
        messageBox.classList.add("error");
        messageBox.style.display = "block";
        checkEmpty(); 
        return;
    }

    // Duplicate check
    const duplicate = Array.from(document.querySelectorAll(".task-text"))
        .some(t => t.textContent.toLowerCase() === text.toLowerCase());

    if (duplicate) {
        messageBox.textContent = "Task already exists!";
        messageBox.classList.add("error");
        messageBox.style.display = "block"; 
        checkEmpty();
        return;
    }

    messageBox.textContent = "";
    messageBox.classList.remove("error");
    messageBox.style.display = "none"; 

    createTask(text);
    saveTasks();

    taskInput.value = "";
    taskInput.focus();

    checkEmpty();
}

// ====== Empty State Check ======
function checkEmpty() {
    if (taskList.children.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }
}

// ====== Event Listeners ======
addBtn.onclick = addTask;

taskInput.addEventListener("keydown", e => {
    if (e.key === "Enter") addTask();
});

clearCompletedBtn.onclick = () => {
    document.querySelectorAll(".completed").forEach(li => li.remove());
    saveTasks();
    checkEmpty();
};

clearAllBtn.onclick = () => {
    if (confirm("Are you sure you want to clear all tasks?")) {
        taskList.innerHTML = "";
        saveTasks();
        checkEmpty();
    }
};

// Search
searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();

    document.querySelectorAll("#task-list li").forEach(li => {
        li.style.display = li.textContent.toLowerCase().includes(value)
            ? "flex"
            : "none";
    });
});

// ====== Load on Page Start ======

window.onload = loadTasks;

