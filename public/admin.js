// Fetch existing products
function fetchProducts() {
    fetch('/api/products')
      .then((response) => response.json())
      .then((products) => {
        const productsAdmin = document.getElementById('products-admin');
        productsAdmin.innerHTML = ''; // Clear existing content
  
        products.forEach((product) => {
          const productElement = document.createElement('div');
          productElement.className = 'product-item';
          productElement.innerHTML = `
            <p><strong>${product.name}</strong> - $${product.price}</p>
            <img src="${product.image}" alt="${product.name}" onerror="this.src='/images/default.jpg'">
            <button onclick="removeProduct(${product.id})">Remove</button>
          `;
          productsAdmin.appendChild(productElement);
        });
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }
  
  // Add a new product
  function addProduct(event) {
    event.preventDefault();
  
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const image = document.getElementById('product-image').value || '/images/default.jpg';
  
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price, image }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message); // Show success message
        document.getElementById('product-form').reset(); // Reset the form
        fetchProducts(); // Refresh the product list
      })
      .catch((error) => {
        console.error('Error adding product:', error);
      });
  }
  
  // Remove a product
  function removeProduct(productId) {
    fetch(`/api/products/${productId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message); // Show success message
        fetchProducts(); // Refresh the product list
      })
      .catch((error) => {
        console.error('Error removing product:', error);
      });
  }
  
  // Event Listener for the Add Product Form
  document.getElementById('product-form').addEventListener('submit', addProduct);
  
  // Fetch products on page load
  fetchProducts();
  