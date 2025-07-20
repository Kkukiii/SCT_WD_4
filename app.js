let tasks = [];

window.addEventListener("DOMContentLoaded", () => {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    updateTasksList();
  }
});

document.getElementById("taskForm").addEventListener("submit", (e) => {
  e.preventDefault();
  addTask();
});

const addTask = () => {
  const taskInput = document.getElementById("taskInput");
  const taskDate = document.getElementById("taskDate");
  const text = taskInput.value.trim();
  const date = taskDate.value;

  if (text) {
    tasks.push({ text, completed: false, dueDate: date });
    updateTasksList();
    taskInput.value = '';
    taskDate.value = '';
  }
};

const updateTasksList = () => {
  const taskList = document.querySelector(".task-list");
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const listItem = document.createElement("li");
    listItem.classList.add("task-item");

    const checked = task.completed ? 'checked' : '';
    const completedClass = task.completed ? 'completed' : '';
    const overdueClass = isOverdue(task.dueDate) && !task.completed ? 'overdue' : '';

    listItem.innerHTML = `
      <div class="taskItem">
        <div class="task ${completedClass}">
          <input type="checkbox" class="checkbox" ${checked} />
          <div>
            <p>${task.text}</p>
            <small class="due-date ${overdueClass}">
              ${task.dueDate ? formatDate(task.dueDate) : ''}
            </small>
          </div>
        </div>
        <div class="icons">
          <img src="edit.png" alt="Edit" onclick="editTask(${index})" />
          <img src="bin.png" alt="Delete" onclick="deleteTask(${index})" />
        </div>
      </div>
    `;

    listItem.querySelector(".checkbox").addEventListener("change", () => toggleTaskComplete(index));
    taskList.appendChild(listItem);
  });

  updateStats();
  saveTasksToLocal();
};

const toggleTaskComplete = (index) => {
  tasks[index].completed = !tasks[index].completed;
  if (tasks[index].completed) launchConfetti();
  updateTasksList();
};

const deleteTask = (index) => {
  tasks.splice(index, 1);
  updateTasksList();
};

const editTask = (index) => {
  const newText = prompt("Edit your task:", tasks[index].text);
  if (newText !== null && newText.trim() !== '') {
    tasks[index].text = newText.trim();
    updateTasksList();
  }
};

const saveTasksToLocal = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const updateStats = () => {
  const completed = tasks.filter(task => task.completed).length;
  const total = tasks.length;
  const progress = document.getElementById("progress");
  const numbers = document.getElementById("numbers");

  const percent = total ? (completed / total) * 100 : 0;
  progress.style.width = `${percent}%`;
  numbers.textContent = `${completed} / ${total}`;
};

const formatDate = (dateStr) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
};

const isOverdue = (dateStr) => {
  if (!dateStr) return false;
  const today = new Date();
  const due = new Date(dateStr);
  return due < new Date(today.setHours(0, 0, 0, 0));
};

const launchConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
};
