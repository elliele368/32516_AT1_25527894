let quantity = [];
let hasReserved = [];
let producChose = [];
let cartCount = 0; // Total number of products in the cart
// let cartData = JSON.parse(localStorage.getItem("cartProduct")) || [];
let cartData;
try {
  cartData = JSON.parse(localStorage.getItem("cartProduct")) || [];
} catch (e) {
  // Nếu parse lỗi, dùng productsInit làm mặc định
  cartData = [];
}

// Update Cart Display
function updateCartDisplay() {
  const cartBadge = document.getElementById('cart-count');
  cartBadge.textContent = cartCount;
}

// Add this function to calculate and update the cart badge
function updateCartBadgeFromStorage() {
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

function initRenderProduct() {
  for (let i = 0; i < products.length; i++) {
    document.getElementById("product-layout").innerHTML += renderTemplate(products[i], i);
  }
}

let intiTime = 1;
function initEvents() {
    try {
        cartData = JSON.parse(localStorage.getItem("cartProduct")) || [];
      } catch (e) {
        // Nếu parse lỗi, dùng productsInit làm mặc định
        cartData = [];
      }
    console.log("cart list la: ",cartData);
  const decreaseButtons = document.querySelectorAll(".decreaseBtn");
  const addButtons = document.querySelectorAll(".addButton");
  const plusButtons = document.querySelectorAll(".plusBtn");

  decreaseButtons.forEach(button => {
    button.addEventListener("click", () => {
      const index = button.getAttribute("data-index");
      decreaseQty(parseInt(index));
    });
  });

  addButtons.forEach(button => {
    button.addEventListener("click", () => {
      const index = button.getAttribute("data-index");
      showQuantityCounter(parseInt(index));
    });
  });

  plusButtons.forEach(button => {
    button.addEventListener("click", () => {
      const index = button.getAttribute("data-index");
      increaseQty(parseInt(index));
    });
  });

  // Initialize other product-related states
  hasReserved = [];
  quantity = [];
  producChose = [];
  products.forEach((product, i) => {
    const foundItem = cartData.find(item => item.id === product.id);
    if (foundItem) {
      quantity.push(foundItem.quantity);
      producChose.push({ id: product.id, quantity: foundItem.quantity });
    } else {
      quantity.push(0);
      producChose.push({ id: product.id, quantity: 0 });
    }

    // if (intiTime === 1) {
    //   product.quantity = foundItem ? product.quantity - foundItem.quantity : product.quantity;
    // }

    updateQtyDisplay(i);
    InitStockDisplay(i);
    updateAddButtonState(product,i);
  });
}

// Load Product Cards
window.onload = function () {
  // initRenderProduct();
  // renderCategories(); // Assuming this function exists for rendering categories
  // initEvents(); // Initialize events for products
  // updateCartBadgeFromStorage(); // Update the cart badge on page load
};

// Toggle dropdown for categories
function toggleDropdown() {
  const dropdown = document.getElementById("dropdown");
  const button = document.getElementById("dropdownDefault");
  const arrow = document.getElementById("dropdown-arrow");

  const isOpen = !dropdown.classList.contains("hidden");

  if (isOpen) {
    dropdown.classList.add("hidden");
    arrow.classList.remove("rotate-180");
    button.classList.remove("border-green-500");
    document.removeEventListener("click", handleOutsideClick);
  } else {
    dropdown.classList.remove("hidden");
    arrow.classList.add("rotate-180");
    button.classList.add("border-green-500");

    setTimeout(() => {
      document.addEventListener("click", handleOutsideClick);
    }, 0);
  }

  function handleOutsideClick(event) {
    if (!dropdown.contains(event.target) && !button.contains(event.target)) {
      dropdown.classList.add("hidden");
      arrow.classList.remove("rotate-180");
      button.classList.remove("border-green-500");
      document.removeEventListener("click", handleOutsideClick);
    }
  }
}

// When clicking Add to Cart, decrease the stock
function showQuantityCounter(index) {
  if (products[index].quantity <= 0) return;
  plusBtn = document.getElementsByClassName('plusBtn')[index];
  quantity[index] += 1;
  products[index].quantity-= quantity[index];
  producChose[index].quantity = quantity[index];
  cartCount++; // Increase cart count
  hasReserved[index] = true;
  updateQtyDisplay(index);
  updateStockDisplay(index);
  updateCartDisplay(); // Update cart UI
  document.getElementsByClassName('addButton')[index].classList.add('hidden');
  document.getElementsByClassName('quantitySelector')[index].classList.remove('hidden');

  if (products[index].quantity <= 0) {
    plusBtn.disabled = true;
    plusBtn.classList.add('opacity-50', 'bg-gray-500', 'text-white', 'cursor-not-allowed');
    plusBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
  }
  
}

// Increase quantity and decrease stock
function increaseQty(index) {
  plusBtn = document.getElementsByClassName('plusBtn')[index];
  if (products[index].quantity > 0) {
    quantity[index]++;
    producChose[index].quantity++;
    products[index].quantity--;
    cartCount++;
    updateQtyDisplay(index);
    updateStockDisplay(index);
    updateCartDisplay();
  }

  if (products[index].quantity <= 0) {
    plusBtn.disabled = true;
    plusBtn.classList.add('opacity-50', 'bg-gray-500', 'text-white', 'cursor-not-allowed');
    plusBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
  }
}

// Decrease quantity and add stock back
function decreaseQty(index) {
  plusBtn = document.getElementsByClassName('plusBtn')[index];
  if (quantity[index] > 1) {
    quantity[index]--;
    producChose[index].quantity--;
    products[index].quantity++;
    cartCount--;
    updateQtyDisplay(index);
    updateStockDisplay(index);
    updateCartDisplay();

    if (products[index].quantity > 0) {
      plusBtn.disabled = false;
      plusBtn.classList.remove('opacity-50', 'bg-gray-500', 'cursor-not-allowed');
      plusBtn.classList.add('bg-green-600', 'text-white', 'hover:bg-green-700');
    }
  } else {
    quantity[index] = 0;
    producChose[index].quantity = 0;
    if (hasReserved[index]) {
      products[index].quantity++;
      cartCount--;
      hasReserved[index] = false;
      updateQtyDisplay(index);
      updateStockDisplay(index);
      updateCartDisplay();
    }

    document.getElementsByClassName('quantitySelector')[index].classList.add('hidden');
    document.getElementsByClassName('addButton')[index].classList.remove('hidden');

    plusBtn.disabled = false;
    plusBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  }
}

// Update quantity display
function updateQtyDisplay(index) {
  document.getElementsByClassName('qty')[index].textContent = quantity[index];
}

// Update stock display UI
function InitStockDisplay(index) {
    const unitInfo = products[index].displayUnit ? `${products[index].displayUnit} / QTY: ${products[index].quantity}` : `QTY: ${products[index].quantity}`;
    document.getElementsByClassName('product-quantity')[index].textContent = `(${unitInfo})`;

  }
function updateStockDisplay(index) {
  const unitInfo = products[index].displayUnit ? `${products[index].displayUnit} / QTY: ${products[index].quantity}` : `QTY: ${products[index].quantity}`;
  document.getElementsByClassName('product-quantity')[index].textContent = `(${unitInfo})`;
 updateCartData(index);
 updateAddButtonState(products[index], index);
}

function updateAddButtonState(product, index) {
  const addBtn = document.getElementsByClassName('addButton')[index];
  let cartQuantity = 0;
  try {
    const cartData = JSON.parse(localStorage.getItem("cartProduct")) || [];
    const cartItem = cartData.find(item => item.id === product.id);
    if (cartItem) {
      cartQuantity = cartItem.quantity;
    }
  } catch (e) {
    console.error("Error getting cart quantity:", e);
  }

  // Get available quantity (original quantity minus cart quantity)
  let quantityProduct  = productsInit.find(p => p.id === product.id).quantity - cartQuantity;
  
  if (quantityProduct=== 0) {
    addBtn.disabled = true;
    addBtn.textContent = 'Out of stock';

    addBtn.classList.add('bg-gray-500', 'text-white', 'cursor-not-allowed');
    addBtn.classList.remove('bg-green-600', 'hover:bg-green-800');
  } else {
    addBtn.disabled = false;
    addBtn.textContent = 'Add to cart';

    addBtn.classList.add('bg-green-600', 'text-white', 'hover:bg-green-800');
    addBtn.classList.remove('bg-gray-500', 'cursor-not-allowed');
  }
}

// Category Filter Logic
const categoryMap = {
  'Fruit & Vegetable': ['Fruit', 'Salad'],
  'Meat & Seafood': ['Meat', 'Seafood'],
  'Dairy & Egg': ['Milk', 'Egg'],
  'Snack & Drink': ['Snack', 'Drink'],
  'Health & Wellness': ['Health', 'Wellness'],
};

// Event listeners for category checkboxes
const checkboxes = document.querySelectorAll('#dropdown input[type="checkbox"]');

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', function () {
    const id = checkbox.id;

    // Handle parent checkbox logic
    if (categoryMap[id]) {
      categoryMap[id].forEach(subId => {
        const subCb = document.getElementById(subId);
        if (subCb) subCb.checked = checkbox.checked;
      });
    } else {
      // Handle child checkbox logic
      Object.entries(categoryMap).forEach(([mainId, subIds]) => {
        if (subIds.includes(id)) {
          updateMainCategoryCheckState(mainId, subIds);
        }
      });
    }
    getSelectedCategories();
  });
});

// Update parent checkbox state
function updateMainCategoryCheckState(mainId, subIds) {
  const allChecked = subIds.every(id => document.getElementById(id)?.checked);
  const mainCb = document.getElementById(mainId);
  if (mainCb) mainCb.checked = allChecked;
}

// Filter products by selected categories
function getSelectedCategories() {
  const selected = [];
  document.querySelectorAll('#dropdown input[type="checkbox"]:checked').forEach(cb => {
    selected.push(cb.id);
  });

  console.log("Selected categories:", selected);

  if (selected.length > 0) {
    products = JSON.parse(JSON.stringify(filterByTags(selected)));
  } else {
    products = JSON.parse(JSON.stringify(productsInit));
  }

  document.getElementById("product-layout").innerHTML = "";
  initRenderProduct();
  initEvents();
}

// Filter products by tags
function filterByTags(selectedTags) {
  return productsInit.filter(product =>
    product.tag.some(tag => selectedTags.includes(tag))
  );
}

// function updateCartData(index){

//   producChose = Array.from(
//     new Map(producChose.map(item => [item.id, item])).values()
//   );
  
//   // console.log(unique);
//   // Output: [ { id: 1, quantity: 4 } ]
//   let cartList = producChose
//   .filter((product) => product.quantity > 0)
//   .map(({ id, quantity }) => ({ id, quantity }));
 
//   console.log("carlist la",cartList);
//   // producChose.forEach()

//   localStorage.setItem("cartProduct", JSON.stringify(cartList));

//   updateCartBadgeFromStorage(); // Update badge whenever cart data changes
// }
function updateCartData(index) {
    // Get current cart data
    let cartList = [];
    try {
      cartList = JSON.parse(localStorage.getItem("cartProduct")) || [];
    } catch (e) {
      cartList = [];
    }
  
    // Get the product being updated
    const currentProduct = products[index];
    const currentQuantity = quantity[index];
  
    // Find if product already exists in cart
    const existingProductIndex = cartList.findIndex(item => item.id === currentProduct.id);
  
    if (currentQuantity > 0) {
      // If product exists, update quantity
      if (existingProductIndex !== -1) {
        cartList[existingProductIndex].quantity = currentQuantity;
      } else {
        // If product doesn't exist, add it
        cartList.push({
          id: currentProduct.id,
          quantity: currentQuantity
        });
      }
    } else {
      // If quantity is 0, remove product from cart
      if (existingProductIndex !== -1) {
        cartList.splice(existingProductIndex, 1);
      }
    }
  
    // Update localStorage
    localStorage.setItem("cartProduct", JSON.stringify(cartList));
    
    // Update cart badge
    updateCartBadgeFromStorage();
    
    // Update producChose array to match cart
    producChose[index] = {
      id: currentProduct.id,
      quantity: currentQuantity
    };
  
    console.log("Cart updated:", cartList);
  }
document.addEventListener('DOMContentLoaded', function() {
  updateCartBadgeFromStorage();
});