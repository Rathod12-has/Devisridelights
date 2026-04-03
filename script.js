// Remove the hardcoded array! We will now render the menu dynamically from Firebase
const container = document.getElementById('menu-container');

// Global function triggered by Firebase in index.html
window.renderMenu = function(menuCategories) {
    container.innerHTML = ''; // Clear loading text
    
    menuCategories.forEach(category => {
        const card = document.createElement('div');
        card.className = 'category-card';
        const img = document.createElement('img');
        img.className = 'category-image';
        img.src = category.image;
        card.appendChild(img);

        const header = document.createElement('div');
        header.className = 'category-header';
        header.innerText = category.name;
        // This toggle triggers the 2-column grid to expand to full width!
        header.onclick = () => card.classList.toggle('active');
        card.appendChild(header);

        const itemList = document.createElement('div');
        itemList.className = 'item-list';

        if(category.items) {
            category.items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'menu-item';
                let priceDisplay = (item.price === "Shop Visit") ? `<span class="shop-visit-tag">Price at Shop</span>` : `<span class="item-price">&#8377;${item.price}</span>`;
                let buttonHTML = (item.price === "Shop Visit") ? '' : `<button class="add-btn" onclick="addToCart('${item.name}', ${item.price})">Add</button>`;

                itemDiv.innerHTML = `<div class="item-info"><h4>${item.name}</h4>${priceDisplay}</div>${buttonHTML}`;
                itemList.appendChild(itemDiv);
            });
        }
        card.appendChild(itemList);
        container.appendChild(card);
    });
};

let cart = {};

function addToCart(itemName, price) {
    cart[itemName] = cart[itemName] ? { ...cart[itemName], quantity: cart[itemName].quantity + 1 } : { price, quantity: 1 };
    updateCartUI();
}

function removeFromCart(itemName) {
    if (cart[itemName]) {
        cart[itemName].quantity -= 1;
        if (cart[itemName].quantity <= 0) delete cart[itemName];
        updateCartUI();
        renderCartModalItems();
        
        // If cart is empty, close the slide-up modal smoothly
        if (Object.keys(cart).length === 0) {
            document.getElementById('cart-modal').classList.remove('show');
        }
    }
}

function clearCart() {
    if (confirm("Are you sure you want to clear your entire order?")) {
        cart = {};
        updateCartUI();
        // Close the slide-up modal smoothly
        document.getElementById('cart-modal').classList.remove('show');
    }
}

function updateCartUI() {
    let totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    let totalPrice = Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-count').innerText = totalItems;
    document.getElementById('cart-total').innerText = totalPrice;
    
    const cartBar = document.getElementById('floating-cart');
    if (totalItems > 0) {
        cartBar.style.display = 'flex';
        cartBar.classList.remove('animate-pop'); 
        void cartBar.offsetWidth; // Trigger reflow to restart animation
        cartBar.classList.add('animate-pop');
    } else { 
        cartBar.style.display = 'none'; 
    }
}

// UPDATED: Now uses classList.toggle('show') for the smooth slide-up animation
window.toggleCartModal = function() {
    const modal = document.getElementById('cart-modal');
    if (modal.classList.contains('show')) {
        modal.classList.remove('show');
    } else {
        renderCartModalItems();
        modal.classList.add('show');
    }
};

function renderCartModalItems() {
    const list = document.getElementById('cart-items-list');
    list.innerHTML = '';
    let total = 0;
    for (let item in cart) {
        let itemTotal = cart[item].price * cart[item].quantity;
        total += itemTotal;
        list.innerHTML += `
            <div class="cart-item-row">
                <div>
                    <strong>${item}</strong><br>
                    <small>&#8377;${cart[item].price} x ${cart[item].quantity}</small>
                </div>
                <div style="text-align: right;">
                    <strong style="display:block; margin-bottom: 5px;">&#8377;${itemTotal}</strong>
                    <button class="remove-btn" onclick="removeFromCart('${item}')">Remove</button>
                </div>
            </div>`;
    }
    document.getElementById('modal-total').innerText = total;
}

// We attach this to the window object so the HTML buttons can find it easily
window.sendWhatsAppOrder = function() {
    const customerName = document.getElementById('customer-name').value.trim();
    if (customerName.length < 2) { 
        alert("Please enter a valid name!"); 
        return; 
    }

    // Check if the user is logged in
    if (!window.currentUser) {
        document.getElementById('login-modal').classList.add('show');
        return;
    }

    let total = 0;
    for (let item in cart) {
        total += cart[item].price * cart[item].quantity;
    }

    // Close the cart modal smoothly
    document.getElementById('cart-modal').classList.remove('show');

    // Trigger the Firebase save function defined in index.html
    if (window.saveOrderToFirebase) {
        window.saveOrderToFirebase(customerName, cart, total);
    }

    alert("✅ Order successfully sent to the kitchen!\n\nPlease wait, your phone will notify you the exact moment it is ready for pickup.");

    cart = {};
    updateCartUI();
};

// --- PWA & SHARING LOGIC ---
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('install-app-btn').style.display = 'inline-flex';
});

document.getElementById('install-app-btn').addEventListener('click', () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt = null;
    }
});

document.getElementById('share-app-btn').addEventListener('click', () => {
    const shareData = {
        title: 'Devi Sri Delights',
        text: 'Check out the menu and order online from Devi Sri Delights!',
        url: window.location.href
    };
    if (navigator.share) {
        navigator.share(shareData);
    } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + " " + shareData.url)}`);
    }
});
