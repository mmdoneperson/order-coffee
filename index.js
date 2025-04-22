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

        newBeverage.querySelectorAll('input').forEach(el => {
            if (el.type === 'radio') {
                el.checked = el.defaultChecked;
            } else if (el.type === 'checkbox') {
                el.checked = false;
            }
        });
        newBeverage.querySelector('select').selectedIndex = 0;

        const textarea = newBeverage.querySelector('textarea');
        if (textarea) textarea.value = '';

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

        if (lastDigit === 1 && lastTwoDigits !== 11) {
            return 'напиток';
        } else if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 10 || lastTwoDigits >= 20)) {
            return 'напитка';
        } else {
            return 'напитков';
        }
    }

    function showModal() {
        const beverages = document.querySelectorAll('.beverage');
        const count = beverages.length;
        const wordForm = getDrinkWordForm(count);

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
            width: 700px;
            padding: 20px;
            border-radius: 10px;
            position: relative;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            max-height: 90vh;
            overflow-y: auto;
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

        const header = document.createElement('p');
        header.textContent = `Вы заказали ${count} ${wordForm}`;
        header.style.fontSize = '18px';
        header.style.marginBottom = '20px';

        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginBottom = '20px';

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th style="border-bottom: 1px solid #ccc;">Напиток</th>
                <th style="border-bottom: 1px solid #ccc;">Молоко</th>
                <th style="border-bottom: 1px solid #ccc;">Дополнительно</th>
                <th style="border-bottom: 1px solid #ccc;">Пожелания</th>
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
                <td style="padding: 5px;">${drink}</td>
                <td style="padding: 5px;">${milk}</td>
                <td style="padding: 5px;">${options}</td>
                <td style="padding: 5px;">${wishes}</td>
            `;
            tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);

        // Время заказа
        const timeLabel = document.createElement('label');
        timeLabel.textContent = 'Выберите время заказа:';
        timeLabel.style.display = 'block';
            timeLabel.style.marginBottom = '5px';

        const timeInput = document.createElement('input');
        timeInput.type = 'time';
        timeInput.style.cssText = `
            display: block;
            margin-bottom: 20px;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 5px;
        `;

        // Кнопка оформления
        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = 'Оформить';
        confirmBtn.style.cssText = `
            margin-top: 10px;
            padding: 10px 20px;
            font-size: 16px;
            background-color: orange;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;

        confirmBtn.addEventListener('click', () => {
            const selectedTime = timeInput.value;
            if (!selectedTime) return;

            const now = new Date();
            const [hours, minutes] = selectedTime.split(':').map(Number);
            const selected = new Date();
            selected.setHours(hours, minutes, 0, 0);

            if (selected < now) {
                timeInput.style.borderColor = 'red';
                alert('Мы не умеем перемещаться во времени. Выберите время позже, чем текущее');
            } else {
                overlay.remove();
            }
        });

        modal.appendChild(closeBtn);
        modal.appendChild(header);
        modal.appendChild(table);
        modal.appendChild(timeLabel);
        modal.appendChild(timeInput);
        modal.appendChild(confirmBtn);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showModal();
    });

    function highlightKeywords(text) {
        const keywords = ['срочно', 'быстрее', 'побыстрее', 'скорее', 'поскорее', 'очень нужно'];
        const regex = new RegExp(keywords.join('|'), 'gi');
        return text.replace(regex, match => `<b>${match}</b>`);
    }


    // Добавим textarea пожеланий
    function addWishesTextarea(beverage) {
        const wishesField = document.createElement('label');
        wishesField.className = 'field';

        const textareaId = 'textarea-' + Math.random().toString(36).substring(2, 9);
        const previewId = 'preview-' + Math.random().toString(36).substring(2, 9);

        wishesField.innerHTML = `
        И ещё вот что:<br/>
        <textarea id="${textareaId}" rows="2" style="width: 100%; margin-top: 5px;"></textarea>
        <div id="${previewId}" style="margin-top: 5px; color: #333; font-size: 14px;"></div>
    `;

        beverage.appendChild(wishesField);

        const textarea = wishesField.querySelector(`#${textareaId}`);
        const preview = wishesField.querySelector(`#${previewId}`);

        textarea.addEventListener('input', () => {
            let rawText = textarea.value;

            // Экранируем HTML
            rawText = rawText.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');

            // Применяем твою функцию
            const highlighted = highlightKeywords(rawText);

            preview.innerHTML = highlighted;
        });
    }





    // Добавить к первому напитку textarea и delete
    const firstBeverage = document.querySelector('.beverage');
    addWishesTextarea(firstBeverage);
    firstBeverage.appendChild(createDeleteButton());
    updateDeleteButtonsState();
});
