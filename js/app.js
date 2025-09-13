/* =========================
   SMOOTH SCROLL FOR NAV LINKS
========================= */
document.querySelectorAll('.nav-links a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* =========================
   CONTACT FORM SUBMISSION
========================= */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitButton = contactForm.querySelector('button');
const btnText = submitButton.querySelector('.btn-text');
const btnSpinner = submitButton.querySelector('.btn-spinner');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    showStatus('Please fill in all fields.', 'error');
    return;
  }

  // Show spinner
  btnText.style.display = 'none';
  btnSpinner.style.display = 'inline-block';
  showStatus('Sending...', 'loading');

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });

    if (response.ok) {
      showStatus('Message sent successfully!', 'success');
      contactForm.reset();
    } else {
      const data = await response.json();
      showStatus(data.error || 'Something went wrong.', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showStatus('Unable to send message. Try again later.', 'error');
  } finally {
    // Hide spinner
    btnText.style.display = 'inline-block';
    btnSpinner.style.display = 'none';
  }
});

function showStatus(message, type) {
  formStatus.textContent = message;
  formStatus.style.opacity = 1;

  switch (type) {
    case 'loading':
      formStatus.style.color = '#00b4d8';
      break;
    case 'success':
      formStatus.style.color = '#90e0ef';
      break;
    case 'error':
      formStatus.style.color = '#ff4c4c';
      break;
    default:
      formStatus.style.color = '#ffffff';
  }

  if (type !== 'loading') {
    setTimeout(() => {
      formStatus.style.opacity = 0;
    }, 5000);
  }
}

/* =========================
   PROJECT CARD MODALS
========================= */
const projectCards = document.querySelectorAll('.project-card');
const modals = document.querySelectorAll('.modal');

projectCards.forEach(card => {
  card.addEventListener('click', () => {
    const modalId = card.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
  });
});

modals.forEach(modal => {
  const closeBtn = modal.querySelector('.modal-close');
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
});

window.addEventListener('click', (e) => {
  modals.forEach(modal => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});
