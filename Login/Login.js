document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real app, you'd validate credentials here
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = '../MAIN-WEBSITE/MainPage.html';
        });
    }
});
