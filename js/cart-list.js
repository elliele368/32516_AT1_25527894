// cart-list.js

// Update the renderCartItem function for better button styling

function renderCartItem(product) {
  const isOutOfStock = product.quantity === 0;
  // Use the cartQuantity property to track items in cart
  const cartQuantity = product.cartQuantity || 1;
  const isChecked = product.selected ?? true;

  return `
    <div class="flex items-center justify-between p-3 rounded-md border border-gray-200 bg-white" style="box-shadow: 0px 4px 8px 0px #0A1A280A;">
      <div class="flex items-center space-x-3 min-w-0">
        <input type="checkbox"
               class="custom-checkbox w-5 h-5 rounded-md border border-gray-400 appearance-none checked:bg-green-600 checked:border-green-600 ${isOutOfStock ? 'cursor-not-allowed' : 'cursor-pointer'}"
               ${isOutOfStock ? 'disabled' : isChecked ? 'checked' : ''}
               onchange="toggleSelection(${product.id}, this.checked)" />

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
              <button class="w-[28px] h-[28px] ${cartQuantity <= 1 ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'} text-white text-sm flex items-center justify-center disabled:opacity-50 disabled:bg-gray-500"
                      id="decrease-btn-${product.id}" 
                      ${cartQuantity <= 1 ? 'disabled' : ''}
                      onclick="updateQuantity(${product.id}, ${cartQuantity - 1})">
                <span class="leading-none">−</span>
              </button>
              <div class="w-[32px] h-[28px] flex items-center justify-center bg-gray-50 text-sm font-medium">
                <span id="qty-display-${product.id}">${cartQuantity}</span>
              </div>
              <button class="w-[28px] h-[28px] text-white text-sm flex items-center justify-center ${isOutOfStock || cartQuantity >= product.quantity ? 'bg-gray-500 opacity-50' : 'bg-green-600 hover:bg-green-700'}"
                      id="increase-btn-${product.id}" 
                      ${isOutOfStock || cartQuantity >= product.quantity ? 'disabled' : ''}
                      onclick="updateQuantity(${product.id}, ${cartQuantity + 1})">
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
        <button class="w-9 h-9 flex items-center justify-center border border-red-200 rounded-md hover:bg-red-50 group"
                onclick="removeFromCart(${product.id})">
          <img src="images/delete.svg" alt="Delete" class="w-5 h-5" />
        </button>
      </div>
    </div>
  `;
}

// Update the toggleSelection function to properly track selected items

function toggleSelection(productId, checked) {
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

function updateQuantity(productId, newQuantity) {
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

// Update the function that handles removing items from cart

function removeFromCart(productId) {
  // Remove from productList
  productList = productList.filter(p => p.id !== productId);
  
  // Remove from productChose
  productChose = productChose.filter(item => item.id !== productId);
  
  // Update localStorage
  updateCartInLocalStorage();
  
  // Re-render the cart
  renderCartList(productList);
  
  // Update cart badge display
  updateCartBadge();
  
  // If cart is now empty, disable the place order button
  const placeOrderBtn = document.getElementById("place-order-btn");
  if (placeOrderBtn && productList.length === 0) {
    placeOrderBtn.disabled = true;
  } else if (placeOrderBtn) {
    placeOrderBtn.disabled = false;
  }
}

// Add this to updateCartInLocalStorage function

function updateCartInLocalStorage() {
  localStorage.setItem("cartProduct", JSON.stringify(productChose));
  
  // Update cart badge
  updateCartBadge();
  
  // Update order button state if the function exists
  if (typeof updateOrderButtonState === 'function') {
    updateOrderButtonState();
  }
}

// Update the renderCartList function to handle empty cart and button state

// Update the renderCartList function
function renderCartList(products) {
  const container = document.getElementById("cart-list");
  const placeOrderBtn = document.getElementById("place-order-btn");
  
  if (products && products.length > 0) {
    container.innerHTML = products.map(p => renderCartItem(p)).join('');
    
    // Calculate and display total
    updateCartTotal(products);
    
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
  
  // Update the cart badge using the centralized function
  updateCartBadge();
}

// Update the updateCartTotal function to calculate only selected items
function updateCartTotal(products) {
  // Only calculate for selected products (if they don't have selected:false)
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

// Add this function to handle address input changes
function setupAddressListeners() {
  const addressInput = document.getElementById("delivery-address");
  if (addressInput) {
    addressInput.addEventListener('input', function() {
      updateCartTotal(productList);
    });
  }
}

// Call this function when page loads
document.addEventListener('DOMContentLoaded', function() {
  updateCartBadge();
  setupAddressListeners();
});

// Initialize cart - update this part to ensure correct structure
let productChose = [];
try {
  const storedCart = localStorage.getItem("cartProduct");
  productChose = storedCart ? JSON.parse(storedCart) : [];
  
  // Ensure all items have a quantity property
  productChose = productChose.map(item => {
    if (typeof item.quantity === 'undefined') {
      item.quantity = 1;
    }
    return item;
  });
  
  // Update localStorage with corrected data
  localStorage.setItem("cartProduct", JSON.stringify(productChose));
} catch (e) {
  console.error("Error loading cart from localStorage:", e);
  productChose = [];
}

function getChosenProducts(selectedList, products) {
  // Mỗi phần tử trong selectedList, tìm sản phẩm tương ứng trong products
  return selectedList.map((selectedItem) => {
    const foundProduct = products.find((p) => p.id === selectedItem.id);
    if (!foundProduct) return null; // Nếu không tìm thấy, xử lý tuỳ ý

    // Trả về object sản phẩm kèm quantity từ selectedList
    return {
      ...foundProduct,
      cartQuantity: selectedItem.quantity, // Use cartQuantity for the amount in cart
    };
  }).filter(Boolean); // lọc bỏ null nếu có
}

let productList = [];
if (productChose && productChose.length > 0 && typeof products !== 'undefined') {
  productList = getChosenProducts(productChose, products);
  renderCartList(productList);
} else {
  document.getElementById("cart-list").innerHTML = `<div class="p-4 text-center text-gray-500">Your cart is empty</div>`;
}

// Update the deleteAllItem function
function deleteAllItem() {
  localStorage.setItem("cartProduct", "[]");
  productChose = [];
  productList = [];
  const container = document.getElementById("cart-list");
  container.innerHTML = `<div class="p-4 text-center text-gray-500">Your cart is empty</div>`;
  
  // Update total if it exists
  const totalElement = document.getElementById("cart-total");
  if (totalElement) {
    totalElement.textContent = "$0.00";
  }
  
  // Update cart badge display
  updateCartBadge();
  
  // Disable the place order button
  const placeOrderBtn = document.getElementById("place-order-btn");
  if (placeOrderBtn) {
    placeOrderBtn.disabled = true;
  }
}
