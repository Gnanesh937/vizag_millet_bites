document.addEventListener("DOMContentLoaded", () => {
  const orderData = JSON.parse(localStorage.getItem("paymentSuccess"));
  if (!orderData) {
    document.getElementById("order-summary").innerHTML = "<p>No order found.</p>";
    return;
  }

  const { cart, total, customer, paymentId } = orderData;

  let summaryHTML = `
    <p><strong>Payment ID:</strong> ${paymentId}</p>
    <p><strong>Name:</strong> ${customer.name}</p>
    <p><strong>Phone:</strong> ${customer.phone}</p>
    <p><strong>Email:</strong> ${customer.email}</p>
    <p><strong>Address:</strong><br>
    ${customer.door}, ${customer.street}, ${customer.area},<br>
    ${customer.city}, ${customer.state} - ${customer.pincode}<br>
    Nearby: ${customer.nearby || "N/A"}</p>
    <h3>Order Items:</h3>
    <ul>
  `;

  for (const productName in cart) {
    const item = cart[productName];
    const itemTotal = computeItemTotal(item);
    summaryHTML += `<li>${productName} - ${formatQuantity(item)} : ₹${itemTotal.toFixed(2)}</li>`;
  }

  summaryHTML += `</ul><p><strong>Total:</strong> ₹${total.toFixed(2)}</p>`;

  document.getElementById("order-summary").innerHTML = summaryHTML;

  downloadPDF(); // Auto-download on load
});

function formatQuantity(item) {
  if (item.product.type === "combo") {
    return `${item.quantity} Pack${item.quantity > 1 ? "s" : ""}`;
  } else {
    if (item.quantity >= 1000) {
      return (item.quantity / 1000).toFixed(2) + " kg";
    } else {
      return item.quantity + " g";
    }
  }
}

function computeItemTotal(item) {
  if (item.product.type === "combo") {
    return item.quantity * item.product.price;
  } else {
    const unit = item.product.pricePer === 250 ? 250 : 100;
    return (item.quantity / unit) * item.product.price;
  }
}

function downloadPDF() {
  const orderData = JSON.parse(localStorage.getItem("paymentSuccess"));
  if (!orderData) return;

  const { cart, total, customer, paymentId } = orderData;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Millet Bites - Invoice", 20, 20);

  doc.setFontSize(12);
  doc.text(`Payment ID: ${paymentId}`, 20, 30);
  doc.text(`Name: ${customer.name}`, 20, 40);
  doc.text(`Phone: ${customer.phone}`, 20, 50);
  doc.text(`Email: ${customer.email}`, 20, 60);

  doc.text("Address:", 20, 70);
  doc.text(
    `${customer.door}, ${customer.street}, ${customer.area},\n${customer.city}, ${customer.state} - ${customer.pincode}\nNearby: ${customer.nearby || "N/A"}`,
    20,
    80
  );

  doc.text("Order Details:", 20, 110);

  let y = 120;
  for (const productName in cart) {
    const item = cart[productName];
    const itemTotal = computeItemTotal(item);
    doc.text(`${productName} - ${formatQuantity(item)} : ₹${itemTotal.toFixed(2)}`, 20, y);
    y += 10;
  }

  doc.text(`Total: ₹${total.toFixed(2)}`, 20, y + 10);

  doc.save(`MilletBites_Invoice_${paymentId}.pdf`);
}
