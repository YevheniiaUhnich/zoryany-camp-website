// Accordion logic for 'Важливе для батьків'
export function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');
  items.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    header.addEventListener('click', function() {
      const expanded = header.getAttribute('aria-expanded') === 'true';
      // Закриваємо всі
      document.querySelectorAll('.accordion-header').forEach(h => {
        h.setAttribute('aria-expanded', 'false');
      });
      document.querySelectorAll('.accordion-content').forEach(c => {
        c.hidden = true;
      });
      // Відкриваємо поточний, якщо був закритий
      if (!expanded) {
        header.setAttribute('aria-expanded', 'true');
        content.hidden = false;
      }
    });
  });
} 