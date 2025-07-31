// COUNSELOR SCHOOL REGISTRATION MODULE

function initCounselorSchoolForm() {
  const form = document.querySelector('#counselorSchoolForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    // Збір даних
    const name = form.querySelector('[name="name"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    let error = '';
    if (!name) error = 'Введіть імʼя';
    else if (!phone) error = 'Введіть телефон';
    else if (!email) error = 'Введіть email';
    if (error) {
      showCounselorFormMessage(error, 'error');
      return;
    }
    // Тут можна відправити дані на сервер (fetch/AJAX)
    showCounselorFormMessage('Дякуємо за реєстрацію! Ми звʼяжемося з вами найближчим часом.', 'success');
    form.reset();
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
  box.style.color = type === 'error' ? '#e74c3c' : '#27ae60';
  box.style.marginTop = '12px';
}

export { initCounselorSchoolForm }; 