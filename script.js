/* ============================================================
   ROMANTIC BIRTHDAY WEBSITE — script.js
   ============================================================ */

'use strict';

/* =====================================================
   DATA — Edit semua konten di sini
   ===================================================== */
const CONFIG = {
  // Teks typing hero (berganti otomatis)
  typingPhrases: [
    "Hari ini harinya kamu 🙂",
    "Aku cuma mau bikin kamu senyum hari ini.",
    "Website kecil ini khusus buat kamu ❤️",
    "Semoga kamu suka ya!",
  ],

  // Foto galeri
  // Ganti 'src' dengan path foto asli kamu, misal: 'assets/images/foto1.jpg'
  // Jika tidak ada foto, website akan menampilkan placeholder emoji cantik
  photos: [
    { src: 'assets/moy1.jpg', emoji: '🌸', caption: 'Si Anak Cantik' },
    { src: 'assets/moy2.jpg', emoji: '🌙', caption: 'Jutek dikittttt, tapi tetep manis :)' },
    { src: 'assets/moy3.jpg', emoji: '☕', caption: 'Hiwww cantiknyaaaa moyy' },
    { src: 'assets/moy4.jpg', emoji: '🌊', caption: 'Gemesss!!!' },
    { src: 'assets/moy5.jpg', emoji: '🌹', caption: 'Wallpaper akuuuuuu!!' },
    { src: 'assets/moy6.jpg', emoji: '✨', caption: 'Terfavorit akuuu' },
  ],

  // Timeline perjalanan cinta
  timeline: [
    {
      emoji: '🌟',
      date: 'Awal segalanya',
      title: 'Pertama Kali Bertemu',
      desc: 'Saat itu aku tidak tahu bahwa pertemuan biasa ini akan mengubah seluruh hidupku.',
    },
    {
      emoji: '💬',
      date: 'Pelan tapi pasti',
      title: 'Mulai Saling Kenal',
      desc: 'Obrolan kita yang tidak ada habisnya — dari topik serius sampai hal-hal konyol yang hanya kita yang mengerti.',
    },
    {
      emoji: '🌷',
      date: 'Momen spesial',
      title: 'Pertama Jalan Bersama',
      desc: 'Jalan pertama yang terasa seperti mimpi — aku masih ingat betapa bahagianya hatiku saat itu.',
    },
    {
      emoji: '❤️',
      date: 'Saat itu aku sadar',
      title: 'Jatuh Cinta',
      desc: 'Aku tidak bisa berhenti memikirkanmu. Dan aku sadar, inilah yang namanya jatuh cinta sungguhan.',
    },
    {
      emoji: '🤝',
      date: 'Resmi & Serius',
      title: 'Kita Bersama',
      desc: 'Dari hari itu, aku berjanji untuk selalu ada — dalam suka maupun duka, dalam sederhana maupun istimewa.',
    },
    {
      emoji: '🎂',
      date: 'Hari ini',
      title: 'Ulang Tahunmu ❤️',
      desc: 'Dan sekarang, aku di sini merayakan hari spesialmu — bersyukur setiap hari bisa mengenal seseorang seistimewa kamu.',
    },
  ],
};

/* =====================================================
   OPENING SCREEN
   ===================================================== */
const openingScreen = document.getElementById('opening-screen');
const openBtn       = document.getElementById('open-btn');
const mainSite      = document.getElementById('main-site');
const bgMusic       = document.getElementById('bg-music');
const openingCanvas = document.getElementById('opening-canvas');

// Sparkle particles on opening canvas
(function initOpeningSparkles() {
  const ctx = openingCanvas.getContext('2d');
  let particles = [];

  function resize() {
    openingCanvas.width  = window.innerWidth;
    openingCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function randomParticle() {
    return {
      x: Math.random() * openingCanvas.width,
      y: Math.random() * openingCanvas.height,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.4 + 0.1,
      drift: (Math.random() - 0.5) * 0.3,
    };
  }

  for (let i = 0; i < 120; i++) particles.push(randomParticle());

  function drawSparkles() {
    ctx.clearRect(0, 0, openingCanvas.width, openingCanvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 220, 200, ${p.alpha})`;
      ctx.fill();
      p.y -= p.speed;
      p.x += p.drift;
      p.alpha += (Math.random() - 0.5) * 0.04;
      p.alpha = Math.max(0.1, Math.min(0.9, p.alpha));
      if (p.y < -5) { Object.assign(p, randomParticle(), { y: openingCanvas.height + 5 }); }
    });
    requestAnimationFrame(drawSparkles);
  }
  drawSparkles();
})();

openBtn.addEventListener('click', () => {
  // Trigger confetti
  launchConfetti();

  // Try to play music
  bgMusic.volume = 0.45;
  bgMusic.play().catch(() => {
    // Browser might block autoplay; user can click music button
  });

  // Fade out opening
  openingScreen.style.opacity = '0';
  openingScreen.style.pointerEvents = 'none';
  setTimeout(() => {
    openingScreen.style.display = 'none';
    mainSite.classList.remove('hidden');
    // Start floating hearts
    initFloatingHearts();
    // Start typing
    startTyping();
    // Scroll reveal
    initScrollReveal();
    // Timeline reveal
    // initTimeline();
    // Gallery
    initGallery();
  }, 1200);
});

/* =====================================================
   CONFETTI (canvas-based)
   ===================================================== */
const mainCanvas = document.getElementById('main-canvas');
const mctx       = mainCanvas.getContext('2d');
let confettiPieces = [];
let confettiActive = false;

function resizeMainCanvas() {
  mainCanvas.width  = window.innerWidth;
  mainCanvas.height = window.innerHeight;
}
resizeMainCanvas();
window.addEventListener('resize', resizeMainCanvas);

const CONFETTI_COLORS = [
  '#e8a0b4', '#f8bbd0', '#c9637e', '#d4aa70',
  '#f9ece2', '#fce4ec', '#a84467', '#f0d9b0',
];
const CONFETTI_SHAPES = ['circle', 'rect', 'heart'];

function makeConfetto(x, y) {
  return {
    x: x ?? Math.random() * mainCanvas.width,
    y: y ?? -10,
    r: Math.random() * 8 + 4,
    shape: CONFETTI_SHAPES[Math.floor(Math.random() * CONFETTI_SHAPES.length)],
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    vx: (Math.random() - 0.5) * 4,
    vy: Math.random() * 3 + 2,
    rot: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 6,
    alpha: 1,
    life: 1,
  };
}

function launchConfetti() {
  confettiActive = true;
  const count = 160;
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const x = Math.random() * window.innerWidth;
      confettiPieces.push(makeConfetto(x, -10));
    }, i * 15);
  }
  setTimeout(() => { confettiActive = false; }, 4000);
  animateConfetti();
}

function drawHeart(ctx, x, y, size) {
  ctx.beginPath();
  const s = size / 2;
  ctx.moveTo(x, y + s * 0.7);
  ctx.bezierCurveTo(x, y + s * 0.35, x - s, y - s * 0.1, x - s, y - s * 0.5);
  ctx.bezierCurveTo(x - s, y - s * 1.1, x, y - s * 0.9, x, y - s * 0.5);
  ctx.bezierCurveTo(x, y - s * 0.9, x + s, y - s * 1.1, x + s, y - s * 0.5);
  ctx.bezierCurveTo(x + s, y - s * 0.1, x, y + s * 0.35, x, y + s * 0.7);
  ctx.closePath();
  ctx.fill();
}

function animateConfetti() {
  if (!confettiPieces.length && !confettiActive) return;
  mctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

  confettiPieces = confettiPieces.filter(p => p.alpha > 0.01 && p.y < mainCanvas.height + 30);

  confettiPieces.forEach(p => {
    mctx.save();
    mctx.globalAlpha = p.alpha;
    mctx.fillStyle = p.color;
    mctx.translate(p.x, p.y);
    mctx.rotate((p.rot * Math.PI) / 180);

    if (p.shape === 'circle') {
      mctx.beginPath();
      mctx.arc(0, 0, p.r, 0, Math.PI * 2);
      mctx.fill();
    } else if (p.shape === 'rect') {
      mctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
    } else {
      drawHeart(mctx, 0, 0, p.r * 1.6);
    }

    mctx.restore();

    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.05; // gravity
    p.rot += p.rotSpeed;
    if (p.y > mainCanvas.height * 0.6) p.alpha -= 0.018;
  });

  requestAnimationFrame(animateConfetti);
}

/* Heart rain (for surprise section) */
function launchHeartRain(container, count = 30) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const h = document.createElement('div');
      h.className = 'petal';
      h.textContent = ['❤️','💕','🌸','💖','💗'][Math.floor(Math.random() * 5)];
      h.style.left = Math.random() * 100 + '%';
      h.style.top  = '-30px';
      h.style.fontSize = (Math.random() * 1.2 + 0.7) + 'rem';
      h.style.animationDuration = (Math.random() * 3 + 2) + 's';
      h.style.animationDelay = '0s';
      container.appendChild(h);
      setTimeout(() => h.remove(), 6000);
    }, i * 80);
  }
}

/* =====================================================
   MUSIC CONTROL
   ===================================================== */
const musicBtn  = document.getElementById('music-btn');
const musicIcon = document.getElementById('music-icon');
let musicOn     = true;

musicBtn.addEventListener('click', () => {
  if (musicOn) {
    bgMusic.pause();
    musicIcon.textContent = '♪̶'; // muted visual
    musicBtn.style.opacity = '0.5';
  } else {
    bgMusic.play().catch(() => {});
    musicIcon.textContent = '♪';
    musicBtn.style.opacity = '1';
  }
  musicOn = !musicOn;
});

/* =====================================================
   FLOATING HEARTS (hero background)
   ===================================================== */
function initFloatingHearts() {
  const container = document.getElementById('floating-hearts-bg');
  const heartEmojis = ['❤️','🌸','💕','✿','❧','💗','🌹','♡','💖'];

  function spawnHeart() {
    const h = document.createElement('div');
    h.className = 'fheart';
    h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    h.style.left = Math.random() * 100 + '%';
    h.style.bottom = '-2rem';
    h.style.fontSize = (Math.random() * 1.5 + 0.6) + 'rem';
    h.style.animationDuration = (Math.random() * 10 + 8) + 's';
    h.style.animationDelay   = (Math.random() * 4) + 's';
    container.appendChild(h);
    setTimeout(() => h.remove(), 18000);
  }

  for (let i = 0; i < 8; i++) spawnHeart();
  setInterval(spawnHeart, 1500);
}

/* =====================================================
   TYPING ANIMATION
   ===================================================== */
function startTyping() {
  const el      = document.getElementById('typing-text');
  const phrases = CONFIG.typingPhrases;
  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;

  function tick() {
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = phrase.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === phrase.length) {
        deleting = true;
        setTimeout(tick, 2500);
        return;
      }
      setTimeout(tick, 60);
    } else {
      el.textContent = phrase.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 35);
    }
  }
  setTimeout(tick, 1200);
}

/* =====================================================
   SCROLL REVEAL
   ===================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, Number(delay));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el, i) => {
    // Stagger siblings
    const siblings = el.parentElement.querySelectorAll('.reveal');
    siblings.forEach((s, j) => {
      if (!s.dataset.delay) s.dataset.delay = j * 120;
    });
    observer.observe(el);
  });
}

/* =====================================================
   GALLERY
   ===================================================== */
function initGallery() {
  const grid     = document.getElementById('gallery-grid');
  const photos   = CONFIG.photos;
  let current    = 0;

  // Build grid
  photos.forEach((photo, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item reveal';
    item.dataset.delay = i * 100;

    if (photo.src) {
      item.innerHTML = `
        <img src="${photo.src}" alt="${photo.caption}" loading="lazy" />
        <div class="gallery-overlay">
          <div class="gallery-caption">${photo.caption}</div>
        </div>`;
    } else {
      item.innerHTML = `
        <div class="gallery-placeholder">
          <span>${photo.emoji}</span>
          <span>${photo.caption.split(' ').slice(0, 4).join(' ')}...</span>
        </div>
        <div class="gallery-overlay" style="opacity:1; background: rgba(123,45,66,0.45);">
          <div class="gallery-caption">${photo.caption}</div>
        </div>`;
    }

    item.addEventListener('click', () => openModal(i));
    grid.appendChild(item);
  });

  // Re-run reveal for newly created elements
  setTimeout(() => {
    const newReveal = grid.querySelectorAll('.reveal');
    const observer  = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add('visible'), Number(delay));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    newReveal.forEach(el => observer.observe(el));
  }, 100);

  // Modal
  const modal     = document.getElementById('photo-modal');
  const modalImg  = document.getElementById('modal-img');
  const modalCap  = document.getElementById('modal-caption');
  const modalClose= document.getElementById('modal-close');
  const modalPrev = document.getElementById('modal-prev');
  const modalNext = document.getElementById('modal-next');
  const overlay   = document.getElementById('modal-overlay');

  function openModal(idx) {
    current = idx;
    showModalPhoto(idx);
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function showModalPhoto(idx) {
    const photo = photos[idx];
    if (photo.src) {
      modalImg.src = photo.src;
      modalImg.style.display = 'block';
    } else {
      // Show placeholder in modal
      modalImg.src = generatePlaceholderDataURL(photo.emoji);
      modalImg.style.display = 'block';
    }
    modalCap.textContent = photo.caption;
  }

  function generatePlaceholderDataURL(emoji) {
    // Create a simple canvas placeholder
    const c = document.createElement('canvas');
    c.width = 600; c.height = 600;
    const cx = c.getContext('2d');
    // Gradient background
    const grd = cx.createLinearGradient(0, 0, 600, 600);
    grd.addColorStop(0, '#fce4ec');
    grd.addColorStop(1, '#f3d9c8');
    cx.fillStyle = grd;
    cx.fillRect(0, 0, 600, 600);
    // Emoji
    cx.font = '120px serif';
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillText(emoji, 300, 280);
    cx.font = '500 22px "Cormorant Garamond", serif';
    cx.fillStyle = '#a84467';
    cx.fillText('Letakkan foto kamu di sini', 300, 420);
    cx.font = '16px sans-serif';
    cx.fillStyle = '#b07a8e';
    cx.fillText('assets/images/', 300, 455);
    return c.toDataURL();
  }

  modalClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  modalPrev.addEventListener('click', () => {
    current = (current - 1 + photos.length) % photos.length;
    modalImg.style.animation = 'none';
    void modalImg.offsetWidth;
    modalImg.style.animation = '';
    showModalPhoto(current);
  });

  modalNext.addEventListener('click', () => {
    current = (current + 1) % photos.length;
    showModalPhoto(current);
  });

  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft')  modalPrev.click();
    if (e.key === 'ArrowRight') modalNext.click();
  });

  // Touch swipe
  let touchStartX = null;
  modal.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
  modal.addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      dx < 0 ? modalNext.click() : modalPrev.click();
    }
    touchStartX = null;
  });
}

/* =====================================================
   TIMELINE
   ===================================================== */
function initTimeline() {
  const container = document.getElementById('timeline-items');

  CONFIG.timeline.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'timeline-item';
    div.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <div class="timeline-emoji">${item.emoji}</div>
        <div class="timeline-date">${item.date}</div>
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
      </div>`;
    container.appendChild(div);
  });

  // Reveal one by one
  const items    = container.querySelectorAll('.timeline-item');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(item => observer.observe(item));
}

/* =====================================================
   SURPRISE BUTTON
   ===================================================== */
const surpriseBtn     = document.getElementById('surprise-btn');
const surpriseMessage = document.getElementById('surprise-message');
const surpriseGlow    = document.getElementById('surprise-glow');
let surpriseDone      = false;

surpriseBtn.addEventListener('click', () => {
  if (surpriseDone) return;
  surpriseDone = true;

  surpriseBtn.style.transform = 'scale(0.95)';
  setTimeout(() => {
    surpriseBtn.style.display = 'none';
    surpriseGlow.classList.add('active');
    surpriseMessage.classList.remove('hidden');

    // Heart rain inside surprise card
    const heartsContainer = document.getElementById('surprise-hearts-anim');
    launchHeartRain(heartsContainer, 25);

    // Also canvas confetti burst
    for (let i = 0; i < 60; i++) {
      setTimeout(() => {
        const cx = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
        confettiPieces.push(makeConfetto(cx, window.innerHeight / 2));
      }, i * 20);
    }
    animateConfetti();

    surpriseMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 300);
});

/* =====================================================
   REPLAY BUTTON
   ===================================================== */
document.getElementById('replay-btn').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => window.location.reload(), 600);
});

/* =====================================================
   CLOSING PETALS — decorative ambient
   ===================================================== */
function initClosingPetals() {
  const container = document.getElementById('closing-petals');
  const petals    = ['🌸','🌺','🌷','✿','❀','🌹'];

  function spawnPetal() {
    const p = document.createElement('div');
    p.className = 'petal';
    p.textContent = petals[Math.floor(Math.random() * petals.length)];
    p.style.left     = Math.random() * 100 + '%';
    p.style.fontSize = (Math.random() * 1 + 0.6) + 'rem';
    p.style.animationDuration = (Math.random() * 6 + 4) + 's';
    p.style.animationDelay   = '0s';
    container.appendChild(p);
    setTimeout(() => p.remove(), 12000);
  }

  // Only spawn when section is visible
  const section  = document.getElementById('closing');
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      for (let i = 0; i < 5; i++) setTimeout(spawnPetal, i * 400);
      setInterval(spawnPetal, 1800);
      observer.disconnect();
    }
  }, { threshold: 0.3 });
  observer.observe(section);
}
initClosingPetals();

/* =====================================================
   SMOOTH SCROLL for anchor links (if any added)
   ===================================================== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
