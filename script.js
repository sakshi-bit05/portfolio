/* ============================================================
   SAKSHI BHOITE PORTFOLIO
   All interactive behaviour & animations
   ============================================================ */

/* ==================== PRELOADER ==================== */
const hidePreloader = () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.opacity = '0';
    preloader.style.visibility = 'hidden';
    preloader.classList.add('hide');
  }
};

document.addEventListener('DOMContentLoaded', hidePreloader);
window.addEventListener('load', hidePreloader);

/* ==================== CANVAS PARTICLE BACKGROUND ==================== */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H;
const particles = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const isDark = () => document.documentElement.getAttribute('data-theme') !== 'light';

function Particle() {
  this.reset = function () {
    this.x     = Math.random() * W;
    this.y     = Math.random() * H;
    this.vx    = (Math.random() - 0.5) * 0.35;
    this.vy    = (Math.random() - 0.5) * 0.35;
    this.r     = Math.random() * 1.5 + 0.4;
    this.alpha = Math.random() * 0.5 + 0.15;
  };
  this.reset();
  this.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  };
}

for (let i = 0; i < 100; i++) particles.push(new Particle());

function drawCanvas() {
  ctx.clearRect(0, 0, W, H);
  const dark = isDark();

  /* Background gradient */
  const grad = ctx.createLinearGradient(0, 0, W, H);
  if (dark) {
    grad.addColorStop(0, 'rgba(0,5,15,0.95)');
    grad.addColorStop(1, 'rgba(5,5,20,0.98)');
  } else {
    grad.addColorStop(0, 'rgba(230,238,255,0.9)');
    grad.addColorStop(1, 'rgba(220,230,255,0.9)');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  /* Grid lines */
  ctx.strokeStyle = dark ? 'rgba(0,212,255,0.04)' : 'rgba(0,80,200,0.04)';
  ctx.lineWidth   = 0.5;
  const gs = 80;
  for (let x = 0; x <= W; x += gs) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += gs) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  /* Connection lines between nearby particles */
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const alpha = 0.12 * (1 - dist / 120);
        ctx.beginPath();
        ctx.strokeStyle = dark
          ? `rgba(0,212,255,${alpha})`
          : `rgba(0,80,200,${alpha * 0.85})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  /* Particle dots */
  particles.forEach(p => {
    p.update();
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = dark
      ? `rgba(0,212,255,${p.alpha})`
      : `rgba(0,80,200,${p.alpha * 0.7})`;
    ctx.fill();
  });

  requestAnimationFrame(drawCanvas);
}
drawCanvas();

/* ==================== CUSTOM CURSOR ==================== */
const cursorDot   = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');
let mx = 0, my = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top  = my + 'px';
  setTimeout(() => {
    cursorTrail.style.left = mx + 'px';
    cursorTrail.style.top  = my + 'px';
  }, 80);
});

/* Scale cursor on interactive elements */
const interactives = document.querySelectorAll('a, button, .tag, .tech, .project-link');
interactives.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.style.transform   = 'translate(-50%,-50%) scale(2)';
    cursorTrail.style.transform = 'translate(-50%,-50%) scale(1.5)';
    cursorTrail.style.opacity   = '0.7';
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.style.transform   = 'translate(-50%,-50%) scale(1)';
    cursorTrail.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorTrail.style.opacity   = '0.4';
  });
});

/* ==================== TYPING EFFECT ==================== */
const typedTexts = [
  'B.Tech CSE Student',
  'AI / ML Enthusiast',
  'Problem Solver'
];
let textIndex  = 0;
let charIndex  = 0;
let deleting   = false;
const typedEl  = document.getElementById('typed-text');

function typeLoop() {
  const current = typedTexts[textIndex];

  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
    setTimeout(typeLoop, 65);
  } else {
    typedEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting   = false;
      textIndex  = (textIndex + 1) % typedTexts.length;
      setTimeout(typeLoop, 400);
      return;
    }
    setTimeout(typeLoop, 35);
  }
}
setTimeout(typeLoop, 1000);

/* ==================== SCROLL REVEAL ==================== */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
  .forEach(el => revealObserver.observe(el));

/* ==================== SKILL BAR ANIMATION ==================== */
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.skill-fill');
      if (fill) fill.style.width = fill.dataset.width + '%';
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-item').forEach(el => skillObserver.observe(el));

/* ==================== THEME TOGGLE ==================== */
const themeBtn = document.getElementById('theme-toggle');

themeBtn.addEventListener('click', () => {
  const html      = document.documentElement;
  const wasDark   = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', wasDark ? 'light' : 'dark');
  themeBtn.innerHTML = wasDark
    ? '<i class="fas fa-moon"></i>'
    : '<i class="fas fa-sun"></i>';
});

/* ==================== HAMBURGER MENU ==================== */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

/* Close menu on nav link click */
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ==================== ACTIVE NAV HIGHLIGHT ==================== */
const allSections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  allSections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 110) current = sec.id;
  });
  allNavLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--neon)'
      : '';
  });
});

/* ==================== CONTACT FORM ==================== */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();
  contactForm.style.display = 'none';
  formSuccess.style.display = 'block';
});

/* ==================== CERTIFICATE VIEW ==================== */
function viewCertificate(type) {
  if (type === 'android') {
    window.open('certificate.jpeg', '_blank');
  } else if (type === 'c') {
    window.open('c.png', '_blank');
  } else if (type === 'cpp') {
    window.open('c++.png', '_blank');
  } else if (type === 'java') {
    window.open('java.png', '_blank');
  }
}

/* ==================== RESUME DOWNLOAD ==================== */
document.getElementById('resumeBtn').addEventListener('click', e => {
  e.preventDefault();
  const a    = document.createElement('a');
  a.href     = 'resume.docx';
  a.download = 'Sakshi_Bhoite_Resume.docx';
  a.click();
});

/* ==================== CERTIFICATE MODAL ==================== */
function openCertificateModal() {
  const modal = document.getElementById('certificateModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function showImage(imageSrc) {
  const mainImage = document.getElementById('mainImage');
  const thumbs = document.querySelectorAll('.gallery-thumbnails .thumb');
  
  // Update main image
  mainImage.src = imageSrc;
  
  // Update active thumbnail
  thumbs.forEach(thumb => {
    thumb.classList.remove('active');
    if (thumb.src.includes(imageSrc)) {
      thumb.classList.add('active');
    }
  });
}

function closeCertificateModal() {
  const modal = document.getElementById('certificateModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function downloadCertificate() {
  // Create a download link for the certificate
  const a = document.createElement('a');
  a.href = 'https://via.placeholder.com/600x400/020814/00d4ff?text=Internship+Certificate';
  a.download = 'Sakshi_Bhoite_Internship_Certificate.jpg';
  a.target = '_blank';
  a.click();
}

// Close modal when clicking outside
document.getElementById('certificateModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeCertificateModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeCertificateModal();
  }
});

/* ==================== STAGGERED REVEAL DELAYS ==================== */
document.querySelectorAll('.projects-grid, .skills-grid, .soft-grid, .about-cards').forEach(grid => {
  grid.querySelectorAll('.reveal').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.1) + 's';
  });
});
