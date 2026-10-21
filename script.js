const moviesContainer = document.querySelector('.Filmes');  // seleciona a sessão onde os filmes vao entrar
const movies = [
  {
    title: 'Avengers Endgame (2019)',
    image: 'img/Avengers.svg',
    rating: 9.2,
    isFavorited: false,
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
  },
  {
    title: 'Batman (2022)',
    image: 'img/BATMAN.svg',
    rating: 9.4,
    isFavorited: true,
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
  }
];
console.log(moviesContainer);
console.log(movies);

movies.forEach(movie => {
  // 1. Criar o contentor principal do filme
  const movieCard = document.createElement('div');
  movieCard.classList.add('filme');

  // Teste temporário: colocar apenas o título lá dentro
  movieCard.textContent = movie.title;

  // 2. Colocar o cartão criado dentro da secção principal
  moviesContainer.appendChild(movieCard);
});