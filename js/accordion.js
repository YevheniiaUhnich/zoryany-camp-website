export function initAccordion() {
  const items = document.querySelectorAll(".accordion-item");
  items.forEach((item) => {
    const header = item.querySelector(".accordion-header");
    const content = item.querySelector(".accordion-content");
    if (!header || !content || header.dataset.bound) return;

    header.dataset.bound = "1";
    header.addEventListener("click", () => {
      const container = item.closest(".accordion") || document;
      const expanded = header.getAttribute("aria-expanded") === "true";

      // закриваємо тільки в межах контейнера
      container
        .querySelectorAll(".accordion-header")
        .forEach((h) => h.setAttribute("aria-expanded", "false"));
      container
        .querySelectorAll(".accordion-content")
        .forEach((c) => (c.hidden = true));

      if (!expanded) {
        header.setAttribute("aria-expanded", "true");
        content.hidden = false;
      }
    });
  });
}
