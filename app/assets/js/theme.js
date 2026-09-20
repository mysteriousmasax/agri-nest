/**
 * AGRI-NEST Theme Controller
 * Handles dark/light mode toggling and system preference detection
 */

const ThemeController = (function () {
  function init() {
    const saved = AppState.get('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');

    AppState.set('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');

    // Listen for system changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('agri-nest-theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        AppState.set('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      }
    });
  }

  function toggle() {
    AppState.toggleTheme();
  }

  return {
    init,
    toggle,
  };
})();
