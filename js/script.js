const movieSearchBox = document.getElementById('movie-search-box');
const searchlist = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

// Carregar filmes com a API
async function loadMovies(searchTerm) {
    const URL = `http://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=d3a09049`;
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
    for (let idx = 0; idx < movies.length; idx++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID;
        movieListItem.classList.add('search-list-item');

        let moviePoster = movies[idx].Poster !== "N/A" ? movies[idx].Poster : "img/image_not_found.jpg";

        movieListItem.innerHTML = `
            <div class="search-item-thumbnail">
                <img src="${moviePoster}" alt="Poster do filme">
            </div>
            <div class="search-item-info">
                <h3>${movies[idx].Title}</h3>
                <p>${movies[idx].Year}</p>
            </div>
        `;
        searchlist.appendChild(movieListItem);
    }
}
