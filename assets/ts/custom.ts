(function () {
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
            if (drawer.classList.contains('show')) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });

        if (overlay) {
            overlay.addEventListener('click', closeDrawer);
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && drawer.classList.contains('show')) {
                closeDrawer();
            }
        });
    }

    // Dark mode toggle sync
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

    // Reading progress bar
    var progressBar = document.getElementById('reading-progress-bar');
    if (progressBar) {
        function updateProgress() {
            var scrollTop = window.scrollY;
            var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            var winHeight = window.innerHeight;
            var pageWrapper = document.querySelector('.page-wrapper');

            if (pageWrapper) {
                var wrapperTop = pageWrapper.offsetTop;
                var wrapperHeight = pageWrapper.scrollHeight;
                var scrollable = wrapperHeight - winHeight - wrapperTop;

                if (scrollable <= 0) {
                    progressBar.style.width = '0%';
                    return;
                }

                var progress = Math.min((scrollTop - wrapperTop) / scrollable, 1);
                progressBar.style.width = (progress * 100) + '%';

                if (scrollTop <= wrapperTop) {
                    progressBar.style.opacity = '0';
                } else {
                    progressBar.style.opacity = '1';
                }
            }
        }

        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress, { passive: true });
        updateProgress();
    }

    // Entrance animation for article cards
    if ('IntersectionObserver' in window) {
        var cards = document.querySelectorAll('.article-list article, .article-list--compact article');
        if (cards.length > 0) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

            cards.forEach(function (card) {
                card.classList.add('animate-ready');
                observer.observe(card);
            });
        }
    }

    // Smooth anchor scrolling offset for fixed header
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                var headerHeight = 60;
                var targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });
})();
