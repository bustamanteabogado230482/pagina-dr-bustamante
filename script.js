/* ============================================================
   Dr. Nicéforo Bustamante Paulino — script.js
============================================================ */

// ── Año actual en el footer ──────────────────────────────────
document.getElementById('currentYear').textContent = new Date().getFullYear();

// ── Navbar: scroll shadow + active link ─────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links  = document.querySelectorAll('.navbar__link');
  const sections = document.querySelectorAll('main section[id]');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    // Highlight active nav link
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    links.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ── Menú mobile ──────────────────────────────────────────────
(function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const menu   = document.getElementById('navMenu');

  function close() {
    toggle.classList.remove('open');
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Cierra al hacer clic en un enlace
  document.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', close);
  });

  // Cierra al presionar Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) close();
  });
})();

// ── Fade-in al hacer scroll (IntersectionObserver) ──────────
(function initFadeIn() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
})();

// ── Smooth scroll para anclas internas ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--navbar-h')) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Formulario de contacto → WhatsApp ────────────────────────
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const WA_NUMBER = '51962640741';

  const serviceLabels = {
    tesis:        'Asesoría de Tesis',
    clases:       'Clases Magistrales',
    conferencias: 'Conferencias',
    consultoria:  'Consultoría en Investigación Científica',
    acreditacion: 'Gestión de Calidad para Acreditación',
    libros:       'Libros Publicados',
    otro:         'Otro',
  };

  function validate() {
    let valid = true;
    ['name', 'email', 'message'].forEach(id => {
      const el = document.getElementById(id);
      el.classList.remove('error');
      if (!el.value.trim() || (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value))) {
        el.classList.add('error');
        valid = false;
      }
    });
    return valid;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) {
      form.querySelector('.error').focus();
      return;
    }

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();
    const svcTxt  = service ? serviceLabels[service] || service : 'No especificado';

    const text = [
      `Hola Dr. Bustamante, le escribo desde su sitio web.`,
      ``,
      `*Nombre:* ${name}`,
      `*Email:* ${email}`,
      `*Servicio de interés:* ${svcTxt}`,
      ``,
      `*Mensaje:*`,
      message,
    ].join('\n');

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  // Quita error al escribir
  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => input.classList.remove('error'));
  });
})();

// ── Legajo académico: pestañas ───────────────────────────────
(function initLegajoTabs() {
  const tabs = document.querySelectorAll('.legajo__tab');
  if (!tabs.length) return;
  const panels = document.querySelectorAll('.legajo__panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      tabs.forEach(t => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });

      panels.forEach(panel => {
        const isTarget = panel.id === 'panel-' + target;
        panel.classList.toggle('active', isTarget);
        panel.hidden = !isTarget;
      });
    });
  });
})();

// ── Botón WhatsApp: tooltip en móvil al tocar ────────────────
(function initWaFloat() {
  const btn = document.querySelector('.whatsapp-float');
  if (!btn) return;
  btn.addEventListener('touchstart', () => {
    btn.classList.add('touched');
    setTimeout(() => btn.classList.remove('touched'), 2500);
  }, { passive: true });
})();
