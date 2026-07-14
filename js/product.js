const params = new URLSearchParams(window.location.search);
const id = params.get("id");

console.log("ID:", id);

fetch(`https://vasundhar-ecommerce-production.up.railway.app/products/${id}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Product not found");
    }
    return response.json();
  })
  .then((product) => {
    console.log(product);

    const container = document.getElementById("productDetails");

    container.innerHTML += `

<div class="product-card">

    <span class="sale-badge">SALE</span>

    <button class="wishlist-btn">

        <i class="fa-regular fa-heart"></i>

    </button>

    <div class="product-image">

        <img src="https://vasundhar-ecommerce-production.up.railway.app/uploads/${product.image}" alt="${product.name}">

        <div class="quick-view">

            Quick View

        </div>

    </div>

    <div class="product-info">

        <p class="category">${product.category}</p>

        <h3>${product.name}</h3>

        <div class="rating">

            ★★★★★

        </div>

        <div class="price">

            ₹${product.price}

        </div>

        <button class="add-cart"

            data-id="${product._id}">

            Add to Cart

        </button>

    </div>

</div>

`;
  })
  .catch((error) => {
    console.error(error);
  });
