function loadHeaderAndInitCartBadge() {
    fetch("header.html")
      .then(res => res.text())
      .then(html => {
        document.getElementById("header-placeholder").innerHTML = html;
  
        // Wait for header to load and then update cart badge
        const checkExist = setInterval(() => {
          const cartBadge = document.getElementById("cart-count");
  
          if (cartBadge && typeof updateCartBadge === "function") {
            updateCartBadge();
            clearInterval(checkExist); // Ngừng kiểm tra sau khi đã chạy xong
          }
        }, 100); // kiểm tra mỗi 100ms
      })
      .catch(err => console.error("❌ Failed to load header:", err));
  }