// ========================================================
//  JZ Birthday Website — Script
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
    // --- Create Stars ---
    const starsContainer = document.getElementById('starsContainer');
    const starCount = 120;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 2.5 + 0.5;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 65 + '%';
        star.style.setProperty('--dur', (Math.random() * 4 + 2) + 's');
        star.style.setProperty('--min-op', (Math.random() * 0.3 + 0.1).toFixed(2));
        star.style.setProperty('--max-op', (Math.random() * 0.5 + 0.5).toFixed(2));
        star.style.animationDelay = (Math.random() * 5) + 's';
        starsContainer.appendChild(star);
    }

    // --- Create Fireflies ---
    const firefliesContainer = document.getElementById('fireflies');
    const fireflyCount = 8;
    for (let i = 0; i < fireflyCount; i++) {
        const ff = document.createElement('div');
        ff.className = 'firefly';
        ff.style.left = (Math.random() * 80 + 10) + '%';
        ff.style.top = (Math.random() * 60 + 20) + '%';
        ff.style.setProperty('--fly-dur', (Math.random() * 8 + 6) + 's');
        ff.style.setProperty('--fly-x', (Math.random() * 80 - 40) + 'px');
        ff.style.setProperty('--fly-y', (Math.random() * 80 - 60) + 'px');
        ff.style.setProperty('--fly-x2', (Math.random() * 60 - 30) + 'px');
        ff.style.setProperty('--fly-y2', (Math.random() * 60 - 40) + 'px');
        ff.style.animationDelay = (Math.random() * 6) + 's';
        firefliesContainer.appendChild(ff);
    }

    // --- Music Toggle ---
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    let musicPlaying = false;

    musicToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (musicPlaying) {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
        } else {
            bgMusic.play().catch(() => {
                // Autoplay blocked — silently ignore
            });
            musicToggle.classList.add('playing');
        }
        musicPlaying = !musicPlaying;
    });

    // --- Envelope Click -> Open Letter ---
    const envelopeWrapper = document.getElementById('envelopeWrapper');
    const landing = document.getElementById('landing');
    const letterScene = document.getElementById('letterScene');

    envelopeWrapper.addEventListener('click', () => {
        // Start opening animation
        envelopeWrapper.classList.add('opening');

        // Try to auto-play music on first interaction
        if (!musicPlaying) {
            bgMusic.play().then(() => {
                musicPlaying = true;
                musicToggle.classList.add('playing');
            }).catch(() => {});
        }

        // After envelope animation, switch to letter
        setTimeout(() => {
            landing.classList.remove('active');
            letterScene.classList.add('active');
        }, 800);
    });

    // --- Letter Page Navigation ---
    const pages = document.querySelectorAll('.letter-page');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentPage = 0;
    const totalPages = pages.length;

    function goToPage(index) {
        if (index < 0 || index >= totalPages || index === currentPage) return;

        const goingForward = index > currentPage;

        // Exit current page
        pages[currentPage].classList.remove('active');
        pages[currentPage].classList.add(goingForward ? 'exit-left' : '');

        // After a tiny delay, remove exit class
        setTimeout(() => {
            pages[currentPage].classList.remove('exit-left');
        }, 50);

        // Activate new page
        currentPage = index;
        
        // Set initial position for entrance
        pages[currentPage].style.transform = goingForward 
            ? 'translateX(60px) scale(0.95)' 
            : 'translateX(-60px) scale(0.95)';
        
        // Force reflow
        pages[currentPage].offsetHeight;
        
        // Remove inline style to let CSS transition take over
        pages[currentPage].style.transform = '';
        pages[currentPage].classList.add('active');

        // Update dots
        dots.forEach((d, i) => {
            d.classList.toggle('active', i === currentPage);
        });

        // Update buttons
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === totalPages - 1;
    }

    prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
    nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

    // Dot click navigation
    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const target = parseInt(dot.dataset.page);
            goToPage(target);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!letterScene.classList.contains('active')) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            goToPage(currentPage + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            goToPage(currentPage - 1);
        }
    });

    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const letterContainer = document.getElementById('letterContainer');

    letterContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    letterContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                goToPage(currentPage + 1); // Swipe left = next
            } else {
                goToPage(currentPage - 1); // Swipe right = prev
            }
        }
    }, { passive: true });

    // Initialize button states
    prevBtn.disabled = true;
    nextBtn.disabled = totalPages <= 1;
});
