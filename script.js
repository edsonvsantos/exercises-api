const pageInput = document.getElementById("pageInput")
const searchBtn = document.getElementById("searchBtn")
const resultsDiv = document.getElementById("results")

async function fetchCharacters(page){
    resultsDiv.innerHTML = "<p>Carregando...</p>"

    try {
        const response = await fetch(`https://dragonball-api.com/api/characters?page=${page}`)
        const data = await response.json()
        console.log(data)

        if(data.error){
            resultsDiv.innerHTML = "<p>Página inválida! Tente outra.</p>"
            return
        }

         resultsDiv.innerHTML = ""
         data.items.forEach(character => {
            const card = document.createElement("div")
            card.className = "card"
            card.innerHTML = `
                <img src="${character.image}" alt="${character.name}">
                <h3>${character.name}</h3>
                <p><strong>Filmes:</strong>${character.race}</p>
                <p><strong>Vídeo games:</strong>${character.gender}</p>
                <p><strong>Vídeo games:</strong>${character.ki}</p>

            `
            resultsDiv.appendChild(card)
         })
    } catch (error) {
        // console.log("deu ruim")
        resultsDiv.innerHTML = "<p>Erro ao buscar personagens!!!</p>"
    }
}

searchBtn.addEventListener("click", () => {
    const page = pageInput.value.trim()
    if(page){
        fetchCharacters(page)
    }else{
        resultsDiv.innerHTML = "<p>Digite um número de página</p>"
    }
})

fetchCharacters(1)