document.addEventListener('DOMContentLoaded', function() {
    
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCartBtn = document.getElementById('closeCart');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.querySelector('.cart-count');
    
    let cart = [];

    
    function openCart() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    }

    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    }

    
    cartIcon.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;
        let count = 0;

        cart.forEach(item => {
            count += item.quantity;
            total += item.price * item.quantity;

            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        <span class="remove-item" data-id="${item.id}">🗑️</span>
                    </div>
                </div>
            `;
            cartItems.appendChild(itemElement);
        });

        cartTotal.textContent = `R$ ${total.toFixed(2)}`;
        cartCount.textContent = count;
    }

    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({...item, quantity: 1});
        }
        
        updateCart();
        openCart();
    }

    
    function extractPrice(priceText) {
        if (!priceText) return 0;
        const match = priceText.match(/R\$\s*(\d+(?:\.\d{3})*(?:,\d{2})?)/);
        if (match) {
            return parseFloat(match[1].replace('.', '').replace(',', '.'));
        }
        return 0;
    }

    
    document.querySelectorAll('.promo-button, .event-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Encontrar o card do evento
            const eventCard = e.target.closest('.event-card, .flip-card');
            if (!eventCard) return;

            // Capturar dados do evento
            let name, price, image;

            // Para cards flip
            if (eventCard.classList.contains('flip-card')) {
                name = eventCard.querySelector('.flip-card-front h3').textContent;
                const priceElement = eventCard.querySelector('.event-price');
                price = priceElement ? extractPrice(priceElement.textContent) : 100.00;
                image = eventCard.querySelector('.flip-card-front img').src;
            } 
            // Para event cards
            else if (eventCard.classList.contains('event-card')) {
                name = eventCard.querySelector('h3').textContent;
                const priceElement = eventCard.querySelector('.promo-price');
                price = priceElement ? extractPrice(priceElement.textContent) : 100.00;
                image = eventCard.querySelector('img').src;
            }

            console.log('Adicionando ao carrinho:', { name, price, image }); // Debug

            addToCart({
                id: name,
                name: name,
                price: price,
                image: image
            });
        });
    });

    
    cartItems.addEventListener('click', (e) => {
        if (e.target.classList.contains('quantity-btn')) {
            const id = e.target.dataset.id;
            const item = cart.find(item => item.id === id);
            
            if (e.target.classList.contains('plus')) {
                item.quantity++;
            } else if (e.target.classList.contains('minus')) {
                item.quantity--;
                if (item.quantity === 0) {
                    cart = cart.filter(cartItem => cartItem.id !== id);
                }
            }
            updateCart();
        }
        
        if (e.target.classList.contains('remove-item')) {
            const id = e.target.dataset.id;
            cart = cart.filter(item => item.id !== id);
            updateCart();
        }
    });

    
    const checkoutButton = document.getElementById('checkoutButton');
    
    checkoutButton.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }

        
        localStorage.setItem('cartItems', JSON.stringify(cart));
        
        
        let resumo = 'Resumo da compra:\n\n';
        let total = 0;
        
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            resumo += `${item.name} - ${item.quantity}x R$ ${item.price.toFixed(2)} = R$ ${subtotal.toFixed(2)}\n`;
            total += subtotal;
        });
        
        resumo += `\nTotal: R$ ${total.toFixed(2)}`;
        
        
        localStorage.setItem('cartSummary', resumo);

        
        window.location.href = 'pagamento.html';
    });

    
    function clearCart() {
        cart = [];
        updateCart();
        localStorage.removeItem('cartItems');
        localStorage.removeItem('cartSummary');
    }
});
