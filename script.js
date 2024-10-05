let currentPage = 1;
const itemsPerPage = 10;

$("#loginForm").submit(function (event) {
  event.preventDefault();

  const username = $("#username").val();
  const password = $("#password").val();

  fetch("/api/credentials")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao buscar credenciais");
      }
      return response.json();
    })
    .then((data) => {
      if (username === data.user && password === data.password) {
        window.location.href = "finance.html";
      } else {
        $("#errorMessage").show();
      }
    })
    .catch((error) => {
      console.error("Erro:", error);
      $("#errorMessage")
        .text("Erro ao autenticar, tente novamente mais tarde.")
        .show();
    });
});

let finances = [];

function calculateTotals() {
  let totalConcluido = 0;
  let totalEstimado = 0;

  finances.forEach((finance) => {
    const valor = parseFloat(finance.value);

    if (finance.type === "Despesa") {
      totalEstimado -= valor;
    } else {
      totalEstimado += valor;
    }

    if (finance.status === "Concluído") {
      if (finance.type === "Despesa") {
        totalConcluido -= valor;
      } else {
        totalConcluido += valor;
      }
    }
  });

  $("#totalValue").text(totalConcluido.toFixed(2));
  $("#estimatedValue").text(totalEstimado.toFixed(2));
}

function formatCurrency(value) {
  return parseFloat(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDateBrazil(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

async function loadFinances() {
  const response = await fetch("/api/finances");
  const data = await response.json();

  if (response.ok) {
    finances = data;

    // Datas mais recentes primeiro
    finances.sort((a, b) => new Date(b.date) - new Date(a.date));

    renderTable();
  } else {
    console.error("Erro ao carregar finanças:", data.error);
  }
}

async function saveFinance(finance) {
  const response = await fetch("/api/finances", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(finance),
  });

  if (response.ok) {
    loadFinances();
  } else {
    const data = await response.json();
    console.error("Erro ao salvar finança:", data.error);
  }
}

async function updateFinance(id, finance) {
  const response = await fetch("/api/finances", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, updatedFinance: finance }),
  });

  if (response.ok) {
    loadFinances();
  } else {
    const data = await response.json();
    console.error("Erro ao atualizar finança:", data.error);
  }
}

async function deleteFinance(id) {
  const response = await fetch("/api/finances", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  if (response.ok) {
    loadFinances();
  } else {
    const data = await response.json();
    console.error("Erro ao excluir finança:", data.error);
  }
}

function renderTable() {
  const tableBody = $("#financeTableBody");
  tableBody.empty();

  // Aplica os filtros antes de renderizar a tabela
  const filteredFinances = applyFilters();

  // Pagina os resultados filtrados
  const paginatedFinances = paginate(filteredFinances);

  // Renderiza as finanças paginadas
  paginatedFinances.forEach((finance, index) => {
    const rowColor =
      finance.type === "Receita" ? "table-success" : "table-danger";
    const row = `<tr class="${rowColor}">
        <td>${formatDateBrazil(finance.date)}</td>
        <td>${finance.info}</td>
        <td>${formatCurrency(finance.value)}</td>
        <td>${finance.type}</td>
        <td>${finance.status}</td>
        <td>
          <button class="btn btn-warning btn-sm editFinance" data-index="${index}" data-id="${
      finance.id
    }">Editar</button>
          <button class="btn btn-danger btn-sm deleteFinance" data-id="${
            finance.id
          }">Excluir</button>
        </td>
      </tr>`;
    tableBody.append(row);
  });

  calculateTotals();

  renderPagination(filteredFinances.length);
}

// Eventos de filtro de busca
$("#searchInfo").on("input", function () {
  renderTable(); // Re-renderiza a tabela toda vez que informações mudar
});

$("#searchDate").on("input", function () {
  renderTable(); // Re-renderiza a tabela quando a data for alterada
});

// Function para aplicar filtro de busca
function applyFilters() {
  const searchInfo = $("#searchInfo").val().toLowerCase();
  const searchDate = $("#searchDate").val();

  const filteredFinances = finances.filter((finance) => {
    const matchesInfo = finance.info.toLowerCase().includes(searchInfo);
    const matchesDate = !searchDate || finance.date === searchDate;

    return matchesInfo && matchesDate;
  });

  return filteredFinances;
}

// Fazer a paginação
function paginate(filteredFinances) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredFinances.slice(startIndex, endIndex);
}

// Function para renderizar a paginação
function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationContainer = $("#pagination");
  paginationContainer.empty();

  if (totalPages <= 1) return; // Não exibe paginação se houver apenas se tiver

  // Botão anterior
  if (currentPage > 1) {
    paginationContainer.append(
      `<button class="btn btn-secondary me-2" id="prevPage">Anterior</button>`
    );
  }

  // Botão "Proxima"
  if (currentPage < totalPages) {
    paginationContainer.append(
      `<button class="btn btn-secondary me-2" id="nextPage">Próxima</button>`
    );
  }

  $("#prevPage").click(() => {
    currentPage--;
    renderTable();
  });

  $("#nextPage").click(() => {
    currentPage++;
    renderTable();
  });
}

$("#addFinance").click(function () {
  $("#financeModalLabel").text("Adicionar Nova Entrada");
  $("#financeForm")[0].reset();
  $("#editIndex").val("");
  $("#financeModal").modal("show");
});

$(document).on("click", ".editFinance", function () {
  const index = $(this).data("index");
  const finance = finances[index];

  $("#financeModalLabel").text("Editar Entrada");
  $("#financeDate").val(finance.date);
  $("#financeInfo").val(finance.info);
  $("#financeValue").val(finance.value);
  $("#financeType").val(finance.type);
  $("#financeStatus").val(finance.status);
  $("#editIndex").val(finance.id);

  $("#financeModal").modal("show");
});

$(document).on("click", ".deleteFinance", function () {
  const id = $(this).data("id");
  deleteFinance(id);
});

$("#financeForm").submit(function (event) {
  event.preventDefault();

  const finance = {
    date: $("#financeDate").val(),
    info: $("#financeInfo").val(),
    value: $("#financeValue").val(),
    type: $("#financeType").val(),
    status: $("#financeStatus").val(),
  };

  const editId = $("#editIndex").val();
  if (editId) {
    updateFinance(editId, finance);
  } else {
    saveFinance(finance);
  }

  $("#financeModal").modal("hide");
});

loadFinances();
