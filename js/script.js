const movieSearchBox = document.getElementById('movie-search-box');
const searchlist = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

// Carregar filmes com a API
async function loadMovies(searchTerm) {
    const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=d3a09049`;
    const res = await fetch(URL);
    const data = await res.json();

    if (data.Response === "True") {
        displayMovieList(data.Search);
    } else {
        searchlist.innerHTML = "<p>Nenhum filme encontrado</p>";
    }
}

function findMovies() {
    let searchTerm = movieSearchBox.value.trim();
    if (searchTerm.length > 0) {
        searchlist.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchlist.classList.add('hide-search-list');
    }
}

function displayMovieList(movies) {
    searchlist.innerHTML = "";
    movies.forEach(movie => {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movie.imdbID;
        movieListItem.classList.add('search-list-item');

        let moviePoster = movie.Poster !== "N/A" ? movie.Poster : "img/image_not_found.jpg";

        movieListItem.innerHTML = `
            <div class="search-item-thumbnail">
                <img src="${moviePoster}" alt="Poster do filme">
            </div>
            <div class="search-item-info">
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
            </div>
        `;
        searchlist.appendChild(movieListItem);

        // Adicionar evento de clique para cada item
        movieListItem.addEventListener('click', async () => {
            searchlist.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=d3a09049`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details) {
    resultGrid.innerHTML = `
    <div class="movie-poster">
        <img src="${details.Poster !== "N/A" ? details.Poster : "/img/image_not_found.png"}" alt="Poster do filme">
    </div>
    <div class="movie-info">
        <h3 class="movie-title">${details.Title}</h3>
        <ul class="movie-misc-info">
            <li class="year">Ano: ${details.Year}</li>
            <li class="rated">Classificação: ${details.Rated}</li>
            <li class="released">Lançamento: ${details.Released}</li>
        </ul>
        <p class="genre"><b>Gênero:</b> ${details.Genre}</p>
        <p class="writer"><b>Roteirista:</b> ${details.Writer}</p>
        <p class="actors"><b>Atores:</b> ${details.Actors}</p>
        <p class="plot"><b>Sinopse:</b> ${details.Plot}</p>
        <p class="language"><b>Idioma:</b> ${details.Language}</p>
        <p class="awards"><b><i class="fa-award"></i>Prêmios:</b> ${details.Awards}</p>
    </div>
    `;
}

window.addEventListener('click', (event) => {
    if (event.target.className !== "form-control") {
        searchlist.classList.add('hide-search-list');
    }
});
