let isRecaptchaValid = false;
let submitButton;
let privacyCheck;


function updateSubmitButtonState() {
    if (submitButton && privacyCheck) {
        if (privacyCheck.checked && isRecaptchaValid) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    }
}

function onRecaptchaSuccess() {
    isRecaptchaValid = true;
    updateSubmitButtonState();
}

function onRecaptchaExpired() {
    isRecaptchaValid = false;
    updateSubmitButtonState();
}


document.addEventListener('DOMContentLoaded', () => {
    const applyButton = document.getElementById('apply-button');
    const overlay = document.getElementById('overlay');
    const closeButton = document.getElementById('close-button');
    const form = document.getElementById('join-form');
    const formMessage = document.getElementById('form-message');

    submitButton = document.getElementById('submit-button');
    privacyCheck = document.getElementById('privacy-check');


    if (!applyButton || !overlay || !closeButton || !form || !submitButton || !privacyCheck) {
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
        if (typeof grecaptcha !== 'undefined') {
            grecaptcha.reset();
        }
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

            formMessage.textContent = 'Спасибо! Ваша заявка отправлена.';
            formMessage.classList.add('success');
            
            setTimeout(() => {
                hideOverlay();
            }, 2000);

        } catch (error) {
            console.error('Ошибка отправки формы:', error);
            formMessage.textContent = 'Ошибка отправки. Попробуйте снова.';
            formMessage.classList.add('error');
            submitButton.disabled = false;
            submitButton.textContent = 'ОТПРАВИТЬ';
        }
    });
});
