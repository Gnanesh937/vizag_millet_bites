document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  addToCartButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const type = btn.dataset.type;
      const unit = parseInt(btn.dataset.unit);

      let cart = JSON.parse(localStorage.getItem("orderCart")) || {};
      if (cart[name]) {
        cart[name].quantity += unit;
      } else {
        cart[name] = { product: { price, type, pricePer: unit }, quantity: unit };
      }

      localStorage.setItem("orderCart", JSON.stringify(cart));

      let total = Object.values(cart).reduce((sum, item) => {
        return sum + (item.product.price / item.product.pricePer) * item.quantity;
      }, 0);

      localStorage.setItem("orderTotal", total);
      alert(`${name} added to cart!`);
    });
  });

  const contactForm = document.getElementById("contact-form");
  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    contactForm.reset();
  });
});
