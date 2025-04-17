// Biến lưu trữ trạng thái filter
let activeFilters = new Set();

// Hàm render checkbox cho mỗi category
function renderCategoryFilter(category, index) {
  const groupId = `cat-${index}`;
  return `
    <div class="space-y-2">
      <label class="flex items-center">
        <input type="checkbox" 
               id="${groupId}" 
               class="w-4 h-4 accent-green-600"
               onchange="toggleCategory('${category.name}', ${index})" />
        <span class="ml-2 text-sm font-medium text-gray-700">${category.name}</span>
        <span class="ml-auto text-xs text-gray-500">(${countProductsForCategory(category)})</span>
      </label>
      <div class="ml-6 space-y-1">
        ${category.subs.map((sub, subIndex) => `
          <label class="flex items-center">
            <input type="checkbox" 
                   id="${groupId}-sub-${subIndex}"
                   class="w-4 h-4 accent-green-600"
                   onchange="toggleSubcategory('${sub}', '${category.name}', ${index}, ${subIndex})" />
            <span class="ml-2 text-sm text-gray-600">${sub}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `;
}

// Hàm toggle category
function toggleCategory(categoryName, index) {
  const groupId = `cat-${index}`;
  const parentCheckbox = document.getElementById(groupId);
  const isChecked = parentCheckbox.checked;

  if (isChecked) {
    activeFilters.add(categoryName);
    // Check tất cả subcategories
    const category = categories[index];
    category.subs.forEach((sub, subIndex) => {
      const subCheckbox = document.getElementById(`${groupId}-sub-${subIndex}`);
      if (subCheckbox) {
        subCheckbox.checked = true;
        activeFilters.add(sub);
      }
    });
  } else {
    activeFilters.delete(categoryName);
    // Uncheck tất cả subcategories
    const category = categories[index];
    category.subs.forEach((sub, subIndex) => {
      const subCheckbox = document.getElementById(`${groupId}-sub-${subIndex}`);
      if (subCheckbox) {
        subCheckbox.checked = false;
        activeFilters.delete(sub);
      }
    });
  }
  updateProductDisplay();
}

// Hàm toggle subcategory
function toggleSubcategory(subName, categoryName, catIndex, subIndex) {
  const groupId = `cat-${catIndex}`;
  const subCheckbox = document.getElementById(`${groupId}-sub-${subIndex}`);
  const parentCheckbox = document.getElementById(groupId);
  
  if (subCheckbox.checked) {
    activeFilters.add(subName);
    // Kiểm tra nếu tất cả subcategories được check thì check category
    const category = categories[catIndex];
    const allSubsChecked = category.subs.every((sub, idx) => 
      document.getElementById(`${groupId}-sub-${idx}`).checked
    );
    if (allSubsChecked) {
      parentCheckbox.checked = true;
      activeFilters.add(categoryName);
    }
  } else {
    activeFilters.delete(subName);
    // Nếu có một sub bị uncheck thì uncheck category
    parentCheckbox.checked = false;
    activeFilters.delete(categoryName);
  }
  updateProductDisplay();
}

// Hàm lọc và hiển thị sản phẩm
function updateProductDisplay() {
  const container = document.getElementById('product-layout');
  const countElement = document.getElementById('product-count');
  
  // Cập nhật tiêu đề dựa trên bộ lọc đang chọn
  const titleElement = document.getElementById('category-title');
  if (activeFilters.size > 0) {
    const selectedCategories = categories
      .filter(cat => activeFilters.has(cat.name))
      .map(cat => cat.name);
    if (selectedCategories.length === 1) {
      titleElement.textContent = selectedCategories[0];
    } else if (selectedCategories.length > 1) {
      titleElement.textContent = 'Filtered Categories';
    } else {
      // Nếu không có category chính, kiểm tra subcategory đang chọn và lấy category cha
      let subMatched = false;
      categories.forEach(cat => {
        cat.subs.forEach(sub => {
          if (activeFilters.has(sub)) {
            titleElement.textContent = sub;
            subMatched = true;
          }
        });
      });
      if (!subMatched) titleElement.textContent = 'All Categories';
    }
  } else {
    titleElement.textContent = 'All Categories';
  }

  // Nếu không có filter nào được chọn, hiển thị tất cả
  let filteredProducts = productsInit;
  
  if (activeFilters.size > 0) {
    filteredProducts = productsInit.filter(product => 
      product.tag.some(tag => 
        activeFilters.has(tag) || 
        categories.some(cat => 
          activeFilters.has(cat.name) && 
          cat.subs.some(sub => product.tag.includes(sub))
        )
      )
    );
  }
  products = JSON.parse(JSON.stringify(filteredProducts));

  // Cập nhật số lượng sản phẩm
  countElement.textContent = `${filteredProducts.length} products`;
  
  // Render sản phẩm
  container.innerHTML = filteredProducts.length > 0 
    ? filteredProducts.map((product, index) => renderTemplate(product, index)).join('')
    : '<div class="col-span-full text-center py-8 text-gray-500">No products found</div>';

  // Khởi tạo lại các event listeners cho sản phẩm
  if (typeof initEvents === 'function') {
    initEvents();
  }
  // Khởi tạo lại sự kiện modal
  if (typeof updateCartBadgeFromStorage === 'function') {
    updateCartBadgeFromStorage();
  }

  if (typeof initializeModalEvents === 'function') {
    // Modal events được khởi tạo bên trong openProductModal nên không cần init lại
  }

  if (typeof openProductModal !== 'function') {
    console.warn('Modal function openProductModal not available');
  }
}

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', async () => {
  // Chờ sản phẩm load trước khi hiển thị (nếu productsInit được gán từ file khác thì đảm bảo đã được load)
  if (!productsInit || productsInit.length === 0) {
    // Đợi 100ms mỗi lần để xem dữ liệu có sẵn chưa
    for (let i = 0; i < 20; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      if (productsInit && productsInit.length > 0) break;
    }
  }

  // Render filter sidebar
  const filterContainer = document.getElementById('filter-sidebar');
  if (filterContainer) {
    filterContainer.innerHTML = categories.map((cat, index) =>
      renderCategoryFilter(cat, index)
    ).join('');
  }

  // Kiểm tra URL parameters
  const params = new URLSearchParams(window.location.search);
  const categoryParam = params.get('category');
  const subcategoryParam = params.get('subcategory');

  const titleElement = document.getElementById('category-title');

  if (categoryParam) {
    titleElement.textContent = categoryParam;
    activeFilters.add(categoryParam);

    const categoryIndex = categories.findIndex(c => c.name === categoryParam);
    if (categoryIndex !== -1) {
      const groupId = `cat-${categoryIndex}`;
      const parentCheckbox = document.getElementById(groupId);
      if (parentCheckbox) {
        parentCheckbox.checked = true;
        categories[categoryIndex].subs.forEach((sub, subIndex) => {
          const subCheckbox = document.getElementById(`${groupId}-sub-${subIndex}`);
          if (subCheckbox) {
            subCheckbox.checked = true;
            activeFilters.add(sub);
          }
        });
      }
    }
  }

  if (subcategoryParam) {
    titleElement.textContent = subcategoryParam;
    activeFilters.add(subcategoryParam);

    categories.forEach((cat, catIndex) => {
      const subIndex = cat.subs.indexOf(subcategoryParam);
      if (subIndex !== -1) {
        const groupId = `cat-${catIndex}`;
        const subCheckbox = document.getElementById(`${groupId}-sub-${subIndex}`);
        if (subCheckbox) {
          subCheckbox.checked = true;
        }
      }
    });
  }

  // Hiển thị sản phẩm đã lọc
  updateProductDisplay();
});