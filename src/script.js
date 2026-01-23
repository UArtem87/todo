const TASKSADRESS = 'https://696f53afa06046ce618642cd.mockapi.io/tasks';
const PURCHASESADRESS = 'https://696f53afa06046ce618642cd.mockapi.io/purchases';

window.addEventListener('DOMContentLoaded', () => {
  let itemsList = [];
  let currentAdress = PURCHASESADRESS;

  const header = document.querySelector('.header');
  const container = document.querySelector('.container');
  const title = document.querySelector('.title');
  const loader = document.querySelector('.loader');
  const data = document.querySelector('.data__input');
  const save = document.querySelector('.data__btn');
  const items = document.querySelector('.items');

  async function getList(adress) {
    if (adress === TASKSADRESS) {
      title.textContent = 'Надо сделать:'
    } else {
      title.textContent = 'Надо купить:'
    }
    loader.classList.remove('not-view');

    const response = await fetch(adress);
    const dataList = await response.json();

    if (dataList) {
      itemsList = dataList;
      loader.classList.add('not-view');

      renderItems();
    } else {
      itemsList = [];
    }
  };

  function renderItems() {
    items.innerHTML = '';
    itemsList.forEach((item, i) => {
      const itemText = `${item.text.slice(0, 1).toUpperCase()}${item.text.slice(1)}`;

      const itemBlock = document.createElement('div');
      itemBlock.setAttribute('id', item.id);
      itemBlock.classList.add('items__block');

      const itemsBlockTitle = document.createElement('span');
      itemsBlockTitle.classList.add('items__block--title');
      itemsBlockTitle.textContent = `${i + 1}. ${itemText}`;

      const important = document.createElement('span');
      important.classList.add('important');
      important.innerHTML = item.important ? '★' : '☆';

      if (item.important) {
        important.classList.add('active');
      }

      const del = document.createElement('span');
      del.classList.add('del');

      itemBlock.append(itemsBlockTitle, important, del);
      items.append(itemBlock);
    });

    data.value = '';

    items.classList.remove('faded');
  };


  async function setItem(adress) {
    if (data.value === '') {
      data.focus();
    } else {
      const item = data.value;

      await fetch(adress, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: item })
      });

      getList(adress);
    }
  };

  async function deleteItem(adress, taskId) {
    await fetch(`${adress}/${taskId}`, {
      method: 'DELETE'
    });
    getList(adress);
  };

  async function madeImportant(adress, taskId, status) {
    await fetch(`${adress}/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ important: status })
    });
  };

  document.addEventListener('click', (e) => {
    const el = e.target;
    const parent = el.closest('.items__block');

    if (!parent) return;

    const id = parent.getAttribute('id');

    if (el.classList.contains('del')) {
      deleteItem(currentAdress, id);
    }

    if (el.classList.contains('important')) {
      el.classList.toggle('active');
      const status = el.classList.contains('active');
      el.innerHTML = status ? '★' : '☆';
      madeImportant(currentAdress, id, status);
    }

    if (el.classList.contains('items__block--title')) {
      el.classList.toggle('expanded');
    }
  });

  save.onclick = () => setItem(currentAdress);
  data.onkeydown = (e) => {
    if (e.key === 'Enter') {
      setItem(currentAdress);
    }
  };

  header.addEventListener('click', (e) => {
    const isTasks = e.target.classList.contains('tasks');
    const isPurchases = e.target.classList.contains('purchases');

    if (!isTasks && !isPurchases) return;

    const mainTitle = document.querySelector('.main-title');
    mainTitle.classList.add('hidden');
    container.classList.remove('hidden');

    items.classList.add('faded');

    setTimeout(() => {
      currentAdress = isTasks ? TASKSADRESS : PURCHASESADRESS;
      getList(currentAdress);
    }, 300);
  }
  );
});

