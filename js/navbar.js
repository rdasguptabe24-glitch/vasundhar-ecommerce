const user = JSON.parse(localStorage.getItem("user"));

const loginLink = document.getElementById("loginLink");

if (user && loginLink) {
  if (user.role === "admin") {
    loginLink.innerHTML = "Admin Dashboard";

    loginLink.href = "admin.html";
  } else {
    loginLink.innerHTML = "My Account";

    loginLink.href = "profile.html";
  }
}
