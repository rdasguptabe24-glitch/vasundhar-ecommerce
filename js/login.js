const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    if (!response.ok) {
      alert(data.message);

      return;
    }

    // Save token and role
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);

    alert("Login Successful!");

    if (data.user.role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "shop.html";
    }
  } catch (error) {
    console.error(error);

    alert("Something went wrong!");
  }
});
