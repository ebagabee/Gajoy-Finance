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

// Função para carregar as finanças do backend (api/finances)
async function loadFinances() {
  const response = await fetch('/api/finances');
  const data = await response.json();

  if (response.ok) {
    finances = data;
    renderTable();   // Renderiza a tabela com os dados carregados
  } else {
    console.error('Erro ao carregar finanças:', data.error);
  }
}

// Função para salvar uma nova entrada no backend
async function saveFinance(finance) {
  const response = await fetch('/api/finances', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(finance)
  });

  if (response.ok) {
    loadFinances(); // Recarrega a tabela após salvar
  } else {
    const data = await response.json();
    console.error('Erro ao salvar finança:', data.error);
  }
}

// Função para atualizar uma entrada existente no backend
async function updateFinance(id, finance) {
  const response = await fetch('/api/finances', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id, updatedFinance: finance })
  });

  if (response.ok) {
    loadFinances(); // Recarrega a tabela após atualizar
  } else {
    const data = await response.json();
    console.error('Erro ao atualizar finança:', data.error);
  }
}

// Função para excluir uma entrada no backend
async function deleteFinance(id) {
  const response = await fetch('/api/finances', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id })
  });

  if (response.ok) {
    loadFinances(); // Recarrega a tabela após excluir
  } else {
    const data = await response.json();
    console.error('Erro ao excluir finança:', data.error);
  }
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
        <button class="btn btn-warning btn-sm editFinance" data-index="${index}" data-id="${finance.id}">Editar</button>
        <button class="btn btn-danger btn-sm deleteFinance" data-id="${finance.id}">Excluir</button>
      </td>
    </tr>`;
    tableBody.append(row);
  });
}

// Ação para adicionar nova entrada
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
  $('#editIndex').val(finance.id);

  $('#financeModal').modal('show');
});

// Ação para excluir uma entrada
$(document).on('click', '.deleteFinance', function() {
  const id = $(this).data('id');
  deleteFinance(id); // Chama a função de exclusão
});

// Salvar nova entrada ou atualizar existente
$('#financeForm').submit(function(event) {
  event.preventDefault();

  const finance = {
    date: $('#financeDate').val(),
    info: $('#financeInfo').val(),
    value: $('#financeValue').val(),
    type: $('#financeType').val(),
    status: $('#financeStatus').val(),
  };

  const editId = $('#editIndex').val();
  if (editId) {
    updateFinance(editId, finance); // Atualiza a entrada
  } else {
    saveFinance(finance); // Adiciona uma nova entrada
  }

  $('#financeModal').modal('hide'); // Fecha o modal
});

// Carregar as finanças ao carregar a página
loadFinances();



