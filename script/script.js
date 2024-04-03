document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    
    // Here you can perform further validation or send the data to the server for authentication
    // For demonstration purposes, let's assume the login is successful
    // You can replace this with your actual authentication logic
  
    // If login is successful, navigate to the homepage
    // Replace "homepage.html" with the URL of your homepage
    window.location.href = "homepage.html";
  });
  