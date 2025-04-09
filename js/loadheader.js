
  function loadHeader(id_header) {
    fetch('header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById(id_header).innerHTML = data;
    initializeSearch();
    // Gắn event sau khi DOM navbar đã được inject
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', (e) => {
        console.log('Link clicked:', e.target.href);
      });
    });
  });

  }
  function initializeSearch() {
    
    document.dispatchEvent(new Event('headerLoaded'));
  }
  window.loadHeader = loadHeader;