const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "login.html";
}

document.getElementById("username").innerText = user.name;

document.getElementById("email").innerText = user.email;

document.getElementById("role").innerText = "Role : " + user.role;

function logout() {
  localStorage.removeItem("token");

  localStorage.removeItem("user");

  localStorage.removeItem("cart");

  window.location.href = "login.html";
}
