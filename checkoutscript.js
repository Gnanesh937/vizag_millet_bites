document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("orderCart")) || {};
  let total = parseFloat(localStorage.getItem("orderTotal")) || 0;

  const orderItemsTbody = document.getElementById("order-items");
  const orderTotalP = document.getElementById("order-total");
  const checkoutForm = document.getElementById("checkout-form");

  function sanitize(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  }

  function formatQuantity(item) {
    if (item.product.type === "combo") {
      return `${item.quantity} Pack${item.quantity > 1 ? "s" : ""}`;
    } else {
      const unit = item.product.pricePer === 250 ? 250 : 100;
      if (item.quantity >= 1000) return (item.quantity / 1000).toFixed(2) + " kg";
      return item.quantity + " g";
    }
  }

  function computeItemTotal(item) {
    if (item.product.type === "combo") return item.quantity * item.product.price;
    const unit = item.product.pricePer === 250 ? 250 : 100;
    return (item.quantity / unit) * item.product.price;
  }

  if (Object.keys(cart).length === 0) {
    orderItemsTbody.innerHTML =
      `<tr><td colspan="3" style="text-align:center; padding:12px;">Your cart is empty.</td></tr>`;
    orderTotalP.textContent = "";
  } else {
    orderItemsTbody.innerHTML = "";
    for (const productName in cart) {
      const item = cart[productName];
      const itemTotal = computeItemTotal(item);
      const qtyText = formatQuantity(item);

      const tr = document.createElement("tr");

      const tdName = document.createElement("td");
      tdName.innerHTML = `<strong>${sanitize(productName)}</strong>`;

      const tdQty = document.createElement("td");
      tdQty.textContent = qtyText;

      const tdPrice = document.createElement("td");
      tdPrice.textContent = `₹${itemTotal.toFixed(2)}`;
      tdPrice.style.textAlign = "right";

      tr.appendChild(tdName);
      tr.appendChild(tdQty);
      tr.appendChild(tdPrice);

      orderItemsTbody.appendChild(tr);
    }

    orderTotalP.textContent = "Total: ₹" + total.toFixed(2);
  }

  checkoutForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (Object.keys(cart).length === 0) {
      alert("Your cart is empty. Please add items before checkout.");
      return;
    }

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const door = document.getElementById("door").value.trim();
    const street = document.getElementById("street").value.trim();
    const area = document.getElementById("area").value.trim();
    const nearby = document.getElementById("nearby").value.trim() || "";
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const pincode = document.getElementById("pincode").value.trim();

    const customer = { name, phone, email, door, street, area, nearby, city, state, pincode };

    const options = {
      key: "rzp_test_RGFvmNP1FiIT6V",
      amount: Math.round(total * 100),
      currency: "INR",
      name: "Millet Bites",
      description: "Order Payment",
      handler: function (response) {
        const orderSummary = { cart, total, customer, paymentId: response.razorpay_payment_id };
        localStorage.setItem("paymentSuccess", JSON.stringify(orderSummary));
        localStorage.removeItem("orderCart");
        localStorage.removeItem("orderTotal");
        window.location.href = "index.html#home";
      },
      prefill: { name, email, contact: phone },
      theme: { color: "#ff7043" }
    };

    const rzp = new Razorpay(options);
    rzp.open();

    rzp.on("payment.failed", function (response) {
      alert(`Payment failed: ${response.error.description}`);
      localStorage.setItem("paymentFailure", "true");
      window.location.href = "index.html#home";
    });
  });
});

function goBackToCart() {
  window.history.back();
}
