// COUNSELOR SCHOOL REGISTRATION MODULE

function initCounselorSchoolForm() {
  const form = document.querySelector('#counselorSchoolForm');
  if (!form) {
    console.log('Counselor school form not found');
    return;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Збір даних з правильними назвами полів
    const firstName = form.querySelector('[name="firstName"]').value.trim();
    const lastName = form.querySelector('[name="lastName"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const motivation = form.querySelector('[name="motivation"]').value.trim();
    
    // Валідація
    let error = '';
    if (!firstName) error = 'Введіть імʼя';
    else if (!lastName) error = 'Введіть прізвище';
    else if (!phone) error = 'Введіть телефон';
    else if (!email) error = 'Введіть email';
    else if (!motivation) error = 'Введіть мотиваційний лист';
    
    if (error) {
      showCounselorFormMessage(error, 'error');
      return;
    }

    // Показуємо повідомлення про завантаження
    showCounselorFormMessage('Відправляємо заявку...', 'info');
    
    // Створюємо URL з параметрами для Google Apps Script
    const formUrl = form.action;
    const params = new URLSearchParams();
    params.append('Імʼя', firstName);
    params.append('Прізвище', lastName);
    params.append('Телефон', phone);
    params.append('Email', email);
    params.append('Мотивація', motivation);

    // Відправляємо через iframe для обходу CORS
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = `${formUrl}?${params.toString()}`;
    document.body.appendChild(iframe);

    // Показуємо успіх після короткої затримки
    setTimeout(() => {
      showCounselorFormMessage('Дякуємо за реєстрацію! Ми звʼяжемося з вами найближчим часом.', 'success');
      form.reset();
      document.body.removeChild(iframe);
    }, 2000);

    // Альтернативний спосіб через window.open
    /*
    const submitUrl = `${formUrl}?${params.toString()}`;
    window.open(submitUrl, '_blank');
    showCounselorFormMessage('Форма відкрилася у новому вікні. Заповніть її та відправте.', 'info');
    */
  });
}

function showCounselorFormMessage(msg, type = 'success') {
  let box = document.querySelector('.counselor-form-message');
  if (!box) {
    box = document.createElement('div');
    box.className = 'counselor-form-message';
    document.querySelector('#counselorSchoolForm').appendChild(box);
  }
  box.textContent = msg;
  box.style.color = type === 'error' ? '#e74c3c' : type === 'info' ? '#3498db' : '#27ae60';
  box.style.marginTop = '12px';
  box.style.fontWeight = 'bold';
}

export { initCounselorSchoolForm }; 