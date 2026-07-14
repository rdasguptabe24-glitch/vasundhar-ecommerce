const urlParams = new URLSearchParams(window.location.search);

const selectedCategory = urlParams.get("category");

let allProducts = [];

const productGrid = document.getElementById("productContainer");

// Display products on the page
function displayProducts(products) {
  productGrid.innerHTML = "";

  products.forEach((product) => {
    const productCard = `
<div class="product-card">

    <span class="sale-badge">NEW</span>

    <div class="product-image">

        <img
            src="https://vasundhar-ecommerce-production.up.railway.app/uploads/${product.image}"
            alt="${product.name}">

    </div>

    <div class="product-info">

        <p class="product-category">
            ${product.category}
        </p>

        <h3>
            <a href="product.html?id=${product._id}">
                ${product.name}
            </a>
        </h3>

        <div class="product-rating">
            ⭐⭐⭐⭐⭐
            <span>(4.9)</span>
        </div>

        <div class="price-row">

            <span class="new-price">
                ₹${product.price}
            </span>

        </div>

        <button
    class="add-cart"
    data-id="${product._id}"
    data-name="${product.name}"
    data-price="${product.price}"
    data-image="${product.image}">

    Add to Cart

</button>

    </div>

</div>
`;

    productGrid.innerHTML += productCard;
  });

  attachCartEvents();
}

// Add event listeners to Add to Cart buttons
function attachCartEvents() {
  const buttons = document.querySelectorAll(".add-cart");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      const product = {
        id: button.dataset.id,
        name: button.dataset.name,
        price: Number(button.dataset.price),
        image: button.dataset.image,
        quantity: 1,
      };

      const existing = cart.find((item) => item.id === product.id);

      if (existing) {
        existing.quantity++;
      } else {
        cart.push(product);
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      const cartCount = document.getElementById("cart-count");

      if (cartCount) {
        const totalQuantity = cart.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );

        cartCount.innerText = totalQuantity;
      }

      alert("Product added to cart!");
    });
  });
}

// Fetch products from backend
fetch("https://vasundhar-ecommerce-production.up.railway.app/products")
  .then((response) => response.json())
  .then((products) => {
    allProducts = products;

    // If opened from a category card
    if (selectedCategory) {
      categoryFilter.value = selectedCategory;
    }

    // Apply filters
    filterProducts();
  })
  .catch((error) => {
    console.error("Error loading products:", error);
  });

// Search functionality
const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", () => {
    filterProducts();
  });
}

const categoryFilter = document.getElementById("categoryFilter");

if (categoryFilter) {
  categoryFilter.addEventListener("change", () => {
    filterProducts();
  });
}

function filterProducts() {
  const searchText = searchInput.value.toLowerCase();

  const selectedCategory = categoryFilter.value;

  let filtered = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchText),
  );

  if (selectedCategory !== "All") {
    filtered = filtered.filter(
      (product) => product.category === selectedCategory,
    );
  }

  displayProducts(filtered);
}
