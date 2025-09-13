// Load Products
function loadProducts() {
    fetch('get_products.php')
    .then(res => res.json())
    .then(data => {
        const tbody = document.querySelector('#productsTable tbody');
        tbody.innerHTML = '';
        data.forEach(p => {
            tbody.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>${p.price}</td>
                <td>${p.category}</td>
                <td>
                    <button onclick="updateStock(${p.id}, '${p.stock_status === 'in' ? 'out':'in'}')">
                    ${p.stock_status}</button>
                </td>
                <td>
                    <button onclick="${p.in_slide == 1 ? 'removeFromSlide':'addToSlide'}(${p.id})">
                    ${p.in_slide == 1 ? 'Remove Slide':'Add Slide'}</button>
                </td>
                <td>
                    <button onclick="removeProduct(${p.id})">Delete</button>
                </td>
            </tr>`;
        });
    });
}

// Load Orders
function loadOrders() {
    fetch('get_orders.php')
    .then(res => res.json())
    .then(data => {
        const tbody = document.querySelector('#ordersTable tbody');
        tbody.innerHTML = '';
        data.forEach(o => {
            const items = o.items.map(i=> `${i.name} x${i.qty}($${i.price})`).join('<br>');
            tbody.innerHTML += `
            <tr>
                <td>${o.id}</td>
                <td>${o.customer_name}</td>
                <td>${o.customer_phone}</td>
                <td>${o.customer_address}</td>
                <td>${o.payment_ref}</td>
                <td>${o.total_price}</td>
                <td>${items}</td>
            </tr>`;
        });
    });
}

// Add Product Form
document.getElementById('addProductForm').addEventListener('submit', function(e){
    e.preventDefault();
    const formData = new FormData(this);
    fetch('add_product.php', {method:'POST', body: formData})
    .then(res => res.json())
    .then(data => {
        alert(data.status);
        loadProducts();
        this.reset();
    });
});

function removeProduct(id){
    if(confirm('Delete this product?')){
        fetch(`remove_product.php?id=${id}`).then(()=> loadProducts());
    }
}

function updateStock(id, status){
    fetch(`update_stock.php?id=${id}&status=${status}`).then(()=> loadProducts());
}

function addToSlide(id){
    fetch(`add_to_slide.php?id=${id}`).then(()=> loadProducts());
}

function removeFromSlide(id){
    fetch(`remove_from_slide.php?id=${id}`).then(()=> loadProducts());
}

// Initial load
loadProducts();
loadOrders();
