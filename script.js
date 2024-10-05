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

let finances = [];

// Função para renderizar a tabela de finanças
function renderTable() {
  const tableBody = $('#financeTableBody');
  tableBody.empty(); // Limpar o conteúdo da tabela

  finances.forEach((finance, index) => {
    const row = `<tr>
      <td>${finance.date}</td>
      <td>${finance.info}</td>
      <td>${finance.value}</td>
      <td>${finance.type}</td>
      <td>${finance.status}</td>
      <td>
        <button class="btn btn-warning btn-sm editFinance" data-index="${index}">Editar</button>
        <button class="btn btn-danger btn-sm deleteFinance" data-index="${index}">Excluir</button>
      </td>
    </tr>`;
    tableBody.append(row);
  });
}

$('#addFinance').click(function() {
  $('#financeModalLabel').text('Adicionar Nova Entrada');
  $('#financeForm')[0].reset();
  $('#editIndex').val('');
  $('#financeModal').modal('show');
});

$(document).on('click', '.editFinance', function() {
  const index = $(this).data('index');
  const finance = finances[index];

  $('#financeModalLabel').text('Editar Entrada');
  $('#financeDate').val(finance.date);
  $('#financeInfo').val(finance.info);
  $('#financeValue').val(finance.value);
  $('#financeType').val(finance.type);
  $('#financeStatus').val(finance.status);
  $('#editIndex').val(index);

  $('#financeModal').modal('show');
});

$(document).on('click', '.deleteFinance', function() {
  const index = $(this).data('index');
  finances.splice(index, 1); 
  renderTable();
});

$('#financeForm').submit(function(event) {
  event.preventDefault();

  const finance = {
    date: $('#financeDate').val(),
    info: $('#financeInfo').val(),
    value: $('#financeValue').val(),
    type: $('#financeType').val(),
    status: $('#financeStatus').val(),
  };

  const editIndex = $('#editIndex').val();
  if (editIndex) {
    finances[editIndex] = finance;
  } else {
    finances.push(finance);
  }

  $('#financeModal').modal('hide'); 
  renderTable(); 
});

renderTable();

