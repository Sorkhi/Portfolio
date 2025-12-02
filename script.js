const themeToggle = document.getElementById('themeToggle');
const homeElement = document.querySelector('.home');

if (themeToggle && homeElement) {
  // Check for saved theme preference or default to light mode
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    homeElement.classList.add('dark-mode');
  }

  themeToggle.addEventListener('click', () => {
    homeElement.classList.toggle('dark-mode');

    // Save theme preference
    const theme = homeElement.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
  });
}
