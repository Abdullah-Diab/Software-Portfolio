const todoInput = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");
const todoContainer = document.getElementById("todo-container");

addButton.addEventListener("click", (e) => {
  let todo = document.createElement("div");
  todo.classList.add("todo");

  let li = document.createElement("li");
  li.innerHTML = `${todoInput.value}`;
  todo.appendChild(li);

  let checkButton = document.createElement("button");
  checkButton.innerHTML = `<ion-icon name="checkmark-circle"></ion-icon>`;
  checkButton.classList.add("todo-check");
  todo.appendChild(checkButton);

  let deletButton = document.createElement("button");
  deletButton.innerHTML = `<ion-icon name="trash"></ion-icon>`;
  deletButton.classList.add("todo-delete");
  todo.appendChild(deletButton);

  if (todoInput.value === "") {
    alert("please Enter Some Text");
  } else {
    todoContainer.appendChild(todo);
  }

  todoInput.value = "";
});

todoContainer.addEventListener("click", (e) => {
  let target = e.target;
  if (target.classList.contains("todo-delete")) {
    let item = target.parentElement;
    item.remove();
  }

  if (target.classList.contains("todo-check")) {
    let item = target.parentElement;
    item.classList.toggle("completed");
  }
});
