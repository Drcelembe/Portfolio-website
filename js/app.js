/* =========================
   PROJECT MODALS
========================= */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', (e) => {
    // Ignore clicks on links inside the card
    if (e.target.tagName === 'A') return;

    const modalId = card.dataset.modal;
    const modal = document.getElementById(modalId);
    if(modal) modal.style.display = 'flex';
  });
});

document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal').style.display = 'none';
  });
});

// Close modal if clicked outside content
window.addEventListener('click', (e) => {
  document.querySelectorAll('.modal').forEach(modal => {
    if(e.target === modal) modal.style.display = 'none';
  });
});

/* =========================
   CONTACT FORM
========================= */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if(contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    if(!name || !email || !message) {
      formStatus.textContent = "⚠️ Please fill out all fields.";
      formStatus.style.color = 'red';
      return;
    }

    // Show spinner
    const btn = contactForm.querySelector('button');
    btn.querySelector('.btn-text').style.display = 'none';
    btn.querySelector('.btn-spinner').style.display = 'inline-block';
    formStatus.textContent = '';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const result = await response.json();

      if(result.success) {
        formStatus.textContent = "✅ Message sent successfully!";
        formStatus.style.color = '#00bfa6';
        contactForm.reset();
      } else {
        formStatus.textContent = "❌ Failed to send message. Try again later.";
        formStatus.style.color = 'red';
      }

    } catch(err) {
      console.error('Error submitting form:', err);
      formStatus.textContent = "⚠️ Error sending message. Please try again later.";
      formStatus.style.color = 'red';
    }

    // Hide spinner
    btn.querySelector('.btn-text').style.display = 'inline-block';
    btn.querySelector('.btn-spinner').style.display = 'none';
  });
}

// ===== PAYPAL BUTTON REDIRECT =====
document.addEventListener('DOMContentLoaded', () => {
  const paypalBtn = document.getElementById('paypalBtn'); // Make sure your PayPal button has id="paypalBtn"
  
  if (paypalBtn) {
    paypalBtn.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent default link behavior
      // Open PayPal in a new tab safely
      window.open('https://paypal.me/AzolaCele/50', '_blank', 'noopener,noreferrer');
    });
  }
});

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {

  // ===== PAYPAL BUTTON REDIRECT =====
  const paypalBtn = document.getElementById('paypalBtn');
  if (paypalBtn) {
    paypalBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.open('https://paypal.me/AzolaCele/50', '_blank', 'noopener,noreferrer');
    });
  }

  // ===== OPTIONAL: Smooth Scroll for Hero CTA Buttons =====
  const heroBtns = document.querySelectorAll('.hero-cta a');
  heroBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});

