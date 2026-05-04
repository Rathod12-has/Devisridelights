let cart = {};
const container = document.getElementById('menu-container');
window.storeIsOpen = true;

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const track = document.querySelector('.carousel-track');
        if (track) { track.scrollBy({ left: 120, behavior: 'smooth' }); setTimeout(() => track.scrollBy({ left: -120, behavior: 'smooth' }), 600); }
    }, 1500);
});

window.renderMenu = function(menuCategories) {
    if (!container) return;
    container.innerHTML = ''; 
    
    menuCategories.forEach(category => {
        const card = document.createElement('div');
        let cardTypeClass = category.type === 'minor' ? 'minor' : 'major';
        card.className = `category-card ${cardTypeClass}`;
        
        card.innerHTML = `
            <img class="category-image" src="${category.image || 'https://via.placeholder.com/600x200'}">
            <div class="category-header">
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 0; pointer-events: none;">
                    <div class="bg-shape shape-3" style="transform: scale(0.4); top: -15px; left: 10px; opacity: 0.6;"></div>
                    <div class="bg-shape shape-8" style="transform: scale(0.5); bottom: -20px; right: 40px; opacity: 0.6;"></div>
                </div>
                <span style="position: relative; z-index: 2;">${category.name}</span>
            </div>
            <div class="item-list" style="position: relative; overflow: hidden;">
                <div style="position: absolute; inset: 0; overflow: hidden; z-index: 0; pointer-events: none; border-radius: 0 0 16px 16px;">
                    <div class="bg-shape shape-2" style="transform: scale(0.6); top: 10px; left: -10px; opacity: 0.5;"></div>
                    <div class="bg-shape shape-5" style="transform: scale(0.5); bottom: 15%; right: -15px; opacity: 0.5;"></div>
                </div>
            </div>
        `;
        
        card.querySelector('.category-header').onclick = () => {
            const isActive = card.classList.contains('active');
            document.querySelectorAll('.category-card.active').forEach(c => c.classList.remove('active'));
            if (!isActive) { card.classList.add('active'); setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'start' }), 450); }
        };
        
        const itemList = card.querySelector('.item-list');
        
        // Safely check if items exist and is an array
        if(category.items && Array.isArray(category.items) && category.items.length > 0) {
            category.items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'menu-item'; itemDiv.style.position = "relative"; itemDiv.style.zIndex = "2";

                let isOut = item.inStock === false;
                let priceDisplay = (item.price === "Shop Visit") ? `<span class="shop-visit-tag">Price at Shop</span>` : `<span class="item-price">₹${item.price}</span>`;
                
                let buttonHTML = '';
                if (item.price !== "Shop Visit") {
                    if (isOut) {
                        buttonHTML = `<button class="add-btn" style="background: #E2E8F0; color: #94A3B8; box-shadow: none; cursor: not-allowed;" disabled>Sold Out</button>`;
                        itemDiv.style.opacity = "0.6"; 
                    } else {
                        buttonHTML = `<button class="add-btn" onclick="addToCart('${item.name}', ${item.price})">Add</button>`;
                    }
                }

                let itemImg = item.image ? `<img src="${item.image}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover; margin-right: 12px; flex-shrink: 0; box-shadow: var(--shadow-inner);">` : '';

                itemDiv.innerHTML = `
                    <div style="display: flex; align-items: center;">${itemImg}<div class="item-info"><h4 style="color: var(--text-dark); margin-bottom: 4px; font-size: 0.95rem;">${item.name}</h4>${priceDisplay}</div></div>
                    ${buttonHTML}
                `;
                itemList.appendChild(itemDiv);
            });
        } else {
             itemList.innerHTML += `<div style="padding: 15px; text-align: center; color: #64748B; position: relative; z-index: 2;">Items will be updated soon.</div>`;
        }
        container.appendChild(card);
    });
};

const popSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3");

window.addToCart = function(itemName, price) {
    if (!window.storeIsOpen) return alert("Sorry, the store is currently closed! We aren't accepting new orders right now.");
    cart[itemName] = cart[itemName] ? { ...cart[itemName], quantity: cart[itemName].quantity + 1 } : { price, quantity: 1 };
    updateCartUI(); popSound.currentTime = 0; popSound.play().catch(e=>console.log("Audio blocked"));
};

window.removeFromCart = function(itemName) {
    if (cart[itemName]) {
        cart[itemName].quantity -= 1; if (cart[itemName].quantity <= 0) delete cart[itemName];
        updateCartUI(); renderCartModalItems();
        if (Object.keys(cart).length === 0) document.getElementById('cart-modal').classList.remove('show');
    }
};

window.clearCart = function() {
    if (confirm("Are you sure you want to clear your entire order?")) { cart = {}; updateCartUI(); document.getElementById('cart-modal').classList.remove('show'); }
};

window.updateCartUI = function() {
    let totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    let totalPrice = Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-count').innerText = totalItems; document.getElementById('cart-total').innerText = totalPrice;
    const cartBar = document.getElementById('floating-cart');
    if (totalItems > 0 && window.storeIsOpen) {
        cartBar.style.display = 'flex'; cartBar.classList.remove('animate-pop'); void cartBar.offsetWidth; cartBar.classList.add('animate-pop');
    } else { cartBar.style.display = 'none'; }
};

window.toggleCartModal = function() {
    const modal = document.getElementById('cart-modal');
    if (modal.classList.contains('show')) modal.classList.remove('show'); else { renderCartModalItems(); modal.classList.add('show'); }
};

window.renderCartModalItems = function() {
    const list = document.getElementById('cart-items-list'); list.innerHTML = ''; let total = 0;
    for (let item in cart) {
        let itemTotal = cart[item].price * cart[item].quantity; total += itemTotal;
        list.innerHTML += `<div class="cart-item-row" style="position: relative; z-index: 2;"><div><strong style="color: var(--text-dark);">${item}</strong><br><small style="color: #64748B;">₹${cart[item].price} x ${cart[item].quantity}</small></div><div style="text-align: right;"><strong style="display:block; margin-bottom: 5px; color: var(--text-accent);">₹${itemTotal}</strong><button class="remove-btn" onclick="removeFromCart('${item}')">Remove</button></div></div>`;
    }
    document.getElementById('modal-total').innerText = total;
};

window.sendWhatsAppOrder = function() {
    if (!window.storeIsOpen) return alert("Sorry, the store is currently closed! We aren't accepting new orders right now.");
    const customerName = document.getElementById('customer-name').value.trim();
    if (customerName.length < 2) return alert("Please enter a valid name!"); 
    if (!window.currentUser) return document.getElementById('login-modal').classList.add('show');

    let total = 0; for (let item in cart) total += cart[item].price * cart[item].quantity;
    document.getElementById('cart-modal').classList.remove('show');
    if (window.saveOrderToFirebase) window.saveOrderToFirebase(customerName, cart, total);

    document.getElementById('placed-modal').classList.add('show');
    let ordersCount = parseInt(localStorage.getItem('orderCount') || '0');
    if (ordersCount === 0 && window.deferredPrompt) {
        document.getElementById('install-suggestion-container').style.display = 'block';
        document.getElementById('modal-install-btn').onclick = () => { window.deferredPrompt.prompt(); window.deferredPrompt = null; document.getElementById('install-suggestion-container').style.display = 'none'; };
    } else { document.getElementById('install-suggestion-container').style.display = 'none'; }
    
    localStorage.setItem('orderCount', ordersCount + 1); cart = {}; updateCartUI();
};

window.deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); window.deferredPrompt = e; document.getElementById('install-app-btn').style.display = 'inline-flex'; });
document.getElementById('install-app-btn').addEventListener('click', () => { if (window.deferredPrompt) { window.deferredPrompt.prompt(); window.deferredPrompt = null; } });
document.getElementById('share-app-btn').addEventListener('click', () => {
    const shareData = { title: 'Devi Sri Delights', text: 'Check out the menu and order online from Devi Sri Delights!', url: window.location.href };
    if (navigator.share) navigator.share(shareData); else window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + " " + shareData.url)}`);
});
