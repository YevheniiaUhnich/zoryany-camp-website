// BOOKING MODAL FUNCTIONALITY
function initBookingModal() {
    const bookingButton = document.getElementById('bookingButton');
    const bookingModal = document.getElementById('bookingModal');
    const bookingModalClose = document.getElementById('bookingModalClose');
    const genderButtons = document.querySelectorAll('.gender-button');

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
    genderButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const gender = this.getAttribute('data-gender');
            
            // Показуємо повідомлення про вибір
            alert(`Обрано: ${gender === 'boy' ? 'Хлопчик' : 'Дівчинка'}. Скоро тут буде форма бронювання!`);
            
            // Закриваємо модальне вікно
            closeModal();
        });
    });
}

export { initBookingModal }; 