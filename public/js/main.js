// ========================================
// MANGAVERSE - MAIN JAVASCRIPT
// Interactive Features & UI Enhancements
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  initMobileMenu();
  initUserDropdown();
  initFilterButtons();
  initFlashMessages();
  initSearchEnhancements();
  initImageErrorHandling();
});


document.addEventListener('DOMContentLoaded', function() {
  
document.addEventListener('DOMContentLoaded', () => {
    initDotGrid();
});

function initDotGrid() {
    const canvas = document.getElementById('dot-grid-canvas');
    const container = document.getElementById('dot-grid-container');
    
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    
    // CONFIGURATION (Adjust colors here)
    const config = {
        dotSize: 4,          // Smaller dots look better in BG
        gap: 30,             // Spacing
        baseColor: '#1a1a1a',// Subtle dark grey (blends with bg)
        activeColor: '#ff003c', // Your theme RED
        proximity: 150,      // How close mouse needs to be to color
        shockRadius: 200,    // Click radius
        shockStrength: 10,   // Click power
        returnSpeed: 0.1,    // How fast dots go back
        friction: 0.90       // Physics friction
    };

    let dots = [];
    let width, height;
    
    // Mouse State
    const mouse = { x: -1000, y: -1000, lastX: -1000, lastY: -1000, vx: 0, vy: 0 };
    
    // Color Helpers
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };
    
    const baseRgb = hexToRgb(config.baseColor);
    const activeRgb = hexToRgb(config.activeColor);

    // Resize Handler
    function resize() {
        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        width = rect.width;
        height = rect.height;
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        
        ctx.scale(dpr, dpr);
        
        createDots();
    }

    // Create Grid
    function createDots() {
        dots = [];
        const cols = Math.floor((width + config.gap) / (config.dotSize + config.gap));
        const rows = Math.floor((height + config.gap) / (config.dotSize + config.gap));
        
        const startX = (width - (cols * (config.dotSize + config.gap) - config.gap)) / 2;
        const startY = (height - (rows * (config.dotSize + config.gap) - config.gap)) / 2;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                dots.push({
                    originX: startX + i * (config.dotSize + config.gap),
                    originY: startY + j * (config.dotSize + config.gap),
                    x: startX + i * (config.dotSize + config.gap),
                    y: startY + j * (config.dotSize + config.gap),
                    vx: 0,
                    vy: 0
                });
            }
        }
    }

    // Interaction Handlers
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const nowX = e.clientX - rect.left;
        const nowY = e.clientY - rect.top;

        // Calculate velocity
        mouse.vx = (nowX - mouse.lastX) * 0.5; // Sensitivity
        mouse.vy = (nowY - mouse.lastY) * 0.5;

        mouse.lastX = nowX;
        mouse.lastY = nowY;
        mouse.x = nowX;
        mouse.y = nowY;

        // Apply mouse momentum to nearby dots
        dots.forEach(dot => {
            const dx = dot.x - mouse.x;
            const dy = dot.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < config.proximity) {
                // Push dots based on mouse velocity
                const force = (config.proximity - dist) / config.proximity;
                dot.vx += mouse.vx * force * 0.5;
                dot.vy += mouse.vy * force * 0.5;
            }
        });
    });

    window.addEventListener('click', () => {
        dots.forEach(dot => {
            const dx = dot.x - mouse.x;
            const dy = dot.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < config.shockRadius) {
                const force = (config.shockRadius - dist) / config.shockRadius;
                const angle = Math.atan2(dy, dx);
                dot.vx += Math.cos(angle) * config.shockStrength * force * 10;
                dot.vy += Math.sin(angle) * config.shockStrength * force * 10;
            }
        });
    });

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        dots.forEach(dot => {
            // Physics: Return to origin
            const dx = dot.originX - dot.x;
            const dy = dot.originY - dot.y;
            
            dot.vx += dx * config.returnSpeed;
            dot.vy += dy * config.returnSpeed;
            
            // Physics: Friction
            dot.vx *= config.friction;
            dot.vy *= config.friction;
            
            // Apply Position
            dot.x += dot.vx;
            dot.y += dot.vy;

            // Draw Dot
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, config.dotSize / 2, 0, Math.PI * 2);
            
            // Color blending based on distance from mouse
            const distFromMouse = Math.hypot(dot.x - mouse.x, dot.y - mouse.y);
            
            if (distFromMouse < config.proximity) {
                const t = 1 - distFromMouse / config.proximity;
                const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
                const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
                const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
                ctx.fillStyle = `rgb(${r},${g},${b})`;
            } else {
                ctx.fillStyle = config.baseColor;
            }
            
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    // Init
    window.addEventListener('resize', resize);
    resize();
    animate();
}
  // ========================================
  // NEW: INTRO ANIMATION HANDLER
  // ========================================
const intro = document.getElementById("intro-overlay");

if (intro) {
  document.body.style.overflow = "hidden";

  setTimeout(() => {
    intro.classList.add("fade-out");
    document.body.classList.add("intro-done");
    document.body.style.overflow = "";
  }, 4500); // matches loading animation
}


  // ... existing init functions ...
  initMobileMenu();
  initUserDropdown();
  // ... rest of your JS ...
});

// ========================================
// MOBILE MENU
// ========================================
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
      
      // Change icon
      const icon = this.querySelector('i');
      if (mobileMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
    
    // Close on link click
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      });
    });
    
    // Close on outside click
    document.addEventListener('click', function(e) {
      if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenu.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }
}

// ========================================
// USER DROPDOWN
// ========================================
function initUserDropdown() {
  const userBtn = document.querySelector('.user-btn');
  const userDropdown = document.querySelector('.user-dropdown');
  
  if (userBtn && userDropdown) {
    userBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      userDropdown.classList.toggle('active');
    });
    
    // Close on outside click
    document.addEventListener('click', function(e) {
      if (!userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.remove('active');
      }
    });
  }
}

// ========================================
// FILTER BUTTONS (Trending Page)
// ========================================
function initFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Get filter value
        const filterValue = this.getAttribute('data-filter');
        
        // Filter manga cards
        filterMangaCards(filterValue);
      });
    });
  }
}

function filterMangaCards(filterValue) {
  const mangaCards = document.querySelectorAll('.manga-card, .manga-list-item');
  
  mangaCards.forEach(card => {
    if (filterValue === 'all') {
      card.style.display = '';
      return;
    }
    
    // For trending page - filter by time period
    if (card.dataset.trending) {
      const trendingPeriod = card.dataset.trending;
      if (filterValue === trendingPeriod) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    }
    
    // For genre filtering (if implemented)
    if (card.dataset.genres) {
      const genres = card.dataset.genres.split(',');
      if (genres.includes(filterValue)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    }
  });
}

// ========================================
// FILTER BY TIME (Trending Page)
// ========================================
function filterByTime(period) {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const mangaCards = document.querySelectorAll('.manga-card');
  
  // Update active button
  filterButtons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.toLowerCase().includes(period) || 
        (period === 'all' && btn.textContent.toLowerCase().includes('all'))) {
      btn.classList.add('active');
    }
  });
  
  // Show all cards (all periods show all manga in trending)
  // In a real implementation, you'd filter by actual date ranges
  mangaCards.forEach(card => {
    card.style.display = '';
  });
}

// Make filterByTime globally accessible
window.filterByTime = filterByTime;

// ========================================
// FILTER BY TIME (Trending Page)
// ========================================
function filterByTime(period) {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const mangaCards = document.querySelectorAll('.manga-card');
  
  // Update active button
  filterButtons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.toLowerCase().includes(period) || 
        (period === 'all' && btn.textContent.toLowerCase().includes('all'))) {
      btn.classList.add('active');
    }
  });
  
  // Show all cards (all periods show all manga in trending)
  // In a real implementation, you'd filter by actual date ranges
  mangaCards.forEach(card => {
    card.style.display = '';
  });
}

// Make filterByTime globally accessible
window.filterByTime = filterByTime;

// ========================================
// FLASH MESSAGES
// ========================================
function initFlashMessages() {
  const flashMessages = document.querySelectorAll('.alert');
  
  flashMessages.forEach(flash => {
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      flash.style.animation = 'slideUp 0.3s ease';
      setTimeout(() => {
        flash.remove();
      }, 300);
    }, 5000);
    
    // Add close button functionality if exists
    const closeBtn = flash.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        flash.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
          flash.remove();
        }, 300);
      });
    }
  });
}

// ========================================
// SEARCH ENHANCEMENTS
// ========================================
function initSearchEnhancements() {
  const searchForm = document.querySelector('.search-form');
  const searchInput = document.querySelector('.search-input');
  const suggestionsEl = document.querySelector('.search-suggestions');

  if (!searchForm || !searchInput || !suggestionsEl) return;

  let debounceTimer = null;
  let activeIndex = -1;
  let currentSuggestions = [];

  function renderSuggestions(list) {
    suggestionsEl.innerHTML = '';
    suggestionsEl.setAttribute('aria-hidden', list.length === 0 ? 'true' : 'false');
    currentSuggestions = list;
    activeIndex = -1;

    list.forEach((item, idx) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'suggestion-item';
      el.setAttribute('role', 'option');
      el.innerHTML = `<strong>${escapeHtml(item.title)}</strong>${item.author ? ' <span class="s-author">by ' + escapeHtml(item.author) + '</span>' : ''}`;
      el.addEventListener('click', () => {
        // Navigate to manga detail
        window.location.href = `/manga/${item.id}`;
      });
      suggestionsEl.appendChild(el);
    });
  }

  function clearSuggestions() {
    suggestionsEl.innerHTML = '';
    suggestionsEl.setAttribute('aria-hidden', 'true');
    currentSuggestions = [];
    activeIndex = -1;
  }

  function highlight(index) {
    const items = suggestionsEl.querySelectorAll('.suggestion-item');
    items.forEach((it, i) => {
      if (i === index) it.classList.add('active'); else it.classList.remove('active');
    });
  }

  // Basic HTML escape
  function escapeHtml(s) {
    return (s + '').replace(/[&<>"]+/g, function(ch) {
      return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[ch] || ch;
    });
  }

  searchInput.addEventListener('input', function() {
    const query = this.value.trim();
    const searchBtn = searchForm.querySelector('.search-btn');
    if (searchBtn) searchBtn.style.opacity = query.length > 0 ? '1' : '0.5';

    if (debounceTimer) clearTimeout(debounceTimer);
    if (query.length < 2) { clearSuggestions(); return; }

    debounceTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/search/suggestions?q=${encodeURIComponent(query)}`);
        if (!res.ok) { clearSuggestions(); return; }
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) { clearSuggestions(); return; }

        renderSuggestions(data);
      } catch (err) {
        console.error('Suggestion fetch error', err);
        clearSuggestions();
      }
    }, 180);
  });

  // Keyboard navigation
  searchInput.addEventListener('keydown', function(e) {
    const items = suggestionsEl.querySelectorAll('.suggestion-item');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
      highlight(activeIndex);
      items[activeIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      highlight(activeIndex);
      items[activeIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && currentSuggestions[activeIndex]) {
        e.preventDefault();
        window.location.href = `/manga/${currentSuggestions[activeIndex].id}`;
      }
    } else if (e.key === 'Escape') {
      clearSuggestions();
    }
  });

  // Close on outside click
  document.addEventListener('click', function(e) {
    if (!searchForm.contains(e.target)) clearSuggestions();
  });

  // Ensure suggestions hide on blur after a short delay (allow click)
  searchInput.addEventListener('blur', () => setTimeout(() => clearSuggestions(), 250));

  // Prevent empty searches
  searchForm.addEventListener('submit', function(e) {
    const query = searchInput.value.trim();
    if (query.length === 0) {
      e.preventDefault();
      searchInput.focus();
      searchInput.style.borderColor = '#ef4444';
      setTimeout(() => { searchInput.style.borderColor = ''; }, 1000);
    }
  });
}

// ========================================
// IMAGE ERROR HANDLING
// ========================================
function initImageErrorHandling() {
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    // Add loading class
    img.classList.add('loading');
    
    // Store original source and attempt count
    if (!img.dataset.originalSrc) {
      img.dataset.originalSrc = img.src;
      img.dataset.errorCount = '0';
    }
    
    img.addEventListener('load', function() {
      this.classList.remove('loading');
      this.classList.add('loaded');
    });
    
    img.addEventListener('error', function() {
      this.classList.remove('loading');
      const errorCount = parseInt(this.dataset.errorCount || '0');
      const originalSrc = this.dataset.originalSrc || this.src;
      
      // Try alternative sources with progressive fallback
      if (errorCount === 0) {
        // Attempt 1: Try with cache bypass
        this.dataset.errorCount = '1';
        this.src = originalSrc.split('?')[0] + '?t=' + Date.now();
      } else if (errorCount === 1) {
        // Attempt 2: Try forcing HTTPS
        this.dataset.errorCount = '2';
        const httpsUrl = originalSrc.replace(/^http:/, 'https:');
        if (httpsUrl !== originalSrc) {
          this.src = httpsUrl;
        } else {
          // Skip to next attempt
          this.dataset.errorCount = '3';
          tryAlternativeCDN(this, originalSrc);
        }
      } else if (errorCount === 2) {
        // Attempt 3: Try alternative CDN proxy
        this.dataset.errorCount = '3';
        tryAlternativeCDN(this, originalSrc);
      } else {
        // Final fallback: Use themed SVG placeholder
        this.classList.add('error');
        this.src = createPlaceholderImage(this.alt || 'Manga Cover');
        this.style.objectFit = 'cover';
      }
    });
  });
}

// Try alternative image CDN/proxy services
function tryAlternativeCDN(img, originalSrc) {
  // Extract the URL and try via a CORS proxy
  const cleanUrl = originalSrc.split('?')[0];
  
  // Try different MyAnimeList image servers
  if (cleanUrl.includes('myanimelist.net')) {
    // MyAnimeList has multiple CDN servers (cdn, cdn2, cdn-us, etc.)
    const alternativeUrl = cleanUrl
      .replace('cdn.myanimelist.net', 'cdn-us.myanimelist.net')
      .replace('cdn-us.myanimelist.net', 'cdn2.myanimelist.net');
    
    if (alternativeUrl !== cleanUrl) {
      img.src = alternativeUrl;
      return;
    }
  }
  
  // If all else fails, use placeholder
  img.classList.add('error');
  img.src = createPlaceholderImage(img.alt || 'Manga Cover');
  img.style.objectFit = 'cover';
}

// Create a themed SVG placeholder
function createPlaceholderImage(altText) {
  const title = altText.substring(0, 30); // Limit text length
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3c3836;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#504945;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect fill="url(#grad)" width="400" height="600"/>
      <circle cx="200" cy="250" r="60" fill="#fe8019" opacity="0.3"/>
      <text fill="#ebdbb2" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
            x="200" y="340" text-anchor="middle">${title}</text>
      <text fill="#a89984" font-family="Arial, sans-serif" font-size="16" 
            x="200" y="370" text-anchor="middle">Image Unavailable</text>
      <g transform="translate(170, 220)">
        <path d="M30 5 L50 25 L30 45 L10 25 Z" fill="none" stroke="#fe8019" stroke-width="3"/>
        <circle cx="30" cy="25" r="15" fill="none" stroke="#fabd2f" stroke-width="2"/>
      </g>
    </svg>
  `.trim();
  
  return 'data:image/svg+xml;base64,' + btoa(svg);
}

// ========================================
// SMOOTH SCROLL
// ========================================
function initSmoothScroll() {
  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  
  scrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Only for hash links
      if (href !== '#' && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

// ========================================
// DELETE CONFIRMATION
// ========================================
function confirmDelete(message = 'Are you sure you want to delete this?') {
  return confirm(message);
}

// ========================================
// FORM VALIDATION
// ========================================
function validateForm(formId) {
  const form = document.getElementById(formId);
  
  if (!form) return true;
  
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      isValid = false;
      field.style.borderColor = '#ef4444';
      
      // Reset border color after 2 seconds
      setTimeout(() => {
        field.style.borderColor = '';
      }, 2000);
    }
  });
  
  return isValid;
}

// ========================================
// TRENDING ANIMATION (Optional Enhancement)
// ========================================
function initTrendingAnimation() {
  const trendingBadges = document.querySelectorAll('.trending-badge');
  
  trendingBadges.forEach(badge => {
    // Add pulsing animation
    badge.style.animation = 'pulse 2s infinite';
  });
}

// Add keyframe animation via JavaScript
const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-20px);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;
document.head.appendChild(style);

// ========================================
// LAZY LOADING IMAGES (Optional)
// ========================================
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// ========================================
// VIEW COUNT TRACKER
// ========================================
function trackView(mangaId) {
  // Could send AJAX request to increment view count
  // For now, handled by backend on page load
  console.log(`Viewing manga: ${mangaId}`);
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 7) {
    return date.toLocaleDateString();
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

// Truncate text
function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Export functions for use in other scripts
window.MangaVerse = {
  confirmDelete,
  validateForm,
  formatDate,
  truncateText,
  trackView
};
