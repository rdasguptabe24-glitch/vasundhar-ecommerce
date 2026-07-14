const token = localStorage.getItem("token");
console.log("admin.js loaded");
const form = document.getElementById("productForm");
console.log("Form found:", form);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get selected image
  console.log("Submit clicked");
  const imageFile = document.getElementById("imageFile").files[0];
  console.log(imageFile);

  // Hidden input value (used while editing)
  let imageName = document.getElementById("image").value;

  // Upload image if a new one is selected
  if (imageFile) {
    const formData = new FormData();

    formData.append("image", imageFile);

    const uploadResponse = await fetch("https://vasundhar-ecommerce-production.up.railway.app/upload", {
      method: "POST",

      body: formData,
    });

    const uploadData = await uploadResponse.json();

    imageName = uploadData.filename;
  }

  const product = {
    name: document.getElementById("name").value,

    price: Number(document.getElementById("price").value),

    image: imageName,

    category: document.getElementById("category").value,

    description: document.getElementById("description").value,

    stock: Number(document.getElementById("stock").value),
  };

  const productId = document.getElementById("productId").value;

  try {
    let response;

    if (productId) {
      // Update existing product
      response = await fetch(`https://vasundhar-ecommerce-production.up.railway.app/products/${productId}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },

        body: JSON.stringify(product),
      });

      alert("Product Updated Successfully!");
    } else {
      // Add new product
      response = await fetch("https://vasundhar-ecommerce-production.up.railway.app/products", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },

        body: JSON.stringify(product),
      });

      alert("Product Added Successfully!");
    }

    await response.json();

    form.reset();

    document.getElementById("productId").value = "";

    loadProducts();
  } catch (error) {
    console.error(error);
  }
});

const productList = document.getElementById("productList");

async function loadProducts() {
  const response = await fetch("https://vasundhar-ecommerce-production.up.railway.app/products");

  const products = await response.json();

  productList.innerHTML = "";

  products.forEach((product) => {
    productList.innerHTML += `

        <div class="product-card">

            <h3>${product.name}</h3>

            <p>₹${product.price}</p>

            <p>${product.category}</p>

            <button onclick="editProduct('${product._id}')">
    Edit
</button>

<button onclick="deleteProduct('${product._id}')">
    Delete
</button>

        </div>

        `;
  });
}

loadProducts();

async function deleteProduct(id) {
  const confirmDelete = confirm("Delete this product?");

  if (!confirmDelete) return;

  const token = localStorage.getItem("token");

  const response = await fetch(`https://vasundhar-ecommerce-production.up.railway.app/products/${id}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  console.log(data);

  loadProducts();
}

async function editProduct(id) {
  const response = await fetch(`https://vasundhar-ecommerce-production.up.railway.app/products/${id}`);

  const product = await response.json();

  document.getElementById("productId").value = product._id;
  document.getElementById("name").value = product.name;
  document.getElementById("price").value = product.price;
  document.getElementById("image").value = product.image;
  document.getElementById("category").value = product.category;
  document.getElementById("description").value = product.description;
  document.getElementById("stock").value = product.stock;
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("cart");

  window.location.href = "login.html";
}
