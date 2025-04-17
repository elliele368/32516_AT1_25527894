let products = [];
let productsInit = [];

// function initRenderProduct() {
//   console.log("Rendering products:", products);
//   // Add your rendering logic here
// }

// function initEvents() {
//   console.log("Setting up events");
//   // Add your event listener logic here
// }

// function updateCartBadgeFromStorage() {
//   console.log("Updating cart badge");
//   // Add your cart badge update logic here
// }

fetch('products.php')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    productsInit = deepFreeze(JSON.parse(JSON.stringify(data)));

    products = JSON.parse(JSON.stringify(data));
    initRenderProduct();
    // renderCategories(); // Assuming this function exists for rendering categories
    initEvents(); // Initialize events for products


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
function getOriginalProduct(productId) {
  const originalProduct = productsInit.find(p => p.id === productId);
  // Return a deep copy of the original product to prevent mutations
  return JSON.parse(JSON.stringify(
    originalProduct
));
}
function deepFreeze(object) {
  // Retrieve the property names defined on object
  const propNames = Object.getOwnPropertyNames(object);

  // Freeze properties before freezing self
  propNames.forEach(name => {
    const value = object[name];

    if (value && typeof value === "object") { 
      deepFreeze(value);
    }
  });

  return Object.freeze(object);
}