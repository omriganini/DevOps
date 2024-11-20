// Fetch products from the backend
fetch('/api/products')
  .then((response) => response.json())
  .then((products) => {
    const productContainer = document.getElementById('products');
    products.forEach((product) => {
      const productElement = document.createElement('div');
      productElement.className = 'product';
      productElement.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Price: $${product.price}</p>
        <button onclick="addToCart(1, ${product.id}, 1)">Add to Cart</button>
      `;
      productContainer.appendChild(productElement);
    });
  })
  .catch((error) => {
    console.error('Error fetching products:', error);
  });


const customerId = 1; // Replace with dynamic customer ID if available

// Fetch and display cart items
function fetchCart() {
  fetch(`/api/cart/${customerId}`)
    .then((response) => response.json())
    .then((cartItems) => {
      const cartContainer = document.getElementById('cart-items');
      cartContainer.innerHTML = ''; // Clear existing cart items

      if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
      }

      cartItems.forEach((item) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
          <p>${item.name} - $${item.price} x ${item.quantity}</p>
          <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartContainer.appendChild(cartItem);
      });
    })
    .catch((error) => {
      console.error('Error fetching cart:', error);
    });
}

// Remove an item from the cart
function removeFromCart(cartId) {
  fetch(`/api/cart/${cartId}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message); // Show success message
      fetchCart(); // Refresh the cart after removing the item
    })
    .catch((error) => {
      console.error('Error removing item from cart:', error);
    });
}

// Add item to cart and update dynamically
function addToCart(customerId, productId, quantity) {
  fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId, productId, quantity }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        alert(data.message); // Show a success message
        fetchCart(); // Dynamically refresh the cart after adding the item
      } else {
        alert('Failed to add item to cart'); // Show an error message if needed
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('An error occurred while adding to cart');
    });
}

// Fetch the cart when the page loads
fetchCart();
