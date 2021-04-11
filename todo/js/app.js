const clear = document.querySelector(".clear");
const dateElement = document.querySelector("#date");
const list = document.querySelector("#list");
const inputToDo = document.querySelector("#input");
const addButton = document.querySelector(".fa-plus-circle");

const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";

let LIST, id;

let data = localStorage.getItem("TODO");

if (data) {
  LIST = JSON.parse(data);
  id = LIST.length;
  loadList(LIST);
} else {
  LIST = [];
  id = 0;
}

function loadList(arr) {
  arr.forEach((item) => addToDo(item.name, item.id, item.done, item.trash));
}

clear.addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});

const options = {
  weekday: "long",
  month: "short",
  day: "numeric",
};

const today = new Date();

dateElement.innerHTML = today.toLocaleDateString("ru-RU", options);

function addToDo(todo, id, done, trash) {
  if (trash) {
    return;
  }
  const DONE = done ? CHECK : UNCHECK;
  const LINE = done ? LINE_THROUGH : "";

  const item = `
    <li class="item">
        <i class="fa ${DONE} co" data-job='complete' id='${id}'></i>
        <p class="text ${LINE}">${todo}</p>
        <i class="fa fa-trash-o de" data-job='delete' id='${id}'></i>
    </li>
    `;

  const position = "beforeend";

  list.insertAdjacentHTML(position, item);
}

function manipulationWithData() {
  const toDo = inputToDo.value;

  if (toDo) {
    addToDo(toDo, id, false, false);

    LIST.push({
      name: toDo,
      id: id,
      done: false,
      trash: false,
    });

    localStorage.setItem("TODO", JSON.stringify(LIST));

    id++;
  }

  inputToDo.value = "";
}

document.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    manipulationWithData();
  }
});

addButton.addEventListener("click", () => {
  manipulationWithData();
});

function completeToDo(el) {
  el.classList.toggle(CHECK);
  el.classList.toggle(UNCHECK);
  el.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

  LIST[el.id].done = LIST[el.id].done ? false : true;
}

function removeToDo(el) {
  el.parentNode.parentNode.removeChild(el.parentNode);

  LIST[el.id].trash = true;
}

list.addEventListener("click", (e) => {
  let elJob = null;
  const el = e.target;

  if (el.getAttribute("data-job")) {
    elJob = el.dataset.job;

    if (elJob === "complete") {
      completeToDo(el);
    } else if (elJob === "delete") {
      removeToDo(el);
    }
  }

  localStorage.setItem("TODO", JSON.stringify(LIST));
});
