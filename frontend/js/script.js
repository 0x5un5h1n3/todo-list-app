document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");
  let token = "";

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
      .then((tasks) => {
        taskList.innerHTML = "";
        tasks.forEach((task) => {
          addTaskToList(task);
        });
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
        addTaskToList(task);
      })
      .catch((error) => console.error("Error:", error));
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
          fetchTasks();
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
        fetchTasks();
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
        fetchTasks();
      })
      .catch((error) => console.error("Error:", error));
  }
});
