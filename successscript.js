document.addEventListener("DOMContentLoaded", () => {
  const orderSummary = JSON.parse(localStorage.getItem("paymentSuccess"));
  if (!orderSummary) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // --- Company Logo ---
  const logoUrl = "https://i.ibb.co/ZVh01dm/millet-logo.png"; // replace with your logo

  const addLogo = (callback) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      doc.addImage(img, "PNG", 14, 10, 30, 30); // x,y,width,height
      callback();
    };
    img.src = logoUrl;
  };

  const generatePDF = () => {
    // --- Header ---
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("Millet Bites", 50, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text("Healthy Millet Snacks", 50, 26);
    doc.text("Email: support@milletbites.com | Phone: +91 98765 43210", 50, 32);

    // Invoice meta
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("INVOICE", 150, 20);
    doc.setFontSize(10);
    doc.text("Date: " + new Date().toLocaleDateString(), 150, 26);
    doc.text("Invoice ID: " + orderSummary.paymentId, 150, 32);

    // --- Customer Details Table ---
    const c = orderSummary.customer;
    const customerTable = [
      ["Name", c.name],
      ["Phone", c.phone],
      ["Email", c.email],
      ["Address", `${c.door}, ${c.street}, ${c.area}`],
      ["City/State", `${c.city}, ${c.state}`],
      ["Pincode", c.pincode],
      ["Landmark", c.nearby || "-"]
    ];

    doc.autoTable({
      head: [["Customer Details", ""]],
      body: customerTable,
      startY: 50,
      theme: "grid",
      headStyles: { fillColor: [57, 136, 212], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 3 }
    });

    // --- Order Details Table ---
    const items = [];
    for (const name in orderSummary.cart) {
      const item = orderSummary.cart[name];

      // Fix: use same compute logic as checkout
      let itemTotal;
      if (item.product.type === "combo") {
        itemTotal = item.quantity * item.product.price;
      } else {
        const unit = item.product.pricePer === 250 ? 250 : 100;
        itemTotal = (item.quantity / unit) * item.product.price;
      }

      items.push([
        name,
        item.quantity.toString(),
        "₹" + itemTotal.toFixed(2)
      ]);
    }

    doc.autoTable({
      head: [["Item", "Quantity", "Price (₹)"]],
      body: items,
      startY: doc.lastAutoTable.finalY + 10,
      theme: "striped",
      headStyles: { fillColor: [57, 136, 212], textColor: 255 },
      styles: { fontSize: 10 }
    });

    // --- Totals Section ---
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.text("Subtotal:", 150, finalY);
    doc.text("₹" + (orderSummary.total.toFixed(2)), 180, finalY);

    // Example tax breakdown (optional)
    const gst = (orderSummary.total * 0.05).toFixed(2); // 5% GST
    const grandTotal = (orderSummary.total + parseFloat(gst)).toFixed(2);

    doc.text("GST (5%):", 150, finalY + 6);
    doc.text("₹" + gst, 180, finalY + 6);

    doc.setFontSize(13);
    doc.setTextColor(0, 102, 0);
    doc.text("Grand Total:", 150, finalY + 14);
    doc.text("₹" + grandTotal, 180, finalY + 14);

    // --- Footer ---
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("Thank you for choosing Millet Bites!", 14, finalY + 28);

    // Save PDF
    function savePDF() {
      doc.save("MilletBites_Invoice.pdf");
    }

    // Auto download + button download
    savePDF();
    document.getElementById("download-btn").addEventListener("click", savePDF);

    // Clear data
    localStorage.removeItem("paymentSuccess");
  };

  addLogo(generatePDF);
});
