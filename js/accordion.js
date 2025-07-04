// Accordion logic for 'Важливе для батьків'
export function initAccordion() {
  console.log('initAccordion called');
  const items = document.querySelectorAll('.accordion-item');
  console.log('Accordion items found:', items.length);
  
  items.forEach((item, index) => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    
    console.log(`Item ${index}:`, { header: !!header, content: !!content });
    
    if (header && content) {
      header.addEventListener('click', function(e) {
        console.log('Accordion header clicked:', e.target);
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
          console.log('Accordion opened');
        } else {
          console.log('Accordion closed');
        }
      });
      
      console.log(`Event listener added to item ${index}`);
    }
  });
} 