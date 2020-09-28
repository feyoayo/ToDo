//Массив задач
const tasks = [
  {
    _id: "5d2ca9e2e03d40b326596aa7",
    completed: true,
    body:
      "Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n",
    title: "Eu ea incididunt sunt consectetur fugiat non.",
  },
  {
    _id: "5d2ca9e29c8a94095c1288e0",
    completed: false,
    body:
      "Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n",
    title:
      "Deserunt laborum id consectetur pariatur veniam occaecat occaecat tempor voluptate pariatur nulla reprehenderit ipsum.",
  },
  {
    _id: "5d2ca9e2e03d40b3232496aa7",
    completed: true,
    body:
      "Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n",
    title: "Eu ea incididunt sunt consectetur fugiat non.",
  },
  {
    _id: "5d2ca9e29c8a94095564788e0",
    completed: false,
    body:
      "Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n",
    title:
      "Deserunt laborum id consectetur pariatur veniam occaecat occaecat tempor voluptate pariatur nulla reprehenderit ipsum.",
  },
];
//Обворачиваем в самовызывающую функцию, чтобы все что внутри неё, было приватным, и если будет еще js файл, чтобы он вдруг не перезаписал эту логику(переменные, функции)
(function (arrOfTasks) {
  const objOfTasks = arrOfTasks.reduce((acc, task) => {
    acc[task._id] = task; // На каждой итерации получаем задачу
    return acc;
  }, {}); //! Переводим массив в объект объектов, ключем будет id

  //?Elements UI
  const emptyTitle = document.createElement("h2");
  const listContainer = document.querySelector(
    ".tasks-list-section .list-group"
  );
  const form = document.forms["addTask"];
  const inputTitle = form.elements["title"];
  const inputBody = form.elements["body"];
  const notCompleted = document.getElementById("notCompleted");
  const allTaskButton = document.getElementById("allTasks");

  //?Events
  renderAllTasks(objOfTasks); //Вызываем фукнцию,  и передаем в неё наш объект объектов, созданный выше
  form.addEventListener("submit", onFormSubmitHandler);
  listContainer.addEventListener("click", onDeleteHandler);
  listContainer.addEventListener("click", onCompleteHandler);
  notCompleted.addEventListener("click", showUncompletedTasks);
  allTaskButton.addEventListener("click", showAllTasksHandler);

  //? Functions
  function renderAllTasks(tasksList) {
    //! Функция прорисовывает наши таски на странице из полученных значений
    //Делаем проверку, если не передаются задачи, то возвращаем ошибку
    if (!tasksList) {
      console.error("передайте список задач");
      return;
    }

    //Создаем фрагмент, бущего списка с задачами в который будем передавать наши генерированные ЛИшки. Фрагмент создаем чтобы каждый раз не вызывать перересовку дома
    const fragments = document.createDocumentFragment();
    Object.values(tasksList).forEach((task) => {
      const li = listItemTemplate(task);
      fragments.appendChild(li);
    });
    listContainer.appendChild(fragments);
    completedSeeingTasks();
    emptyTaskText(objOfTasks);
    notEmptyTaskText(objOfTasks);
  }

  function listItemTemplate({ _id, title, body } = {}) {
    //! Функция занимается генерацией одного итема списка, добавляя ему классы, стили
    const li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "d-flex",
      "align-items-center",
      "justify-content-between",
      "flex-wrap",
      "mt-2"
    );
    li.setAttribute("data-task-id", _id); //Добавляет для li через дата id, чтобы было понятно, какую задачу надо удалить

    //Создаем заголовок задачи
    const span = document.createElement("span");
    span.textContent = title;
    span.style.fontWeight = "bold";
    span.classList.add("text-center");

    //Создаем кнопку чека что задача выполнена
    const doneButton = document.createElement("button");
    doneButton.textContent = "Complete";
    doneButton.classList.add("btn", "btn-success", "ml-auto", "complete-btn");

    //Кнопка удаления задачи
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("btn", "btn-danger", "mr-0", "delete-btn");

    //Текст задачи
    const article = document.createElement("p");
    article.textContent = body;
    article.classList.add("mt-2", "w-100");

    //Добавляем вышесозданное в li
    li.appendChild(span);
    li.appendChild(article);
    li.appendChild(deleteBtn);
    li.appendChild(doneButton);

    //Возвращаем ЛИшку, которая будет передана во фрагмент
    return li;
  }

  function onFormSubmitHandler(e) {
    //! Функция получает значения наших полей и добавляет на страницу в виде нового "таска"
    //preventDefault пишем для того, чтобы после нажатия Enter или кнопки сабмита не обновалялась страница
    e.preventDefault();
    //Получаем значения переданые в инпуты
    const titleValue = inputTitle.value;
    const bodyValue = inputBody.value;

    if (!titleValue || !bodyValue) {
      alert("Please fill title and body");
      return;
    }

    //Получаем здесь копию новой задачи, получнную возвратом из функции createNewTask
    const task = createNewTask(titleValue, bodyValue);
    //С помощью ранее созданой функции создаем новый ДОМ объект на основе полученых значений новой задачи
    const listItem = listItemTemplate(task);
    //Добавляем его в самое начало нашего списка задач
    listContainer.insertAdjacentElement("afterbegin", listItem);
    form.reset(); // После наполнения формы и передачи данных очищает инпуты до изначальных значений
    notEmptyTaskText(objOfTasks); // Подключаем функцию которая убирает сообщение что нет добавленых тасков
  }

  function createNewTask(title, body) {
    //!Функция получает на вход наши значения переданые с инпутов, и обрабатывает их, добавляя их в новый объект, а затем уже и добавляет в общий список тасков. completed по умолчанию false, id генерируем через math random
    const newTask = {
      title,
      body,
      completed: false,
      _id: `task-${Math.random()}`,
    };
    objOfTasks[newTask._id] = newTask; // Добавялем созданную задачу в список всех тасков

    //Возвращаем копию этой новый задачи
    return { ...newTask };
  }

  function deleteTask(id) {
    const { title } = objOfTasks[id];
    // console.log(objOfTasks[id]);
    const isConfirm = confirm(`Do you want to delete task ? ${title}`);
    if (!isConfirm) return isConfirm;
    delete objOfTasks[id];
    return isConfirm;
  }

  function deleteTaskFromHtml(confirmed, el) {
    if (!confirmed) return;
    el.remove();
  }

  function onDeleteHandler({ target }) {
    if (target.classList.contains("delete-btn")) {
      const parent = target.closest("[data-task-id]");
      const id = parent.dataset.taskId;
      const confirmed = deleteTask(id);
      deleteTaskFromHtml(confirmed, parent);
      emptyTaskText();
    }
  }
  function onCompleteHandler({ target }) {
    if (target.classList.contains("complete-btn")) {
      const parent = target.closest("[data-task-id]");
      const id = parent.dataset.taskId;
      objOfTasks[id].completed = false;
      parent.classList.toggle("complete-class");
      let isComplete = objOfTasks[id];
      if (parent.classList.contains("complete-class")) {
        isComplete.completed = true;
      } else if (!parent.classList.contains("complete-class")) {
        isComplete.completed = false;
      }
      completedSeeingTasks();
    }
  }
  function completedSeeingTasks() {
    //! Функция собирает завершенные таски и сразу их делает зелеными и ставит в конец списка
    listContainer.querySelectorAll("li").forEach((item) => {
      let id = item.dataset.taskId;
      if (objOfTasks[id].completed == true) {
        item.classList.add("complete-class");
        listContainer.insertAdjacentElement("beforeend", item);
      }
    });
  }

  function emptyTaskText() {
    //! Функция проверяет что наш объект пустой, и если да, то выводит сообщения о том что не было создано тасков
    let li = document.querySelectorAll(".list-group-item");
    emptyTitle.classList.add("header_show");
    emptyTitle.textContent = "Nothing here yet...";
    emptyTitle.classList.add("emptyHeader");
    listContainer.appendChild(emptyTitle);
    if (Object.values(objOfTasks).length === 0 || li.length === 0) {
      // emptyTitle.classList.remove("header_show");
      emptyTitle.style.display = "block";
      console.log("zero");
    }
  }
  function notEmptyTaskText(obj) {
    //! Функция проверяет: если есть хоть 1 таск то убирает надпись о том, что список задач пустой
    if (Object.entries(obj).length > 0) {
      emptyTitle.style.display = "none";
    }
  }
  function showUncompletedTasks() {
    //! Функция обработчик кнопки "Not Completed" при нажатии рендерит новый объект в котором все задачи еще не выполнены

    const listGroup = document.querySelectorAll(".list-group-item"); // Собрали все прорисованные(текущие) Лишки
    [...listGroup].forEach((el) => {
      if (el.classList.contains("complete-class")) {
        el.remove();
        console.log(el);
      }
    }); //Удалили их с ХТМЛ разметки
    emptyTaskText();
  }

  function showAllTasksHandler() {
    //! Функция обработчик кнопки "All Tasks", при нажатии рендерит все наши таски как и в начале
    const listGroup = document.querySelectorAll(".list-group-item");
    console.log(listGroup);
    [...listGroup].forEach((el) => el.remove());
    renderAllTasks(objOfTasks);
  }
})(tasks);
