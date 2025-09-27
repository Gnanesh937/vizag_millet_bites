document.addEventListener("DOMContentLoaded", () => {
  const cartItemsTbody = document.getElementById("cart-items");
  const cartTotalP = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");

  let cart = JSON.parse(localStorage.getItem("orderCart")) || {};
  let total = parseFloat(localStorage.getItem("orderTotal")) || 0;

  function renderCart() {
    cartItemsTbody.innerHTML = "";
    if (Object.keys(cart).length === 0) {
      cartItemsTbody.innerHTML = `<tr><td colspan="4">Your cart is empty.</td></tr>`;
      cartTotalP.textContent = "";
      checkoutBtn.disabled = true;
      return;
    }

    for (const name in cart) {
      const item = cart[name];
      const row = document.createElement("tr");

      const tdName = document.createElement("td");
      tdName.textContent = name;

      const tdQty = document.createElement("td");
      tdQty.textContent = item.quantity;

      const tdPrice = document.createElement("td");
      const price = (item.product.price / item.product.pricePer) * item.quantity;
      tdPrice.textContent = `₹${price.toFixed(2)}`;

      const tdRemove = document.createElement("td");
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "X";
      removeBtn.style.cursor = "pointer";
      removeBtn.addEventListener("click", () => {
        delete cart[name];
        localStorage.setItem("orderCart", JSON.stringify(cart));
        total = Object.values(cart).reduce((sum, i) => sum + (i.product.price / i.product.pricePer) * i.quantity, 0);
        localStorage.setItem("orderTotal", total);
        renderCart();
      });
      tdRemove.appendChild(removeBtn);

      row.appendChild(tdName);
      row.appendChild(tdQty);
      row.appendChild(tdPrice);
      row.appendChild(tdRemove);

      cartItemsTbody.appendChild(row);
    }
    cartTotalP.textContent = `Total: ₹${total.toFixed(2)}`;
    checkoutBtn.disabled = false;
  }

  renderCart();

  checkoutBtn.addEventListener("click", () => {
    window.location.href = "checkout.html";
  });
});

function goBack() {
  window.history.back();
}
