document.addEventListener('DOMContentLoaded', function () {
    const toggleSwitch = document.getElementById('darkModeToggle');
    const currentTheme = localStorage.getItem('theme');
  
    if (currentTheme) {
      document.body.classList.add(currentTheme);
      if (currentTheme === 'dark-mode') {
        toggleSwitch.checked = true;
      }
    }
  
    toggleSwitch.addEventListener('change', function () {
      if (this.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.removeItem('theme');
      }
    });
  });

