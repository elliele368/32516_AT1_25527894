let selectedProductIndex = 0;  // Track the selected product's index
let modalQty = 1;             // Modal quantity counter (initial set to 1)


function renderTemplate2(product, index) {
  const tagsHTML = product.tag.map(tag => `
    <span class="rounded bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-primary-800">${tag}</span>
  `).join('');

  const cartData = JSON.parse(localStorage.getItem('cartProduct')) || [];
  const productInCart = cartData.find(item => item.id === product.id);
  const isInCart = productInCart ? true : false;
  console.log('isInCart', isInCart);
  
  return `
    <div id="product-${product.id}"
         data-index="${index}" 
         class="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm min-h-[500px] flex flex-col justify-between transition-all duration-200 hover:shadow-2xl hover:border-green-300">
      <div>
        <div class="h-56 w-full">
          <a href="#" onclick="openProductModal(products[${index}],${index}); return false;">
            <img class="mx-auto h-full object-cover rounded-md cursor-pointer" src="${product.image}" alt="${product.name}" />
          </a>
        </div>
        <div class="flex items-center justify-between gap-2 pt-6 pb-4">
          <p class="text-2xl font-extrabold leading-tight text-gray-900">$${Number(product.price).toFixed(2)}</p>
          <span class="product-quantity text-xs text-gray-500 whitespace-nowrap ml-2">
            (${product.displayUnit} / QTY: ${isInCart ? (product.quantity - productInCart.quantity) : product.quantity})
          </span>
        </div>
        <a href="#" onclick="openProductModal(products[${index}],${index}); return false;" class="text-lg font-semibold leading-tight text-gray-900 group-hover:text-green-700 hover:underline cursor-pointer">
          ${product.name}
        </a>
        <div class="flex gap-2 py-2 pb-4">
          ${tagsHTML}
        </div>
      </div>
      <div class="pt-3 border-t border-gray-200/80">
        <button data-id="${product.id}" data-index="${index}" class="${isInCart ? "hidden" : ""} addButton w-full h-[40px] rounded-lg bg-green-600 px-5 text-sm font-medium text-white text-center hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed">
          Add to cart
        </button>
        <div class="${isInCart ? "" : "hidden"} flex h-[40px] w-full overflow-hidden rounded-lg border border-gray-300 text-gray-900 quantitySelector">
          <button data-id="${product.id}" data-index="${index}" class="decreaseBtn w-[44px] bg-green-600 text-white hover:bg-green-700 flex items-center justify-center">
            <span class="text-xl leading-none">−</span>
          </button>
          <div class="flex grow items-center justify-center bg-gray-50 text-base font-medium">
            <span class="qty">${isInCart ? productInCart.quantity : 1}</span>
          </div>
          <button data-id="${product.id}" data-index="${index}" class="plusBtn w-[44px] bg-green-600 text-white hover:bg-green-700 flex items-center justify-center">
            <span class="text-xl leading-none">+</span>
          </button>
        </div>
      </div>
    </div>
  `;
}



// Thêm hàm bay "flyToCartAnimation"
function flyToCartAnimation(product, startX, startY, endX, endY) {
  // Tạo 1 element (img) đại diện sản phẩm
  const flyer = document.createElement('img');
  flyer.src = product.image;              // Lấy ảnh của product
  flyer.style.position = 'fixed';
  flyer.style.left = startX + 'px';
  flyer.style.top = startY + 'px';
  flyer.style.width = '50px';
  flyer.style.height = '50px';
  flyer.style.zIndex = '9999';
  flyer.style.transition = 'all 0.8s ease';

  // Thêm vào body
  document.body.appendChild(flyer);

  // Bắt buộc reflow để transition hoạt động
  flyer.offsetWidth; // force reflow

  // Di chuyển đến icon giỏ hàng
  flyer.style.left = endX + 'px';
  flyer.style.top = endY + 'px';
  flyer.style.width = '10px';
  flyer.style.height = '10px';
  flyer.style.opacity = '0.5';

  // Khi bay xong thì xoá phần tử
  flyer.addEventListener('transitionend', () => {
    flyer.remove();
  });
}

// Reference to updateCartData from script.js
function updateCartDataLocal(index, modalQty, productId) {
  // Get current cart data
  let cartList = [];
  try {
    cartList = JSON.parse(localStorage.getItem("cartProduct")) || [];
  } catch (e) {
    console.error("Error parsing cart data:", e);
    cartList = [];
  }

  // Update producChose array
  if (!producChose[index]) {
    producChose[index] = {
      id: productId,
      quantity: 0
    };
  }
  producChose[index].quantity += modalQty;

  // Find if product exists in cart
  const existingItemIndex = cartList.findIndex(item => item.id === productId);

  if (existingItemIndex !== -1) {
    // Update existing item quantity
    cartList[existingItemIndex].quantity += modalQty;
  } else {
    // Add new item to cart
    cartList.push({
      id: productId,
      quantity: modalQty
    });
  }

  // Update localStorage
  try {
    localStorage.setItem("cartProduct", JSON.stringify(cartList));
    console.log("Cart updated successfully:", cartList);
  } catch (e) {
    console.error("Error saving to localStorage:", e);
  }

  // Update cart badge
  updateCartBadgeFromStorage();

  return cartList; // Return updated cart data
}

// Mở modal
function openProductModal(productmn, index) {
  let product = JSON.parse(JSON.stringify(productmn));

  // Get cart data and calculate available quantity
  // try {
  //   // let cartData = JSON.parse(localStorage.getItem("cartProduct")) || [];
  //   // let cartItem = cartData.find(item => item.id === product.id);
  //   // if (cartItem) {
  //   //   // Update available quantity based on cart
  //   //   let originalProduct = productsInit.find(p => p.id === product.id);
  //   //   console.log("originalProduct: ", originalProduct);
  //   //   console.log("cartItem: ", cartItem);
  //   //   product.quantity = originalProduct.quantity - cartItem.quantity;
  //   //   console.log("product.quantity: ", product.quantity);
  //   //   if( product.quantity < 0) {
  //   //     product.quantity = 0; // Ensure quantity doesn't go negative
  //   //   }
  //   }
  // } catch (e) {
  //   console.error("Error updating product quantity:", e);
  // }

  const modal = document.getElementById("productDetail-modal");
  const content = document.getElementById("modalContent");
  const scrollPosition = window.scrollY;
  console.log("scrollPosition: ", product, index);
  // Get cart data from localStorage
  try {
    const cartData = JSON.parse(localStorage.getItem("cartProduct")) || [];
    const cartItem = cartData.find(item => item.id === product.id);
    
    // Set modalQty based on cart quantity or default to 1
    // modalQty = cartItem ? cartItem.quantity : 1;

    // Update product quantity based on cart
    const originalProduct = getOriginalProduct(product.id);
    if (originalProduct && cartItem) {
      product.quantity = originalProduct.quantity - cartItem.quantity;
    }
  } catch (e) {
    console.error("Error getting cart data:", e);
    modalQty = 1;
  }
  modalQty =  1; // Set modalQty to the quantity of the selected product
  console.log("model: ", product, index);
  modal.classList.remove("hidden");
  document.body.classList.add('modal-open');
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.position = 'fixed';

  // Render modal content
  content.innerHTML = `
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Image -->
      <div class="w-full md:w-1/2">
        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover rounded-lg" />
      </div>

      <!-- Info -->
      <div class="w-full md:w-1/2 flex flex-col gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">${product.name}</h2>
          <p class="text-xl font-bold text-green-700">$${product.price.toFixed(2)}</p>
          <p id="model-qty" class=" text-sm text-gray-500 mt-1">
            (${product.displayUnit} / QTY: ${product.quantity})
          </p>
        </div>

        <div class="bg-green-50 p-4 rounded-lg">
          <p class="font-semibold text-gray-800 mb-1">Description</p>
          <p class="text-sm text-gray-700 leading-relaxed">${product.description}</p>
        </div>

        <!-- Quantity + Button -->
        <div class="flex items-center gap-4 mt-4">
          <div class="flex h-[40px] overflow-hidden rounded-lg border border-gray-300 text-gray-900 w-1/3">
            <button class="w-[44px] bg-gray-500 text-white hover:bg-green-700 flex items-center justify-center"
                    id="decrease-btn-${product.id}" disabled>
              <span class="text-xl leading-none">−</span>
            </button>
            <div class="flex grow items-center justify-center bg-gray-50 text-base font-medium px-4">
              <span id="qty-display-${product.id}">1</span>
            </div>
            <button class="w-[44px] bg-green-600 text-white hover:bg-green-700 flex items-center justify-center"
                    id="increase-btn-${product.id}">
              <span class="text-xl leading-none">+</span>
            </button>
          </div>

          <span class="text-gray-500">|</span> <!-- separator -->

          <button class="h-[40px] rounded-lg bg-green-600 px-5 text-sm font-medium text-white hover:bg-green-800
                         focus:outline-none focus:ring-4 focus:ring-green-300 w-2/3"
                  id="add-to-cart-btn-${product.id}">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  `;

  // Khởi tạo sự kiện trong modal
  initializeModalEvents(product, index);
}

// Đóng modal
function closeProductModal() {



  const modal = document.getElementById("productDetail-modal");
  const scrollPosition = Math.abs(parseInt(document.body.style.top || '0'));

  modal.classList.add("hidden");
  document.body.classList.remove('modal-open');
  document.body.style.position = '';
  document.body.style.top = '';

  // Restore scroll position


  window.location.href = window.location.href;

  window.scrollTo(0, scrollPosition);

}

// Gắn sự kiện đóng modal cho nút và cho vùng overlay
document.getElementById("closeModalButton").addEventListener("click", closeProductModal);
document.getElementById("productDetail-modal").addEventListener("click", (event) => {
  if (event.target === document.getElementById("productDetail-modal")) {
    closeProductModal();
  }
}


);

// Hàm khởi tạo sự kiện trong modal (sửa lại đoạn Add to cart)
function initializeModalEvents(product, index) {
    const decreaseBtn = document.getElementById(`decrease-btn-${product.id}`);
    const increaseBtn = document.getElementById(`increase-btn-${product.id}`);
    const addToCartBtn = document.getElementById(`add-to-cart-btn-${product.id}`);
    const qtyDisplay = document.getElementById(`qty-display-${product.id}`);
    qtyDisplay.textContent = modalQty;
    // Khi modal mở, set nút ban đầu
    updateModalButtonState(product, decreaseBtn, increaseBtn, addToCartBtn, qtyDisplay);

  // Giảm số lượng
  decreaseBtn.addEventListener("click", () => {
    if (modalQty > 1) {
      modalQty--;
      qtyDisplay.textContent = modalQty;
      updateModalButtonState(product, decreaseBtn, increaseBtn, addToCartBtn, qtyDisplay);
    }
  });

  // Tăng số lượng
  increaseBtn.addEventListener("click", () => {
    if (modalQty < product.quantity) {
      modalQty++;
      qtyDisplay.textContent = modalQty;
      updateModalButtonState(product, decreaseBtn, increaseBtn, addToCartBtn, qtyDisplay);
    }
  });

  // Thêm vào giỏ
  addToCartBtn.addEventListener("click", () => {
    if (product.quantity >= modalQty) {
      // Trừ stock, tăng cartCount
      product.quantity -= modalQty;
      cartCount += modalQty;
      updateCartDisplay();
      updateProductCardStock(index);

      // const htmlModal = document.getElementById("product-layout");
      // htmlModal.innerHTML = ""; // Clear the existing content
      // // Render lại danh sách sản phẩm
      // for (let i = 0; i < products.length; i++) {
      //   htmlModal.innerHTML += renderTemplate2(products[i], i);
      // }

      //reload window



      // Add this section to update cart data
      // Find if product exists in cart
      let cartItemIndex = producChose.findIndex(item => item.id === product.id);
      if (cartItemIndex !== -1) {
        // If exists, increase its quantity
        producChose[cartItemIndex].quantity += modalQty;
      } else {
        // If not exists, add it
        producChose.push({
          id: product.id,
          quantity: modalQty
        });
      }
      
      // Update localStorage
      updateCartDataLocal(index, modalQty, product.id);

      // Cập nhật text hiển thị còn lại
      document.getElementById("model-qty").textContent = `(${product.displayUnit} / QTY: ${product.quantity})`;
      updateModalButtonState(product, decreaseBtn, increaseBtn, addToCartBtn, qtyDisplay);

      // Tính toạ độ bắt đầu (nút Add to cart trong modal)
      const addBtnRect = addToCartBtn.getBoundingClientRect();
      const startX = addBtnRect.left + window.scrollX + (addBtnRect.width / 2);
      const startY = addBtnRect.top + window.scrollY + (addBtnRect.height / 2);

      // Tính toạ độ kết thúc (icon giỏ hàng)
      const cartIcon = document.getElementById('cartIcon');
      const cartRect = cartIcon.getBoundingClientRect();
      const endX = cartRect.left + window.scrollX + (cartRect.width / 2);
      const endY = cartRect.top + window.scrollY + (cartRect.height / 2);

      // Gọi hàm bay
      flyToCartAnimation(product, startX, startY, endX, endY);

    }


  });
}

// Cập nhật trạng thái nút trong modal
function updateModalButtonState(product, decreaseBtn, increaseBtn, addToCartBtn, qtyDisplay) {
  // Disable decrease nếu đang là 1
  if (modalQty === 1) {
    decreaseBtn.disabled = true;
    decreaseBtn.classList.add('opacity-50', 'bg-gray-500', 'cursor-not-allowed');
    decreaseBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
  } else {
    decreaseBtn.disabled = false;
    decreaseBtn.classList.remove('opacity-50', 'bg-gray-500', 'cursor-not-allowed');
    decreaseBtn.classList.add('bg-green-600', 'hover:bg-green-700');
  }

  // Disable increase nếu đạt max stock
  if (modalQty >= product.quantity) {
    increaseBtn.disabled = true;
    increaseBtn.classList.add('opacity-50', 'bg-gray-500', 'cursor-not-allowed');
    increaseBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
  } else {
    increaseBtn.disabled = false;
    increaseBtn.classList.remove('opacity-50', 'bg-gray-500', 'cursor-not-allowed');
    increaseBtn.classList.add('bg-green-600', 'hover:bg-green-700');
  }

  // Nếu out of stock => disable tất cả
  if (product.quantity === 0) {
    decreaseBtn.disabled = true;
    increaseBtn.disabled = true;
    addToCartBtn.disabled = true;
    addToCartBtn.textContent = 'Out of stock';
    addToCartBtn.classList.add('opacity-50', 'bg-gray-500', 'cursor-not-allowed');
    addToCartBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
  }
}

// Cập nhật thẻ product card ngoài danh sách
function updateProductCardStock(index) {
  const product = products[index];
  const productCard = document.getElementById(`product-${product.id}`);
  if (!productCard) return;

  // Nếu hết hàng => đổi nút thành "Out of stock"
  if (product.quantity === 0) {
    const addBtn = productCard.querySelector('.addButton');
    addBtn.disabled = true;
    addBtn.textContent = 'Out of stock';

    // Đổi màu sang xám
    addBtn.classList.add('bg-gray-500', 'text-white', 'cursor-not-allowed', 'opacity-50');
    addBtn.classList.remove('bg-green-600', 'hover:bg-green-800', 'hover:bg-green-700');
  }

  // Luôn cập nhật text QTY
  const quantityEl = productCard.querySelector('.product-quantity');
  quantityEl.textContent = `(${product.displayUnit} / QTY: ${product.quantity})`;
}
