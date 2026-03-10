document.addEventListener("DOMContentLoaded", function () {
  const regForm = document.querySelector("form");
  if (regForm) {
    regForm.addEventListener("submit", function (e) {
      e.preventDefault();
      // In a real app, you'd save the user data here
      // We'll store the username to show on the main page later
      const username = document.getElementById("username").value;
      localStorage.setItem("registeredUser", username);

      alert("Registration Successful! Please login.");
      window.location.href = "../LOGIN-CODE/Login.html";
    });
  }
});
