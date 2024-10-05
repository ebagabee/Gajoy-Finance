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

// Função para carregar finanças do backend
function loadFinances() {
  fetch('/api/finances')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao carregar finanças');
      }
      return response.json();
    })
    .then(data => {
      finances = data; // Atualiza o array de finanças
      renderTable();   // Renderiza a tabela com as finanças carregadas
    })
    .catch(error => {
      console.error('Erro ao carregar finanças:', error);
    });
}

// Função para salvar o array completo de finanças no backend
function saveFinances() {
  fetch('/api/finances', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(finances) // Envia o array completo
  })
  .then(() => {
    loadFinances(); // Recarrega a tabela após salvar
  })
  .catch(error => {
    console.error('Erro ao salvar finanças:', error);
  });
}

// Função para renderizar a tabela de finanças
function renderTable() {
  const tableBody = $('#financeTableBody');
  tableBody.empty(); // Limpa o conteúdo da tabela

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

// Ação para adicionar uma nova entrada
$('#addFinance').click(function() {
  $('#financeModalLabel').text('Adicionar Nova Entrada');
  $('#financeForm')[0].reset();
  $('#editIndex').val('');
  $('#financeModal').modal('show');
});

// Ação para editar uma entrada existente
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

// Ação para excluir uma entrada existente
$(document).on('click', '.deleteFinance', function() {
  const index = $(this).data('index');
  finances.splice(index, 1); // Remove a entrada da lista

  saveFinances(); // Salva o array atualizado no backend
  renderTable();  // Re-renderiza a tabela
});

// Salvar nova entrada ou editar existente
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
    finances[editIndex] = finance; // Editando uma entrada existente
  } else {
    finances.push(finance); // Adicionando uma nova entrada
  }

  $('#financeModal').modal('hide'); // Fecha o modal

  saveFinances();  // Salva o array atualizado no backend
  renderTable();   // Atualiza a tabela com as finanças atualizadas
});

// Carregar as finanças ao carregar a página
loadFinances();



