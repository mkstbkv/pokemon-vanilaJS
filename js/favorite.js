document.addEventListener('DOMContentLoaded', () => {
    const url = 'https://pokeapi.co/api/v2/pokemon/';
    let favorites = JSON.parse(localStorage.getItem('favorites'));
    const resultsBlock = document.getElementById('result-block');
    const loader = document.getElementById('preloader');

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
            const getPokemonInfo = await fetchData(url + arr[i]);
            const types = getPokemonInfo.types.map(t => t.type.name);
            const favoritesPok = JSON.parse(localStorage.getItem('favorites'));
            if (favoritesPok) {
                if (favoritesPok.includes(getPokemonInfo.name)) {
                    r += `
                        <div class="result-card">
                            <img src="${ getPokemonInfo['sprites']['front_default'] }" alt="${ getPokemonInfo.name }"/>
                            <p>${ getPokemonInfo.name }</p>
                            <p>Рост: ${ getPokemonInfo.height }</p>
                            <p>Вес: ${ getPokemonInfo.weight }</p>
                            <p>Тип: ${ types.join(', ') }</p>
                            <button class="btnAddToFavorite ${ getPokemonInfo.name }">Удалить из ибранного</button>
                            <a href="../pages/pokemon-info.html" class="pokemon-info ${ getPokemonInfo.name }">More info</a>  
                        </div>
                    `;
                } else {
                    r += `
                        <div class="result-card">
                            <img src="${ getPokemonInfo['sprites']['front_default'] }" alt="${ getPokemonInfo.name }"/>
                            <p>${ getPokemonInfo.name }</p>
                            <p>Рост: ${ getPokemonInfo.height }</p>
                            <p>Вес: ${ getPokemonInfo.weight }</p>
                            <p>Тип: ${ types.join(', ') }</p>
                            <button class="btnAddToFavorite ${ getPokemonInfo.name }">Добавить в избранное</button>
                            <a href="../pages/pokemon-info.html" class="pokemon-info ${ getPokemonInfo.name }">More info</a>  
                        </div>
                    `;
                }
            } else {
                r += `
                    <div class="result-card">
                        <img src="${ getPokemonInfo['sprites']['front_default'] }" alt="${ getPokemonInfo.name }"/>
                        <p>${ getPokemonInfo.name }</p>
                        <p>Рост: ${ getPokemonInfo.height }</p>
                        <p>Вес: ${ getPokemonInfo.weight }</p>
                        <p>Тип: ${ types.join(', ') }</p>
                        <button class="btnAddToFavorite ${ getPokemonInfo.name }">Добавить в избранное</button>
                        <a href="../pages/pokemon-info.html" class="pokemon-info ${ getPokemonInfo.name }">More info</a>
                    </div>
                `;
            }
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
                        event.target.innerText = 'Удалить из ибранного';

                    } else {
                        favoritesPok.splice(favoritesPok.indexOf(event.target.classList[1]), 1);
                        localStorage.setItem('favorites', JSON.stringify(favoritesPok));
                        event.target.innerText = 'Добавить в избранное';

                    }
                } else {
                    const fav = [];
                    fav.push(event.target.classList[1]);
                    localStorage.setItem('favorites', JSON.stringify(fav));
                    event.target.innerText = 'Удалить из ибранного';
                }
            }
            let favoritesPok = JSON.parse(localStorage.getItem('favorites'));
            resultsBlock.innerHTML = await paintResult(favoritesPok);
        });
    };
    run();
});
