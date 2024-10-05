$('#loginForm').submit(function(event) {
    event.preventDefault();

    const username = $('#username').val();
    const password = $('#password').val();

    fetch('credentials.json')
        .then(response => response.json())
        .then(data => {
            if (username === data.username && password === data.password) {
                window.location.href = 'finance.html';
            } else {
                $('#errorMessage').show();
            }
        })
        .catch(error => console.error('Erro', error));
});