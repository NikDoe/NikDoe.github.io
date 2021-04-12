const form = document.querySelector("#itemForm");
const inputItem = document.querySelector("#itemInput");
const itemList = document.querySelector("#itemList");
const filters = document.querySelectorAll(".nav-item");

let TODOS_ITEMS;

const getItemsFilter = function (type) {
  let filterItems = [];
  switch (type) {
    case "todo":
      filterItems = TODOS_ITEMS.filter((item) => !item.isDone);
      break;
    case "done":
      filterItems = TODOS_ITEMS.filter((item) => item.isDone);
      break;
    default:
      filterItems = TODOS_ITEMS;
  }
  getList(filterItems);
};

const removeItem = function (obj) {
  const removeIndexItem = TODOS_ITEMS.indexOf(obj);
  TODOS_ITEMS.splice(removeIndexItem, 1);
};

const updateItem = function (index, value) {
  const newItem = TODOS_ITEMS[index];
  newItem.name = value;
  TODOS_ITEMS.splice(index, 1, newItem);
  setToLocalStorage(TODOS_ITEMS);
};

const handlerItem = function (obj) {
  const items = document.querySelectorAll(".list-group-item");
  items.forEach((item) => {
    if (item.querySelector(".title").getAttribute("data-time") == obj.addedAt) {
      //done
      item.querySelector("[data-done]").addEventListener("click", function (e) {
        e.preventDefault();
        const objIndex = TODOS_ITEMS.indexOf(obj);
        const currentObj = TODOS_ITEMS[objIndex];

        const currentClass = currentObj.isDone
          ? "bi-check-circle-fill"
          : "bi-check-circle";

        currentObj.isDone = currentObj.isDone ? false : true;
        TODOS_ITEMS.splice(objIndex, 1, currentObj);
        setToLocalStorage(TODOS_ITEMS);

        const iconClass = currentObj.isDone
          ? "bi-check-circle-fill"
          : "bi-check-circle";

        this.firstElementChild.classList.replace(currentClass, iconClass);
        const filterType = document.querySelector("#filterType").value;
        getItemsFilter(filterType);
      });
      //edit
      item.querySelector("[data-edit]").addEventListener("click", function (e) {
        e.preventDefault();

        inputItem.value = obj.name;
        document.querySelector("#objIndex").value = TODOS_ITEMS.indexOf(obj);
      });
      //delete
      item
        .querySelector("[data-delete]")
        .addEventListener("click", function (e) {
          e.preventDefault();
          if (confirm(`Действительно удалить ${obj.name}`)) {
            itemList.removeChild(item);
            removeItem(obj);
            setToLocalStorage(TODOS_ITEMS);
            return TODOS_ITEMS.filter((item) => item != obj);
          }
        });
    }
  });
};

const getList = function (arr) {
  itemList.innerHTML = "";
  if (arr.length > 0) {
    arr.forEach((item) => {
      const iconClass = item.isDone
        ? "bi-check-circle-fill"
        : "bi-check-circle";
      itemList.insertAdjacentHTML(
        "beforeend",
        `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <span class="title" data-time="${item.addedAt}">${item.name}</span>
            <span>
                <a href="#" data-done=""><i class="bi ${iconClass} green"></i></a>
                <a href="#" data-edit=""><i class="bi bi-pencil-square blue"></i></a>
                <a href="#" data-delete=""><i class="bi bi-x-circle red"></i></a>
            </span>
        </li>
        `
      );
      handlerItem(item);
    });
  } else {
    itemList.insertAdjacentHTML(
      "beforeend",
      `
      <li class="list-group-item d-flex justify-content-between align-items-center">
          <span>
              Заданий нет :)
          </span>
      </li>
      `
    );
  }
};

const getFromLocalStorage = function () {
  const todoStorage = localStorage.getItem("Todos Items");
  if (todoStorage === "undefined" || todoStorage === null) {
    TODOS_ITEMS = [];
  } else {
    TODOS_ITEMS = JSON.parse(todoStorage);
  }
  getList(TODOS_ITEMS);
};

const setToLocalStorage = function (arr) {
  localStorage.setItem("Todos Items", JSON.stringify(arr));
};

document.addEventListener("DOMContentLoaded", () => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const itemValue = inputItem.value.trim();

    if (itemValue.length !== 0) {
      const currentItemIndex = document.querySelector("#objIndex").value;
      if (currentItemIndex) {
        //update
        updateItem(currentItemIndex, itemValue);
        document.querySelector("#objIndex").value = "";
      } else {
        const itemObj = {
          name: itemValue,
          isDone: false,
          addedAt: new Date().getTime(),
        };
        TODOS_ITEMS.push(itemObj);
        setToLocalStorage(TODOS_ITEMS);
      }
      getList(TODOS_ITEMS);
    } else {
      alert("Заполните поле для ввода");
    }
    inputItem.value = "";
  });

  //filter
  filters.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();
      const tabType = this.getAttribute("data-type");
      document.querySelectorAll(".nav-link").forEach((nav) => {
        nav.classList.remove("active");
      });
      this.firstElementChild.classList.add("active");
      getItemsFilter(tabType);
      document.querySelector("#filterType").value = tabType;
    });
  });
  //load todos
  getFromLocalStorage();
});
