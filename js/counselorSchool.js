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
    
    // Формуємо дані для Google Forms
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('motivation', motivation);

    // Відправляємо на Google Forms
    fetch(form.action, {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    })
    .then(() => {
      showCounselorFormMessage('Дякуємо за реєстрацію! Ми звʼяжемося з вами найближчим часом.', 'success');
      form.reset();
    })
    .catch((error) => {
      console.error('Error:', error);
      showCounselorFormMessage('Помилка відправки. Спробуйте ще раз або звʼяжіться з нами.', 'error');
    });
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