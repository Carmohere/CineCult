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
        <img src="${details.Poster !== "N/A" ? details.Poster : "/img/image_not_found.jpg"}" alt="Poster do filme">
    </div>
    <div class="movie-info">
        <h3 class="movie-title">${details.Title}</h3>
        <ul class="movie-misc-info">
            <li class="year">Year: ${details.Year}</li>
            <li class="rated">Ratings: ${details.Rated}</li>
            <li class="released">Released: ${details.Released}</li>
        </ul>
        <p class="genre"><b>Genre:</b> ${details.Genre}</p>
        <p class="writer"><b>Writer:</b> ${details.Writer}</p>
        <p class="actors"><b>Actors:</b> ${details.Actors}</p>
        <p class="plot"><b>Plot:</b> ${details.Plot}</p>
        <p class="language"><b>Language:</b> ${details.Language}</p>
        <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
}

window.addEventListener('click', (event) => {
    if (event.target.className !== "form-control") {
        searchlist.classList.add('hide-search-list');
    }
});