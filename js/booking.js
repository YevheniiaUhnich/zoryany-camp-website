// BOOKING MODAL FUNCTIONALITY
function initBookingModal() {
    const bookingButton = document.getElementById('bookingButton');
    const bookingModal = document.getElementById('bookingModal');
    const bookingModalClose = document.getElementById('bookingModalClose');
    const genderButtons = document.querySelectorAll('.gender-button');
    const boyAgeDropdown = document.getElementById('boyAgeDropdown');
    const boyAgeBtns = document.querySelectorAll('.boy-age-btn');
    const girlAgeDropdown = document.getElementById('girlAgeDropdown');
    const girlAgeBtns = document.querySelectorAll('.girl-age-btn');
    const genderButtonsContainer = document.querySelector('.gender-buttons');

    if (!bookingButton) {
        console.error('Booking button not found!');
        return;
    }

    if (!bookingModal) {
        console.error('Booking modal not found!');
        return;
    }

    // Відкриття модального вікна
    bookingButton.addEventListener('click', function(e) {
        e.preventDefault();
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Показати кнопки вибору статі, сховати дропдауни віку
        if (genderButtonsContainer) genderButtonsContainer.style.display = '';
        if (boyAgeDropdown) boyAgeDropdown.style.display = 'none';
        if (girlAgeDropdown) girlAgeDropdown.style.display = 'none';
    });

    // Закриття модального вікна
    function closeModal() {
        bookingModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Закриття кнопкою "Закрити"
    if (bookingModalClose) {
        bookingModalClose.addEventListener('click', function() {
            closeModal();
        });
    }

    // Закриття при кліку поза модальним вікном
    bookingModal.addEventListener('click', function(e) {
        if (e.target === bookingModal) {
            closeModal();
        }
    });

    // Закриття при натисканні Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Обробка кліків по кнопках вибору статі
    genderButtons.forEach((button) => {
        button.addEventListener('click', function() {
            const gender = this.getAttribute('data-gender');
            if (gender === 'boy') {
                // Показати дропдаун віку хлопчика
                if (genderButtonsContainer) genderButtonsContainer.style.display = 'none';
                if (boyAgeDropdown) boyAgeDropdown.style.display = '';
                if (girlAgeDropdown) girlAgeDropdown.style.display = 'none';
            } else if (gender === 'girl') {
                // Показати дропдаун віку дівчинки
                if (genderButtonsContainer) genderButtonsContainer.style.display = 'none';
                if (girlAgeDropdown) girlAgeDropdown.style.display = '';
                if (boyAgeDropdown) boyAgeDropdown.style.display = 'none';
            }
        });
    });

    // Обробка кліків по кнопках віку хлопчика
    boyAgeBtns.forEach((btn) => {
        btn.addEventListener('click', function() {
            const age = this.getAttribute('data-age');
            alert(`Обрано: Хлопчик, ${age} років. Скоро тут буде форма бронювання!`);
            closeModal();
        });
    });

    // Обробка кліків по кнопках віку дівчинки
    girlAgeBtns.forEach((btn) => {
        btn.addEventListener('click', function() {
            const age = this.getAttribute('data-age');
            alert(`Обрано: Дівчинка, ${age} років. Скоро тут буде форма бронювання!`);
            closeModal();
        });
    });
}

export { initBookingModal }; 