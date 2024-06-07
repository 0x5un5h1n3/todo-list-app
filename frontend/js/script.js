document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");
  const filters = document.getElementById("filters");
  let token = "";
  let tasks = [];

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    loginUser(username, password);
  });

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addTask(taskInput.value);
    taskInput.value = "";
  });

  document
    .getElementById("sort-asc")
    .addEventListener("click", () => sortTasks("asc"));
  document
    .getElementById("sort-desc")
    .addEventListener("click", () => sortTasks("desc"));
  document
    .getElementById("filter-completed")
    .addEventListener("click", () => filterTasks("completed"));
  document
    .getElementById("filter-pending")
    .addEventListener("click", () => filterTasks("pending"));
  document
    .getElementById("filter-all")
    .addEventListener("click", () => filterTasks("all"));

  function loginUser(username, password) {
    fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          token = data.token;
          loginForm.style.display = "none";
          taskForm.style.display = "block";
          filters.style.display = "block";
          fetchTasks();
        } else {
          alert("Login failed");
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  function fetchTasks() {
    fetch("http://localhost:3000/api/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        tasks = data;
        renderTasks(tasks);
      })
      .catch((error) => console.error("Error:", error));
  }

  function addTask(taskTitle) {
    fetch("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: taskTitle }),
    })
      .then((response) => response.json())
      .then((task) => {
        tasks.push(task);
        renderTasks(tasks);
      })
      .catch((error) => console.error("Error:", error));
  }

  function renderTasks(tasks) {
    taskList.innerHTML = "";
    tasks.forEach((task) => {
      addTaskToList(task);
    });
  }

  function addTaskToList(task) {
    const li = document.createElement("li");
    li.innerHTML = `
        <span class="${task.completed ? "completed" : ""}">${task.title}</span>
        <div>
          <button class="edit" data-id="${task._id}">Edit</button>
          <button class="delete" data-id="${task._id}">Delete</button>
          <button class="complete" data-id="${task._id}">${
      task.completed ? "Undo" : "Complete"
    }</button>
        </div>
      `;
    taskList.appendChild(li);

    li.querySelector(".edit").addEventListener("click", () => editTask(task));
    li.querySelector(".delete").addEventListener("click", () =>
      deleteTask(task._id)
    );
    li.querySelector(".complete").addEventListener("click", () =>
      toggleTaskCompletion(task)
    );
  }

  function editTask(task) {
    const newTitle = prompt("Edit task", task.title);
    if (newTitle) {
      fetch(`http://localhost:3000/api/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle }),
      })
        .then((response) => response.json())
        .then((updatedTask) => {
          tasks = tasks.map((t) =>
            t._id === updatedTask._id ? updatedTask : t
          );
          renderTasks(tasks);
        })
        .catch((error) => console.error("Error:", error));
    }
  }

  function deleteTask(taskId) {
    fetch(`http://localhost:3000/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        tasks = tasks.filter((task) => task._id !== taskId);
        renderTasks(tasks);
      })
      .catch((error) => console.error("Error:", error));
  }

  function toggleTaskCompletion(task) {
    fetch(`http://localhost:3000/api/tasks/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed: !task.completed }),
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        tasks = tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t));
        renderTasks(tasks);
      })
      .catch((error) => console.error("Error:", error));
  }

  function sortTasks(order) {
    const sortedTasks = [...tasks].sort((a, b) => {
      if (order === "asc") {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
    renderTasks(sortedTasks);
  }

  function filterTasks(filter) {
    let filteredTasks;
    if (filter === "completed") {
      filteredTasks = tasks.filter((task) => task.completed);
    } else if (filter === "pending") {
      filteredTasks = tasks.filter((task) => !task.completed);
    } else {
      filteredTasks = tasks;
    }
    renderTasks(filteredTasks);
  }
});
