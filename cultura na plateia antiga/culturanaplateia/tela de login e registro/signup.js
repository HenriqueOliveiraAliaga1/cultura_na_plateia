document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#signup-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            
            const formData = new FormData(form);
            
            
            simulateApiCall(formData)
                .then(response => {
                    if (response.success) {
                        alert('Registro realizado com sucesso!');
                        
                        window.location.href = 'login.html';
                    } else {
                        alert('Erro no registro: ' + response.message);
                    }
                })
                .catch(error => {
                    console.error('Erro:', error);
                    alert('Ocorreu um erro durante o registro. Por favor, tente novamente.');
                });
        });
    }
});

function simulateApiCall(formData) {
    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            
            const email = formData.get('email');
            if (email && email.includes('@')) {
                resolve({ success: true, message: 'Usuário registrado com sucesso' });
            } else {
                resolve({ success: false, message: 'Email inválido' });
            }
        }, 1000); 
    });
}

