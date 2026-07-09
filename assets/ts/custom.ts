(function () {
    // ========== Drawer ==========
    var toggleBtn = document.getElementById('toggle-drawer');
    var drawer = document.getElementById('menu-drawer');
    var overlay = document.querySelector('.drawer-overlay');

    if (toggleBtn && drawer) {
        function openDrawer() {
            drawer.classList.add('show');
            document.body.classList.add('drawer-open');
            toggleBtn.classList.add('is-active');
        }

        function closeDrawer() {
            drawer.classList.remove('show');
            document.body.classList.remove('drawer-open');
            toggleBtn.classList.remove('is-active');
        }

        toggleBtn.addEventListener('click', function () {
            if (drawer.classList.contains('show')) { closeDrawer(); }
            else { openDrawer(); }
        });

        if (overlay) overlay.addEventListener('click', closeDrawer);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && drawer.classList.contains('show')) closeDrawer();
        });
    }

    // ========== Dark Mode Sync ==========
    var toggleBtns = document.querySelectorAll('.dark-mode-toggle');
    if (toggleBtns.length > 1) {
        toggleBtns.forEach(function (btn) {
            if (btn.id !== 'dark-mode-toggle') {
                btn.addEventListener('click', function () {
                    var primaryToggle = document.getElementById('dark-mode-toggle');
                    if (primaryToggle) primaryToggle.click();
                });
            }
        });
    }

    // ========== Reading Progress ==========
    var progressBar = document.getElementById('reading-progress-bar');
    if (progressBar) {
        function updateProgress() {
            var scrollTop = window.scrollY;
            var winHeight = window.innerHeight;
            var wrapper = document.querySelector('.page-wrapper');
            if (!wrapper) return;
            var wrapperTop = wrapper.offsetTop;
            var scrollable = wrapper.scrollHeight - winHeight - wrapperTop;
            if (scrollable <= 0) { progressBar.style.width = '0%'; return; }
            var p = Math.min((scrollTop - wrapperTop) / scrollable, 1);
            progressBar.style.width = (p * 100) + '%';
            progressBar.style.opacity = scrollTop <= wrapperTop ? '0' : '1';
        }
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress, { passive: true });
        updateProgress();
    }

    // ========== Entrance Animations ==========
    if ('IntersectionObserver' in window) {
        var cards = document.querySelectorAll('.article-list article, .article-list--compact article');
        if (cards.length > 0) {
            var obs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
            cards.forEach(function (c) { c.classList.add('animate-ready'); obs.observe(c); });
        }
    }

    // ========== Smooth Anchors ==========
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 60, behavior: 'smooth' });
            }
        });
    });

    // ========== Particle Background ==========
    var canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 70;
    var isDark = document.documentElement.dataset.scheme === 'dark';

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function getColors() {
        isDark = document.documentElement.dataset.scheme === 'dark';
        return {
            p1: isDark ? '96, 165, 250' : '37, 99, 235',
            p2: isDark ? '167, 139, 250' : '124, 58, 237',
            p3: isDark ? '129, 140, 248' : '59, 130, 246',
            bg: isDark ? 'rgba(0,0,0,0)' : 'rgba(247,248,250,0)'
        };
    }

    function Particle() {
        var colors = getColors();
        var palette = [colors.p1, colors.p2, colors.p3];
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.8;
        this.speedY = -(Math.random() * 0.3 + 0.1);
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = palette[Math.floor(Math.random() * palette.length)];
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
    }

    function initParticles() {
        particles = [];
        for (var i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();

    // Observe color scheme changes
    var schemeObserver = new MutationObserver(function () {
        isDark = document.documentElement.dataset.scheme === 'dark';
    });
    schemeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-scheme'] });

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var colors = getColors();

        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.pulse += p.pulseSpeed;
            var currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

            p.y += p.speedY;
            p.x += p.speedX;

            if (p.y + p.size < 0) {
                p.y = canvas.height + p.size;
                p.x = Math.random() * canvas.width;
            }
            if (p.x < -p.size) p.x = canvas.width + p.size;
            if (p.x > canvas.width + p.size) p.x = -p.size;

            var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
            gradient.addColorStop(0, 'rgba(' + p.color + ', ' + currentOpacity + ')');
            gradient.addColorStop(0.3, 'rgba(' + p.color + ', ' + (currentOpacity * 0.4) + ')');
            gradient.addColorStop(1, 'rgba(' + p.color + ', 0)');

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + p.color + ', ' + (currentOpacity * 1.2) + ')';
            ctx.fill();
        }

        // Connecting lines between close particles
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    var lineOpacity = (1 - dist / 120) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(' + colors.p1 + ', ' + lineOpacity + ')';
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(drawParticles);
    }

    drawParticles();
})();
