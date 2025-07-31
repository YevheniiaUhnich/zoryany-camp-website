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
    
    // Спробуємо POST спочатку
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('motivation', motivation);

    console.log('Trying POST method...');
    
    fetch(form.action, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      console.log('POST response status:', response.status);
      return response.text();
    })
    .then(data => {
      console.log('POST response data:', data);
      showCounselorFormMessage('Дякуємо за реєстрацію! Ми звʼяжемося з вами найближчим часом.', 'success');
      form.reset();
    })
    .catch((error) => {
      console.log('POST failed, trying GET method...');
      
      // Якщо POST не працює, спробуємо GET через iframe
      const formUrl = form.action;
      const params = new URLSearchParams();
      params.append('firstName', firstName);
      params.append('lastName', lastName);
      params.append('phone', phone);
      params.append('email', email);
      params.append('motivation', motivation);

      console.log('Form URL:', formUrl);
      console.log('Parameters:', params.toString());
      console.log('Full URL:', `${formUrl}?${params.toString()}`);

      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = `${formUrl}?${params.toString()}`;
      document.body.appendChild(iframe);

      setTimeout(() => {
        showCounselorFormMessage('Дякуємо за реєстрацію! Ми звʼяжемося з вами найближчим часом.', 'success');
        form.reset();
        document.body.removeChild(iframe);
      }, 2000);
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