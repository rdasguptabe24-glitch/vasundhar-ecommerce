const form = document.getElementById("signupForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const user = {

        name: document.getElementById("name").value,

        email: document.getElementById("email").value,

        password: document.getElementById("password").value

    };

    try {

        const response = await fetch(`${API_BASE_URL}/signup`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(user)

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            return;

        }

        alert("Account created successfully!");

        window.location.href = "login.html";

    } catch (error) {

        console.error(error);

        alert("Something went wrong!");

    }

});