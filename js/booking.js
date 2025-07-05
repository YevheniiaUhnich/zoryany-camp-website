// BOOKING MODAL FUNCTIONALITY
function initBookingModal() {
    const bookingButton = document.getElementById('bookingButton');
    const bookingModal = document.getElementById('bookingModal');
    const bookingModalClose = document.getElementById('bookingModalClose');
    const genderButtons = document.querySelectorAll('.gender-button');

    // Відкриття модального вікна
    bookingButton.addEventListener('click', function() {
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Блокуємо скрол на фоні
    });

    // Закриття модального вікна
    function closeModal() {
        bookingModal.classList.remove('active');
        document.body.style.overflow = ''; // Відновлюємо скрол
    }

    bookingModalClose.addEventListener('click', closeModal);

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
    genderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const gender = this.getAttribute('data-gender');
            console.log('Обрана стать:', gender);
            
            // Тут можна додати логіку для подальшої обробки вибору
            // Наприклад, перенаправлення на форму бронювання або показ додаткової інформації
            
            // Показуємо повідомлення про вибір
            alert(`Обрано: ${gender === 'boy' ? 'Хлопчик' : 'Дівчинка'}. Скоро тут буде форма бронювання!`);
            
            // Закриваємо модальне вікно
            closeModal();
        });
    });
}

export { initBookingModal }; 