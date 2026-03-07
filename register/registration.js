document.addEventListener('DOMContentLoaded', function() {
    const regForm = document.querySelector('form');
    if (regForm) {
        regForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real app, you'd save the user data here
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = '../MAIN-WEBSITE/MainPage.html';
        });
    }
});
