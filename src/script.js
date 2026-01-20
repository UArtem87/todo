const data = document.querySelector('.task-box__input');
const save = document.querySelector('.task-box__btn');
const todos = document.querySelector('.todos');

data.focus();

let toDoList = [];

async function getList() {
  loader.classList.remove('hidden');

  const response = await fetch('https://696f53afa06046ce618642cd.mockapi.io/tasks');
  const dataList = await response.json();
  console.log(dataList)
  if (dataList) {
    toDoList = dataList;
    loader.classList.add('hidden');

    renderToDo();
  } else {
    toDoList = [];
  }
}

getList();

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
    toDoBlock.setAttribute('id', todo.id)
    toDoBlock.classList.add('todoblock')
    const toDoItem = document.createElement('span')
    toDoItem.classList.add('todos__item');
    const del = document.createElement('span');
    del.classList.add('del');
    toDoBlock.append(toDoItem);
    toDoBlock.append(del);
    toDoItem.textContent = `${i + 1}. ${task}`;
    todos.append(toDoBlock);
  });
  data.value = '';
  data.focus();
};

async function deleteTask(taskId) {
  await fetch(`https://696f53afa06046ce618642cd.mockapi.io/tasks/${taskId}`, {
    method: 'DELETE'
  });

  getList();
}

data.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    setToDo();
  }
});

save.addEventListener('click', setToDo);

todos.addEventListener('click', (e) => {
  if (e.target.classList.contains('del')) {
    const id = e.target.closest('.todoblock').getAttribute('id');
    deleteTask(id);
  }
});