const tasksAdress = 'https://696f53afa06046ce618642cd.mockapi.io/tasks';
const purchasesAdress = 'https://696f53afa06046ce618642cd.mockapi.io/purchases';

let currentAdress = purchasesAdress;

window.addEventListener('DOMContentLoaded', () => {


  const header = document.querySelector('.header');

  let data;
  let todos;
  let save;

  let toDoList = [];

  async function getList(adress) {
    const activeBox = document.querySelector('.container-tasks:not(.hidden), .container-purchases:not(.hidden)');
    let loader = activeBox.querySelector('.loader');
    loader.classList.remove('hidden');

    const response = await fetch(adress);
    const dataList = await response.json();

    if (dataList) {
      toDoList = dataList;
      loader.classList.add('hidden');

      renderToDo();
    } else {
      toDoList = [];
    }
  };

  async function setToDo(adress) {
    if (data.value === '') {
      data.focus();
    } else {
      const task = data.value;

      await fetch(adress, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: task })
      });

      getList(adress);
    }
  }

  function renderToDo() {
    const activeBox = document.querySelector('.container-tasks:not(.hidden), .container-purchases:not(.hidden)');
    data = activeBox.querySelector('.task-box__input');
    save = activeBox.querySelector('.task-box__btn');
    todos = activeBox.querySelector('.todos');
    todos.innerHTML = '';
    toDoList.forEach((todo, i) => {
      const task = `${todo.text.slice(0, 1).toUpperCase()}${todo.text.slice(1)}`;

      const toDoBlock = document.createElement('div');
      toDoBlock.setAttribute('id', todo.id);
      toDoBlock.classList.add('todoblock');

      const toDoItem = document.createElement('span');
      toDoItem.classList.add('todos__item');
      toDoItem.textContent = `${i + 1}. ${task}`;

      let important = document.createElement('span');
      important.classList.add('important');
      important.innerHTML = todo.important ? '★' : '☆';

      if (todo.important) {
        important.classList.add('active');
      }


      let del = document.createElement('span');
      del.classList.add('del');

      toDoBlock.append(toDoItem, important, del);
      todos.append(toDoBlock);
    });

    save.onclick = () => setToDo(currentAdress);
    data.onkeydown = (e) => {
      if (e.key === 'Enter') {
        setToDo(currentAdress);
      }
    };

    data.value = '';
    data.focus();
  };

  document.addEventListener('click', (e) => {
    const el = e.target;
    const parent = el.closest('.todoblock');

    if (!parent) return;

    const id = parent.getAttribute('id');

    if (el.classList.contains('del')) {
      deleteTask(currentAdress, id);
    }

    if (el.classList.contains('important')) {
      el.classList.toggle('active');
      const status = el.classList.contains('active');
      el.innerHTML = status ? '★' : '☆';
      madeImportant(currentAdress, id, status);
    }

    if (el.classList.contains('todos__item')) {
      el.classList.toggle('expanded');
    }
  });

  async function deleteTask(adress, taskId) {
    await fetch(`${adress}/${taskId}`, {
      method: 'DELETE'
    });
    getList(adress);
  }

  async function madeImportant(adress, taskId, status) {
    await fetch(`${adress}/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ important: status })
    });
  }

  header.addEventListener('click', (e) => {
    const mainTitle = document.querySelector('.main-title');
    const purchases = document.querySelector('.container-purchases');
    const tasks = document.querySelector('.container-tasks');

    if (e.target.classList.contains('task')) {
      currentAdress = tasksAdress;
      mainTitle.classList.add('hidden');
      tasks.classList.remove('hidden');
      purchases.classList.add('hidden');
      getList(currentAdress);
    }

    if (e.target.classList.contains('purchases')) {
      currentAdress = purchasesAdress;
      mainTitle.classList.add('hidden');
      tasks.classList.add('hidden');
      purchases.classList.remove('hidden');
      getList(currentAdress);
    }
  });
});