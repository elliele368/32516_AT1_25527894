/**
 * Form validation for delivery details with tooltip-style error messages
 * Only shows errors after user interaction with fields
 * Button is disabled until all fields are properly filled AND cart has items
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get form elements
  const nameInput = document.querySelector('input[placeholder="Enter your name here"]');
  const phoneInput = document.querySelector('input[type="tel"]');
  const emailInput = document.querySelector('input[type="email"]');
  const addressInput = document.getElementById('delivery-address');
  const stateSelect = document.getElementById('delivery-state');
  const placeOrderBtn = document.getElementById('place-order-btn');
  
  // Disable button by default
  placeOrderBtn.disabled = true;
  
  // Track touched fields
  const touchedFields = new Set();
  
  // Function to validate email format
  function isValidEmail(email) {
    if (!email) return true; // Empty is considered valid (we're only checking format)
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }
  
  // Function to validate Australian phone number
  function isValidPhone(phone) {
    if (!phone) return true; // Empty is considered valid (we're only checking format)
    // Basic validation for Australian numbers (mobile and landline)
    const regex = /^(\+614|\+6104|04|\(04\)|\(02\)|\(03\)|\(07\)|\(08\))[0-9]{8}$/;
    return regex.test(phone.replace(/\s+/g, ''));
  }
  
  // Function to check if cart is empty
  function isCartEmpty() {
    const cartItems = document.querySelectorAll('#cart-list > div');
    return !cartItems.length || cartItems[0].textContent.includes('Your cart is empty');
  }
  
  // Check if all form fields are valid
  function areAllFieldsFilled() {
    // Check if all fields have valid values
    const nameValid = nameInput.value.trim() !== '';
    const phoneValid = phoneInput.value.trim() !== '' && isValidPhone(phoneInput.value);
    const emailValid = emailInput.value.trim() !== '' && isValidEmail(emailInput.value);
    const addressValid = addressInput.value.trim() !== '';
    const stateValid = stateSelect.value !== '';
    
    return nameValid && phoneValid && emailValid && addressValid && stateValid;
  }
  
  // Function to update button status
  function updateOrderButtonState() {
    const cartHasItems = !isCartEmpty();
    const formIsValid = areAllFieldsFilled();
    
    // Button is enabled only when both conditions are true
    placeOrderBtn.disabled = !(cartHasItems && formIsValid);
    
    // Update hover title for better UX
    if (placeOrderBtn.disabled) {
      if (!cartHasItems) {
        placeOrderBtn.setAttribute('title', 'Cart is empty');
      } else {
        placeOrderBtn.setAttribute('title', 'Please complete all required fields correctly');
      }
    } else {
      placeOrderBtn.removeAttribute('title');
    }
  }
  
  // Show tooltip error message for an input field
  function showError(inputElement, message) {
    // Remove existing tooltip if any
    const existingTooltip = inputElement.parentNode.querySelector('.tooltip');
    if (existingTooltip) {
      existingTooltip.remove();
    }
    
    // Add red border to input
    inputElement.classList.add('border-red-500');
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = message;
    
    // Add tooltip to parent container
    inputElement.parentNode.appendChild(tooltip);
    
    // Position the tooltip
    positionTooltip(tooltip, inputElement);
    
    // Initially show tooltip
    tooltip.style.opacity = '1';
    
    // Hide tooltip after 3 seconds
    setTimeout(() => {
      if (tooltip.parentNode) { // Check if tooltip still exists in DOM
        tooltip.style.opacity = '0';
      }
    }, 3000);
  }
  
  // Position tooltip relative to input
  function positionTooltip(tooltip, inputElement) {
    // Get input position
    const inputRect = inputElement.getBoundingClientRect();
    
    // Set tooltip position
    tooltip.style.left = `${(inputRect.width / 2)}px`;
    
    // Adjust if tooltip goes off-screen
    setTimeout(() => {
      if (!tooltip.parentNode) return; // Check if tooltip still exists
      
      const tooltipRect = tooltip.getBoundingClientRect();
      
      if (tooltipRect.right > window.innerWidth) {
        const overflow = tooltipRect.right - window.innerWidth;
        tooltip.style.left = `${parseInt(tooltip.style.left) - overflow - 10}px`;
      }
      
      if (tooltipRect.left < 0) {
        tooltip.style.left = '0px';
        tooltip.style.transform = 'translateX(0)';
      }
    }, 0);
  }
  
  // Clear error for a specific field
  function clearError(field) {
    field.classList.remove('border-red-500');
    const tooltip = field.parentNode.querySelector('.tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  }
  
  // Check specific field format (phone and email)
  function validateFieldFormat(field) {
    let isValid = true;
    let errorMessage = '';
    
    if (field === phoneInput && field.value.trim()) {
      if (!isValidPhone(field.value)) {
        isValid = false;
        errorMessage = 'Enter a valid Australian phone number';
      }
    } else if (field === emailInput && field.value.trim()) {
      if (!isValidEmail(field.value)) {
        isValid = false;
        errorMessage = 'Enter a valid email address';
      }
    }
    
    if (!isValid) {
      showError(field, errorMessage);
    }
    
    // Update button state after validation
    updateOrderButtonState();
    
    return isValid;
  }
  
  // Add event listeners to form fields
  const formFields = [nameInput, phoneInput, emailInput, addressInput, stateSelect];
  
  formFields.forEach(field => {
    // On focus, mark field as touched
    field.addEventListener('focus', function() {
      // Add to touched fields set
      touchedFields.add(field);
    });
    
    // On input, remove error and update button state
    field.addEventListener('input', function() {
      clearError(field);
      updateOrderButtonState();
      
      // If field is address, update shipping fee
      if (field === addressInput) {
        updateShippingFee();
      }
    });
    
    // On blur, validate format for email and phone
    field.addEventListener('blur', function() {
      if ((field === emailInput || field === phoneInput) && field.value.trim() !== '') {
        // For email and phone, validate format if they contain something
        validateFieldFormat(field);
      }
      updateOrderButtonState();
    });
    
    // For select element, add change listener
    if (field.tagName === 'SELECT') {
      field.addEventListener('change', function() {
        updateOrderButtonState();
      });
    }
  });
  
  // Check form validity for submission
  function checkFormValidity(showErrors = false) {
    let isValid = true;
    
    // Validate name
    if (!nameInput.value.trim()) {
      if (showErrors) showError(nameInput, 'Name is required');
      isValid = false;
    }
    
    // Validate phone
    if (!phoneInput.value.trim()) {
      if (showErrors) showError(phoneInput, 'Phone number is required');
      isValid = false;
    } else if (!isValidPhone(phoneInput.value)) {
      if (showErrors) showError(phoneInput, 'Enter a valid Australian phone number');
      isValid = false;
    }
    
    // Validate email
    if (!emailInput.value.trim()) {
      if (showErrors) showError(emailInput, 'Email is required');
      isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
      if (showErrors) showError(emailInput, 'Enter a valid email address');
      isValid = false;
    }
    
    // Validate address
    if (!addressInput.value.trim()) {
      if (showErrors) showError(addressInput, 'Address is required');
      isValid = false;
    }
    
    // Validate state
    if (!stateSelect.value) {
      if (showErrors) showError(stateSelect, 'Please select a state');
      isValid = false;
    }
    
    return isValid;
  }
  
  // Update shipping fee based on address
  function updateShippingFee() {
    const shippingElement = document.getElementById('shipping-fee');
    if (shippingElement) {
      const addressValue = addressInput.value.trim();
      
      if (addressValue) {
        shippingElement.textContent = '$5.50';
        shippingElement.parentElement.classList.remove('text-gray-300');
        shippingElement.parentElement.classList.add('text-gray-600');
      } else {
        shippingElement.textContent = 'Enter address first';
        shippingElement.parentElement.classList.remove('text-gray-600');
        shippingElement.parentElement.classList.add('text-gray-300');
      }
    }
  }
  
  // Add event listener to place order button
  placeOrderBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Mark all fields as touched
    formFields.forEach(field => touchedFields.add(field));
    
    // Validate all fields and show errors
    if (checkFormValidity(true)) {
      // Debug: Log the raw localStorage data first
      console.log("Raw cart data:", localStorage.getItem("cartProduct"));
      
      // Form is valid, collect order data
      const orderData = collectOrderData();
      
      // Log the complete order to console
      console.log("Order placed successfully!");
      console.log(JSON.stringify(orderData, null, 2));
      
      // Show success message to user
      alert('Order placed successfully!');
    }
  });
  
  // Function to collect all order data
  function collectOrderData() {
    // Get selected products from cart
    const selectedProducts = [];
    
    try {
      // Get cart items from localStorage
      const cartItems = JSON.parse(localStorage.getItem("cartProduct") || "[]");
      
      // Filter only selected items (if they have a selected property and it's true)
      for (let item of cartItems) {
        if (item.selected !== false) { // If undefined or true
          selectedProducts.push({
            id: item.id,
            name: item.name || `Product #${item.id}`, // Fallback name if missing
            quantity: item.quantity || 1, // Use quantity directly from localStorage
            price: parseFloat(item.price) || 0,
            totalPrice: ((parseFloat(item.price) || 0) * (item.quantity || 1)).toFixed(2)
          });
        }
      }
    } catch (e) {
      console.error("Error parsing cart data:", e);
    }
    
    // Calculate totals
    const subtotal = selectedProducts.reduce((sum, product) => sum + (parseFloat(product.totalPrice) || 0), 0);
    const shippingFee = addressInput.value.trim() ? 5.50 : 0;
    const total = subtotal + shippingFee;
    
    // Get the payment method
    const paymentMethod = document.getElementById('selected-payment-method').value || 'cash';
    
    // Collect customer info
    const customerInfo = {
      name: nameInput.value,
      phone: phoneInput.value,
      email: emailInput.value,
      address: addressInput.value,
      state: stateSelect.value
    };
    
    // Build complete order object
    const orderData = {
      orderId: generateOrderId(),
      orderDate: new Date().toISOString(),
      customer: customerInfo,
      products: selectedProducts,
      payment: {
        method: paymentMethod,
        subtotal: subtotal.toFixed(2),
        shippingFee: shippingFee.toFixed(2),
        total: total.toFixed(2)
      }
    };
    
    return orderData;
  }
  
  // Generate a simple order ID
  function generateOrderId() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${timestamp}-${random}`;
  }
  
  // Initialize button state
  updateOrderButtonState();
  
  // Set up MutationObserver to monitor cart changes
  const cartObserver = new MutationObserver(updateOrderButtonState);
  const cartList = document.getElementById('cart-list');
  
  if (cartList) {
    cartObserver.observe(cartList, {
      childList: true,
      subtree: true
    });
  }
});