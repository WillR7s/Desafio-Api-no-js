const moviesContainer =document.querySelector('.Filmes');    //onde os filmes serão adicionados

const movies = [
  {
    title: 'Avengers Endgame (2019)',
    image: 'img/Avengers.svg',
    rating: 9.2,
    isFavorited: false,
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
  },
  {
  title: 'Batman (2022)',
    image: 'img/BATMAN.svg',
    rating: 9.4,
    isFavorited: true,
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
  },
  {
    title: 'Doctor Strange in the Multiverse of Madness',
    image: 'img/D.STRANGE.svg',
    rating: 8.5,
    isFavorited: false,
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
  },
  {
    title: 'Avatar (2009)',
    image: 'img/AVATAR.svg',
    rating: 9.5,
    isFavorited: true,
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
  }
]


//-- Criar Função para montar o card dos filmes

function renderMovie(movie){

  // 1. Criando As DIVs
  //  Cria a caixa principal: <div class="filme"></div>
  const movieElement=document.createElement('div');
  movieElement.classList.add('filme');

   // 2. Cria a imagem: <img src="..." alt="...">
  const movieImage = document.createElement('img');
  movieImage.src = movie.image;
  movieImage.alt = movie.title;


  // 3. Coloca a imagem dentro da caixa principal
  movieElement.appendChild(movieImage);

  

  //Criando a div.conteudo1
  const contentDiv= document.createElement('div');
  contentDiv.classList.add('conteudo1');

  //Criando o titulo do filme
  const movieTitle = document.createElement ('h3');
  movieTitle.textContent = movie.title;
 
 contentDiv.appendChild(movieTitle);

  //Criando div.subcont
  const subContent = document.createElement('div');
  subContent.classList.add('subcont');

  // Ícone da estrela 
  const starIcon = document.createElement('i');
  starIcon.className = 'fa-solid fa-star';
  starIcon.id ='star';
  subContent.appendChild(starIcon);

  //Nota
  const ratingSpan =document.createElement('span');
  ratingSpan.textContent =movie.rating;
  subContent.appendChild(ratingSpan);

// Bloco de Favorito
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

  // Anexa a sub-linha ao bloco central
  contentDiv.appendChild(subContent);

  // Anexa o bloco central ao cartão principal
  movieElement.appendChild(contentDiv);

  const movieDescription = document.createElement('p');
  movieDescription.classList.add('descricao');
  movieDescription.textContent = movie.description;

  movieElement.appendChild(movieDescription);

// Retorna o elemento completo pronto
  return movieElement;

}

// ----Chamar a função para cada item da lista -------

movies.forEach(movie=>{
  const cardPronto = renderMovie(movie);
  moviesContainer.appendChild(cardPronto);
}


)

//--------------------- Consumindo a Api --------------

const ACCESS_TOKEN = 'SEU_TOKENAQUI';

// Função assíncrona responsável por buscar a lista de filmes populares da API e exibi-los na tela
async function carregarFilmesPopulares() {

  // 1. ENDEREÇO DA API (ENDPOINT):
  // Usamos a rota '/movie/popular' para pedir a lista dos filmes em alta.
  // Os parâmetros '?language=pt-BR&page=1' configuram o idioma para português do Brasil e trazem a 1ª página de resultados.
  const url = 'https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1';

  // 2. CONFIGURAÇÕES E CABEÇALHOS (HEADERS):
  // Especificamos o método HTTP (GET = pegar dados) e passamos o Bearer Token para que o TMDb autorize a requisição.
  const opcoes = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${ACCESS_TOKEN}`
    }
  };

  try {
    // 3. FAZENDO A REQUISIÇÃO:
    // O 'await fetch' envia a requisição pela rede e pausa a função até receber a resposta do servidor do TMDb.
    const resposta = await fetch(url, opcoes);

    // 4. VERIFICAÇÃO DE SUCESSO:
    // Se a resposta retornar um código de erro HTTP (ex: 401 não autorizado, 404 não encontrado), lançamos um erro.
    if (!resposta.ok) {
      throw new Error(`Erro na requisição: ${resposta.status}`);
    }

    // 5. CONVERSÃO PARA JSON:
    // O 'await resposta.json()' faz o download completo do corpo da resposta e o converte em um objeto JavaScript utilizável.
    const dados = await resposta.json();

    // 6. LIMPEZA DO HTML:
    // Esvaziamos a section '.Filmes' para garantir que filmes antigos ou testes estáticos não fiquem duplicados na tela.
    moviesContainer.innerHTML = '';

    // 7. PERCORRENDO A LISTA DE FILMES:
    // A API guarda o array de 20 filmes dentro da propriedade 'results' (dados.results).
    // O '.forEach' percorre cada um desses 20 filmes individualmente.
    dados.results.forEach(filme => {

      // 8. FORMATAÇÃO E TRATAMENTO DOS DADOS (DE-PARA):
      // Adaptamos os nomes das propriedades da API para os nomes que a nossa função 'renderMovie' espera:
      const filmeFormatado = {
        title: filme.title,    // Título original ou traduzido fornecido pela API

        // A API não devolve o link inteiro da imagem, apenas o caminho final (ex: "/poster.jpg").
        // Se houver caminho, montamos a URL com a base 'https://image.tmdb.org/t/p/w500'; se não houver, usamos uma imagem padrão
        image: filme.poster_path 
          ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
          : 'img/placeholder.svg',

          // A API envia notas com muitas casas decimais (ex: 7.842). O '.toFixed(1)' corta para apenas 1 casa decimal (7.8).
        rating: filme.vote_average.toFixed(1),

        // Inicializamos o favorito como falso (pode ser integrado com LocalStorage futuramente).
        isFavorited: false,

        // A propriedade 'overview' contém a sinopse. Se vier vazia ou nula, usamos o texto alternativo após o '||'.
        description: filme.overview || 'Sinopse não disponível.'
      };

      // 9. CRIAÇÃO DO ELEMENTO NO DOM:
      // Passamos o objeto limpo para a função 'renderMovie', que cria a div, imagem, título e textos com suas classes CSS.
      const card = renderMovie(filmeFormatado);

      // 10. INSERÇÃO NA PÁGINA:
      // Injeta o card finalizado dentro da section '.Filmes' no documento HTML.
      moviesContainer.appendChild(card);
    });

  } catch (erro) {

    // 11. TRATAMENTO DE ERROS:
    // Se a internet cair, a URL estiver incorreta ou o token expirar, o erro será capturado aqui sem quebrar o restante da página.
    console.error('Falha ao carregar a lista de filmes:', erro);
  }
}

// 12. EXECUÇÃO INICIAL:
// Chama a função logo ao carregar o script para preencher a tela automaticamente.
carregarFilmesPopulares();
