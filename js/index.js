const productContainer = document.getElementById("featuredProducts");

fetch(`${API_BASE_URL}/products`)
  .then((response) => response.json())
  .then((products) => {
    // Show only first 4 products

    const featured = products.slice(0, 4);

    featured.forEach((product) => {
      productContainer.innerHTML += `

            <div class="product-card">

                <img src="${API_BASE_URL}/uploads/${product.image}" alt="${product.name}">

                <div class="product-info">

                    <h3>${product.name}</h3>

                    <p>${product.category}</p>

                    <div class="price">

                        ₹${product.price}

                    </div>

                    <button
                        onclick="window.location.href='product.html?id=${product._id}'">

                        View Product

                    </button>

                </div>

            </div>

            `;
    });
  });
