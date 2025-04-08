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
  updateCartBadge(); // Use the centralized function
}

function initRenderProduct() {
  const productLayout = document.getElementById("product-layout");
  if (!productLayout) {
    // Trang hiện tại không có product-layout, không cần render
    return;
  }

  for (let i = 0; i < products.length; i++) {
    productLayout.innerHTML += renderTemplate(products[i], i);
  }
}

function initEvents() {
  for (let i = 0; i < products.length; i++) {
    const decreaseBtn = document.getElementsByClassName("decreaseBtn")[i];
    const addButton = document.getElementsByClassName("addButton")[i];
    const plusBtn = document.getElementsByClassName("plusBtn")[i];

    if (decreaseBtn && addButton && plusBtn) {
      decreaseBtn.addEventListener("click", decreaseQty.bind(null, i));
      addButton.addEventListener("click", showQuantityCounter.bind(null, i));
      plusBtn.addEventListener("click", increaseQty.bind(null, i));
    } else {
      console.warn(`⚠️ Some buttons not found for product index ${i}`);
      continue;
    }

    quantity.push(1);
    hasReserved.push(false);
    let foundItem = cartData.find(item => item.id === products[i].id);
    products[i].quantity = foundItem ? products[i].quantity - foundItem.quantity : products[i].quantity;
    producChose.push({
      id: products[i].id,
      quantity: foundItem ? foundItem.quantity : 0
    });
    updateAddButtonState(i);
  }
}

// Load Product Cards
window.onload = function () {
  initRenderProduct();
  if (typeof renderCategories === "function" && document.getElementById("category-layout")) {
    renderCategories(); // Only call if it's defined and used on this page
  }
  initEvents(); // Initialize events for products
  updateCartBadge(); // Update the cart badge on page load
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
  quantity[index] = 1;
  products[index].quantity--;
  producChose[index].quantity = quantity[index];
  cartCount++; // Increase cart count
  hasReserved[index] = true;
  updateQtyDisplay(index);
  updateStockDisplay(index);
  
  if (document.getElementById('cart-count')) {
    updateCartDisplay(); // Update cart UI
  } else {
    console.warn("Cart badge not found in showQuantityCounter.");
  }

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
    
    if (document.getElementById('cart-count')) {
      updateCartDisplay();
    }
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
    
    if (document.getElementById('cart-count')) {
      updateCartDisplay();
    }

    if (products[index].quantity > 0) {
      plusBtn.disabled = false;
      plusBtn.classList.remove('opacity-50', 'bg-gray-500', 'cursor-not-allowed');
      plusBtn.classList.add('bg-green-600', 'text-white', 'hover:bg-green-700');
    }
  } else {
    quantity[index] = 1;
    producChose[index].quantity = 1;
    if (hasReserved[index]) {
      products[index].quantity++;
      cartCount--;
      hasReserved[index] = false;
      updateStockDisplay(index);
      
      if (document.getElementById('cart-count')) {
        updateCartDisplay();
      }
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
function updateStockDisplay(index) {
  const unitInfo = products[index].displayUnit ? `${products[index].displayUnit} / QTY: ${products[index].quantity}` : `QTY: ${products[index].quantity}`;
  document.getElementsByClassName('product-quantity')[index].textContent = `(${unitInfo})`;
  this.updateCartData();
}

function updateAddButtonState(index) {
  const addBtn = document.getElementsByClassName('addButton')[index];

  if (products[index].quantity === 0) {
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
    products = filterByTags(selected);
  } else {
    products = productsInit;
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

function updateCartData(){
  let cartList = producChose
    .filter((product) => product.quantity > 0)
    .map(({ id, quantity }) => ({ id, quantity }));
 
  localStorage.setItem("cartProduct", JSON.stringify(cartList));
  updateCartBadge(); // Use the centralized function
}

document.addEventListener('DOMContentLoaded', function() {
});