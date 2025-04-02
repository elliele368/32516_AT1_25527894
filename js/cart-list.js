// cart-list.js

function renderCartItem(product) {
  const isOutOfStock = product.quantity === 0;
  const cartQty = product.cartQty ?? 1;
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
              <button class="w-[28px] h-[28px] bg-gray-500 text-white text-sm flex items-center justify-center hover:bg-green-700 disabled:opacity-50 disabled:bg-gray-500"
                      id="decrease-btn-${product.id}" ${cartQty <= 1 ? 'disabled' : ''}>
                <span class="leading-none">−</span>
              </button>
              <div class="w-[32px] h-[28px] flex items-center justify-center bg-gray-50 text-sm font-medium">
                <span id="qty-display-${product.id}">${cartQty}</span>
              </div>
              <button class="w-[28px] h-[28px] text-white text-sm flex items-center justify-center ${isOutOfStock ? 'bg-gray-500 opacity-50' : 'bg-green-600 hover:bg-green-700'}"
                      id="increase-btn-${product.id}" ${isOutOfStock ? 'disabled' : ''}>
                <span class="leading-none">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center space-x-3 flex-shrink-0">
        <div class="text-green-600 font-bold text-lg min-w-[60px] text-right">
          $${(product.price * cartQty).toFixed(2)}
        </div>
        <button class="w-9 h-9 flex items-center justify-center border border-red-200 rounded-md hover:bg-red-50 group">
          <img src="images/delete.svg" alt="Delete" class="w-5 h-5" />
        </button>
      </div>
    </div>
  `;
}

function toggleSelection(id, checked) {
  const product = productsInit.find(p => p.id === id);
  if (product) {
    product.selected = checked;
    renderCartList(productsInit);
  }
}

function renderCartList(products) {
  const container = document.getElementById("cart-list");
  container.innerHTML = products.map(p => renderCartItem(p)).join('');
}

renderCartList(productsInit);
