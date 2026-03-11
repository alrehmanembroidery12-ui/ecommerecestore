// ✅ 6 Premium Products (Now with Live Web Links & Balanced Grid)
const products = [
    {
        id: 1,
        title: "Radiance Vitamin C Serum",
        price: 45.00,
        image: "https://images.unsplash.com/photo-1580913209249-14a589574492?w=600&q=80",
        badge: "Best Seller"
    },
    {
        id: 2,
        title: "Deep Hydration Night Cream",
        price: 68.00,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
        badge: ""
    },
    {
        id: 3,
        title: "Purifying Gentle Cleanser",
        price: 32.00,
        image: "https://images.unsplash.com/photo-1556228515-01ff1ee39a5b?w=600&q=80",
        badge: "New"
    },
    {
        id: 4,
        title: "Rosewater Balancing Toner",
        price: 28.00,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
        badge: ""
    },
    {
        id: 5,
        title: "Overnight Repair Mask",
        price: 55.00,
        image: "https://images.unsplash.com/photo-1590156221170-ce35ee64c733?w=600&q=80",
        badge: "Popular"
    },
    {
        id: 6,
        title: "Botanical Eye Gel",
        price: 40.00,
        image: "https://images.unsplash.com/photo-1594125355919-f81216659ca4?w=600&q=80",
        badge: ""
    }
];

// Cart State
let cart = [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const heroImage = document.getElementById('heroImage');
const cartSidebar = document.getElementById('cartSidebar');
const overlay = document.getElementById('overlay');
const cartToggleBtns = document.querySelectorAll('.cart-toggle');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartCountElements = document.querySelectorAll('.cart-count');
const toast = document.getElementById('toast');
const header = document.querySelector('.header');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // ✅ Set Hero Image with a Stable Live Link
    if (heroImage) {
        heroImage.src = "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1920&q=80";
    }

    // Render Products
    renderProducts();

    // Event Listeners
    setupEventListeners();

    // Scroll Animations
    initScrollAnimations();
});

// Render Products Grid
function renderProducts() {
    if (!productsGrid) return;
    productsGrid.innerHTML = '';
    products.forEach((product, index) => {
        const productEl = document.createElement('div');
        productEl.className = 'product-card reveal';
        productEl.style.transitionDelay = `${index * 0.1}s`;
        
        const badgeHTML = product.badge ? `<span class="product-badge">${product.badge}</span>` : '';

        productEl.innerHTML = `
            <div class="product-image">
                ${badgeHTML}
                <img src="${product.image}" alt="${product.title}" loading="lazy">
                <div class="product-action">
                    <button class="btn btn-primary w-100" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
            </div>
        `;
        productsGrid.appendChild(productEl);
    });
}

// Setup Event Listeners
function setupEventListeners() {
    cartToggleBtns.forEach(btn => btn.addEventListener('click', toggleCart));
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (overlay) overlay.addEventListener('click', toggleCart);

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll <= 0) {
            header.classList.remove('hide');
            header.style.background = 'rgba(255, 255, 255, 0.8)';
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('hide')) {
            header.classList.add('hide');
        } else if (currentScroll < lastScroll && header.classList.contains('hide')) {
            header.classList.remove('hide');
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
        lastScroll = currentScroll;
    });
}

// Cart Logic
function toggleCart() {
    cartSidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('open') ? 'hidden' : '';
}

window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    showToast();
    
    setTimeout(() => {
        if (!cartSidebar.classList.contains('open')) {
            toggleCart();
        }
    }, 800);
}

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

window.updateQuantity = function(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => el.textContent = totalItems);

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is currently empty.</div>';
    } else {
        cartItemsContainer.innerHTML = '';
        cart.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-details">
                    <span class="cart-item-title">${item.title}</span>
                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                    <div class="qty-control">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <input type="text" class="qty-input" value="${item.quantity}" readonly>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">x</button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartSubtotal.textContent = `$${total.toFixed(2)}`;
}

function showToast() {
    if (toast) {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}