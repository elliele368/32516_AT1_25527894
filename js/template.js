function renderTemplate(product, index) {
  const tagsHTML = product.tag.map(tag => `
    <span class="rounded bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-primary-800">${tag}</span>
  `).join('');

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
            (${product.displayUnit} / QTY: ${product.quantity})
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
        <button data-id="${product.id}" data-index="${index}" class="addButton w-full h-[40px] rounded-lg bg-green-600 px-5 text-sm font-medium text-white text-center hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed">
          Add to cart
        </button>
        <div class="hidden flex h-[40px] w-full overflow-hidden rounded-lg border border-gray-300 text-gray-900 quantitySelector">
          <button data-id="${product.id}" data-index="${index}" class="decreaseBtn w-[44px] bg-green-600 text-white hover:bg-green-700 flex items-center justify-center">
            <span class="text-xl leading-none">−</span>
          </button>
          <div class="flex grow items-center justify-center bg-gray-50 text-base font-medium">
            <span class="qty">1</span>
          </div>
          <button data-id="${product.id}" data-index="${index}" class="plusBtn w-[44px] bg-green-600 text-white hover:bg-green-700 flex items-center justify-center">
            <span class="text-xl leading-none">+</span>
          </button>
        </div>
      </div>
    </div>
  `;
}
