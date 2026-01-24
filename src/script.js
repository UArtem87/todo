const TASKSADRESS = 'YOUR_MOCK_API_ENDPOINT_HERE';
const PURCHASESADRESS = 'YOUR_MOCK_API_ENDPOINT_HERE';

window.addEventListener('DOMContentLoaded', () => {
  let itemsList = [];
  let editId = null;
  let currentAdress = PURCHASESADRESS;

  const header = document.querySelector('.header');
  const container = document.querySelector('.container');
  const title = document.querySelector('.title');
  const loader = document.querySelector('.loader');
  const data = document.querySelector('.data__input');
  const save = document.querySelector('.data__btn');
  const items = document.querySelector('.items');

  async function getList(adress) {
    title.textContent = adress === TASKSADRESS
      ? 'Надо сделать:'
      : 'Надо купить:';

    loader.classList.remove('not-view');

    try {
      const response = await fetch(adress);

      if (!response.ok) {
        throw new Error("Ошибка сервера");
      }

      const dataList = await response.json();

      if (dataList) {
        itemsList = [];
        dataList.forEach(item => {
          item.important ? itemsList.unshift(item) : itemsList.push(item);
        });
      };

      renderItems();
    } catch (error) {
      console.error('Не удалось загрузить список');
    } finally {
      loader.classList.add('not-view');
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

      const change = document.createElement('span');
      change.classList.add('change');
      change.innerHTML = '&#9999';

      itemBlock.append(change, itemsBlockTitle, important, del);
      items.append(itemBlock);
    });

    data.value = '';

    items.classList.remove('faded');
  };


  async function setItem(adress) {
    try {
      if (editId !== null) {
        if (data.value.trim() === '') {
          data.focus();
          return;
        }
        await changeItemText(currentAdress, editId, data.value);
        save.textContent = 'Сохранить';
        editId = null;
      } else {
        if (data.value === '') {
          data.focus();
        } else {
          const item = data.value;

          const response = await fetch(adress, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ text: item })
          });

          if (!response.ok) {
            throw new Error("Не удалось отправить данные на сервер");

          }
          await getList(adress);
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function deleteItem(adress, taskId) {
    try {
      const response = await fetch(`${adress}/${taskId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Не удалось удалить задачу');

      await getList(adress);
    } catch (error) {
      console.error('Ошибка при удалении:', error);
      alert('Произошла ошибка при удалении задачи. Проверьте соединение.');
    }
  };

  async function madeImportant(adress, taskId, status) {
    try {
      const response = await fetch(`${adress}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ important: status })
      });

      if (!response.ok) throw new Error('Не удалось обновить статус');

      await getList(adress);
    } catch (error) {
      console.error('Ошибка изменения важности:', error);
      // Здесь можно не выводить alert, чтобы не надоедать пользователю, 
      // но в консоли мы увидим, что пошло не так.
    }
  };

  async function changeItemText(adress, taskId, itemText) {
    try {
      const response = await fetch(`${adress}/${taskId}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: itemText })
      });

      if (!response.ok) throw new Error('Не удалось изменить текст');

      await getList(adress);
    } catch (error) {
      console.error('Ошибка при редактировании:', error);
      alert('Не удалось сохранить изменения.');
    }
  }

  document.addEventListener('click', (e) => {
    const el = e.target;
    const parent = el.closest('.items__block');

    if (!parent) return;

    const id = parent.getAttribute('id');

    if (el.classList.contains('del')) {
      parent.classList.add('delete');
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

    if (el.classList.contains('change')) {
      editId = id;
      data.value = itemsList.find(item => item.id === editId).text;
      save.textContent = 'Обновить';
      data.focus();
    }
  });

  save.onclick = () => setItem(currentAdress);
  data.onkeydown = (e) => {
    if (e.key === 'Enter') {
      setItem(currentAdress);
    }
  };

  header.addEventListener('click', (e) => {
    editId = null;
    save.textContent = 'Сохранить';
    data.value = '';

    const isTasks = e.target.classList.contains('tasks');
    const isPurchases = e.target.classList.contains('purchases');

    if (!isTasks && !isPurchases) return;

    document.querySelectorAll('.view').forEach(tab => {
      tab.classList.remove('active');
    });

    e.target.classList.add('active')


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

