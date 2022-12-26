document.addEventListener('DOMContentLoaded', () => {
    let favorites = JSON.parse(localStorage.getItem('favorites'));
    let pokemons = JSON.parse(localStorage.getItem('pokemons'));
    const resultsBlock = document.getElementById('result-block');
    const loader = document.getElementById('preloader');
    const url = 'https://pokeapi.co/api/v2/pokemon/';
    const fetchData = async url => {
        const response = await fetch(url);
        if (response.ok) {
            return await response.json();
        } else {
            console.log('Что то пошло не так. Ошибка: ' + response.status);
        }
    };

    async function paintResult (arr) {
        for ( i = 0, r = ""; i < arr.length; i++ ) {

            let pokemon = null;
            pokemons.forEach(pok => {
                if (pok.name === arr[i]) {
                    pokemon = pok;
                }
            });
            let pokemonData = await fetchData(url + pokemon.name);

            r += `
                <div class="result-card fav-card">
                    <img src="${  pokemonData.sprites.other["official-artwork"].front_default ? pokemonData.sprites.other["official-artwork"].front_default : `../images/no-image.png`} "
                        alt="${  pokemonData.name }"/>
                    <p>${  pokemonData.name }</p>
                    <button class="btnAddToFavorite ${  pokemonData.name }">Удалить из избранного</button>
                    <a href="../pages/pokemon-info.html" class="pokemon-info ${  pokemonData.name }">More info</a>  
                </div>
            `;
        }
        return r;
    }


    const run = async () => {
        if (favorites && favorites.length > 0) {
            loader.style.display = 'block';
            resultsBlock.innerHTML = await paintResult(favorites);
            loader.style.display = 'none';
        }

        document.addEventListener('click', async function (event){
            if ([...event.target.classList].includes("btnAddToFavorite")) {
                let favoritesPok = JSON.parse(localStorage.getItem('favorites'));
                if (favoritesPok) {
                    if (!favoritesPok.includes(event.target.classList[1])) {
                        favoritesPok.push(event.target.classList[1]);
                        localStorage.setItem('favorites', JSON.stringify(favoritesPok));
                        event.target.innerText = 'Удалить из избранного';

                    } else {
                        favoritesPok.splice(favoritesPok.indexOf(event.target.classList[1]), 1);
                        localStorage.setItem('favorites', JSON.stringify(favoritesPok));
                        event.target.innerText = 'Добавить в избранное';
                    }
                }
            }
            let favoritesPok = JSON.parse(localStorage.getItem('favorites'));
            resultsBlock.innerHTML = await paintResult(favoritesPok);
        });

        document.addEventListener('click',function (event){
            if ([...event.target.classList].includes("pokemon-info")) {
                let pokemon = event.target.classList[1];
                localStorage.setItem('pokemon', pokemon);
            }
        });
    };
    run();
});
