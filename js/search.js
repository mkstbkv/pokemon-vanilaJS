document.addEventListener('DOMContentLoaded', () => {
    const url = 'https://pokeapi.co/api/v2/pokemon/';
    const allPokemon = [];
    const resultsBlock = document.getElementById('result-block');
    const paginationBlock = document.getElementById('pagination');
    const form = document.getElementById('form');
    const inputText = document.getElementById('inputText');
    const inputNumber = document.getElementById('inputNumber');
    const sortSelect = document.getElementById('sortSelect');
    const orderSelect = document.getElementById('orderSelect');
    const typeSelect = document.getElementById('typeSelect');
    const loader = document.getElementById('preloader');

    const fetchData = async url => {
        const response = await fetch(url);
        if (response.ok) {
            return await response.json();
        } else {
            console.log('Что то пошло не так. Ошибка: ' + response.status);
        }
    };

    function numberOfButtons (arr, num) {
        return Math.ceil(arr.length/num )
    }

    function paintPaginationButton ( count ) {
        for( i = 1, r = ""; i <= count; i++ ){
            r += `<button class="pagination-button">${ i }</button>`;
        }
        return r;
    }

    function paintResult (arr) {
        for ( i = 0, r = ""; i < arr.length; i++ ) {
            const favorites = JSON.parse(localStorage.getItem('favorites'));
            if (favorites) {
                if (favorites.includes( arr[i].name) ) {
                    r += `
                        <div class="result-card">
                            <img src="${  arr[i].img ? arr[i].img : `../images/no-image.png`} " alt="${  arr[i].name }"/>
                            <p>${  arr[i].name }</p>
                            <p>Рост: ${  arr[i].height }</p>
                            <p>Вес: ${  arr[i].weight }</p>
                            <p>Тип: ${ arr[i].types.type_1 }</p>
                            <button class="btnAddToFavorite ${  arr[i].name }">Удалить из избранного</button>
                            <a href="../pages/pokemon-info.html" class="pokemon-info ${  arr[i].name }">More info</a>  
                        </div>
                    `;
                } else {
                    r += `
                        <div class="result-card">
                            <img src="${  arr[i].img ? arr[i].img : `../images/no-image.png`} " alt="${  arr[i].name }"/>
                            <p>${  arr[i].name }</p>
                            <p>Рост: ${  arr[i].height }</p>
                            <p>Вес: ${  arr[i].weight }</p>
                            <p>Тип: ${ arr[i].types.type_1 }</p>
                            <button class="btnAddToFavorite ${  arr[i].name }">Добавить в избранное</button>
                            <a href="../pages/pokemon-info.html" class="pokemon-info ${  arr[i].name }">More info</a>  
                        </div>
                    `;
                }
            } else {
                r += `
                    <div class="result-card">
                            <img src="${  arr[i].img ? arr[i].img : `../images/no-image.png`} " alt="${  arr[i].name }"/>
                        <p>${  arr[i].name }</p>
                        <p>Рост: ${  arr[i].height }</p>
                        <p>Вес: ${  arr[i].weight }</p>
                        <p>Тип: ${ arr[i].types.type_1 }</p>
                        <button class="btnAddToFavorite ${  arr[i].name }">Добавить в избранное</button>
                        <a href="../pages/pokemon-info.html" class="pokemon-info ${  arr[i].name }">More info</a>
                    </div>
                `;
            }
        }
        return r;
    }

    const btnAddToFavorite = event =>{
        let favorites = JSON.parse(localStorage.getItem('favorites'));
        if (favorites) {
            if (!favorites.includes(event.target.classList[1])) {
                favorites.push(event.target.classList[1]);
                localStorage.setItem('favorites', JSON.stringify(favorites));
                event.target.innerText = 'Удалить из избранного';
            } else {
                favorites.splice(favorites.indexOf(event.target.classList[1]), 1);
                localStorage.setItem('favorites', JSON.stringify(favorites));
                event.target.innerText = 'Добавить в избранное';
            }
        } else {
            const fav = [];
            fav.push(event.target.classList[1]);
            localStorage.setItem('favorites', JSON.stringify(fav));
            event.target.innerText = 'Удалить из избранного';
        }
    }

    const paginationButton = (event, pokemons) => {
        const limitLocal = parseInt(JSON.parse(localStorage.getItem('limit')));
        let searchPokemons = JSON.parse(localStorage.getItem('searchPokemons'));

        loader.style.display = 'block';
        addClassActive(event.target);
        const y = event.target.textContent;
        const start = limitLocal * (y - 1);
        const end = limitLocal * y;

        if (!searchPokemons) {
            resultsBlock.innerHTML = paintResult(pokemons.slice(start, end));
        } else {
            resultsBlock.innerHTML = paintResult(searchPokemons.slice(start, end));
        }
        loader.style.display = 'none';
        localStorage.setItem('onPaginationPage', JSON.stringify(event.target.textContent));
    }

    const addClassActive = ( page ) => {
        const activePage = document.querySelector('.active');
        activePage.classList.remove('active');
        page.classList.add('active');
    }

    const searchPagination = arr => {
        const onPage = parseInt(JSON.parse(localStorage.getItem('onPaginationPage')));
        const limitLocal = parseInt(JSON.parse(localStorage.getItem('limit')));

        paginationBlock.innerHTML = paintPaginationButton(numberOfButtons(arr, limitLocal));
        paginationBlock.children[0].classList.add('active');
        if (onPage) {
            resultsBlock.innerHTML = paintResult(arr.slice((limitLocal * (onPage - 1)), limitLocal * onPage));
            const page = document.querySelectorAll('.pagination-button');
            for (let i = 0; i < page.length; i++) {
                if (page[i].textContent === onPage.toString()) {
                    addClassActive(page[i]);
                }
            }
        } else {
            resultsBlock.innerHTML = paintResult(arr.slice(0, limitLocal));
        }
    }

    function sortInArr (field, order) {
        if (order === 'increase') {
            return (a, b) => a[field] > b[field] ? 1 : -1;
        } else if (order === 'decrease') {
            return (a, b) => a[field] > b[field] ? -1 : 1;
        }
        return 0;
    }

    const submit = (arr, input, type, sort, order,) => {
        paginationBlock.innerHTML = '';

        if (!(input === '')) {
            let pokemonData = [];
            arr.forEach(pokemon => {
                if ((pokemon.name.includes(input.toLowerCase())) && (type === pokemon.types.type_1)) {
                    pokemonData.push(pokemon);
                }
            });

            if (pokemonData.length <= 0) {
                resultsBlock.innerHTML = `
                   <p>Извините, по вашему запросу ничего не найдено. Измените параметры поиска</p>
               `;
            } else {
                pokemonData.sort(sortInArr(sort, order));
                localStorage.setItem('searchPokemons', JSON.stringify(pokemonData));
                searchPagination(pokemonData);
            }

        } else {
            localStorage.setItem('input', '');
            let pokemonData = [];
            arr.forEach(pokemon => {
                if (type === pokemon.types.type_1) {
                    pokemonData.push(pokemon);
                }
            });
            pokemonData.sort(sortInArr(sort, order));
            localStorage.setItem('searchPokemons', JSON.stringify(pokemonData));
            searchPagination(pokemonData);
        }
    }

    const run = async () => {
        const limit = parseInt(JSON.parse(localStorage.getItem('limit')));
        let pokemons = JSON.parse(localStorage.getItem('pokemons'));
        let input = localStorage.getItem('input');
        let sort = localStorage.getItem('sort');
        let order = localStorage.getItem('order');
        if (input) {
            inputText.value = input
        }
        if (sort) {
            sortSelect.value = sort
        }
        if (order) {
            orderSelect.value = order
        }
        if (isNaN(limit)) {
            localStorage.setItem('limit', JSON.stringify(10));
            inputNumber.value = 10;
        }

        if (!pokemons) {
            loader.style.display = 'block';
            let data = await fetchData(url + '?limit=100000&offset=0');
            for (let i = 0; i < data.results.length; i++) {
                const pokemon = await fetchData(url + data.results[i].name);
                const allType = (arr) => {
                    if (arr.length === 2) {
                        return {type_1: arr[0].type.name, type_2: arr[1].type.name}
                    } else if (arr.length === 1) {
                        return {type_1: arr[0].type.name}
                    }
                }
                const obj = {
                    id: pokemon.id,
                    name: pokemon.name,
                    height: pokemon.height,
                    weight: pokemon.weight,
                    types: allType(pokemon.types),
                    img: pokemon.sprites.other['official-artwork'].front_default,
                    stats: {
                        hp: pokemon.stats[0].base_stat,
                        attack: pokemon.stats[1].base_stat,
                        defense: pokemon.stats[2].base_stat,
                        special_attack: pokemon.stats[3].base_stat,
                        special_defense: pokemon.stats[4].base_stat,
                        speed: pokemon.stats[5].base_stat,
                    }
                }
                allPokemon.push(obj);
            }
            localStorage.setItem('pokemons', JSON.stringify(allPokemon));
        }

        pokemons = JSON.parse(localStorage.getItem('pokemons'));
        let searchPokemons = JSON.parse(localStorage.getItem('searchPokemons'));
        if (!searchPokemons) {
            searchPagination(pokemons);

        } else {
            searchPagination(searchPokemons);
        }
        loader.style.display = 'none';

        document.addEventListener('click',async function (event){
            if ([...event.target.classList].includes("pagination-button")) {
                paginationButton(event, pokemons)
            }
        });

        document.addEventListener('click',function (event){
            if ([...event.target.classList].includes("btnAddToFavorite")) {
               btnAddToFavorite(event);
            }
        });

        document.addEventListener('click',function (event){
            if ([...event.target.classList].includes("pokemon-info")) {
                let pokemon = event.target.classList[1];
                localStorage.setItem('pokemon', pokemon);
            }
        });

        form.addEventListener('submit', async e => {
            e.preventDefault();
            localStorage.setItem('limit', inputNumber.value);
            localStorage.setItem('onPaginationPage', '1');
            localStorage.setItem('sort', sortSelect.value);
            localStorage.setItem('order', orderSelect.value);
            localStorage.setItem('type', typeSelect.value);
            if (!(inputText.value === '')) {
                localStorage.setItem('input', inputText.value);
            }
            loader.style.display = 'block';

            submit(pokemons, inputText.value, typeSelect.value, sortSelect.value, orderSelect.value);
            loader.style.display = 'none';
        });
    };

    run();
});
