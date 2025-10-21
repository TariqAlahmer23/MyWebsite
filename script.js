// ===== Utility =====
const $ = (sel, all = false) => all ? document.querySelectorAll(sel) : document.querySelector(sel);

// ===== Buttons =====
(() => {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
      alert("Thanks for clicking!");
    });
    btn.addEventListener('mouseenter', () => btn.style.transform = 'translateY(-2px)');
    btn.addEventListener('mouseleave', () => btn.style.transform = 'translateY(0)');
  });
})();

// ===== Bubble Explosion =====
(() => {
  const container = $('.hero .bubbles') || $('.bubbles');
  if (!container) return;

  function armBubble(bubble) {
    bubble.addEventListener('click', e => {
      e.stopPropagation();
      explodeBubble(bubble);
    }, { passive: true });
  }

  function explodeBubble(bubble) {
    const rect = bubble.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2 + window.scrollX;
    const centerY = rect.top + rect.height / 2 + window.scrollY;

    const count = 14;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';

      const angle = Math.random() * 2 * Math.PI;
      const radius = 40 + Math.random() * 100;
      const dx = Math.cos(angle) * radius;
      const dy = Math.sin(angle) * radius;

      Object.assign(p.style, {
        left: `${centerX - 4}px`,
        top: `${centerY - 4}px`,
        '--dx': `${dx}px`,
        '--dy': `${dy}px`,
        width: `${6 + Math.random() * 10}px`,
        height: `${6 + Math.random() * 10}px`,
        background: Math.random() < 0.35
          ? 'radial-gradient(circle at 30% 30%, #fff, rgba(255,180,120,0.85))'
          : ''
      });

      document.body.appendChild(p);
      setTimeout(() => p.remove(), 750);
    }

    bubble.remove();
    setTimeout(spawnBubble, 1000);
  }

  function spawnBubble() {
    const b = document.createElement('div');
    b.className = 'bubble';

    const sizes = [70, 80, 90, 95, 110, 120, 130];
    const w = sizes[Math.floor(Math.random() * sizes.length)];
    Object.assign(b.style, {
      width: `${w}px`,
      height: `${w}px`,
      left: `${Math.floor(Math.random() * 85) + 5}%`,
      animationDuration: `${12 + Math.random() * 12}s`,
      bottom: '-140px'
    });

    container.appendChild(b);
    armBubble(b);
  }

  document.querySelectorAll('.bubble').forEach(armBubble);
})();

// ===== Scroll Reveal =====
(() => {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.18 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

// ===== Posts Modal + Carousel + Stars =====
(() => {
  const modal = $('#postModal');
  const modalImg = $('#modal-img');
  const modalTitle = $('#modal-title');
  const modalDate = $('#modal-date');
  const likeBtn = $('.like');
  const likeCount = $('#likeCount');
  const closeBtn = $('.modal-close');
  const overlay = $('.modal-overlay');

  let currentPost = null;
  let likes = JSON.parse(localStorage.getItem("likes") || "{}");

  function saveLikes() {
    localStorage.setItem("likes", JSON.stringify(likes));
  }

  window.addEventListener("DOMContentLoaded", () => {
    if (modal) modal.style.display = "none";
    const countEl = $('#postCount');
    if (countEl) countEl.innerText = $('.post-card', true).length;
  });

  $('.post-card', true).forEach(card => {
    card.addEventListener('click', () => {
      currentPost = card.dataset.id;
      modal.style.display = 'flex';
      modalImg.src = card.dataset.img;
      modalTitle.innerText = card.dataset.title;
      modalDate.innerText = `${card.dataset.date} • ${card.dataset.comments} Comments`;

      const bio = card.dataset.bio || "No description available.";
      document.querySelector('.modal-body').innerHTML = `
        <img src="${card.dataset.img}" alt="">
        <h2>${card.dataset.title}</h2>
        <p>${card.dataset.date}</p>
        <p>${bio}</p>
      `;

      likeCount.innerText = likes[currentPost] || 0;
    });
  });

  [closeBtn, overlay].forEach(el => el && el.addEventListener('click', () => modal.style.display = 'none'));

  if (likeBtn) {
    likeBtn.addEventListener('click', () => {
      if (!currentPost) return;
      likes[currentPost] = (likes[currentPost] || 0) + 1;
      likeCount.innerText = likes[currentPost];
      saveLikes();
    });
  }
})();

// ===== Dark Mode =====
(() => {
  const darkToggle = $('#darkModeToggle');
  const html = document.documentElement;

  if (!darkToggle) return;

  const saved = localStorage.getItem('theme');
  const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) html.classList.add('dark');

  darkToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    lucide.createIcons(); // refresh icon colors
  });
})();
