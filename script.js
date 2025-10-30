const pageInput = document.getElementById("pageInput");
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");
const suggestionsDiv = document.getElementById("suggestions");

let currentData = [];
let currentPage = 1;
const itemsPerPage = 5;

// Lista fixa de músculos conhecidos (para sugestões)
const allMuscles = [
    "biceps", "triceps", "chest", "shoulders", "glutes", "forearms", "calves"
];

// Função principal: busca exercícios pelo termo digitado
async function fetchExercises(muscle) {
    resultsDiv.innerHTML = "<p>Carregando...</p>";

    try {
        const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`, {
            method: "GET",
            headers: {
                "X-Api-Key": "4LaR3eumIcD1XhDBIIe9lA==DBTOTA9lW2ji4TBW",
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (!data.length) {
            resultsDiv.innerHTML = "<p>Nenhum exercício encontrado!</p>";
            return;
        }

        currentData = data;
        currentPage = 1;
        renderPage();

    } catch (error) {
        console.error(error);
        resultsDiv.innerHTML = "<p>Erro ao buscar dados da API!</p>";
    }
}

// Mostra a página atual (5 exercícios por vez)
function renderPage() {
    resultsDiv.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = currentData.slice(start, end);

    pageItems.forEach(exercise => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h2>${exercise.name}</h2>
            <p><strong>Tipo:</strong> ${exercise.type}</p>
            <p><strong>Músculo:</strong> ${exercise.muscle}</p>
            <p><strong>Equipamento:</strong> ${exercise.equipment}</p>
            <p><strong>Dificuldade:</strong> ${exercise.difficulty}</p>
        `;
        resultsDiv.appendChild(card);
    });

    const totalPages = Math.ceil(currentData.length / itemsPerPage);

    const nav = document.createElement("div");
    nav.className = "pagination";
    nav.innerHTML = `
        <button ${currentPage === 1 ? "disabled" : ""} id="prevPage">⬅️ Anterior</button>
        <span>Página ${currentPage} de ${totalPages}</span>
        <button ${currentPage === totalPages ? "disabled" : ""} id="nextPage">Próxima ➡️</button>
    `;
    resultsDiv.appendChild(nav);

    document.getElementById("prevPage")?.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage();
        }
    });

    document.getElementById("nextPage")?.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPage();
        }
    });
}

// Exibe sugestões enquanto o usuário digita
pageInput.addEventListener("input", () => {
    const query = pageInput.value.toLowerCase().trim();
    suggestionsDiv.innerHTML = "";
    if (!query) {
        suggestionsDiv.style.display = "none";
        return;
    }

    const filtered = allMuscles.filter(muscle =>
        muscle.startsWith(query)
    );

    if (filtered.length > 0) {
        suggestionsDiv.style.display = "block";
        filtered.forEach(muscle => {
            const item = document.createElement("div");
            item.className = "suggestion-item";
            item.textContent = muscle;
            item.addEventListener("click", () => {
                pageInput.value = muscle;
                suggestionsDiv.style.display = "none";
            });
            suggestionsDiv.appendChild(item);
        });
    } else {
        suggestionsDiv.style.display = "none";
    }
});

// Esconde sugestões ao clicar fora
document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-box")) {
        suggestionsDiv.style.display = "none";
    }
});

// Quando o usuário clicar em “Buscar”
searchBtn.addEventListener("click", () => {
    const muscle = pageInput.value.trim().toLowerCase();
    if (muscle) {
        fetchExercises(muscle);
    } else {
        resultsDiv.innerHTML = "<p>Digite o nome de um músculo (ex: biceps, chest, legs...)</p>";
    }
});

// Não busca nada ao carregar — só mostra resultados após pesquisa
