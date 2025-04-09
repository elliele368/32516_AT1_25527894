let products = [];
let productsInit = [];

fetch('products.php')
  .then(response => response.json())
  .then(data => {
    productsInit = data;
    products = data;
    
    // Gọi lại các hàm khởi tạo
    initRenderProduct();
    initEvents();
    updateCartBadgeFromStorage();
  })
  .catch(err => {
    console.error("Failed to load products from PHP:", err);
  });

function getProductChose(){

    return producChose
    .filter((product) => product.quantity > 0)
    .map(({ id, quantity }) => ({ id, quantity }));

}
