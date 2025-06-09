let noteInput = document.getElementById("take_a_note");
let addNoteBtn = document.getElementById("add_note");
let noteDescription = document.getElementById("note_description");
let description = document.getElementById("description");
let todoContainer = document.getElementById("todo_container");
let emptyMessage = document.getElementById("empty-message");
emptyMessage.style.display = "none";
let editingId = null;

function showNotification(message, type = "success") {
  const box = document.getElementById("notification");
  const msg = document.getElementById("notification-message");

  msg.textContent = message;

  box.className = "fixed top-4 right-4 text-white px-4 py-2 rounded shadow-md transition-opacity duration-300";
  if (type === "success") box.classList.add("bg-green-500");
  if (type === "error") box.classList.add("bg-red-500");

  box.classList.remove("hidden");
  box.classList.add("opacity-100");

  setTimeout(() => {
    box.classList.add("hidden");
  }, 4000);
}

noteInput.addEventListener("focus", () => {
  description.classList.remove("hidden");
});

// Get todos
const getTodos = () => {
  return JSON.parse(localStorage.getItem('todos') || '[]');
}

// Save todos
const saveTodos = (todo) => {
  localStorage.setItem("todos", JSON.stringify(todo))
}

function checkIfEmpty() {
  const todos = getTodos();
  emptyMessage.style.display = todos.length === 0 ? "flex" : "none";
}

// Delete todos
window.deleteTodo = function (id) {
  let todos = getTodos();
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos(todos);
  displayTodos();
  showNotification("Task Deleted", "success");
};

// ✅ Edit logic: load data into input
window.editTodo = function (id) {
  let todos = getTodos();
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;

  noteInput.value = todo.title;
  noteDescription.value = todo.desc;
  description.classList.remove("hidden");
  addNoteBtn.textContent = "Update Task";
  editingId = id;
};

const displayTodos = () => {
  if (JSON.parse(localStorage.getItem('todos')).length === 0) {
    emptyMessage.style.display = "block";
  }

  let todos = getTodos()
  todoContainer.innerHTML = ""
  todos.forEach(todo => {
    let task = document.createElement("span")

    task.innerHTML = `
    <div class="w-60 p-4 bg-white rounded-lg shadow-sm border hover:shadow-md">
    <h2 class="font-semibold text-gray-800 mb-1">${todo.title}</h2>
    <p class="text-sm text-gray-600">${todo.desc}</p>
      <div class="action_buttons flex items-center justify-end gap-4">
        <button onclick="editTodo('${todo.id}')" title="Edit">
          <!-- Edit Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M4 21h4l11.1-11.1-4-4L4 17v4zm16.7-13.3a1 1 0 0 0 0-1.4l-2-2a1 1 0 0 0-1.4 0l-1.8 1.8 3.4 3.4 1.8-1.8z" />
          </svg>
        </button>

        <button onclick="deleteTodo('${todo.id}')" title="Delete">
          <!-- Delete Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#e04c41" viewBox="0 0 24 24">
            <path
              d="M9 3h6a1 1 0 0 1 1 1v1h4a1 1 0 1 1 0 2h-1v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7H4a1 1 0 1 1 0-2h4V4a1 1 0 0 1 1-1zm1 4a1 1 0 0 0-1 1v11a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1zm4 0a1 1 0 0 0-1 1v11a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1z" />
          </svg>
        </button>
      </div>
    </div>
    `
    todoContainer.appendChild(task);
  });

  checkIfEmpty();

}

displayTodos()

// ✅ Add or update todo
addNoteBtn.addEventListener("click", () => {
  const title = noteInput.value.trim();
  const desc = noteDescription.value.trim();

  if (title === "" || desc === "") {
    showNotification("Please enter note title and description!", "error");
    return;
  }

  let todos = getTodos();

  if (editingId) {
    // ✅ Update
    todos = todos.map((todo) => {
      if (todo.id === editingId) {
        return { ...todo, title, desc };
      }
      return todo;
    });
    showNotification("Task Updated!", "success");
    addNoteBtn.textContent = "Add Note";
    editingId = null;
  } else {
    // ✅ Add new
    todos.push({ id: Date.now().toString(), title, desc });
    showNotification("Task Added!", "success");
  }

  saveTodos(todos);
  displayTodos();

  noteInput.value = "";
  noteDescription.value = "";
  description.classList.add("hidden");
});
