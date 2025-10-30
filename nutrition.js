const btn = document.getElementById('searchBtn');
const input = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');

// Detecta automaticamente o backend (porta 3000 ou outra)
const API_BASE =
  window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
    ? "http://localhost:3000" // servidor Node.js
    : ""; // caso esteja hospedado junto

btn.addEventListener('click', async () => {
  const query = input.value.trim();
  if (!query) {
    resultsDiv.innerHTML = '<p>Digite um alimento.</p>';
    return;
  }

  resultsDiv.innerHTML = '<p>🔎 Buscando...</p>';

  try {
    const response = await fetch(`${API_BASE}/api/search?food=${encodeURIComponent(query)}`);

    if (!response.ok) {
      resultsDiv.innerHTML = `<p>❌ Erro: ${response.status} (${response.statusText})</p>`;
      return;
    }

    // Tenta converter para JSON (evita erro "<!DOCTYPE..."")
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Resposta não era JSON:", text);
      resultsDiv.innerHTML = "<p>❌ Erro: resposta inválida do servidor.</p>";
      return;
    }

    if (!data.foods) {
      resultsDiv.innerHTML = '<p>Nenhum resultado encontrado.</p>';
      return;
    }

    const foods = data.foods.food;
    resultsDiv.innerHTML = foods.map(f => `
      <div class="food-item">
        <strong>${f.food_name}</strong><br>
        <small>${f.food_description}</small>
      </div>
    `).join('');
  } catch (err) {
    console.error(err);
    resultsDiv.innerHTML = '<p>❌ Erro ao buscar alimentos.</p>';
  }
});
