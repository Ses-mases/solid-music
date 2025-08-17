document.addEventListener('DOMContentLoaded', () => {
    const applyButton = document.getElementById('apply-button');
    const overlay = document.getElementById('overlay');
    const closeButton = document.getElementById('close-button');
    const form = document.getElementById('join-form');

    // Показать оверлей
    applyButton.addEventListener('click', () => {
        overlay.style.display = 'flex';
    });

    // Скрыть оверлей
    closeButton.addEventListener('click', () => {
        overlay.style.display = 'none';
    });

    // Скрыть оверлей при клике вне формы
    window.addEventListener('click', (event) => {
        if (event.target === overlay) {
            overlay.style.display = 'none';
        }
    });
    
    // Отправка формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        // !!! ВАЖНО: Замените 'ВАША_ССЫЛКА_НА_WEB_APP' на вашу ссылку из Google Apps Script
        const action = 'https://script.google.com/macros/s/AKfycbxDzE3ZmG9kv7NIxmVZJ8bM3BJAHh-YY1zseDYAtoM3SzyYAX8TBtf4jkA5JZbnBsmO/exec';
        
        fetch(action, {
            method: 'POST',
            body: formData
        })
        .then(() => {
            alert('Ваша заявка отправлена!');
            form.reset();
            overlay.style.display = 'none';
        })
        .catch((error) => {
            alert('Ошибка отправки: ' + error);
        });
    });
});
