document.addEventListener('DOMContentLoaded', () => {
    let favorites = JSON.parse(localStorage.getItem('favorites'));
    let pokemons = JSON.parse(localStorage.getItem('pokemons'));
    const resultsBlock = document.getElementById('result-block');
    const loader = document.getElementById('preloader');

    function paintResult (arr) {
        for ( i = 0, r = ""; i < arr.length; i++ ) {
            let pokemon = null;
            pokemons.forEach(pok => {
                if (pok.name === arr[i]) {
                    pokemon = pok;
                }
            });
            const favoritesPok = JSON.parse(localStorage.getItem('favorites'));
            if (favoritesPok) {
                if (favoritesPok.includes(pokemon.name)) {
                    r += `
                        <div class="result-card">
                            <img src="${  pokemon.img ? pokemon.img : `../images/no-image.png`} " alt="${  pokemon.name }"/>
                            <p>${  pokemon.name }</p>
                            <p>Рост: ${  pokemon.height }</p>
                            <p>Вес: ${  pokemon.weight }</p>
                            <p>Тип: ${ pokemon.types.type_1 }</p>
                            <button class="btnAddToFavorite ${  pokemon.name }">Удалить из избранного</button>
                            <a href="../pages/pokemon-info.html" class="pokemon-info ${  pokemon.name }">More info</a>  
                        </div>
                    `;
                }
            }
        }
        return r;
    }


    const run = async () => {
        if (favorites && favorites.length > 0) {
            loader.style.display = 'block';
            resultsBlock.innerHTML = paintResult(favorites);
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
            resultsBlock.innerHTML = paintResult(favoritesPok);
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
