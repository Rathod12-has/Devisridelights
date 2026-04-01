const menuCategories = [
    {
        name: "Foods",
        image: "https://tse4.mm.bing.net/th/id/OIP.EEc_OHCl8Ls9SxecF-BXAAHaFj?rs=1&pid=ImgDetMain&o=7&rm=3",
        items: [
            { name: "Chapati", price: 10 },
            { name: "Jowar rotis", price: 15 },
            { name: "Bajra roties", price: 20 },
            { name: "Sambar", price: 20 },
            { name: "Veg curries", price: 20 },
            { name: "Chicken curry", price: "Shop Visit" },
            { name: "Rice", price: 20 },
            { name: "Idli", price: 35 }
        ]
    },
    {
        name: "Thali",
        image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=1000&auto=format&fit=crop",
        items: [
            { name: "Veg thali", price: 79 },
            { name: "Non veg thali", price: 99 },
            { name: "Unlimited buffet", price: 79 }
        ]
    },
    {
        name: "Shakes",
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=1000&auto=format&fit=crop",
        items: [
            { name: "Buttermilk", price: 10 },
            { name: "Lassi", price: 20 },
            { name: "Oreo milkshake", price: 79 }
        ]
    },
    {
        name: "Cool Drinks",
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1000&auto=format&fit=crop",
        items: [
            { name: "Red bull", price: 125 },
            { name: "Monster energy", price: 125 },
            { name: "Badam milk", price: 40 },
            { name: "Predator", price: 60 },
            { name: "Thums up", price: "Shop Visit" },
            { name: "Sprite", price: "Shop Visit" },
            { name: "Coca-cola", price: "Shop Visit" },
            { name: "Limca", price: "Shop Visit" },
            { name: "Sprite sugar free", price: "Shop Visit" },
            { name: "Water bottles", price: "Shop Visit" }
        ]
    },
    {
        name: "Ice Creams",
        image: "https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?q=80&w=1000&auto=format&fit=crop",
        items: [
            { name: "Vanilla", price: "Shop Visit" },
            { name: "Strawberry", price: "Shop Visit" },
            { name: "Choco chips", price: "Shop Visit" },
            { name: "Honeymoon delight", price: "Shop Visit" },
            { name: "Mango", price: "Shop Visit" }
        ]
    },
    {
        name: "Sunday Specials",
        image: "https://tse3.mm.bing.net/th/id/OIP.KE-drO0MxumvxRq8P5nOnwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
        items: [
            { name: "Sunday cups (Tutti Frutti)", price: "Shop Visit" },
            { name: "Chocolate flavour", price: "Shop Visit" }
        ]
    },
    {
        name: "Items with Fruits",
        image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=1000&auto=format&fit=crop",
        items: [
            { name: "Fruits bowl", price: "Shop Visit" },
            { name: "Fruits juice", price: "Shop Visit" },
            { name: "Sprouts", price: "Shop Visit" }
        ]
    },
    {
        name: "Snacks",
        image: "sprouts.jpg.jpg",
        items: [
            { name: "Pakodi", price: "Shop Visit" },
            { name: "Sprouts", price: "Shop Visit" }
        ]
    }
];

const container = document.getElementById('menu-container');

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
    header.onclick = () => card.classList.toggle('active');
    card.appendChild(header);

    const itemList = document.createElement('div');
    itemList.className = 'item-list';

    category.items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item';
        // Using &#8377; here to guarantee the Rupee symbol shows up
        let priceDisplay = (item.price === "Shop Visit") ? `<span class="shop-visit-tag">Price at Shop</span>` : `<span class="item-price">&#8377;${item.price}</span>`;
        let buttonHTML = (item.price === "Shop Visit") ? '' : `<button class="add-btn" onclick="addToCart('${item.name}', ${item.price})">Add</button>`;

        itemDiv.innerHTML = `<div class="item-info"><h4>${item.name}</h4>${priceDisplay}</div>${buttonHTML}`;
        itemList.appendChild(itemDiv);
    });
    card.appendChild(itemList);
    container.appendChild(card);
});

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
        if (Object.keys(cart).length === 0) toggleCartModal();
    }
}

function clearCart() {
    if (confirm("Are you sure you want to clear your entire order?")) {
        cart = {};
        updateCartUI();
        toggleCartModal();
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
        cartBar.classList.remove('animate-pop'); void cartBar.offsetWidth; cartBar.classList.add('animate-pop');
    } else { cartBar.style.display = 'none'; }
}

function toggleCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal.style.display === "block") { modal.style.display = "none"; } 
    else { renderCartModalItems(); modal.style.display = "block"; }
}

function renderCartModalItems() {
    const list = document.getElementById('cart-items-list');
    list.innerHTML = '';
    let total = 0;
    for (let item in cart) {
        let itemTotal = cart[item].price * cart[item].quantity;
        total += itemTotal;
        // Using &#8377; here to guarantee the Rupee symbol shows up
        list.innerHTML += `<div class="cart-item-row"><div><strong>${item}</strong><br><small>&#8377;${cart[item].price} x ${cart[item].quantity}</small></div><div style="text-align: right;"><strong style="display:block;">&#8377;${itemTotal}</strong><button class="remove-btn" onclick="removeFromCart('${item}')">Remove</button></div></div>`;
    }
    document.getElementById('modal-total').innerText = total;
}

function sendWhatsAppOrder() {
    const customerName = document.getElementById('customer-name').value.trim();
    if (customerName.length < 2) { 
        alert("Please enter a valid name!"); 
        return; 
    }

    if (!window.currentUser) {
        document.getElementById('login-modal').classList.add('show');
        return;
    }

    let total = 0;
    for (let item in cart) {
        total += cart[item].price * cart[item].quantity;
    }

    toggleCartModal();

    if (window.saveOrderToFirebase) {
        window.saveOrderToFirebase(customerName, cart, total);
    }

    alert("✅ Order successfully sent to the kitchen!\n\nPlease wait, your phone will notify you the exact moment it is ready for pickup.");

    cart = {};
    updateCartUI();
}

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
            
