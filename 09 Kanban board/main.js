const boardName = document.getElementById("board-name");
const cards = document.querySelectorAll(".card");
const deleteIcons = document.querySelectorAll(".delete");
const editIcons = document.querySelectorAll(".edit");
const addCardButtons = document.querySelectorAll(".add-card");
const addNewList = document.querySelector(".add-list");
const scrollLists = document.querySelectorAll(".scroll-list");

// Retrieve the board name from local storage and set it as the initial board name.
let initialBoardName = localStorage.getItem("boardName");
if (initialBoardName) {
  boardName.innerText = initialBoardName;
}

// Add event listener for edit board title.
const boardTitle = boardName.innerText;
const boardTitleEditable = document.createElement("input");
boardTitleEditable.type = "text";
boardTitleEditable.value = boardTitle;
boardTitleEditable.classList.add("board-title-editable");

const editIcon = document.querySelector(".edit");
editIcon.onclick = function (event) {
  event.preventDefault();
  boardName.replaceWith(boardTitleEditable);
  boardTitleEditable.focus();
};

boardTitleEditable.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    boardTitleEditable.blur();
  }
});

boardTitleEditable.addEventListener("blur", function (event) {
  boardTitleEditable.replaceWith(boardName);
  boardName.innerText = boardTitleEditable.value;
  localStorage.setItem("boardName", boardName.innerText);
});

// Add event listener for delete icon.
const deleteIconsContainer = document.querySelectorAll(".scroll-list");
deleteIconsContainer.forEach(function (deleteIcon, index) {
  deleteIcon.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete")) {
      const card = event.target.closest(".card");
      card.remove();
    }
  });
});

// Add event listener for edit icon.
const editIconsContainer = document.querySelectorAll(".scroll-list");
editIconsContainer.forEach(function (editIcon, index) {
  editIcon.addEventListener("click", function (event) {
    if (event.target.classList.contains("edit")) {
      const card = event.target.closest(".card");
      const spanElement = card.querySelector("span");
      spanElement.contentEditable = "true";
      spanElement.focus();

      spanElement.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          spanElement.blur();
        }
      });

      spanElement.addEventListener("blur", function (event) {
        spanElement.contentEditable = "false";
      });
    }
  });
});

// Add event listener to "Add another list" button.
addNewList.addEventListener("click", () => {
  const alertBox = document.createElement("div");
  alertBox.classList.add("alert");
  alertBox.textContent =
    "Unfortunately, that feature is not currently available in this version.";

  document.body.appendChild(alertBox);

  alertBox.addEventListener("click", () => {
    alertBox.remove();
  });
});

// Add event listener to Add a card.
addCardButtons.forEach(function (addCardButton) {
  addCardButton.addEventListener("click", function () {
    const newCard = document.createElement("div");
    newCard.classList.add("card");
    newCard.setAttribute("draggable", "true");

    const cardContent = document.createElement("input");
    cardContent.classList.add("card-content");
    cardContent.placeholder = "Enter a title for this card...";

    cardContent.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        cardContent.blur();
      }
    });

    cardContent.addEventListener("blur", function () {
      const newSpan = document.createElement("span");
      newSpan.innerHTML = cardContent.value;
      cardContent.parentNode.replaceChild(newSpan, cardContent);
      saveToLocalStorage();
    });

    newCard.appendChild(cardContent);

    const cardIcon = document.createElement("span");
    cardIcon.classList.add("card-icon");
    cardIcon.innerHTML = `
      <img src="image/edit.svg" alt="Edit icon" class="edit" />
      <img src="image/delete.svg" alt="Delete icon" class="delete" />
    `;
    newCard.appendChild(cardIcon);

    const scrollList = addCardButton.parentNode.querySelector(".scroll-list");
    scrollList.appendChild(newCard);

    const addCardText = addCardButton.querySelector("h3");
    addCardText.innerText = "Add another card";

    newCard.addEventListener("dragstart", (e) => {
      draggedCard = e.target;
      draggedCard.classList.add("dragging");
    });

    newCard.addEventListener("dragend", (e) => {
      draggedCard.classList.remove("dragging");
    });
  });
});

function saveToLocalStorage() {
  const scrollLists = document.querySelectorAll(".scroll-list");
  const lists = [];

  scrollLists.forEach(function (scrollList) {
    const cards = [];

    scrollList.querySelectorAll(".card-content").forEach(function (card) {
      cards.push(card.textContent);
    });

    lists.push(cards);
  });

  localStorage.setItem("lists", JSON.stringify(lists));
}

function loadFromLocalStorage() {
  const lists = JSON.parse(localStorage.getItem("lists"));

  if (!lists) {
    return;
  }

  const scrollLists = document.querySelectorAll(".scroll-list");

  scrollLists.forEach(function (scrollList, index) {
    const cards = lists[index];

    cards.forEach(function (cardContent) {
      const newCard = document.createElement("div");
      newCard.classList.add("card");
      newCard.setAttribute("draggable", "true");

      const newSpan = document.createElement("span");
      newSpan.innerHTML = cardContent;
      newSpan.classList.add("card-content");
      newCard.appendChild(newSpan);

      const cardIcon = document.createElement("span");
      cardIcon.classList.add("card-icon");
      cardIcon.innerHTML = `
        <img src="image/edit.svg" alt="Edit icon" class="edit" />
        <img src="image/delete.svg" alt="Delete icon" class="delete" />
      `;
      newCard.appendChild(cardIcon);

      newCard.addEventListener("dragstart", (e) => {
        draggedCard = e.target;
        draggedCard.classList.add("dragging");
      });

      newCard.addEventListener("dragend", (e) => {
        draggedCard.classList.remove("dragging");
      });

      scrollList.appendChild(newCard);
    });
  });
}

// Add Drag and Drop Features to existing cards.
cards.forEach((card) => {
  card.addEventListener("dragstart", (e) => {
    draggedCard = e.target;
    draggedCard.classList.add("dragging");
  });
});

scrollLists.forEach((scrollList) => {
  scrollList.addEventListener("dragover", (e) => {
    e.preventDefault();
    scrollList.classList.add("dragover");
  });

  scrollList.addEventListener("dragleave", () => {
    scrollList.classList.remove("dragover");
  });

  scrollList.addEventListener("drop", (e) => {
    e.preventDefault();
    scrollList.appendChild(draggedCard);
    draggedCard.classList.remove("dragging");
    scrollList.classList.remove("dragover");
  });
});
