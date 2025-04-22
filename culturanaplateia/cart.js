document.addEventListener('DOMContentLoaded', function() {
    
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCartBtn = document.getElementById('closeCart');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.querySelector('.cart-count');
    
    // Recuperar carrinho do localStorage, se existir
    let cart = localStorage.getItem('cartItems') ? 
               JSON.parse(localStorage.getItem('cartItems')) : [];

    // Função para mostrar o carrinho
    function openCart() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    }

    // Função para fechar o carrinho
    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    }

    // Adicionar event listeners para abrir/fechar o carrinho
    cartIcon.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Função para atualizar a exibição do carrinho
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
        
        // Salvar carrinho no localStorage
        localStorage.setItem('cartItems', JSON.stringify(cart));
        
        // Exibir notificação se um item for adicionado/removido
        if (cart.length > 0) {
            showNotification('Carrinho atualizado');
        }
    }

    // Função para mostrar notificação temporária
    function showNotification(message) {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.classList.add('active');
            
            setTimeout(() => {
                toast.classList.remove('active');
            }, 3000);
        }
    }

    // Função para adicionar item ao carrinho
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

    // Função auxiliar para extrair preço do texto
    function extractPrice(priceText) {
        if (!priceText) return 0;
        const match = priceText.match(/R\$\s*(\d+(?:\.\d{3})*(?:,\d{2})?)/);
        if (match) {
            // Converter formato brasileiro para número
            return parseFloat(match[1].replace('.', '').replace(',', '.'));
        }
        return 0;
    }

    // Adicionar event listeners para botões "Comprar"
    document.querySelectorAll('.promo-button, .event-button, .btn-comprar-principal').forEach(button => {
        button.addEventListener('click', (e) => {
            // Ignorar se for o botão de finalizar compra no carrinho ou em formulários
            if (button.id === 'checkoutButton' || button.closest('form')) return;
            
            e.preventDefault();
            
            // Encontrar o card do evento mais próximo
            const eventCard = e.target.closest('.event-card, .flip-card, .ticket-list');
            if (!eventCard) return;

            // Capturar dados do evento
            let name, price, image;

            // Para cards flip (músicos, museus, etc)
            if (eventCard.classList.contains('flip-card')) {
                name = eventCard.querySelector('.flip-card-front h3').textContent;
                const priceElement = eventCard.querySelector('.event-price');
                price = priceElement ? extractPrice(priceElement.textContent) : 100.00;
                image = eventCard.querySelector('.flip-card-front img').src;
            } 
            // Para event cards (na página de eventos)
            else if (eventCard.classList.contains('event-card')) {
                name = eventCard.querySelector('h4').textContent;
                const priceElement = eventCard.querySelector('.event-price span');
                price = priceElement ? extractPrice(priceElement.textContent) : 100.00;
                image = 'images/evento1.webp'; // Imagem padrão se não houver
            }
            // Para tickets
            else if (eventCard.classList.contains('ticket-list')) {
                name = eventCard.querySelector('.ticket-header').textContent;
                const priceElement = eventCard.querySelector('.ticket-price p');
                price = priceElement ? extractPrice(priceElement.textContent) : 100.00;
                const iconElement = eventCard.querySelector('.ticket-icon img');
                image = iconElement ? iconElement.src : 'images/reserva.png';
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

    // Listener para botões de quantidade e remoção no carrinho
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

    // Função para finalizar a compra
    const checkoutButton = document.getElementById('checkoutButton');
    
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Seu carrinho está vazio!');
                return;
            }
    
            // Preparar resumo da compra para exibição na página de pagamento
            let resumo = '';
            let total = 0;
            
            cart.forEach(item => {
                const subtotal = item.price * item.quantity;
                resumo += `${item.name} - ${item.quantity}x R$ ${item.price.toFixed(2)} = R$ ${subtotal.toFixed(2)}\n`;
                total += subtotal;
            });
            
            resumo += `\nTotal: R$ ${total.toFixed(2)}`;
            
            // Salvar no localStorage para recuperar na página de pagamento
            localStorage.setItem('cartSummary', resumo);
    
            // Redirecionar para a página de pagamento
            window.location.href = 'pagamento.html';
        });
    }

    // Função para limpar o carrinho
    function clearCart() {
        cart = [];
        updateCart();
        localStorage.removeItem('cartItems');
        localStorage.removeItem('cartSummary');
    }
    
    // Inicializar o carrinho ao carregar a página
    updateCart();
});
