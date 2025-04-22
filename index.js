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
                btn.title = 'Нельзя удалить последний напиток';
            } else {
                btn.disabled = false;
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

        // Сброс полей
        newBeverage.querySelectorAll('input').forEach(el => {
            if (el.type === 'radio') {
                el.checked = el.defaultChecked;
            } else if (el.type === 'checkbox') {
                el.checked = false;
            }
        });
        newBeverage.querySelector('select').selectedIndex = 0;

        // Удаляем клонированные пожелания
        newBeverage.querySelectorAll('label.field').forEach(label => {
            if (label.querySelector('textarea')) {
                label.remove();
            }
        });
        // Добавляем свежую область пожеланий
        addWishesTextarea(newBeverage);

        // Удаляем старую кнопку удаления и добавляем новую
        const oldDelete = newBeverage.querySelector('.delete-button');
        if (oldDelete) oldDelete.remove();
        newBeverage.appendChild(createDeleteButton());

        form.insertBefore(newBeverage, addButton.parentElement);
        updateBeverageHeaders();
        updateDeleteButtonsState();
    });

    function getDrinkWordForm(n) {
        const lastDigit = n % 10;
        const lastTwoDigits = n % 100;
        if (lastDigit === 1 && lastTwoDigits !== 11) return 'напиток';
        if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 10 || lastTwoDigits >= 20)) return 'напитка';
        return 'напитков';
    }

    function showModal() {
        const beverages = document.querySelectorAll('.beverage');
        const count = beverages.length;
        const wordForm = getDrinkWordForm(count);

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'modal-window';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✖';
        closeBtn.className = 'modal-close';
        closeBtn.addEventListener('click', () => overlay.remove());

        const header = document.createElement('p');
        header.textContent = `Вы заказали ${count} ${wordForm}`;
        header.className = 'modal-header';

        const table = document.createElement('table');
        table.className = 'modal-table';

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Напиток</th>
                <th>Молоко</th>
                <th>Дополнительно</th>
                <th>Пожелания</th>
            </tr>
        `;

        const tbody = document.createElement('tbody');
        beverages.forEach(bev => {
            const drink = bev.querySelector('select').selectedOptions[0].textContent;
            const milk = bev.querySelector('input[name="milk"]:checked')?.nextElementSibling?.textContent || '';
            const options = Array.from(bev.querySelectorAll('input[type="checkbox"]:checked'))
                .map(cb => cb.nextElementSibling.textContent.trim())
                .join(', ');
            const wishes = bev.querySelector('textarea')?.value.trim() || '';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${drink}</td>
                <td>${milk}</td>
                <td>${options}</td>
                <td>${wishes}</td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(thead);
        table.appendChild(tbody);

        const timeLabel = document.createElement('label');
        timeLabel.textContent = 'Выберите время заказа:';
        timeLabel.className = 'time-label';

        const timeInput = document.createElement('input');
        timeInput.type = 'time';
        timeInput.className = 'time-input';

        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = 'Оформить';
        confirmBtn.className = 'confirm-button';
        confirmBtn.addEventListener('click', () => {
            const selectedTime = timeInput.value;
            if (!selectedTime) return;
            const now = new Date();
            const [h, m] = selectedTime.split(':').map(Number);
            const selected = new Date();
            selected.setHours(h, m, 0, 0);
            if (selected < now) {
                timeInput.classList.add('time-input-error');
                alert('Мы не умеем перемещаться во времени. Выберите время позже, чем текущее');
            } else {
                overlay.remove();
            }
        });

        modal.append(closeBtn, header, table, timeLabel, timeInput, confirmBtn);
        overlay.append(modal);
        document.body.append(overlay);
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        showModal();
    });

    function highlightKeywords(text) {
        const keywords = ['срочно', 'быстрее', 'побыстрее', 'скорее', 'поскорее', 'очень нужно'];
        const regex = new RegExp(keywords.join('|'), 'gi');
        return text.replace(regex, match => `<b>${match}</b>`);
    }

    function addWishesTextarea(beverage) {
        const wishesField = document.createElement('label');
        wishesField.className = 'field';
        const textareaId = 'textarea-' + Math.random().toString(36).slice(2);
        const previewId = 'preview-' + Math.random().toString(36).slice(2);
        wishesField.innerHTML = `
            И ещё вот что:<br/>
            <textarea id="${textareaId}" rows="2" style="width: 100%; margin-top: 5px;"></textarea>
            <div id="${previewId}" class="preview"></div>
        `;
        beverage.append(wishesField);
        const txt = wishesField.querySelector(`#${textareaId}`);
        const prev = wishesField.querySelector(`#${previewId}`);
        txt.addEventListener('input', () => {
            let raw = txt.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            prev.innerHTML = highlightKeywords(raw);
        });
    }

    const firstBeverage = document.querySelector('.beverage');
    addWishesTextarea(firstBeverage);
    firstBeverage.appendChild(createDeleteButton());
    updateDeleteButtonsState();
});
