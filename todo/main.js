const form = document.querySelector("#itemForm");
const inputItem = document.querySelector("#itemInput");
const itemList = document.querySelector("#itemList");
const filters = document.querySelectorAll(".nav-item");

let TODOS_ITEMS;

const getItemsFilter = function (type) {
  let TODOS_FILTER = [];

  switch (type) {
    case "todo":
      TODOS_FILTER = TODOS_ITEMS.filter((item) => !item.isDone);
      break;
    case "done":
      TODOS_FILTER = TODOS_ITEMS.filter((item) => item.isDone);
      break;
    default:
      TODOS_FILTER = TODOS_ITEMS;
      break;
  }

  getList(TODOS_FILTER);
};

const removeElement = function (obj) {
  const removeIndex = TODOS_ITEMS.indexOf(obj);
  TODOS_ITEMS.splice(removeIndex, 1);
  getList(TODOS_ITEMS);
};

const updateInputValue = function (index, value) {
  const updateItem = TODOS_ITEMS[index];
  updateItem.name = value;
  TODOS_ITEMS.splice(index, 1, updateItem);
  setLocalStorage(TODOS_ITEMS);
};

const handleItem = function (obj) {
  const elements = document.querySelectorAll(".list-group-item");

  elements.forEach((el) => {
    if (el.querySelector(".title").getAttribute("data-id") == obj.id) {
      //выполненено
      el.querySelector("[data-done]").addEventListener("click", function (e) {
        e.preventDefault();

        const indexObj = TODOS_ITEMS.indexOf(obj);
        const currentObj = TODOS_ITEMS[indexObj];

        const currenClass = obj.isDone
          ? "bi-check-circle-fill"
          : "bi-check-circle";

        currentObj.isDone = currentObj.isDone ? false : true;
        TODOS_ITEMS.splice(indexObj, 1, currentObj);
        setLocalStorage(TODOS_ITEMS);

        const newClass = obj.isDone
          ? "bi-check-circle-fill"
          : "bi-check-circle";

        this.firstElementChild.classList.replace(currenClass, newClass);
        const filterType = document.querySelector("#filterType").value;
        getItemsFilter(filterType);
      });
      //редактировать
      el.querySelector("[data-edit]").addEventListener("click", function (e) {
        e.preventDefault();

        inputItem.value = obj.name;

        document.querySelector("#objIndex").value = TODOS_ITEMS.indexOf(obj);
      });
      //удалить
      el.querySelector("[data-delete]").addEventListener("click", function (e) {
        e.preventDefault();

        if (confirm(`действительно удалить ${obj.name}?`)) {
          itemList.removeChild(el);
          removeElement(obj);
          setLocalStorage(TODOS_ITEMS);
          return TODOS_ITEMS.filter((item) => item != obj);
        }
      });
    }
  });
};

const getList = function (array) {
  itemList.innerHTML = "";

  if (array.length > 0) {
    array.forEach((item) => {
      const iconClass = item.isDone
        ? "bi-check-circle-fill"
        : "bi-check-circle";
      itemList.insertAdjacentHTML(
        "beforeend",
        `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <span class="title" data-id="${item.id}">${item.name}</span>
            <span>
                <a href="#" data-done=""><i class="bi ${iconClass} green"></i></a>
                <a href="#" data-edit=""><i class="bi bi-pencil-square blue"></i></a>
                <a href="#" data-delete=""><i class="bi bi-x-circle red"></i></a>
            </span>
        </li>
        `
      );
      handleItem(item);
    });
  } else {
    itemList.insertAdjacentHTML(
      "beforeend",
      `
      <li class="list-group-item d-flex justify-content-between align-items-center">
          <span>задач нету 😄</span>
      </li>
      `
    );
  }
};

const getLocalStorage = function () {
  const storageItems = localStorage.getItem("TODOS");

  if (storageItems === null || storageItems === "undefined") {
    TODOS_ITEMS = [];
  } else {
    TODOS_ITEMS = JSON.parse(storageItems);
  }

  getList(TODOS_ITEMS);
};

const setLocalStorage = function (array) {
  localStorage.setItem("TODOS", JSON.stringify(array));
};

document.addEventListener("DOMContentLoaded", () => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = inputItem.value.trim();

    if (inputValue.length === 0) {
      alert("Заполните данные");
    } else {
      const currentInputValueIndex = document.querySelector("#objIndex").value;

      if (currentInputValueIndex) {
        //обновлять значени
        updateInputValue(currentInputValueIndex, inputValue);
        document.querySelector("#objIndex").value = "";
      } else {
        const arrayObj = {
          name: inputValue,
          isDone: false,
          id: new Date().getTime(),
        };

        TODOS_ITEMS.push(arrayObj);
        setLocalStorage(TODOS_ITEMS);
      }
    }

    getList(TODOS_ITEMS);
    inputItem.value = "";
  });

  filters.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();
      const dataType = this.getAttribute("data-type");
      document.querySelectorAll(".nav-link").forEach((nav) => {
        nav.classList.remove("active");
      });
      this.firstElementChild.classList.add("active");
      getItemsFilter(dataType);
      document.querySelector("#filterType").value = dataType;
    });
  });
  getLocalStorage();
});
