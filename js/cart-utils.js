/**
 * Utility functions for cart management across pages
 */

function getCartItemCount() {
  try {
    const storedCart = localStorage.getItem("cartProduct");
    if (!storedCart) return 0;
    
    const cartItems = JSON.parse(storedCart);
    return cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  } catch (e) {
    console.error("Error calculating cart count:", e);
    return 0;
  }
}

// Update cart badge display function to cover all badge elements
function updateCartBadge() {
  try {
    const storedCart = localStorage.getItem("cartProduct");
    const cartItems = storedCart ? JSON.parse(storedCart) : [];
    
    // Calculate total quantity in cart
    const totalItems = cartItems.reduce((sum, item) => {
      return sum + (item.quantity || 1);
    }, 0);
    
    // Update all cart badges on the page
    const cartBadges = document.querySelectorAll("#cart-badge, #cart-count");
    cartBadges.forEach(badge => {
      if (badge) {
        badge.textContent = totalItems;
      }
    });
    
    // Update header text if on cart page
    const cartHeaderElement = document.querySelector("h2.text-xl.font-semibold.text-green-800");
    if (cartHeaderElement) {
      cartHeaderElement.textContent = `SHOPPING CART (${totalItems})`;
    }
    
    return totalItems;
  } catch (e) {
    console.error("Error updating cart badge:", e);
    return 0;
  }
}

// Initialize cart badge when document loads
document.addEventListener('DOMContentLoaded', function() {
  // Update cart badge on page load
  updateCartBadge();
  
  // Initialize place order button state (if on cart page)
  const placeOrderBtn = document.getElementById("place-order-btn");
  if (placeOrderBtn) {
    try {
      const storedCart = localStorage.getItem("cartProduct");
      const cartItems = storedCart ? JSON.parse(storedCart) : [];
      
      // Enable button if cart has items
      if (cartItems.length > 0) {
        placeOrderBtn.disabled = false;
      } else {
        placeOrderBtn.disabled = true;
      }
    } catch (e) {
      console.error("Error checking cart status:", e);
    }
  }
  
  // Add this part to initialize payment method buttons if they exist
  const cashBtn = document.getElementById('cash-payment');
  const digitalBtn = document.getElementById('digital-payment');
  
  if (cashBtn && digitalBtn) {
    // Make sure cash is set as default
    selectPaymentMethod('cash');
    
    // Add click event listeners
    cashBtn.addEventListener('click', () => selectPaymentMethod('cash'));
    digitalBtn.addEventListener('click', () => selectPaymentMethod('digital'));
  }
});

/**
 * Toggle between payment methods
 * @param {string} method - 'cash' or 'digital'
 */
function selectPaymentMethod(method) {
  // Get the button elements
  const cashBtn = document.getElementById('cash-payment');
  const digitalBtn = document.getElementById('digital-payment');
  const hiddenInput = document.getElementById('selected-payment-method');
  
  if (!cashBtn || !digitalBtn || !hiddenInput) return;
  
  if (method === 'cash') {
    // Set cash as selected
    cashBtn.classList.add('bg-green-50', 'text-green-800');
    cashBtn.classList.remove('bg-gray-50', 'text-gray-700');
    
    // Set digital as not selected
    digitalBtn.classList.remove('bg-green-50', 'text-green-800');
    digitalBtn.classList.add('bg-gray-50', 'text-gray-700');
  } else {
    // Set digital as selected
    digitalBtn.classList.add('bg-green-50', 'text-green-800');
    digitalBtn.classList.remove('bg-gray-50', 'text-gray-700');
    
    // Set cash as not selected
    cashBtn.classList.remove('bg-green-50', 'text-green-800');
    cashBtn.classList.add('bg-gray-50', 'text-gray-700');
  }
  
  // Update hidden input with selected method
  hiddenInput.value = method;
}