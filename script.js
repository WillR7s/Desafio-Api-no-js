const moviesContainer = document.querySelector('.Filmes');

// Chave da API (ou importada via config.js)
const ACCESS_TOKEN = 'SEU_TOKEN_AQUI';

// Elementos de Busca
const searchInput = document.querySelector('.InputBusca');
const searchIcon = document.querySelector('.buscar i');

// 1. Função para montar e retornar o card do filme
function renderMovie(movie) {
  const movieElement = document.createElement('div');
  movieElement.classList.add('filme');

  // Imagem
  const movieImage = document.createElement('img');
  // Aceita tanto a imagem já tratada quanto o poster_path direto da API
  movieImage.src = movie.image || (movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : 'img/placeholder.svg');
  movieImage.alt = movie.title;
  movieElement.appendChild(movieImage);

  // Bloco central: .conteudo1
  const contentDiv = document.createElement('div');
  contentDiv.classList.add('conteudo1');

  // Título
  const movieTitle = document.createElement('h3');
  movieTitle.textContent = movie.title;
  contentDiv.appendChild(movieTitle);

  // Sub-conteúdo: estrela, nota e favorito
  const subContent = document.createElement('div');
  subContent.classList.add('subcont');

  const starIcon = document.createElement('i');
  starIcon.className = 'fa-solid fa-star';
  starIcon.id = 'star';
  subContent.appendChild(starIcon);

  const ratingSpan = document.createElement('span');
  // Arredonda a nota caso venha da API com várias casas decimais
  const nota = typeof movie.rating !== 'undefined' ? movie.rating : movie.vote_average;
  ratingSpan.textContent = typeof nota === 'number' ? nota.toFixed(1) : nota;
  subContent.appendChild(ratingSpan);

  // Favorito
  const favDiv = document.createElement('div');
  favDiv.classList.add('fav');

  const heartIcon = document.createElement('i');
  heartIcon.className = movie.isFavorited ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
  heartIcon.id = 'heart';

  const favText = document.createElement('p');
  favText.textContent = 'Favoritar';

  favDiv.appendChild(heartIcon);
  favDiv.appendChild(favText);
  subContent.appendChild(favDiv);

  contentDiv.appendChild(subContent);
  movieElement.appendChild(contentDiv);

  // Sinopse
  const movieDescription = document.createElement('p');
  movieDescription.classList.add('descricao');
  movieDescription.textContent = movie.description || movie.overview || 'Sinopse não disponível.';
  movieElement.appendChild(movieDescription);

  return movieElement;
}

// 2. Função que renderiza uma lista qualquer de filmes no container
function renderMovieList(movies) {
  moviesContainer.innerHTML = '';

  if (!movies || movies.length === 0) {
    moviesContainer.innerHTML = '<p style="color: white; font-size: 18px; margin-top: 30px;">Nenhum filme encontrado.</p>';
    return;
  }

  movies.forEach(movie => {
    const card = renderMovie(movie);
    moviesContainer.appendChild(card);
  });
}

// 3. Buscar Filmes Populares na API (Apenas busca e retorna os dados)
async function carregarFilmesPopulares() {
  const url = 'https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1';

  const opcoes = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${Token_Api}`
    }
  };

  try {
    const resposta = await fetch(url, opcoes);
    if (!resposta.ok) throw new Error(`Erro na requisição: ${resposta.status}`);

    const dados = await resposta.json();
    return dados.results; // Retorna o array de 20 filmes
  } catch (erro) {
    console.error('Falha ao carregar a lista de filmes populares:', erro);
    return [];
  }
}

// 4. Buscar Filmes por Texto na API
async function searchMovies(query) {
  // Se o campo estiver vazio, recarrega os populares
  if (!query || query.trim() === '') {
    const popularMovies = await carregarFilmesPopulares();
    renderMovieList(popularMovies);
    return;
  }

  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=pt-BR&page=1`;

  const opcoes = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${Token_Api}`
    }
  };

  try {
    const fetchResponse = await fetch(url, opcoes);
    if (!fetchResponse.ok) throw new Error(`Erro HTTP: ${fetchResponse.status}`);

    const { results } = await fetchResponse.json();
    renderMovieList(results);
  } catch (error) {
    console.error('Erro ao pesquisar filmes:', error);
  }
}

// 5. Eventos da Barra de Busca
searchInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    searchMovies(searchInput.value);
  }
});

searchIcon.addEventListener('click', () => {
  searchMovies(searchInput.value);
});

// 6. Carregamento Inicial ao abrir a página
window.onload = async function() {
  const movies = await carregarFilmesPopulares();
  renderMovieList(movies);
};

