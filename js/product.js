let products = [];
let productsInit = [];

function initRenderProduct() {
  console.log("Rendering products:", products);
  // Add your rendering logic here
}

function initEvents() {
  console.log("Setting up events");
  // Add your event listener logic here
}

function updateCartBadgeFromStorage() {
  console.log("Updating cart badge");
  // Add your cart badge update logic here
}

fetch('products.php')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    productsInit = data;
    products = data;
    
    initRenderProduct();
    initEvents();
    updateCartBadgeFromStorage();
    
    // Ensure categories render after productsInit is ready
    if (typeof renderCategories === "function") {
      renderCategories();
    }
  })
  .catch(err => {
    console.error("Failed to load products from PHP:", err);
  });

function getProductChose(){
  return productChose
      .filter((product) => product.quantity > 0)
      .map(({ id, quantity }) => ({ id, quantity }));
}