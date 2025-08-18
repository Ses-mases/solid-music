// Глобальные callback-функции для reCAPTCHA должны быть вне DOMContentLoaded
let isRecaptchaValid = false;

function onRecaptchaSuccess() {
    isRecaptchaValid = true;
    updateSubmitButtonState();
}

function onRecaptchaExpired() {
    isRecaptchaValid = false;
    updateSubmitButtonState();
}

// Основной скрипт
document.addEventListener('DOMContentLoaded', () => {
    const applyButton = document.getElementById('apply-button');
    const overlay = document.getElementById('overlay');
    const closeButton = document.getElementById('close-button');
    const form = document.getElementById('join-form');
    const submitButton = document.getElementById('submit-button');
    const privacyCheck = document.getElementById('privacy-check');
    const formMessage = document.getElementById('form-message');

    if (!applyButton || !overlay || !closeButton || !form) {
        console.error('Ошибка: один из ключевых элементов интерфейса не найден.');
        return;
    }

    const showOverlay = () => {
        overlay.style.display = 'flex';
        overlay.setAttribute('aria-hidden', 'false');
    };

    const hideOverlay = () => {
        overlay.style.display = 'none';
        overlay.setAttribute('aria-hidden', 'true');
        resetFormState();
    };

    const resetFormState = () => {
        form.reset();
        grecaptcha.reset();
        isRecaptchaValid = false;
        updateSubmitButtonState();
        formMessage.textContent = '';
        formMessage.className = 'form-message';
        submitButton.textContent = 'ОТПРАВИТЬ';
    };

    applyButton.addEventListener('click', showOverlay);
    closeButton.addEventListener('click', hideOverlay);
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) hideOverlay();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') hideOverlay();
    });

    // --- Логика формы ---
    window.updateSubmitButtonState = () => {
        if (privacyCheck.checked && isRecaptchaValid) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    };
    
    privacyCheck.addEventListener('change', updateSubmitButtonState);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (submitButton.disabled) return;

        submitButton.disabled = true;
        submitButton.textContent = 'ОТПРАВКА...';
        formMessage.textContent = '';
        formMessage.className = 'form-message';

        const formData = new FormData(form);
        const action = form.dataset.action;

        try {
            const response = await fetch(action, {
                method: 'POST',
                body: formData
            });

            // Google Apps Script часто возвращает редирект, поэтому простой fetch без ошибки - уже успех.
            formMessage.textContent = 'Спасибо! Ваша заявка отправлена.';
            formMessage.classList.add('success');
            
            setTimeout(() => {
                hideOverlay();
            }, 2000); // Закрываем окно через 2 секунды

        } catch (error) {
            console.error('Ошибка отправки формы:', error);
            formMessage.textContent = 'Ошибка отправки. Попробуйте снова.';
            formMessage.classList.add('error');
            submitButton.disabled = false;
            submitButton.textContent = 'ОТПРАВИТЬ';
        }
    });
});
