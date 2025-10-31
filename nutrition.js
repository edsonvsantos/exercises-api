const apiKey = "";

const input = document.getElementById("alimento");
const resultado = document.getElementById("resultado");

input.addEventListener("input", mostrarSugestoes);

async function mostrarSugestoes() {
  const query = input.value.trim();
  resultado.innerHTML = "";

  if (query.length === 0) return;

  try {
    const res = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=10&api_key=${apiKey}`
    );
    const data = await res.json();

    if (!data.foods || data.foods.length === 0) return;

    // filtra apenas alimentos genéricos
    const sugestoes = data.foods.filter(f =>
      f.dataType === "Foundation" || f.dataType === "Survey (FNDDS)"
    );

    if (sugestoes.length === 0) return;

    // cria lista de sugestões
    const ul = document.createElement("ul");
    ul.className = "sugestoes";

    sugestoes.forEach(f => {
      const li = document.createElement("li");
      li.textContent = f.description;
      li.addEventListener("click", () => mostrarCalorias(f));
      ul.appendChild(li);
    });

    resultado.innerHTML = "";
    resultado.appendChild(ul);

  } catch (erro) {
    console.error(erro);
  }
}

function mostrarCalorias(food) {
  // encontra Energy
  const energia = food.foodNutrients.find(n =>
    n.nutrientName.toLowerCase().includes("energy")
  );
  if (!energia) {
    resultado.innerHTML = "Valor energético não encontrado.";
    return;
  }

  let kcal = energia.value;
  if (energia.unitName.toLowerCase() === "kj") {
    kcal = energia.value / 4.184; // converte kJ → kcal
  }

  resultado.innerHTML = `
    <strong>${food.description}</strong><br>
    ${kcal.toFixed(1)} kcal (100 g)
  `;
  input.value = food.description; // coloca o nome no input
}
