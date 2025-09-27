document.addEventListener("DOMContentLoaded", () => {
  const orderSummary = JSON.parse(localStorage.getItem("paymentSuccess"));
  if (!orderSummary) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // --- Company Logo ---
  // Replace this with your base64 logo OR an online image URL converted to Base64
  const logoUrl = "https://i.ibb.co/ZVh01dm/millet-logo.png"; // Example logo

  const addLogo = (callback) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      doc.addImage(img, "PNG", 14, 10, 30, 30); // x, y, width, height
      callback();
    };
    img.src = logoUrl;
  };

  const generatePDF = () => {
    // Company Info
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("Millet Bites", 50, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text("Healthy Millet Snacks", 50, 26);
    doc.text("Email: support@milletbites.com | Phone: +91 98765 43210", 50, 32);

    // Invoice details
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Invoice", 150, 20);
    doc.setFontSize(10);
    doc.text("Date: " + new Date().toLocaleDateString(), 150, 26);
    doc.text("Invoice ID: " + orderSummary.paymentId, 150, 32);

    // --- Customer Details in Table ---
    const customer = orderSummary.customer;
    const customerTable = [
      ["Name", customer.name],
      ["Phone", customer.phone],
      ["Email", customer.email],
      ["Address", `${customer.door}, ${customer.street}, ${customer.area}`],
      ["City/State", `${customer.city}, ${customer.state}`],
      ["Pincode", customer.pincode],
      ["Landmark", customer.nearby || "-"]
    ];

    doc.autoTable({
      head: [["Customer Details", ""]],
      body: customerTable,
      startY: 50,
      theme: "grid",
      headStyles: { fillColor: [57, 136, 212], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 3 }
    });

    // --- Order Details ---
    const items = [];
    for (const name in orderSummary.cart) {
      const item = orderSummary.cart[name];
      const qty = item.quantity;
      const price = (item.product.price * qty).toFixed(2);
      items.push([name, qty.toString(), "₹" + price]);
    }

    doc.autoTable({
      head: [["Item", "Quantity", "Price (₹)"]],
      body: items,
      startY: doc.lastAutoTable.finalY + 10,
      theme: "grid",
      headStyles: { fillColor: [57, 136, 212], textColor: 255 },
      styles: { fontSize: 10 }
    });

    // --- Total ---
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Total: ₹" + orderSummary.total.toFixed(2), 150, finalY);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("Thank you for choosing Millet Bites!", 14, finalY + 20);

    // Save PDF
    function savePDF() {
      doc.save("MilletBites_Invoice.pdf");
    }

    // Auto download on success
    savePDF();

    // Manual download on button click
    document.getElementById("download-btn").addEventListener("click", savePDF);

    // Clear success data
    localStorage.removeItem("paymentSuccess");
  };

  // Run with logo
  addLogo(generatePDF);
});
