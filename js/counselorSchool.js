// COUNSELOR SCHOOL REGISTRATION MODULE

function initCounselorSchoolForm() {
  const form = document.querySelector("#counselorSchoolForm");
  if (!form) {
    console.log("Counselor school form not found");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Збір даних з правильними назвами полів
    const firstName = form.querySelector('[name="firstName"]').value.trim();
    const lastName = form.querySelector('[name="lastName"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const motivation = form.querySelector('[name="motivation"]').value.trim();

    // Детальне логування всіх полів
    console.log("=== FORM DATA ===");
    console.log("firstName:", firstName);
    console.log("lastName:", lastName);
    console.log("phone:", phone);
    console.log("email:", email);
    console.log("motivation:", motivation);
    console.log("================");

    // Валідація
    let error = "";
    if (!firstName) error = "Введіть імʼя";
    else if (!lastName) error = "Введіть прізвище";
    else if (!phone) error = "Введіть телефон";
    else if (!email) error = "Введіть email";
    else if (!motivation) error = "Введіть мотиваційний лист";

    if (error) {
      showCounselorFormMessage(error, "error");
      return;
    }

    // Показуємо повідомлення про завантаження
    showCounselorFormMessage("Відправляємо заявку...", "info");

    // Використовуємо простіші назви параметрів
    const formUrl = form.action;
    const params = new URLSearchParams();
    params.append("firstName", firstName);
    params.append("lastName", lastName);
    params.append("phone", phone);
    params.append("email", email);
    params.append("motivation", motivation);

    console.log("Form URL:", formUrl);
    console.log("Parameters:", params.toString());
    console.log("Full URL:", `${formUrl}?${params.toString()}`);

    // Відправляємо через iframe
    fetch(formUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from server:", data);
        showCounselorFormMessage(
          "Дякуємо за реєстрацію! Ми звʼяжемося з вами найближчим часом.",
          "success"
        );
        form.reset();
      })
      .catch((error) => {
        console.error("Error sending form:", error);
        showCounselorFormMessage(
          "Помилка відправки. Спробуйте пізніше.",
          "error"
        );
      });
  });
}

function showCounselorFormMessage(msg, type = "success") {
  let box = document.querySelector(".counselor-form-message");
  if (!box) {
    box = document.createElement("div");
    box.className = "counselor-form-message";
    document.querySelector("#counselorSchoolForm").appendChild(box);
  }
  box.textContent = msg;
  box.style.color =
    type === "error" ? "#e74c3c" : type === "info" ? "#3498db" : "#27ae60";
  box.style.marginTop = "12px";
  box.style.fontWeight = "bold";
}

export { initCounselorSchoolForm };
