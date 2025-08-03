import { products, products3 } from './products.js';
import { cart, addCombo, addWeight, adjustCombo, adjustWeight, clearCart } from './cart.js';

export function renderProducts() {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = '';

  products
    .filter(product => product.name.toLowerCase().includes("combo"))
    .forEach(product => {
      const div = document.createElement("div");
      div.className = "product-card";
      div.innerHTML = `
        <div class="discount-badge">20% OFF</div>
        <img src="${product.image}" alt="${product.name}" />
        <h4>${product.name}</h4>
        <p>₹${product.price} - pack</p>
        <div class="quantity-controls">
          <button onclick="window.handleRemoveCombo('${product.name}')">-</button>
          <select id="select-${product.name}">
            ${[1, 2, 3, 5].map(p => `<option value="${p}">${p} Pack${p > 1 ? 's' : ''}</option>`).join('')}
          </select>
          <button onclick="window.handleAddCombo('${product.name}')">+</button>
        </div>
        <div class="cart-status" id="status-${product.name}"></div>
      `;
      grid.appendChild(div);
    });

  products
    .filter(product => !product.name.toLowerCase().includes("combo"))
    .forEach(product => {
      const div = document.createElement("div");
      div.className = "product-card";
      div.innerHTML = `
        <div class="discount-badge">20% OFF</div>
        <img src="${product.image}" alt="${product.name}" />
        <h4>${product.name}</h4>
        <p>₹${product.price} - 100g</p>
        <div class="quantity-controls">
          <button onclick="window.handleRemoveWeight('${product.name}')">-</button>
          <select id="select-${product.name}">
            ${[
              { value: 100, label: "100g" },
              { value: 250, label: "250g" },
              { value: 500, label: "500g" },
              { value: 1000, label: "1KG" },
              { value: 2000, label: "2KG" },
              { value: 5000, label: "5KG" }
            ].map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
          </select>
          <button onclick="window.handleAddWeight('${product.name}')">+</button>
        </div>
        <div class="cart-status" id="status-${product.name}"></div>
      `;
      grid.appendChild(div);
    });

  products3
    .forEach(product => {
      const div = document.createElement("div");
      div.className = "product-card";
      div.innerHTML = `
        <div class="discount-badge">20% OFF</div>
        <img src="${product.image}" alt="${product.name}" />
        <h4>${product.name}</h4>
        <p>₹${product.price} - 100g</p>
        <div class="quantity-controls">
          <button onclick="window.handleRemoveWeight3('${product.name}')">-</button>
          <select id="select-${product.name}">
            ${[
              { value: 250, label: "250g" },
              { value: 500, label: "500g" },
              { value: 1000, label: "1KG" },
              { value: 2000, label: "2KG" },
              { value: 5000, label: "5KG" }
            ].map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
          </select>
          <button onclick="window.handleAddWeight3('${product.name}')">+</button>
        </div>
        <div class="cart-status" id="status-${product.name}"></div>
      `;
      grid.appendChild(div);
    });
}

export function updateStatus(productName) {
  const status = document.getElementById(`status-${productName}`);
  if (!cart[productName]) {
    status.textContent = "";
    return;
  }
  const cartItem = cart[productName];
  if (cartItem.qty !== undefined) {
    status.textContent = `In cart: ${cartItem.qty} Pack${cartItem.qty > 1 ? 's' : ''}`;
  } else if (cartItem.grams !== undefined) {
    status.textContent = `In cart: ${cartItem.grams >= 1000 ? (cartItem.grams / 1000).toFixed(2) + ' kg' : cartItem.grams + ' g'}`;
  }
}

export function updateCartCount() {
  const count = Object.keys(cart).length;
  document.getElementById("cartCount").textContent = count;
  const cartCount2 = document.getElementById("cartCount2");
  if (cartCount2) cartCount2.textContent = count;
}

export function updateCartDisplay() {
  const cartItemsContainer = document.getElementById("panel-cart-items");
  let total = 0;

  if (Object.keys(cart).length === 0) {
    cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    document.querySelector(".cart-summary p").textContent = `Total: ₹0.00`;
    return;
  }

  let cartItemsHTML = '';
  for (const item in cart) {
    const cartItem = cart[item];
    let itemTotal = 0;
    let qtyControls = "";

    if (cartItem.qty !== undefined) {
      itemTotal = cartItem.qty * cartItem.price;
      qtyControls = `
        <button onclick="window.handleAdjustCombo('${item}', -1)">-</button>
        ${cartItem.qty} Pack
        <button onclick="window.handleAdjustCombo('${item}', 1)">+</button>
      `;
    } else if (cartItem.grams !== undefined) {
      itemTotal = (cartItem.grams / 100) * cartItem.price;
      qtyControls = `
        <button onclick="window.handleAdjustWeight('${item}', -100)">-</button>
        ${cartItem.grams >= 1000 ? (cartItem.grams / 1000).toFixed(2) + ' kg' : cartItem.grams + ' g'}
        <button onclick="window.handleAdjustWeight('${item}', 100)">+</button>
      `;
    }

    total += itemTotal;

    cartItemsHTML += `
      <div class="cart-item">
        <div class="cart-item-name">${item}</div>
        <div class="cart-item-qty">${qtyControls}</div>
        <div class="cart-item-price">₹${itemTotal.toFixed(2)}</div>
      </div>
    `;
  }

  cartItemsContainer.innerHTML = cartItemsHTML;
  document.querySelector(".cart-summary p").textContent = `Total: ₹${total.toFixed(2)}`;
}

// --- Cart Handlers for UI ---
window.handleAddCombo = function(productName) {
  const product = products.find(p => p.name === productName);
  const qty = parseInt(document.getElementById(`select-${productName}`).value);
  addCombo(productName, product.price, qty);
  updateStatus(productName);
  updateCartDisplay();
  updateCartCount();
};

window.handleRemoveCombo = function(productName) {
  const product = products.find(p => p.name === productName);
  const qty = parseInt(document.getElementById(`select-${productName}`).value);
  addCombo(productName, product.price, -qty);
  updateStatus(productName);
  updateCartDisplay();
  updateCartCount();
};

window.handleAddWeight = function(productName) {
  const product = products.find(p => p.name === productName);
  const grams = parseFloat(document.getElementById(`select-${productName}`).value);
  addWeight(productName, product.price, grams);
  updateStatus(productName);
  updateCartDisplay();
  updateCartCount();
};

window.handleRemoveWeight = function(productName) {
  const product = products.find(p => p.name === productName);
  const grams = parseFloat(document.getElementById(`select-${productName}`).value);
  addWeight(productName, product.price, -grams);
  updateStatus(productName);
  updateCartDisplay();
  updateCartCount();
};

window.handleAddWeight3 = function(productName) {
  const product = products3.find(p => p.name === productName);
  const grams = parseFloat(document.getElementById(`select-${productName}`).value);
  addWeight(productName, product.price, grams);
  updateStatus(productName);
  updateCartDisplay();
  updateCartCount();
};

window.handleRemoveWeight3 = function(productName) {
  const product = products3.find(p => p.name === productName);
  const grams = parseFloat(document.getElementById(`select-${productName}`).value);
  addWeight(productName, product.price, -grams);
  updateStatus(productName);
  updateCartDisplay();
  updateCartCount();
};

window.handleAdjustCombo = function(productName, adjustment) {
  adjustCombo(productName, adjustment);
  updateStatus(productName);
  updateCartDisplay();
  updateCartCount();
};

window.handleAdjustWeight = function(productName, adjustment) {
  adjustWeight(productName, adjustment);
  updateStatus(productName);
  updateCartDisplay();
  updateCartCount();
};

// --- Cart Panel ---
export function toggleCartPanel() {
  document.getElementById("cartPanel").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
}

// --- Order ---
export function sendOrder() {
  if (Object.keys(cart).length === 0) {
    alert("Your cart is empty!");
    return;
  }
  let msg = "Hello! I'd like to order:\n";
  for (const item in cart) {
    const cartItem = cart[item];
    if (cartItem.qty !== undefined) {
      msg += `${item}: ${cartItem.qty} Pack\n`;
    } else if (cartItem.grams !== undefined) {
      msg += `${item}: ${cartItem.grams >= 1000 ? (cartItem.grams / 1000).toFixed(2) + ' kg' : cartItem.grams + ' g'}\n`;
    }
  }
  let total = 0;
  for (const item in cart) {
    const cartItem = cart[item];
    if (cartItem.qty !== undefined) {
      total += cartItem.qty * cartItem.price;
    } else if (cartItem.grams !== undefined) {
      total += (cartItem.grams / 100) * cartItem.price;
    }
  }
  msg += `\nTotal: ₹${total.toFixed(2)}\n\nPlease confirm my order.`;
  const encodedMsg = encodeURIComponent(msg);
  window.open(`https://wa.me/919949840365?text=${encodedMsg}`, "_blank");
}

// --- Initialization ---
export function setupUI() {
  renderProducts();
  updateCartDisplay();
  updateCartCount();

  document.getElementById("cartIcon").addEventListener("click", toggleCartPanel);
  document.getElementById("cartIcon2").addEventListener("click", toggleCartPanel);
  document.getElementById("closeCart").addEventListener("click", toggleCartPanel);
  document.getElementById("overlay").addEventListener("click", toggleCartPanel);

  document.querySelector(".clear").addEventListener("click", () => {
    clearCart();
    renderProducts();
    updateCartDisplay();
    updateCartCount();
  });

  document.querySelector(".order").addEventListener("click", sendOrder);
}