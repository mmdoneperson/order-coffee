document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const addButton = document.querySelector('.add-button');

    function updateBeverageHeaders() {
        document.querySelectorAll('.beverage').forEach((fieldset, index) => {
            fieldset.querySelector('.beverage-count').textContent = `Напиток №${index + 1}`;
        });
    }

    function updateDeleteButtonsState() {
        const beverages = document.querySelectorAll('.beverage');
        beverages.forEach(bev => {
            const btn = bev.querySelector('.delete-button');
            if (beverages.length === 1) {
                btn.disabled = true;
                btn.style.opacity = '0.5';
                btn.style.cursor = 'default';
                btn.title = 'Нельзя удалить последний напиток';
            } else {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
                btn.title = 'Удалить напиток';
            }
        });
    }

    function createDeleteButton() {
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.textContent = '✖';
        deleteBtn.className = 'delete-button';

        deleteBtn.addEventListener('click', function () {
            const beverages = document.querySelectorAll('.beverage');
            if (beverages.length > 1) {
                this.closest('.beverage').remove();
                updateBeverageHeaders();
                updateDeleteButtonsState();
            }
        });

        return deleteBtn;
    }

    addButton.addEventListener('click', () => {
        const beverages = document.querySelectorAll('.beverage');
        const lastBeverage = beverages[beverages.length - 1];
        const newBeverage = lastBeverage.cloneNode(true);

        // Сбросить значения формы
        newBeverage.querySelectorAll('input').forEach(el => {
            if (el.type === 'radio') {
                el.checked = el.defaultChecked;
            } else if (el.type === 'checkbox') {
                el.checked = false;
            }
        });
        newBeverage.querySelector('select').selectedIndex = 0;

        newBeverage.style.position = 'relative';

        // Заменить старую кнопку удаления
        const oldDelete = newBeverage.querySelector('.delete-button');
        if (oldDelete) oldDelete.remove();
        newBeverage.appendChild(createDeleteButton());

        form.insertBefore(newBeverage, addButton.parentElement);
        updateBeverageHeaders();
        updateDeleteButtonsState();
    });

    function showModal() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;

        const modal = document.createElement('div');
        modal.style.cssText = `
      background: white;
      width: 500px;
      padding: 20px;
      border-radius: 10px;
      position: relative;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✖';
        closeBtn.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: transparent;
      border: none;
      font-size: 20px;
      cursor: pointer;
    `;
        closeBtn.addEventListener('click', () => overlay.remove());

        const content = document.createElement('p');
        content.textContent = 'Заказ принят!';
        content.style.fontSize = '18px';

        modal.appendChild(closeBtn);
        modal.appendChild(content);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showModal();
    });

    // Кнопка удаления у первого напитка
    const firstBeverage = document.querySelector('.beverage');
    firstBeverage.appendChild(createDeleteButton());
    updateDeleteButtonsState();
});
