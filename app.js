/**
 * AURA Premium Lifestyle Store - Application Logic
 * Fixed Version: 6 Matched Products with Live Links
 */

// 1. PRODUCT DATABASE (6 Signature Pieces)
const products = [
    {
        id: 1,
        title: "Signature No. 5 Perfume",
        price: 120.00,
        image: "https://images.unsplash.com/photo-1580913209249-14a589574492?w=800&q=80",
        badge: "Best Seller"
    },
    {
        id: 2,
        title: "Astral Chronograph Watch",
        price: 299.00,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
        badge: "Luxury"
    },
    {
        id: 3,
        title: "Vantage DSLR Camera",
        price: 899.00,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
        badge: "New"
    },
    {
        id: 4,
        title: "Urban Explorer Glasses",
        price: 150.00,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
        badge: ""
    },
    {
        id: 5,
        title: "Midnight Ember Ring",
        price: 210.00,
        image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=800&q=80",
        badge: "Popular"
    },
    {
        id: 6,
        title: "Zenith Oud Wood Perfume",
        price: 180.00,
        image: "https://images.unsplash.com/photo-1594125355919-f81216659ca4?w=800&q=80",
        badge: ""
    }
];

// 2. STATE MANAGEMENT
let cart = [];

// 3. DOM ELEMENTS
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

// 4. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    // Set Hero Image (High Res)
    if (heroImage) {
        heroImage.src = "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1920&q=80";
    }

    renderProducts();
    setupEventListeners();
    initScrollAnimations();
});

// 5. RENDER PRODUCTS GRID
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

// 6. EVENT LISTENERS
function setupEventListeners() {
    cartToggleBtns.forEach(btn => btn.addEventListener('click', toggleCart));
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (overlay) overlay.addEventListener('click', toggleCart);

    // Dynamic Header Background
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

// 7. CART CORE FUNCTIONS
window.toggleCart = function() {
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
    
    // Auto-open cart for UX feedback
    setTimeout(() => {
        if (!cartSidebar.classList.contains('open')) {
            toggleCart();
        }
    }, 600);
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
    // Update Counts
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => el.textContent = totalItems);

    // Render Cart Items
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
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
    }

    // Update Subtotal
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartSubtotal.textContent = `$${total.toFixed(2)}`;
}

// 8. UTILITIES & ANIMATIONS
function showToast() {
    if (toast) {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

function initScrollAnimations() {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
