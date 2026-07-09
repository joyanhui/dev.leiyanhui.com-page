(function () {
    // ========== 抽屉菜单 ==========
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

    // ========== 深色模式同步 ==========
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

    // ========== 阅读进度 ==========
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

    // ========== 入场动画 ==========
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

    // ========== 平滑锚点 ==========
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 60, behavior: 'smooth' });
            }
        });
    });

    // ========== 粒子背景 ==========
    var canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 35;
    var MAX_PARTICLES = 300;
    var isDark = document.documentElement.dataset.scheme === 'dark';
    var mx = -999, my = -999;
    var lastSpawn = 0;
    var mouseInside = false;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    document.addEventListener('mousemove', function (e) {
        mx = e.clientX;
        my = e.clientY;
        mouseInside = true;
        spawnMouseParticles();
    });

    document.addEventListener('mouseleave', function () {
        mouseInside = false;
        mx = -999;
        my = -999;
    });

    // 触摸支持
    document.addEventListener('touchmove', function (e) {
        var touch = e.touches[0];
        if (touch) {
            mx = touch.clientX;
            my = touch.clientY;
            mouseInside = true;
            spawnMouseParticles();
        }
    });

    document.addEventListener('touchend', function () {
        mouseInside = false;
        mx = -999;
        my = -999;
    });

    function spawnMouseParticles() {
        var now = Date.now();
        if (now - lastSpawn < 40) return;
        lastSpawn = now;

        // 移除最旧的粒子以容纳新粒子
        var colors = getColors();
        var palette = [colors.p1, colors.p2, colors.p3];
        for (var s = 0; s < 2; s++) {
            if (particles.length >= MAX_PARTICLES) {
                particles.splice(0, 1);
            }
            var p = new Particle();
            p.x = mx + (Math.random() - 0.5) * 40;
            p.y = my + (Math.random() - 0.5) * 40;
            p.size = Math.random() * 3 + 1.2;
            p.speedY = -(Math.random() * 0.4 + 0.12);
            p.speedX = (Math.random() - 0.5) * 0.3;
            p.opacity = Math.random() * 0.4 + 0.35;
            p.color = palette[Math.floor(Math.random() * palette.length)];
            p.pulse = Math.random() * Math.PI * 2;
            p.pulseSpeed = Math.random() * 0.03 + 0.01;
            particles.push(p);
        }
    }

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

    // 监听配色方案变化
    var schemeObserver = new MutationObserver(function () {
        isDark = document.documentElement.dataset.scheme === 'dark';
    });
    schemeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-scheme'] });

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var colors = getColors();

        // 修剪多余粒子
        if (particles.length > MAX_PARTICLES) {
            particles.splice(0, particles.length - MAX_PARTICLES);
        }

        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.pulse += p.pulseSpeed;
            var currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

            // 鼠标排斥
            if (mouseInside) {
                var dx = p.x - mx;
                var dy = p.y - my;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150 && dist > 0) {
                    var force = (1 - dist / 150) * 0.8;
                    p.x += (dx / dist) * force;
                    p.y += (dy / dist) * force;
                }
            }

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

        // 连接相邻粒子之间的线
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
