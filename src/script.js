const data = document.querySelector('.task-box__input');
const save = document.querySelector('.task-box__btn');
const todos = document.querySelector('.todos');
const header = document.querySelector('.header');
const loader = document.querySelector('.loader');

const tasksAdress = 'https://696f53afa06046ce618642cd.mockapi.io/tasks';
const purchasesAdress = 'https://696f53afa06046ce618642cd.mockapi.io/purchases';

data.focus();

let toDoList = [];

async function getList() {
  loader.classList.remove('hidden');

  const response = await fetch('https://696f53afa06046ce618642cd.mockapi.io/tasks');
  const dataList = await response.json();

  if (dataList) {
    toDoList = dataList;
    loader.classList.add('hidden');

    renderToDo();
  } else {
    toDoList = [];
  }
}

async function setToDo() {
  if (data.value === '') {
    data.focus();
  } else {
    const task = data.value;

    await fetch('https://696f53afa06046ce618642cd.mockapi.io/tasks', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: task })
    });

    getList();
  }
}

function renderToDo() {
  todos.innerHTML = '';
  toDoList.forEach((todo, i) => {
    const task = `${todo.text.slice(0, 1).toUpperCase()}${todo.text.slice(1)}`;

    const toDoBlock = document.createElement('div');
    toDoBlock.setAttribute('id', todo.id);
    toDoBlock.classList.add('todoblock');

    const toDoItem = document.createElement('span');
    toDoItem.classList.add('todos__item');
    toDoItem.textContent = `${i + 1}. ${task}`;

    const important = document.createElement('span');
    important.classList.add('important');
    important.innerHTML = todo.important ? '★' : '☆';

    if (todo.important) {
      important.classList.add('active');
    }


    const del = document.createElement('span');
    del.classList.add('del');

    toDoBlock.append(toDoItem, important, del);
    todos.append(toDoBlock);
  });

  save.onclick = () => setToDo();
  data.onkeydown = (e) => {
    if (e.key === 'Enter') {
      setToDo();
    }
  };

  data.value = '';
  data.focus();
};


async function deleteTask(taskId) {
  await fetch(`https://696f53afa06046ce618642cd.mockapi.io/tasks/${taskId}`, {
    method: 'DELETE'
  });
  getList();
}

async function madeImportant(taskId, status) {
  await fetch(`https://696f53afa06046ce618642cd.mockapi.io/tasks/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ important: status })
  });
}

todos.addEventListener('click', (e) => {
  const el = e.target;
  const parent = el.closest('.todoblock');
  const id = parent.getAttribute('id');

  if (el.classList.contains('del')) {
    deleteTask(id);
  }

  if (el.classList.contains('important')) {
    el.classList.toggle('active');
    const status = el.classList.contains('active');
    el.innerHTML = status ? '★' : '☆';
    madeImportant(id, status);
  }

  if (el.classList.contains('todos__item')) {
    el.classList.toggle('expanded');
  }
});

header.addEventListener('click', (e) => {
  const mainTitle = document.querySelector('.main-title');
  const purchases = document.querySelector('.container-purchases');
  const tasks = document.querySelector('.container-tasks');

  if (e.target.classList.contains('task')) {
    mainTitle.classList.add('hidden');
    tasks.classList.remove('hidden');
    purchases.classList.add('hidden');
    getList();
  }

  if (e.target.classList.contains('purchases')) {
    mainTitle.classList.add('hidden');
    tasks.classList.add('hidden');
    purchases.classList.remove('hidden');
    getList();
  }
});