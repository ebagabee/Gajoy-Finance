$('#loginForm').submit(function(event) {
    event.preventDefault(); 

    const username = $('#username').val();
    const password = $('#password').val();


    fetch('/api/credentials')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar credenciais');
            }
            return response.json();
        })
        .then(data => {
            if (username === data.user && password === data.password) {
                window.location.href = 'finance.html';
            } else {
                $('#errorMessage').show();
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            $('#errorMessage').text('Erro ao autenticar, tente novamente mais tarde.').show();
        });
});
