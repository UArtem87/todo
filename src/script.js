const data = document.querySelector('.task-box__input');
const save = document.querySelector('.task-box__btn');
const todos = document.querySelector('.todos');

data.focus();

let toDoList = [];

function getStorageList() {
  toDoList = JSON.parse(localStorage.getItem('list'));
  if (toDoList) {
    renderToDo();
  } else {
    toDoList = [];
  }
}

getStorageList();

function getToDo() {
  if (data.value === '') {
    data.focus();
  }
  if (toDoList) {
    toDoList.push(data.value.trim());
    renderToDo();
  }
};

function renderToDo() {
  todos.innerHTML = '';
  toDoList.forEach((todo, i) => {
    const task = `${todo.slice(0, 1).toUpperCase()}${todo.slice(1)}`;
    const toDoBlock = document.createElement('div');
    toDoBlock.classList.add('todoblock')
    const toDoItem = document.createElement('span')
    toDoItem.classList.add('todos__item');
    const del = document.createElement('span');
    del.classList.add('del');
    toDoBlock.append(toDoItem);
    toDoBlock.append(del);
    toDoBlock.setAttribute('id', i)
    toDoItem.textContent = `${i + 1}. ${task}`;
    todos.append(toDoBlock);
    const storageList = JSON.stringify(toDoList);
    localStorage.setItem('list', storageList);
  });
  data.value = '';
  data.focus();
};

function deleteTask(taskId) {
  const id = +taskId;
  toDoList.splice(id, 1);
  renderToDo();
}

data.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    getToDo();
  }
});
save.addEventListener('click', getToDo)
todos.addEventListener('click', (e) => {
  if (e.target.classList.contains('del')) {
    const id = e.target.closest('.todoblock').getAttribute('id');
    deleteTask(id);
  }
});