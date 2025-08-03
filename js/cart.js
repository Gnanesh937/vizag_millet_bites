export const cart = {};

export function addCombo(productName, price, qty) {
  if (!cart[productName]) cart[productName] = { qty: 0, price };
  cart[productName].qty += qty;
}

export function addWeight(productName, price, grams) {
  if (!cart[productName]) cart[productName] = { grams: 0, price };
  cart[productName].grams += grams;
}

export function adjustCombo(productName, adjustment) {
  if (!cart[productName]) return;
  cart[productName].qty += adjustment;
  if (cart[productName].qty < 1) delete cart[productName];
}

export function adjustWeight(productName, adjustment) {
  if (!cart[productName]) return;
  cart[productName].grams += adjustment;
  if (cart[productName].grams < 1) delete cart[productName];
}

export function clearCart() {
  for (const item in cart) delete cart[item];
}