let searchTimeout = null;
const MIN_SEARCH_CHARS = 2;

// Initialize search functionality after header is loaded or if already available.
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const searchResultsList = document.getElementById('search-results-list');
  const searchLoading = document.getElementById('search-loading');
  const searchNoResults = document.getElementById('search-no-results');

  if (!searchInput || !searchResults || !searchResultsList || !searchLoading || !searchNoResults) {
    console.error('Search elements not found. Initialization aborted.');
    return;
  }
  console.log('Initializing search with searchInput:', searchInput);

  // Listen for input changes.
  searchInput.addEventListener('input', handleSearchInput);

  // Close search results when clicking outside.
  document.addEventListener('click', function(event) {
    if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
      searchResults.classList.add('hidden');
    }
  });

  // Close search results when pressing Escape.
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      searchResults.classList.add('hidden');
    }
  });
}

// Handle search input with debounce.
function handleSearchInput() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const searchResultsList = document.getElementById('search-results-list');
  const searchLoading = document.getElementById('search-loading');
  const searchNoResults = document.getElementById('search-no-results');

  const query = searchInput.value.trim();

  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  // Hide results if query is too short.
  if (query.length < MIN_SEARCH_CHARS) {
    searchResults.classList.add('hidden');
    return;
  }

  // Show the loading state.
  searchResults.classList.remove('hidden');
  searchLoading.classList.remove('hidden');
  searchResultsList.classList.add('hidden');
  searchNoResults.classList.add('hidden');

  // Set a debounce timeout.
  searchTimeout = setTimeout(() => {
    performSearch(query);
  }, 300);
}

// Perform the actual search.
function performSearch(query) {
  const searchLoading = document.getElementById('search-loading');
  const searchNoResults = document.getElementById('search-no-results');

  console.log('Products array:', products);
  if (!products || !Array.isArray(products)) {
    console.error('Products array not found!');
    searchLoading.classList.add('hidden');
    searchNoResults.classList.remove('hidden');
    searchNoResults.textContent = 'Error: Products data not loaded';
    return;
  }

  query = query.toLowerCase();
  const results = products.filter(product =>
    product.name.toLowerCase().includes(query)
  );

  // Hide loading indicator.
  searchLoading.classList.add('hidden');

  if (results.length > 0) {
    renderSearchResults(results);
    document.getElementById('search-results-list').classList.remove('hidden');
    searchNoResults.classList.add('hidden');
  } else {
    document.getElementById('search-results-list').classList.add('hidden');
    searchNoResults.classList.remove('hidden');
  }
}

// Render search results into the dropdown.
function renderSearchResults(results) {
  const searchResultsList = document.getElementById('search-results-list');
  // Clear previous results.
  searchResultsList.innerHTML = '';

  // Limit display to first 5 results.
  const displayResults = results.slice(0, 5);

  // Get cart items from localStorage.
  let productChose = [];
  try {
    const storedCart = localStorage.getItem('cartProduct');
    if (storedCart) {
      productChose = JSON.parse(storedCart);
    }
  } catch (e) {
    console.error('Error loading cart data:', e);
  }

  displayResults.forEach(product => {
    const cartItem = productChose.find(item => item.id === product.id);
    const isInCart = cartItem !== undefined;
    const isOutOfStock = product.quantity <= 0;

    const resultItem = document.createElement('div');
    resultItem.className = 'p-3 hover:bg-gray-50';

    resultItem.innerHTML = `
      <div class="flex items-center justify-between gap-2">
        <!-- Product Info -->
        <div class="flex items-center flex-1 min-w-0">
          <img src="${product.image}" alt="${product.name}" class="w-12 h-12 object-cover rounded-md mr-3" />
          <div class="min-w-0">
            <div class="font-medium text-sm truncate max-w-[200px]">${product.name}</div>
            <div class="text-green-600 font-semibold text-sm">$${product.price.toFixed(2)}</div>
            <div class="text-xs text-gray-500">${product.displayUnit}</div>
          </div>
        </div>
        <!-- Cart Controls -->
        <div class="flex-shrink-0">
          ${isOutOfStock ? 
            `<div class="text-xs text-red-500 font-medium py-1">Out of stock</div>` : 
            isInCart ? 
            `<div class="flex items-center justify-center bg-gray-50 border border-gray-300 rounded-md overflow-hidden h-8 quantity-controls" data-id="${product.id}">
              <button type="button" class="search-decrease-btn w-8 h-8 flex items-center justify-center ${cartItem.quantity <= 1 ? 'bg-gray-100 text-gray-400' : 'bg-green-600 text-white hover:bg-green-700'}" data-id="${product.id}">
                <span class="leading-none font-bold">−</span>
              </button>
              <span class="search-qty w-10 h-8 flex items-center justify-center text-sm font-medium" data-id="${product.id}">${cartItem.quantity}</span>
              <button type="button" class="search-increase-btn w-8 h-8 flex items-center justify-center ${isOutOfStock || cartItem.quantity >= product.quantity ? 'bg-gray-100 text-gray-400' : 'bg-green-600 text-white hover:bg-green-700'}" data-id="${product.id}" ${isOutOfStock || cartItem.quantity >= product.quantity ? 'disabled' : ''}>
                <span class="leading-none font-bold">+</span>
              </button>
            </div>` :
            `<button type="button" class="add-to-cart-btn px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 flex items-center justify-center" data-id="${product.id}">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to cart
            </button>`}
        </div>
      </div>
    `;

    searchResultsList.appendChild(resultItem);
  });

  attachSearchResultEvents();
}

// Attach event listeners to search result buttons.
function attachSearchResultEvents() {
  // Clone add-to-cart buttons to remove old event listeners
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    const newBtn = button.cloneNode(true);
    button.replaceWith(newBtn);
  });

  // Re-select the fresh buttons and attach listener
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      let productId = parseInt(button.getAttribute('data-id'));
      console.log(productId);
      addToCartFromSearch(productId, button);
      return false;
    });
  });

  // Attach increase/decrease events
  attachEventIncreaseDecrease();
}

// Update attachEventIncreaseDecrease function
function attachEventIncreaseDecrease(){
  // Clone increase buttons to remove old event listeners
  document.querySelectorAll('.search-increase-btn').forEach(button => {
    const newBtn = button.cloneNode(true);
    button.replaceWith(newBtn);
  });

  // Clone decrease buttons to remove old event listeners
  document.querySelectorAll('.search-decrease-btn').forEach(button => {
    const newBtn = button.cloneNode(true);
    button.replaceWith(newBtn);
  });

  // Re-attach event listeners to the newly cloned buttons
  document.querySelectorAll('.search-increase-btn').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      let productId = parseInt(button.getAttribute('data-id'));
      console.log(productId);
      updateSearchQuantity(productId, 1);
      return false;
    });
  });

  document.querySelectorAll('.search-decrease-btn').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      let productId = parseInt(button.getAttribute('data-id'));
      console.log("==>", button.getAttribute('data-id'));
      updateSearchQuantity(productId, -1);
      return false;
    });
  });
}

// Update quantity in search results.
function updateSearchQuantity(productId, change) {
  let product = products.find(p => p.id === productId);
  let productChose = [];
  try {
    let storedCart = localStorage.getItem('cartProduct');
    if (storedCart) {
      productChose = JSON.parse(storedCart);
    }
  } catch (e) {
    console.error('Error loading cart data:', e);
  }

  let productIndex = productChose.findIndex(item => item.id === productId);
  console.log(productIndex)
  if (!product) return;

  const qtyElement = document.querySelector(`.search-qty[data-id="${productId}"]`);
  if (!qtyElement) return;

  let qty = parseInt(productChose[productIndex].quantity);
  qty += change;
  // qty = Math.max(1, Math.min(qty, product.quantity));
  qtyElement.textContent = qty;

 
  if (productIndex !== -1) {
    productChose[productIndex].quantity = qty;
    localStorage.setItem('cartProduct', JSON.stringify(productChose));
    if (typeof updateCartBadgeFromStorage === 'function') {
      updateCartBadgeFromStorage();
    } else {
      const cartBadge = document.getElementById('cart-count');
      if (cartBadge) {
        const totalItems = productChose.reduce((sum, item) => sum + (item.quantity || 0), 0);
        cartBadge.textContent = totalItems;
      }
    }
  }

  let decreaseBtn = document.querySelector(`.search-decrease-btn[data-id="${productId}"]`);
  if (decreaseBtn) {
    if (qty <= 1) {
      decreaseBtn.disabled = true;
      decreaseBtn.classList.remove('bg-green-600', 'text-white', 'hover:bg-green-700');
      decreaseBtn.classList.add('bg-gray-100', 'text-gray-400');
    } else {
      decreaseBtn.disabled = false;
      decreaseBtn.classList.remove('bg-gray-100', 'text-gray-400');
      decreaseBtn.classList.add('bg-green-600', 'text-white', 'hover:bg-green-700');
    }
  }

  let increaseBtn = document.querySelector(`.search-increase-btn[data-id="${productId}"]`);
  if (increaseBtn) {
    if (qty >= product.quantity) {
      increaseBtn.disabled = true;
      increaseBtn.classList.remove('bg-green-600', 'text-white', 'hover:bg-green-700');
      increaseBtn.classList.add('bg-gray-100', 'text-gray-400');
    } else {
      increaseBtn.disabled = false;
      increaseBtn.classList.remove('bg-gray-100', 'text-gray-400');
      increaseBtn.classList.add('bg-green-600', 'text-white', 'hover:bg-green-700');
    }
  }
  document.dispatchEvent(new Event("Cart-change"));
}

// Add product to cart from search results.
function addToCartFromSearch(productId , button) {
   let product = products.find(p => p.id === productId);
  if (!product || product.quantity <= 0) return;


  let productChose = [];
  try {
    let storedCart = localStorage.getItem('cartProduct');
    if (storedCart) {
      productChose = JSON.parse(storedCart);
    }
  } catch (e) {
    console.error('Error loading cart data:', e);
  }

  let productIndex = productChose.findIndex(item => item.id === productId);
  console.log("vao day index " + productIndex)
  if (productIndex !== -1) {
    productChose[productIndex].quantity += 1;
  } else {
    productChose.push({
      id: productId,
      quantity: 1
    });
  }

  localStorage.setItem('cartProduct', JSON.stringify(productChose));
  if (typeof updateCartBadgeFromStorage === 'function') {
    searchUpdateCartBadgeFromStorage();
  } else {
    const cartBadge = document.getElementById('cart-count');
    if (cartBadge) {
      const totalItems = productChose.reduce((sum, item) => sum + (item.quantity || 0), 0);
      cartBadge.textContent = totalItems;
    }
  }

  if (window.location.pathname.includes('cart.html') && typeof renderCartList === 'function') {
    try {
      if (productChose && productChose.length > 0 && typeof products !== 'undefined') {
        const productList = getChosenProducts(productChose, products);
        renderCartList(productList);
      }
    } catch (e) {
      console.error('Error updating cart list from search:', e);
    }
  }
  // console.log
  console.log(document.querySelector(`.add-to-cart-btn[data-id="${productId}"]`), productId) 

  //const buttonParent = document.querySelector(`.add-to-cart-btn[data-id="${productId}"]`).parentNode;
  let buttonParent = button.parentNode;
  
  buttonParent.innerHTML = `
    <div class="flex items-center justify-center bg-gray-50 border border-gray-300 rounded-md overflow-hidden h-8 quantity-controls" data-id="${productId}">
      <button type="button" class="search-decrease-btn btn-decrease-${productId} w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-400" data-id="${productId}" disabled>
        <span class="leading-none font-bold">−</span>
      </button>
      <span class="search-qty w-10 h-8 flex items-center justify-center text-sm font-medium" data-id="${productId}">1</span>
      <button type="button" class="search-increase-btn btn-${productId} w-8 h-8 flex items-center justify-center ${product.quantity > 1 ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-100 text-gray-400'}" data-id="${productId}" ${product.quantity > 1 ? '' : 'disabled'}>
        <span class="leading-none font-bold">+</span>
      </button>
    </div>
  `;
  attachSearchResultEvents();
  document.dispatchEvent(new Event("Cart-change"));
// document.getElementById('btn-decrease-'+productId).addEventListener("click",()=>{
//   updateSearchQuantity(productId, -1);
// })
// document.getElementById('btn-'+productId).addEventListener("click",()=>{
//   updateSearchQuantity(productId, +1);
// })

}

// On DOMContentLoaded, initialize search if search input is available; otherwise, wait for headerLoaded event.
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('search-input')) {
    initSearch();
  } else {
    document.addEventListener('headerLoaded', initSearch);
  }
});
function searchUpdateCartBadgeFromStorage() {
  try {
    const cartBadge = document.getElementById("cart-count");
    if (!cartBadge) return; // Ngăn lỗi nếu phần tử chưa tồn tại

    const storedCart = localStorage.getItem("cartProduct");
    if (!storedCart) {
      cartBadge.textContent = "0";
      return;
    }

    const cartItems = JSON.parse(storedCart);
    const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

    cartBadge.textContent = totalItems;
    cartCount = totalItems;
  } catch (e) {
    console.error("Error updating cart badge:", e);
    const fallback = document.getElementById("cart-count");
    if (fallback) fallback.textContent = "0";
  }
}
