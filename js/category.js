// ==== categories.js (category rendering and dropdown toggle) ====

const categories = [
    { name: "Fruit & Vegetable", icon: "./images/fruit.svg", subs: ["Fruit", "Salad"] },
    { name: "Meat & Seafood", icon: "./images/fish.svg", subs: ["Meat", "Seafood"] },
    { name: "Dairy & Egg", icon: "./images/egg.svg", subs: ["Milk", "Egg"] },
    { name: "Snack & Drink", icon: "./images/snack.svg", subs: ["Snack", "Drink"] },
    { name: "Health & Wellness", icon: "./images/health.svg", subs: ["Health", "Wellness"] }
  ];
  
  function countProductsByTag(tagName) {
    return productsInit.filter(p => p.tag.includes(tagName)).length;
  }
  
  function renderCategories() {
    const container = document.getElementById("category-layout");
    container.innerHTML = "";
  
    categories.forEach((cat, index) => {
      const count = cat.subs.reduce((acc, sub) => acc + countProductsByTag(sub), 0);
      const id = `category-${index}`;
  
      const categoryHTML = `
        <div class="relative">
          <div onclick="toggleCategoryDropdown('${id}')"
            id="${id}-toggle"
            class="flex items-center justify-between px-3 py-3 border border-gray-200/80 rounded hover:bg-gray-100 transition cursor-pointer"
            style="box-shadow: 0px 4px 8px 0px #0a1a280b;">
            <div class="flex items-center">
              <div class="w-10 h-10 flex items-center justify-center">
                <img src="${cat.icon}" alt="${cat.name} Icon" class="w-8 h-8" />
              </div>
              <div class="ml-3 text-left">
                <h3 class="text-sm font-semibold text-gray-800">${cat.name}</h3>
                <p class="text-xs text-gray-400">${count} items</p>
              </div>
            </div>
            <svg id="${id}-arrow" class="arrow-icon w-5 h-5 text-gray-500 transform transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
  
          <div id="${id}-dropdown" class="absolute z-20 mt-2 w-full bg-white rounded-lg border border-gray-100 shadow-lg hidden">
            <div class="py-2">
              <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100">View all products</a>
              ${cat.subs.map(sub => `
                <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100">${sub}</a>
              `).join('')}
            </div>
          </div>
        </div>
      `;
  
      container.insertAdjacentHTML("beforeend", categoryHTML);
    });
  }
  function toggleCategoryDropdown(id) {
    const dropdown = document.getElementById(`${id}-dropdown`);
    const toggle = document.getElementById(`${id}-toggle`);
    const arrow = document.getElementById(`${id}-arrow`);
  
    const isOpen = !dropdown.classList.contains("hidden");
  
    // Đóng tất cả dropdown khác và reset style
    document.querySelectorAll('[id$="-dropdown"]').forEach(el => {
      el.classList.add("hidden");
    });
    document.querySelectorAll('[id$="-toggle"]').forEach(el => {
      el.classList.remove("border-green-500");
    });
    document.querySelectorAll('.arrow-icon').forEach(el => {
      el.classList.remove("rotate-180");
    });
  
    // Nếu đang đóng, mở dropdown hiện tại
    if (!isOpen) {
      dropdown.classList.remove("hidden");
      toggle.classList.add("border-green-500");
      arrow.classList.add("rotate-180");
  
      // Sự kiện click ra ngoài để đóng dropdown
      function handleClickOutside(event) {
        if (!dropdown.contains(event.target) && !toggle.contains(event.target)) {
          dropdown.classList.add("hidden");
          toggle.classList.remove("border-green-500");
          arrow.classList.remove("rotate-180");
          document.removeEventListener("click", handleClickOutside);
        }
      }
  
      // Thêm sự kiện sau 1 tick để không bị đóng ngay khi click toggle
      setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 0);
    }
  }
  
  // Filter dropdown toggle (different from category card)
  function toggleFilterDropdown() {
    const dropdown = document.getElementById("filter-dropdown");
    dropdown.classList.toggle("hidden");
  }
  
  // CSS:
  // .rotate-180 { transform: rotate(180deg); }
  