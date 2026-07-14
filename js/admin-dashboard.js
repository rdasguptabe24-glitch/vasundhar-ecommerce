const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "login.html";
}

async function loadDashboard() {
  try {
    const response = await fetch("https://vasundhar-ecommerce-production.up.railway.app/admin/dashboard", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await response.json();

    document.getElementById("stats").innerHTML = `
        <div class="dashboard-card">
            <h2>Total Products</h2>
            <h1>${data.products}</h1>
        </div>

        <div class="dashboard-card">
            <h2>Total Orders</h2>
            <h1>${data.orders}</h1>
        </div>

        <div class="dashboard-card">
            <h2>Pending Orders</h2>
            <h1>${data.pending}</h1>
        </div>

        <div class="dashboard-card">
            <h2>Total Revenue</h2>
            <h1>₹${data.revenue}</h1>
        </div>
    `;
  } catch (error) {
    console.error(error);
  }
}

loadDashboard();
