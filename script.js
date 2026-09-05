/* ==========================================
   CINEMATIC NEO-BRUTALIST PORTFOLIO SCRIPT
   ADVANCED SCROLL TRIGGERS, TIMELINE HUD & REEL ENGINE
   PORTFOLIO FOR DEEPIKA V — DESIGNER • EDITOR • ANIMATOR
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------
     1. Web Audio API Sound Synthesizer (SFX Engine)
     -------------------------------------------------- */
  let sfxEnabled = true;
  const soundBtn = document.getElementById('sound-btn');
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSound(type) {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'hover') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.setValueAtTime(900, now + 0.02);
        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'click') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.setValueAtTime(640, now + 0.025);
        osc.frequency.setValueAtTime(1280, now + 0.05);
        gain.gain.setValueAtTime(0.025, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'snap') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(440, now + 0.03);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'transmit') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'chomp') {
        // Classic arcade Pac-Man waka chomp sound
        osc.type = 'triangle';
        const chompFreq = Math.random() > 0.5 ? 460 : 330;
        osc.frequency.setValueAtTime(chompFreq, now);
        osc.frequency.exponentialRampToValueAtTime(chompFreq * 0.65, now + 0.07);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.start(now);
        osc.stop(now + 0.07);
      } else if (type === 'clear') {
        // Retro arcade stage clear arpeggio
        osc.type = 'square';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        osc.frequency.setValueAtTime(1046.50, now + 0.24);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch (err) {
      // Ignore web audio restrictions if suspended
    }
  }

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      sfxEnabled = !sfxEnabled;
      const txt = soundBtn.querySelector('.btn-text');
      if (txt) txt.textContent = sfxEnabled ? 'SFX: ON' : 'SFX: OFF';
      if (sfxEnabled) playSound('click');
    });
  }

  const interactiveElements = document.querySelectorAll('a, button, .project-card, .filter-btn, .social-link, .hud-keyframe');
  interactiveElements.forEach(elem => {
    elem.addEventListener('mouseenter', () => playSound('hover'));
    elem.addEventListener('click', () => playSound('click'));
  });


  /* --------------------------------------------------
     2. Top-Left Burger Menu Drawer Controller
     -------------------------------------------------- */
  const burgerBtn = document.getElementById('burger-btn');
  const burgerDrawer = document.getElementById('burger-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');

  function toggleBurger(open) {
    if (open) {
      if (burgerBtn) burgerBtn.classList.add('active');
      if (burgerDrawer) burgerDrawer.classList.add('active');
      playSound('click');
    } else {
      if (burgerBtn) burgerBtn.classList.remove('active');
      if (burgerDrawer) burgerDrawer.classList.remove('active');
    }
  }

  if (burgerBtn && burgerDrawer) {
    burgerBtn.addEventListener('click', () => {
      const isActive = burgerDrawer.classList.contains('active');
      toggleBurger(!isActive);
    });
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', () => toggleBurger(false));
  }

  if (burgerDrawer) {
    burgerDrawer.addEventListener('click', (e) => {
      if (e.target === burgerDrawer) toggleBurger(false);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burgerDrawer && burgerDrawer.classList.contains('active')) {
      toggleBurger(false);
    }
  });

  const drawerNavItems = document.querySelectorAll('.drawer-nav-item');
  drawerNavItems.forEach(item => {
    item.addEventListener('click', () => toggleBurger(false));
  });


  /* --------------------------------------------------
     3. Hero Ultra-Large Branding Scroll Zoom & 3D Perspective
     -------------------------------------------------- */
  const brandFirst = document.getElementById('brand-first');
  const brandLast = document.getElementById('brand-last');
  const frameCounterTxt = document.getElementById('frame-counter-txt');
  const scrollProgressBar = document.getElementById('scroll-progress');

  // Floating Vertical Timeline HUD elements
  const hudNeedle = document.getElementById('hud-needle');
  const hudKeyframes = document.querySelectorAll('.hud-keyframe');

  // Horizontal Reel elements
  const filmTrackContainer = document.getElementById('film-track-container');
  const filmTrackInner = document.getElementById('film-track-inner');
  const reelFillBar = document.getElementById('reel-fill-bar');
  const reelThumb = document.getElementById('reel-thumb');
  const reelTimeCode = document.getElementById('reel-time-code');
  const reelPercentTxt = document.getElementById('reel-percent-txt');

  let activeSectionId = 'hero';

  const sectionElements = [
    { id: 'hero', elem: document.getElementById('hero-zoom-container') },
    { id: 'about', elem: document.getElementById('about') },
    { id: 'work', elem: document.getElementById('work') },
    { id: 'skills', elem: document.getElementById('skills') },
    { id: 'reviews', elem: document.getElementById('reviews') },
    { id: 'contact', elem: document.getElementById('contact') }
  ];

  function handleScrollEngine() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? scrollY / docHeight : 0;

    // A. Top Progress Bar
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent * 100}%`;
    }

    // B. Real-time Live Frame Counter Sync
    if (frameCounterTxt) {
      const frameNum = Math.floor(scrollY / 3.5) + 1;
      const formattedFrame = String(frameNum).padStart(4, '0');
      frameCounterTxt.textContent = `FRAME: ${formattedFrame}`;
    }

    // C. Hero Ultra-Large Branding Scroll Zoom & Disintegrate Portal Engine (Centered)
    const zoomBranding = document.getElementById('zoom-branding');
    if (zoomBranding && brandFirst && brandLast) {
      const spacing = Math.min(scrollY * 0.04, 16);
      const scaleZoom = 1 + scrollY * 0.0035; // Deep camera zoom into text portal
      const blurVal = Math.min(scrollY * 0.02, 14); // Disintegration blur
      const fadeOpacity = Math.max(1 - scrollY * 0.0018, 0.08);

      zoomBranding.style.transform = `scale(${scaleZoom})`;
      zoomBranding.style.filter = `blur(${blurVal}px)`;
      zoomBranding.style.opacity = fadeOpacity;
      zoomBranding.style.letterSpacing = `${spacing}px`;
    }

    // D. Floating Vertical Timeline HUD Needle Sync & Active Keyframe Switcher
    if (hudNeedle) {
      hudNeedle.style.top = `${scrollPercent * 100}%`;
    }

    // Find current active section
    let currentSec = 'hero';
    sectionElements.forEach(item => {
      if (item.elem) {
        const rect = item.elem.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.2) {
          currentSec = item.id;
        }
      }
    });

    if (currentSec !== activeSectionId) {
      activeSectionId = currentSec;
      playSound('snap');

      hudKeyframes.forEach(kf => {
        if (kf.getAttribute('data-sec') === activeSectionId) {
          kf.classList.add('active');
        } else {
          kf.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', handleScrollEngine, { passive: true });
  if (filmTrackContainer) {
    filmTrackContainer.addEventListener('scroll', handleScrollEngine, { passive: true });
  }
  handleScrollEngine();


  /* --------------------------------------------------
     5. Custom Ring Cursor Follower Canvas
     -------------------------------------------------- */
  const canvas = document.getElementById('cursor-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    let mouseX = width / 2;
    let mouseY = height / 2;
    let ringX = width / 2;
    let ringY = height / 2;
    const pixels = [];
    const colors = ['#d8ff00', '#ffffff', '#00ffff', '#d8ff00'];

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (Math.random() > 0.3) {
        pixels.push({
          x: mouseX + (Math.random() * 10 - 5),
          y: mouseY + (Math.random() * 10 - 5),
          size: Math.random() > 0.5 ? 4 : 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 + 0.4
        });
      }
    });

    function animateCursor() {
      ctx.clearRect(0, 0, width, height);

      ringX += (mouseX - ringX) * 0.25;
      ringY += (mouseY - ringY) * 0.25;

      for (let i = pixels.length - 1; i >= 0; i--) {
        const p = pixels[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.035;

        if (p.alpha <= 0) {
          pixels.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
          ctx.restore();
        }
      }

      ctx.save();
      const rx = Math.round(ringX);
      const ry = Math.round(ringY);
      ctx.strokeStyle = 'rgba(216, 255, 0, 0.65)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(rx - 7, ry - 7, 14, 14);

      ctx.fillStyle = '#d8ff00';
      ctx.fillRect(Math.round(mouseX) - 2, Math.round(mouseY) - 2, 4, 4);
      ctx.restore();

      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }


  /* --------------------------------------------------
     6. Scroll Reveal & Animated Stat Counters
     -------------------------------------------------- */
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        if (entry.target.classList.contains('stats-card')) {
          animateCounters();
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach(item => revealObserver.observe(item));

  let countersAnimated = false;
  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let count = 0;
      const speed = target / 40;

      const updateCount = () => {
        count += speed;
        if (count < target) {
          counter.innerText = Math.ceil(count);
          setTimeout(updateCount, 30);
        } else {
          counter.innerText = target;
        }
      };
      updateCount();
    });
  }


  /* --------------------------------------------------
     8. Lightbox Breakdown Modal Popup
     -------------------------------------------------- */
  const modalOverlay = document.getElementById('modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalContent = document.getElementById('modal-content');

  const projectData = {
    p1: {
      title: "Cyberpunk Commercial Cut",
      file: "CYBER_COMMERCIAL_REEL.MP4",
      desc: "High-octane commercial video edit produced for an underground streetwear brand. Features custom speed ramping, beat matching, analog glitch transitions, and kinetic typography overlays.",
      tools: ["Premiere Pro", "DaVinci Resolve", "After Effects"],
      deliverables: ["Full 4K Reel", "Shorts Version", "Instagram Story Cuts"]
    },
    p2: {
      title: "Neon 3D Title & Logo Ident",
      file: "3D_CHROME_LOGO_LOOP.AEP",
      desc: "Futuristic 3D chrome logo animation loop rendered in Blender and composited in After Effects. Designed with neon light reflections, wireframe sweeps, and spatial audio sync.",
      tools: ["Blender 3D", "After Effects", "Cinema 4D"],
      deliverables: ["Transparent MOV Alpha Loop", "4K MP4 Ident", "Lottie Web File"]
    },
    p3: {
      title: "Acid Festival Branding System",
      file: "ACID_BRAND_SYSTEM.FIG",
      desc: "Full graphic visual design identity kit for a cyber music festival. Includes poster design, custom font pairings, metallic sticker textures, and social media templates.",
      tools: ["Figma", "Photoshop", "Illustrator"],
      deliverables: ["Brand Stylebook PDF", "Vector Logo Pack", "Social Media Templates"]
    },
    p4: {
      title: "Esports Tournament Trailer",
      file: "ESPORTS_MONTAGE.MP4",
      desc: "Adrenaline-fueled video edit showcasing gaming highlights. Integrated with 3D camera tracking, custom particle explosions, speed ramps, and spatial sound design.",
      tools: ["After Effects", "Premiere Pro", "Audition"],
      deliverables: ["Main Event Trailer", "Player Intro Bumpers"]
    }
  };

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const data = projectData[id];
      if (!data) return;

      if (modalTitle) modalTitle.textContent = data.file;
      if (modalContent) {
        modalContent.innerHTML = `
          <div style="width: 100%; aspect-ratio: 16/9; background: #000; border-radius: 4px; overflow: hidden; margin-bottom: 16px;">
            <svg viewBox="0 0 700 380" style="width: 100%; height: 100%;">
              <rect width="100%" height="100%" fill="#0a0a0a"/>
              <circle cx="350" cy="190" r="90" fill="none" stroke="#d8ff00" stroke-width="2" class="svg-spin"/>
              <text x="350" y="195" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-family="'Josefin Sans'" font-weight="900" font-size="24">${data.title.toUpperCase()}</text>
            </svg>
          </div>
          <h2 style="font-family: var(--font-heading); font-size: 1.4rem; color: #fff; margin-bottom: 6px;">${data.title}</h2>
          <p style="color: var(--gray-muted); font-size: 0.9rem; margin-bottom: 16px;">${data.desc}</p>

          <div style="display: flex; gap: 20px; flex-wrap: wrap;">
            <div>
              <h4 style="font-family: var(--font-mono); color: var(--acid-yellow); font-size: 0.75rem; margin-bottom: 6px;">TOOLS UTILIZED</h4>
              <div style="display: flex; gap: 6px;">
                ${data.tools.map(t => `<span class="tag-item">${t}</span>`).join('')}
              </div>
            </div>
            <div>
              <h4 style="font-family: var(--font-mono); color: var(--white); font-size: 0.75rem; margin-bottom: 6px;">DELIVERABLES</h4>
              <div style="display: flex; gap: 6px;">
                ${data.deliverables.map(d => `<span class="tag-item">${d}</span>`).join('')}
              </div>
            </div>
          </div>
        `;
      }

      if (modalOverlay) modalOverlay.classList.add('active');
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      if (modalOverlay) modalOverlay.classList.remove('active');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
  }


  /* --------------------------------------------------
     10. Contact Form Terminal Simulation
     -------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const terminalReply = document.getElementById('terminal-reply');

  if (contactForm && terminalReply) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playSound('transmit');

      contactForm.style.opacity = '0.4';
      contactForm.style.pointerEvents = 'none';

      terminalReply.style.display = 'flex';
      terminalReply.scrollIntoView({ behavior: 'smooth' });

      setTimeout(() => {
        contactForm.reset();
        contactForm.style.opacity = '1';
        contactForm.style.pointerEvents = 'auto';
      }, 3500);
    });
  }


  /* --------------------------------------------------
     11. Live Clock Footer
     -------------------------------------------------- */
  const liveClock = document.getElementById('live-clock');
  function updateClock() {
    if (!liveClock) return;
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    liveClock.textContent = `${hrs}:${mins}:${secs}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  /* --------------------------------------------------
     12. Continuous Auto-Moving Reel Scrubber Ticker
     -------------------------------------------------- */
  let reelAutoPercent = 0;
  setInterval(() => {
    reelAutoPercent = (reelAutoPercent + 0.15) % 100;
    if (reelFillBar) reelFillBar.style.width = `${reelAutoPercent}%`;
    if (reelThumb) reelThumb.style.left = `${reelAutoPercent}%`;
    if (reelPercentTxt) reelPercentTxt.textContent = `${Math.round(reelAutoPercent)}% REEL COMPLETE`;

    if (reelTimeCode) {
      const totalFrames = Math.floor((reelAutoPercent / 100) * 240);
      const secs = Math.floor(totalFrames / 24);
      const frames = totalFrames % 24;
      const formattedSecs = String(secs).padStart(2, '0');
      const formattedFrames = String(frames).padStart(2, '0');
      reelTimeCode.textContent = `00:01:${formattedSecs}:${formattedFrames}`;
    }
  }, 100);

  /* --------------------------------------------------
     13. Motion Atelier Avatar & Audio Telemetry Console
     -------------------------------------------------- */
  const avatarStage = document.getElementById('avatar-stage');
  const avatarTiltCard = document.getElementById('avatar-tilt-card');
  const liveTcDisplay = document.getElementById('live-timecode-display');
  const timelineTracks = document.querySelectorAll('.timeline-track-item');

  // 3D Parallax Tilt & Light Sheen Tracking
  if (avatarStage && avatarTiltCard) {
    avatarStage.addEventListener('mousemove', (e) => {
      const rect = avatarStage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = x / rect.width;
      const normY = y / rect.height;

      const tiltX = (normY - 0.5) * -16;
      const tiltY = (normX - 0.5) * 16;

      avatarTiltCard.style.transform = `perspective(900px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      avatarTiltCard.style.setProperty('--mouse-x', `${(normX * 100).toFixed(1)}%`);
      avatarTiltCard.style.setProperty('--mouse-y', `${(normY * 100).toFixed(1)}%`);
    });

    avatarStage.addEventListener('mouseleave', () => {
      avatarTiltCard.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      avatarTiltCard.style.setProperty('--mouse-x', '50%');
      avatarTiltCard.style.setProperty('--mouse-y', '50%');
    });

    avatarStage.addEventListener('mouseenter', () => {
      playSound('hover');
    });
  }

  // Live Frame / Timecode ticker for Telemetry Console
  if (liveTcDisplay) {
    let tcSec = 24;
    let tcFrames = 18;
    setInterval(() => {
      tcFrames++;
      if (tcFrames >= 60) {
        tcFrames = 0;
        tcSec = (tcSec + 1) % 60;
      }
      const s = String(tcSec).padStart(2, '0');
      const f = String(tcFrames).padStart(2, '0');
      liveTcDisplay.textContent = `TC 00:01:${s}:${f}`;
    }, 1000 / 30);
  }

  // Interactive Timeline Tracks Hover Sound
  timelineTracks.forEach(track => {
    track.addEventListener('mouseenter', () => {
      playSound('hover');
    });
  });

});


