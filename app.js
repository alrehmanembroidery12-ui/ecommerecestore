const products = [
    { id: 1, title: "Emerald Cloud Sofa", price: 899.0, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80", badge: "Featured" },
    { id: 2, title: "Earth Tone Vase", price: 65.0, image: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&q=80", badge: "" },
    { id: 3, title: "Oak Lounge Chair", price: 350.0, image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80", badge: "Popular" },
    { id: 4, title: "Brass Pendant Light", price: 120.0, image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80", badge: "" },
    { id: 5, title: "Marble Side Table", price: 210.0, image: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=600&q=80", badge: "New" },
    { id: 6, title: "Noir Ceramic Lamp", price: 145.0, image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=600&q=80", badge: "" }
];

let cart = [];
const productsGrid = document.getElementById('productsGrid');
const heroImage = document.getElementById('heroImage');
const cartCountElements = document.querySelectorAll('.cart-count');

document.addEventListener('DOMContentLoaded', () => {
    if (heroImage) heroImage.src = "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1920&q=80";
    renderProducts();
});

function renderProducts() {
    if (!productsGrid) return;
    productsGrid.innerHTML = '';
    products.forEach(product => {
        const productEl = document.createElement('div');
        productEl.className = 'product-card';
        productEl.innerHTML = `
            <div class="product-image">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <img src="${product.image}" alt="${product.title}">
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
            <div class="product-info">
                <h3>${product.title}</h3>
                <p>$${product.price.toFixed(2)}</p>
            </div>
        `;
        productsGrid.appendChild(productEl);
    });
}

window.addToCart = function(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateUI();
};

function updateUI() {
    cartCountElements.forEach(el => el.textContent = cart.length);
}
