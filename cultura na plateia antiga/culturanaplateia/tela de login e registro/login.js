document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#login-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            
            const formData = new FormData(form);
            
            
            simulateLoginApiCall(formData)
                .then(response => {
                    if (response.success) {
                        alert('Login realizado com sucesso!');
                        
                        window.location.href = '../index.html'; 
                    } else {
                        alert('Erro no login: ' + response.message);
                    }
                })
                .catch(error => {
                    console.error('Erro:', error);
                    alert('Ocorreu um erro durante o login. Por favor, tente novamente.');
                });
        });
    }
});

function simulateLoginApiCall(formData) {
    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const email = formData.get('email');
            const password = formData.get('senha');
            
            
            
            if (email && password && email.includes('@') && password.length >= 6) {
                resolve({ success: true, message: 'Login bem-sucedido' });
            } else {
                resolve({ success: false, message: 'Email ou senha inválidos' });
            }
        }, 1000); 
    });
}
