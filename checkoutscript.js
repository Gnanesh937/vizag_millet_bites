
// ✅ Get order details from localStorage
var total = parseFloat(localStorage.getItem("orderTotal")) || 0;
var orderCart = JSON.parse(localStorage.getItem("orderCart")) || {};

// ✅ Render order summary
function renderOrderSummary() {
  const orderItemsDiv = document.getElementById("order-items");
  const orderTotalP = document.getElementById("order-total");

  if (Object.keys(orderCart).length === 0) {
    orderItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    orderTotalP.textContent = "Total: ₹0.00";
    return;
  }

  let html = "<ul>";
  for (const productName in orderCart) {
    const item = orderCart[productName];

    // Quantity text
    let qtyText = item.product.type === "combo"
      ? `${item.quantity} Pack${item.quantity > 1 ? "s" : ""}`
      : item.quantity >= 1000
        ? (item.quantity / 1000).toFixed(2) + " kg"
        : item.quantity + " g";

    // Item price
    let itemPrice = 0;
    if (item.product.type === "combo") {
      itemPrice = item.quantity * item.product.price;
    } else {
      const unit = item.product.pricePer === 250 ? 250 : 100;
      itemPrice = (item.quantity / unit) * item.product.price;
    }

    html += `<li>${productName} - ${qtyText} - ₹${itemPrice.toFixed(2)}</li>`;
  }
  html += "</ul>";

  orderItemsDiv.innerHTML = html;
  orderTotalP.textContent = `Total: ₹${total.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", renderOrderSummary);

// ✅ Handle payment
document.getElementById("checkout-form").addEventListener("submit", function (e) {
  e.preventDefault();

  var customer = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    door: document.getElementById("door").value,
    street: document.getElementById("street").value,
    area: document.getElementById("area").value,
    nearby: document.getElementById("nearby").value,
    city: document.getElementById("city").value,
    state: document.getElementById("state").value,
    pincode: document.getElementById("pincode").value,
  };

  if (total <= 0) {
    alert("Invalid total amount!");
    return;
  }

  var options = {
    key: "rzp_test_RGFvmNP1FiIT6V", // Replace with your Razorpay Key
    amount: parseInt(total) * 100, // in paise
    currency: "INR",
    name: "Millet Bites",
    description: "Product Purchase",
    handler: function (response) {
      // ✅ Prepare order data for Google Sheets
      const orderData = {
        customer: customer,
        paymentId: response.razorpay_payment_id,
        total: total,
        items: Object.keys(orderCart).map(name => {
          const item = orderCart[name];
          let itemPrice = item.product.type === "combo"
            ? item.quantity * item.product.price
            : (item.quantity / (item.product.pricePer === 250 ? 250 : 100)) * item.product.price;

          return {
            name: name,
            quantity: item.product.type === "combo"
              ? `${item.quantity} Pack${item.quantity > 1 ? "s" : ""}`
              : item.quantity >= 1000
                ? (item.quantity / 1000).toFixed(2) + " kg"
                : item.quantity + " g",
            price: itemPrice
          };
        })
      };

      // ✅ Send data to Google Sheets
fetch("https://script.google.com/macros/s/AKfycbwGJe2hfkBYQraE9P761sKTmIOfK9E1fd_CCbhMMCkhRGfhXTPiQJhw5iSvRUXiZn7X/exec", {
  method: "POST",
  body: JSON.stringify({
    customer: customer,
    paymentId: response.razorpay_payment_id,
    total: total,
    items: Object.keys(orderCart).map(name => {
      const item = orderCart[name];
      let itemPrice = item.product.type === "combo"
        ? item.quantity * item.product.price
        : (item.quantity / (item.product.pricePer === 250 ? 250 : 100)) * item.product.price;

      return {
        name: name,
        quantity: item.quantity >= 1000 ? (item.quantity/1000).toFixed(2) + " kg" : item.quantity + " g",
        price: itemPrice
      };
    })
  }),
  headers: { "Content-Type": "application/json" }
})
.then(res => res.json())
.then(data => console.log("📧 Emails sent:", data))
.catch(err => console.error("❌ Email error:", err));

      // ✅ Save success details in localStorage
      localStorage.setItem("paymentSuccess", JSON.stringify({
        customer: customer,
        cart: orderCart,
        total: total,
        paymentId: response.razorpay_payment_id
      }));

      // ✅ Clear local cart storage
      localStorage.removeItem("orderTotal");
      localStorage.removeItem("orderCart");

      // Redirect to home page
      window.location.href = "index.html";
    },
    prefill: {
      name: customer.name,
      email: customer.email,
      contact: customer.phone,
    },
    theme: {
      color: "#3399cc",
    },
    modal: {
      ondismiss: function () {
        localStorage.setItem("paymentFailure", "true");
        window.location.href = "index.html";
      }
    }
  };

  var rzp1 = new Razorpay(options);
  rzp1.open();
});
// ✅ Get order details from localStorage
var total = parseFloat(localStorage.getItem("orderTotal")) || 0;
var orderCart = JSON.parse(localStorage.getItem("orderCart")) || {};

// ✅ Render order summary
function renderOrderSummary() {
  const orderItemsDiv = document.getElementById("order-items");
  const orderTotalP = document.getElementById("order-total");

  if (Object.keys(orderCart).length === 0) {
    orderItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    orderTotalP.textContent = "Total: ₹0.00";
    return;
  }

  let html = "<ul>";
  for (const productName in orderCart) {
    const item = orderCart[productName];

    // Quantity text
    let qtyText = item.product.type === "combo"
      ? `${item.quantity} Pack${item.quantity > 1 ? "s" : ""}`
      : item.quantity >= 1000
        ? (item.quantity / 1000).toFixed(2) + " kg"
        : item.quantity + " g";

    // Item price
    let itemPrice = 0;
    if (item.product.type === "combo") {
      itemPrice = item.quantity * item.product.price;
    } else {
      const unit = item.product.pricePer === 250 ? 250 : 100;
      itemPrice = (item.quantity / unit) * item.product.price;
    }

    html += `<li>${productName} - ${qtyText} - ₹${itemPrice.toFixed(2)}</li>`;
  }
  html += "</ul>";

  orderItemsDiv.innerHTML = html;
  orderTotalP.textContent = `Total: ₹${total.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", renderOrderSummary);

// ✅ Handle payment
document.getElementById("checkout-form").addEventListener("submit", function (e) {
  e.preventDefault();

  var customer = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    door: document.getElementById("door").value,
    street: document.getElementById("street").value,
    area: document.getElementById("area").value,
    nearby: document.getElementById("nearby").value,
    city: document.getElementById("city").value,
    state: document.getElementById("state").value,
    pincode: document.getElementById("pincode").value,
  };

  if (total <= 0) {
    alert("Invalid total amount!");
    return;
  }

  var options = {
    key: "rzp_test_RGFvmNP1FiIT6V", // Replace with your Razorpay Key
    amount: parseInt(total) * 100, // in paise
    currency: "INR",
    name: "Millet Bites",
    description: "Product Purchase",
    handler: function (response) {
      // ✅ Prepare order data for Google Sheets
      const orderData = {
        customer: customer,
        paymentId: response.razorpay_payment_id,
        total: total,
        items: Object.keys(orderCart).map(name => {
          const item = orderCart[name];
          let itemPrice = item.product.type === "combo"
            ? item.quantity * item.product.price
            : (item.quantity / (item.product.pricePer === 250 ? 250 : 100)) * item.product.price;

          return {
            name: name,
            quantity: item.product.type === "combo"
              ? `${item.quantity} Pack${item.quantity > 1 ? "s" : ""}`
              : item.quantity >= 1000
                ? (item.quantity / 1000).toFixed(2) + " kg"
                : item.quantity + " g",
            price: itemPrice
          };
        })
      };

  handler: function (response) {
  var orderData = {
    customer: customer,
    cart: orderCart,
    total: total,
    paymentId: response.razorpay_payment_id
  };

      // ✅ Send data to Google Sheets
fetch("https://script.google.com/macros/s/AKfycbwpKhup4OIysWqDG4fw2nYq5M9gh2hWv51AIsx9UQQU_RZj_1IRQqTR5nABQ8-yHneg/exec", {
  method: "POST",
  body: JSON.stringify({
    customer: customer,
    paymentId: response.razorpay_payment_id,
    total: total,
    items: Object.keys(orderCart).map(name => {
      const item = orderCart[name];
      let itemPrice = item.product.type === "combo"
        ? item.quantity * item.product.price
        : (item.quantity / (item.product.pricePer === 250 ? 250 : 100)) * item.product.price;

      return {
        name: name,
        quantity: item.quantity >= 1000 ? (item.quantity/1000).toFixed(2) + " kg" : item.quantity + " g",
        price: itemPrice
      };
    })
  }),
  headers: { "Content-Type": "application/json" }
})
.then(res => res.json())
.then(data => console.log("📧 Emails sent:", data))
.catch(err => console.error("❌ Email error:", err));

      // ✅ Save success details in localStorage
      localStorage.setItem("paymentSuccess", JSON.stringify({
        customer: customer,
        cart: orderCart,
        total: total,
        paymentId: response.razorpay_payment_id
      }));

      // ✅ Clear local cart storage
      localStorage.removeItem("orderTotal");
      localStorage.removeItem("orderCart");

      // Redirect to home page
      window.location.href = "index.html";
    },
    prefill: {
      name: customer.name,
      email: customer.email,
      contact: customer.phone,
    },
    theme: {
      color: "#3399cc",
    },
    modal: {
      ondismiss: function () {
        localStorage.setItem("paymentFailure", "true");
        window.location.href = "index.html";
      }
    }
  };

  var rzp1 = new Razorpay(options);
  rzp1.open();
});
