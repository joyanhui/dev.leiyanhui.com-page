(function () {
    const toggleBtn = document.getElementById('toggle-drawer');
    const drawer = document.getElementById('menu-drawer');
    const overlay = document.querySelector('.drawer-overlay');

    if (!toggleBtn || !drawer) return;

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

    var toggleBtns = document.querySelectorAll('.dark-mode-toggle');
    if (toggleBtns.length > 1) {
        var scheme = window.Stack && window.Stack.ColorScheme;
        toggleBtns.forEach(function (btn) {
            if (btn.id !== 'dark-mode-toggle') {
                btn.addEventListener('click', function () {
                    var primaryToggle = document.getElementById('dark-mode-toggle');
                    if (primaryToggle) primaryToggle.click();
                });
            }
        });
    }
})();
