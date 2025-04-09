// cart-list.js

// Initialize cart
let productChose = [];
let productList = [];

// Load cart data on page load
document.addEventListener('DOMContentLoaded', function() {
  loadCartData();
  
  setTimeout(() => { updateCartBadge(); }, 300); // Delay to ensure cart data is loaded before setting up listeners
  setupAddressListeners();
  console.log("Cart data loaded and event listeners set up.");
});
window.addEventListener('load', function() {
  console.log("Window loaded, cart data:", productChose);
}) ;
// Function to load cart data from localStorage
function loadCartData() {
  try {
    const storedCart = localStorage.getItem("cartProduct");
    productChose = storedCart ? JSON.parse(storedCart) : [];
    
    // Ensure all items have a quantity property
    productChose = productChose.map(item => {
      if (typeof item.quantity === 'undefined') {
        item.quantity = 1;
      }
      // Ensure ID is a number
      item.id = Number(item.id);
      return item;
    });
    
    // Update localStorage with corrected data
    localStorage.setItem("cartProduct", JSON.stringify(productChose));
    
    // Wait for products to be loaded if they're not available yet
    if (typeof products === 'undefined' || !products.length) {
      setTimeout(loadCartData, 100); // Retry after 100ms
      return;
    }
    
    // Convert to productList format
    if (productChose.length > 0) {
      productList = getChosenProducts(productChose, products);
      renderCartList(productList);
    } else {
      document.getElementById("cart-list").innerHTML = `<div class="p-4 text-center text-gray-500">Your cart is empty</div>`;
      updateCartTotal([]);
    }
  } catch (e) {
    console.error("Error loading cart from localStorage:", e);
    productChose = [];
    document.getElementById("cart-list").innerHTML = `<div class="p-4 text-center text-gray-500">Error loading cart data</div>`;
  }
}

// Map cart items to product details
function getChosenProducts(selectedList, products) {
  return selectedList.map((selectedItem) => {
    const foundProduct = products.find((p) => p.id === Number(selectedItem.id));
    if (!foundProduct) return null;

    return {
      ...foundProduct,
      cartQuantity: selectedItem.quantity,
      selected: selectedItem.selected
    };
  }).filter(Boolean);
}

// Render an individual cart item
function renderCartItem(product) {
  const isOutOfStock = product.quantity === 0;
  const cartQuantity = product.cartQuantity || 1;
  const isChecked = product.selected ?? true;

  return `
    <div class="flex items-center justify-between p-3 rounded-md border border-gray-200 bg-white" 
         style="box-shadow: 0px 4px 8px 0px #0A1A280A;">
      <div class="flex items-center space-x-3 min-w-0">
        <input type="checkbox"
               class="custom-checkbox w-5 h-5 rounded-md border border-gray-400 appearance-none checked:bg-green-600 checked:border-green-600 ${isOutOfStock ? 'cursor-not-allowed' : 'cursor-pointer'}"
               ${isOutOfStock ? 'disabled' : isChecked ? 'checked' : ''}
               data-product-id="${product.id}" />

        <img src="${product.image}" alt="${product.name}" class="w-16 h-16 object-cover rounded" />
        <div class="min-w-0">
          <h3 class="font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis pr-4 md:pr-0">${product.name}</h3>
          <p class="text-xs text-gray-500">
            $${product.price.toFixed(2)} • ${product.displayUnit} / QTY: ${product.quantity} •
            <span class="${isOutOfStock ? 'text-red-500' : 'text-green-600'}">
              ${isOutOfStock ? 'Out of stock' : 'In stock'}
            </span>
          </p>
          <div class="flex items-center mt-1">
            <div class="flex h-[28px] overflow-hidden rounded-md border border-gray-300 text-gray-900">
              <button type="button" class="quantity-btn decrease w-[28px] h-[28px] ${cartQuantity <= 1 ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'} text-white text-sm flex items-center justify-center disabled:opacity-50 disabled:bg-gray-500"
                      data-product-id="${product.id}" 
                      ${cartQuantity <= 1 ? 'disabled' : ''}>
                <span class="leading-none">−</span>
              </button>
              <div class="w-[32px] h-[28px] flex items-center justify-center bg-gray-50 text-sm font-medium">
                <span class="quantity-display" data-product-id="${product.id}">${cartQuantity}</span>
              </div>
              <button type="button" class="quantity-btn increase w-[28px] h-[28px] text-white text-sm flex items-center justify-center ${isOutOfStock || cartQuantity >= product.quantity ? 'bg-gray-500 opacity-50' : 'bg-green-600 hover:bg-green-700'}"
                      data-product-id="${product.id}" 
                      ${isOutOfStock || cartQuantity >= product.quantity ? 'disabled' : ''}>
                <span class="leading-none">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center space-x-3 flex-shrink-0">
        <div class="text-green-600 font-bold text-lg min-w-[60px] text-right">
          $${(product.price * cartQuantity).toFixed(2)}
        </div>
        <button type="button" class="delete-btn w-9 h-9 flex items-center justify-center border border-red-200 rounded-md hover:bg-red-50 group"
                data-product-id="${product.id}">
          <img src="images/delete.svg" alt="Delete" class="w-5 h-5" />
        </button>
      </div>
    </div>
  `;
}

// Render the entire cart list
function renderCartList(products) {
  const container = document.getElementById("cart-list");
  const placeOrderBtn = document.getElementById("place-order-btn");
  
  if (!container) return;
  
  if (products && products.length > 0) {
    container.innerHTML = products.map(p => renderCartItem(p)).join('');
    
    // Add event listeners to checkboxes
    document.querySelectorAll('.custom-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        const productId = Number(this.getAttribute('data-product-id'));
        toggleSelection(productId, this.checked);
      });
    });
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(button => {
      button.addEventListener('click', function() {
        const productId = Number(this.getAttribute('data-product-id'));
        const isIncrease = this.classList.contains('increase');
        
        // Find current quantity
        const product = productList.find(p => p.id === productId);
        if (product) {
          const currentQty = product.cartQuantity || 1;
          const newQty = isIncrease ? currentQty + 1 : currentQty - 1;
          updateQuantity(productId, newQty);
        }
      });
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', function() {
        const productId = Number(this.getAttribute('data-product-id'));
        console.log("Delete button clicked for product ID:", productId);
        removeFromCart(productId);
      });
    });
    
    // Calculate and display total
    updateCartTotal(products.filter(p => p.selected !== false));
    
    // Enable order button if there's at least one product
    if (placeOrderBtn) {
      placeOrderBtn.disabled = false;
    }
  } else {
    container.innerHTML = `<div class="p-4 text-center text-gray-500">Your cart is empty</div>`;
    
    // Set total to zero when cart is empty
    updateCartTotal([]);
    
    // Disable order button when cart is empty
    if (placeOrderBtn) {
      placeOrderBtn.disabled = true;
    }
  }
  
  // Update the cart badge
  updateCartBadge();
}

// Toggle item selection
function toggleSelection(productId, checked) {
  productId = Number(productId);
  console.log(`Toggling selection for product ${productId} to ${checked}`);
  
  // Update the selection status in the productList array
  const productIndex = productList.findIndex(p => p.id === productId);
  if (productIndex !== -1) {
    productList[productIndex].selected = checked;
  }
  
  // Also update in productChose array for localStorage persistence
  const choseIndex = productChose.findIndex(p => p.id === productId);
  if (choseIndex !== -1) {
    productChose[choseIndex].selected = checked;
  }
  
  // Update localStorage
  updateCartInLocalStorage();
  
  // Update cart total display based on selected items
  updateCartTotal(productList.filter(p => p.selected !== false));
}

// Update item quantity
function updateQuantity(productId, newQuantity) {
  productId = Number(productId);
  console.log(`Updating quantity for product ${productId} to ${newQuantity}`);
  
  const productIndex = productList.findIndex(p => p.id === productId);
  if (productIndex !== -1) {
    // Make sure quantity doesn't go below 1 or above product stock
    const stockQuantity = productList[productIndex].quantity;
    newQuantity = Math.max(1, Math.min(newQuantity, stockQuantity));
    
    // Update the cart quantity
    productList[productIndex].cartQuantity = newQuantity;
    
    // Update in cart productChose array
    const cartItemIndex = productChose.findIndex(item => item.id === productId);
    if (cartItemIndex !== -1) {
      // Update quantity in localStorage format
      productChose[cartItemIndex].quantity = newQuantity;
    }
    
    // Update localStorage
    updateCartInLocalStorage();
    
    // Re-render the cart
    renderCartList(productList);
  }
}

// Remove item from cart
function removeFromCart(productId) {
  productId = Number(productId);
  console.log(`Removing product ${productId} from cart`);
  
  // Get the product name for logging
  const product = productList.find(p => p.id === productId);
  const productName = product ? product.name : "Unknown product";
  
  console.log(`Removing ${productName} (ID: ${productId}) from cart`);
  
  // Remove from productList
  productList = productList.filter(p => p.id !== productId);
  
  // Remove from productChose
  productChose = productChose.filter(item => item.id !== productId);
  
  // Update localStorage
  updateCartInLocalStorage();
  
  // Re-render the cart
  renderCartList(productList);
}

// Update cart in localStorage and update display
function updateCartInLocalStorage() {
  localStorage.setItem("cartProduct", JSON.stringify(productChose));
  updateCartBadge();
}

// Update total price calculation
function updateCartTotal(products) {
  // Only calculate for selected products
  const selectedProducts = products.filter(p => p.selected !== false);
  
  // Calculate subtotal
  const subtotal = selectedProducts.reduce((sum, p) => {
    return sum + (p.price * (p.cartQuantity || 1));
  }, 0);
  
  // Get shipping fee
  const shippingFeeElement = document.getElementById('shipping-fee');
  const shippingFee = shippingFeeElement && shippingFeeElement.textContent === '$5.50' ? 5.5 : 0;
  
  // Calculate total
  const total = subtotal + shippingFee;
  
  // Update the total display
  const totalElement = document.getElementById('cart-total');
  if (totalElement) {
    totalElement.textContent = `$${total.toFixed(2)}`;
  }
}

// Update cart badge
function updateCartBadge() {
  try {
    const storedCart = localStorage.getItem("cartProduct");
    const cartItems = storedCart ? JSON.parse(storedCart) : [];
    
    // Calculate total quantity in cart
    const totalItems = cartItems.reduce((sum, item) => {
      return sum + (item.quantity || 1);
    }, 0);
    
    // Update cart badge
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
      cartBadge.textContent = totalItems;
    }
    
    // Update cart count
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
      cartCountElement.textContent = totalItems;
    }
    
    // Update cart header count
    const cartHeaderElement =  document.getElementById("cart-shopping-title");
    if (cartHeaderElement) {
      cartHeaderElement.textContent = `SHOPPING CART (${totalItems})`;
    }
  } catch (e) {
    console.error("Error updating cart badge:", e);
  }
}

// Set up address input listeners
function setupAddressListeners() {
  const addressInput = document.getElementById("delivery-address");
  if (addressInput) {
    addressInput.addEventListener('input', function() {
      updateCartTotal(productList);
    });
  }
}

// Delete all items from cart
function deleteAllItem() {
  console.log("Deleting all items from cart");
  
  localStorage.setItem("cartProduct", "[]");
  productChose = [];
  productList = [];
  
  const container = document.getElementById("cart-list");
  container.innerHTML = `<div class="p-4 text-center text-gray-500">Your cart is empty</div>`;
  
  // Update total if it exists
  updateCartTotal([]);
  
  // Update cart badge display
  updateCartBadge();
  
  // Disable the place order button
  const placeOrderBtn = document.getElementById("place-order-btn");
  if (placeOrderBtn) {
    placeOrderBtn.disabled = true;
  }
}
 function reloadCart(){
  const container = document.getElementById("cart-list");
  container.innerHTML ="";
  loadCartData();
 }
 document.addEventListener("Cart-change",()=>{
  reloadCart();
  console.log("cart -change !!");
 })