// JavaScript para a página de eventos

document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos
    const filterForm = document.querySelector('.filter-form');
    const eventTypeSelect = document.getElementById('event-type');
    const eventDateInput = document.getElementById('event-date');
    const eventLocationSelect = document.getElementById('event-location');
    const applyFilterBtn = document.getElementById('apply-filter');
    const eventCards = document.querySelectorAll('.event-card');
    const paginationButtons = document.querySelectorAll('.page-btn');

    // Funcionalidade de filtro de eventos
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', function() {
            const eventType = document.getElementById('event-type').value;
            const eventDate = document.getElementById('event-date').value;
            const eventLocation = document.getElementById('event-location').value;
            
            // Converter a data do input para um formato comparável
            const selectedDate = eventDate ? new Date(eventDate) : null;
            
            // Filtrar os eventos com base nos critérios selecionados
            eventCards.forEach(card => {
                let showCard = true;
                
                // Filtrar por tipo de evento
                if (eventType !== 'all') {
                    const cardType = card.querySelector('.event-tag').classList[1];
                    if (cardType !== eventType) {
                        showCard = false;
                    }
                }
                
                // Filtrar por data (comparação simplificada)
                if (selectedDate && showCard) {
                    const cardDateText = card.querySelector('.event-date .day').textContent.trim() + '/' +
                                        card.querySelector('.event-date .month').textContent.trim();
                    
                    // Esta é uma verificação simplificada - em uma implementação real,
                    // precisaríamos de uma conversão de data mais robusta
                    const cardDate = new Date(cardDateText);
                    
                    // Como a comparação de data acima é simplificada e pode não funcionar corretamente,
                    // essa parte do filtro está sendo ignorada por enquanto
                    // Se a data do card for anterior à data selecionada, ocultar
                    // if (cardDate < selectedDate) {
                    //     showCard = false;
                    // }
                }
                
                // Filtrar por localização
                if (eventLocation !== 'all' && showCard) {
                    // Aqui precisaríamos de dados adicionais sobre a localização do evento
                    // Por exemplo, adicionar um atributo data-location nos cards
                    const cardLocation = card.getAttribute('data-location');
                    if (cardLocation && cardLocation !== eventLocation) {
                        showCard = false;
                    }
                }
                
                // Mostrar ou ocultar o card com base nos filtros
                if (showCard) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Exibir mensagem se nenhum evento for encontrado
            const visibleEvents = [...eventCards].filter(card => card.style.display !== 'none');
            const noResultsMessage = document.querySelector('.no-results-message');
            
            if (visibleEvents.length === 0) {
                if (!noResultsMessage) {
                    const message = document.createElement('div');
                    message.className = 'no-results-message';
                    message.textContent = 'Nenhum evento encontrado com os filtros selecionados.';
                    filterForm.parentNode.appendChild(message);
                }
            } else if (noResultsMessage) {
                noResultsMessage.remove();
            }
        });
    }

    // Funcionalidade de paginação
    paginationButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove a classe active de todos os botões
            paginationButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Adiciona a classe active ao botão clicado
            if (!this.classList.contains('next')) {
                this.classList.add('active');
            }
            
            // Simulação: mostrar um toast quando o usuário tenta navegar entre páginas
            const toast = document.getElementById('toast');
            if (toast) {
                toast.textContent = 'Carregando página ' + this.textContent;
                toast.classList.add('active');
                
                setTimeout(() => {
                    toast.classList.remove('active');
                }, 3000);
            }
            
            // Aqui, em uma implementação real, chamaríamos um endpoint
            // para carregar a próxima página de eventos
        });
    });

    // Efeito de hover nos cards de eventos
    eventCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        });
    });

    // Implementar comportamento responsivo para o menu
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');

    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
        
        const links = document.querySelectorAll('.nav-links a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                }
            });
        });
    }

    // Implementar funcionalidade do carrinho
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCartBtn = document.getElementById('closeCart');
    
    if (cartIcon && cartSidebar && cartOverlay && closeCartBtn) {
        cartIcon.addEventListener('click', function() {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        function closeCart() {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        closeCartBtn.addEventListener('click', closeCart);
        cartOverlay.addEventListener('click', closeCart);
    }

    // Inicialização de datas para o filtro
    if (eventDateInput) {
        // Define a data mínima como hoje
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        
        eventDateInput.min = `${yyyy}-${mm}-${dd}`;
        
        // Define a data máxima como 6 meses a partir de hoje
        const maxDate = new Date(today);
        maxDate.setMonth(today.getMonth() + 6);
        
        const maxYyyy = maxDate.getFullYear();
        const maxMm = String(maxDate.getMonth() + 1).padStart(2, '0');
        const maxDd = String(maxDate.getDate()).padStart(2, '0');
        
        eventDateInput.max = `${maxYyyy}-${maxMm}-${maxDd}`;
    }
}); 