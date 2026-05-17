/* ── SUDSPECT LANDING PAGE JS ── */

// CRM API endpoint — the Sudspect CRM deployed URL
const CRM_API = 'https://sudspect.pplx.app/port/5000/api/public/lead';

// Nav scroll shadow
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 8);
}, { passive: true });

// Mobile menu
const toggle = document.getElementById('navToggle');
const menu   = document.getElementById('mobileMenu');
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.classList.toggle('open', open);
  menu.setAttribute('aria-hidden', String(!open));
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  toggle.classList.remove('open');
  menu.setAttribute('aria-hidden', 'true');
}));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// Contact form → CRM
const form      = document.getElementById('contactForm');
const btnText   = document.getElementById('btnText');
const btnLoad   = document.getElementById('btnLoading');
const btnSubmit = document.getElementById('submitBtn');
const success   = document.getElementById('formSuccess');

form.addEventListener('submit', async e => {
  e.preventDefault();

  // Validate required fields
  let valid = true;
  form.querySelectorAll('[required]').forEach(f => {
    f.classList.remove('error');
    if (!f.value.trim()) { f.classList.add('error'); valid = false; }
  });
  if (!valid) return;

  btnText.style.display = 'none';
  btnLoad.style.display = 'inline';
  btnSubmit.disabled = true;

  const payload = {
    name:          form.name.value.trim(),
    email:         form.email.value.trim(),
    phone:         form.phone.value.trim(),
    property_name: form.property.value.trim(),
    city:          form.city.value.trim(),
    units:         form.units.value.trim(),
    property_type: form.type.value,
    message:       form.message.value.trim(),
  };

  try {
    const res = await fetch(CRM_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      form.reset();
      success.style.display = 'flex';
      btnSubmit.style.display = 'none';
    } else {
      throw new Error('CRM error ' + res.status);
    }
  } catch (err) {
    // Fallback: mailto
    const sub  = encodeURIComponent('New Property Inquiry — ' + payload.property_name);
    const body = encodeURIComponent(
      `Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nProperty: ${payload.property_name}\nCity: ${payload.city}\nUnits: ${payload.units}\nType: ${payload.property_type}\n\n${payload.message}`
    );
    window.location.href = `mailto:hello@sudspect.com?subject=${sub}&body=${body}`;
  } finally {
    btnText.style.display = 'inline';
    btnLoad.style.display = 'none';
    btnSubmit.disabled = false;
  }
});

// Clear error on input
form.querySelectorAll('input, select, textarea').forEach(f => {
  f.addEventListener('input', () => f.classList.remove('error'));
});

// Scroll-in animation
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.step, .benefit, .property-card, .faq-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity 480ms ease, transform 480ms ease';
  io.observe(el);
});
