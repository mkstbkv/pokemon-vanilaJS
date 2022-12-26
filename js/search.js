document.addEventListener('DOMContentLoaded', () => {
    const url = 'https://pokeapi.co/api/v2/pokemon/';
    const resultsBlock = document.getElementById('result-block');
    const paginationBlock = document.getElementById('pagination');
    const inputText = document.getElementById('inputText');
    const inputNumber = document.getElementById('inputNumber');
    const orderSelect = document.getElementById('orderSelect');
    const btnNext = document.getElementById('btnNext');
    const btnPrevious = document.getElementById('btnPrevious');
    const loader = document.getElementById('preloader');
    const textBtn = document.getElementById('text-field-btn');
    const numberMinus = document.getElementById('number-minus');
    const numberPlus = document.getElementById('number-plus');

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

    async function paintResult (arr) {
        const favorites = JSON.parse(localStorage.getItem('favorites'));
        for ( i = 0, r = ""; i < arr.length; i++ ) {
            const pok = await fetchData(url + arr[i].name);
            if (favorites) {
                if (favorites.includes( arr[i].name) ) {
                    r += `
                        <div class="result-card fav-card">
                            <img src="${  pok.sprites.other["official-artwork"].front_default ? pok.sprites.other["official-artwork"].front_default : `../images/no-image.png`} "
                                alt="${  pok.name }"/>
                            <p>${  pok.name }</p>
                            <button class="btnAddToFavorite ${  pok.name }">Удалить из избранного</button>
                            <a href="../pages/pokemon-info.html" class="pokemon-info ${  pok.name }">More info</a>  
                        </div>
                    `;
                } else {
                    r += `
                        <div class="result-card">
                            <img src="${  pok.sprites.other["official-artwork"].front_default ? pok.sprites.other["official-artwork"].front_default : `../images/no-image.png`} "
                                alt="${  pok.name }"/>
                            <p>${  arr[i].name }</p>
                            <button class="btnAddToFavorite ${  pok.name }">Добавить в избранное</button>
                            <a href="../pages/pokemon-info.html" class="pokemon-info ${  pok.name }">More info</a>  
                        </div>
                    `;
                }
            } else {
                r += `
                    <div class="result-card">
                        <img src="${  pok.sprites.other["official-artwork"].front_default ? pok.sprites.other["official-artwork"].front_default : `../images/no-image.png`} "
                                alt="${  pok.name }"/>
                        <p>${  pok.name }</p>
                        <button class="btnAddToFavorite ${  pok.name }">Добавить в избранное</button>
                        <a href="../pages/pokemon-info.html" class="pokemon-info ${  pok.name }">More info</a>
                    </div>
                `;
            }
        }
        return r;
    }

    function hideOverPages() {
        let items = [...paginationBlock.children];
        if (items.length > 5) {
            items.forEach((item) => item.classList.add("hide"));
            items[0].classList.remove("hide");
            const active = document.querySelector('.active');

            if (active.previousElementSibling) {
                active.previousElementSibling.classList.remove("hide");
            }
            active.classList.remove("hide");
            if (active.nextElementSibling) {
                active.nextElementSibling.classList.remove("hide");
            }
            items[items.length - 1].classList.remove("hide");
        }
    }

    const paginationButton = async (event, pokemons) => {
        if (event.target.classList[1] === 'hide') {
            return;
        }
        const limitLocal = parseInt(JSON.parse(localStorage.getItem('limit')));
        let searchPokemons = JSON.parse(localStorage.getItem('searchPokemons'));
        addClassActive(event.target);
        const y = event.target.textContent;
        const start = limitLocal * (y - 1);
        const end = limitLocal * y;
        resultsBlock.innerHTML = '';
        if (!searchPokemons || searchPokemons.length === 0) {
            loader.style.display = 'block';
            resultsBlock.innerHTML = (await paintResult(pokemons.slice(start, end)));
            hideOverPages();
            loader.style.display = 'none';
        } else {
            loader.style.display = 'block';
            resultsBlock.innerHTML = await paintResult(searchPokemons.slice(start, end));
            hideOverPages();
            loader.style.display = 'none';
        }
        loader.style.display = 'none';
        localStorage.setItem('onPaginationPage', event.target.textContent);
    }

    const btnAddToFavorite = event =>{
        let favorites = JSON.parse(localStorage.getItem('favorites'));
        if (favorites && favorites.length >= 1) {
            if (!favorites.includes(event.target.classList[1])) {
                favorites.push(event.target.classList[1]);
                localStorage.setItem('favorites', JSON.stringify(favorites));
                event.target.innerText = 'Удалить из избранного';
                event.path[1].classList.add('fav-card');

            } else {
                favorites.splice(favorites.indexOf(event.target.classList[1]), 1);
                localStorage.setItem('favorites', JSON.stringify(favorites));
                event.target.innerText = 'Добавить в избранное';
                event.path[1].classList.remove('fav-card');
            }
        } else {
            const fav = [];
            fav.push(event.target.classList[1]);
            localStorage.setItem('favorites', JSON.stringify(fav));
            event.target.innerText = 'Удалить из избранного';
            event.path[1].classList.add('fav-card');
        }
    }

    const orderSort = async () => {
        let pokemonsOrder = JSON.parse(localStorage.getItem('pokemons'));
        let searchPokemonsOrder = JSON.parse(localStorage.getItem('searchPokemons'));

        if (orderSelect.value === '') {
            if (!searchPokemonsOrder || (searchPokemonsOrder.length === 0)) {
                await searchPagination(pokemonsOrder);
            } else {
                await searchPagination(searchPokemonsOrder);
            }
        } else if (orderSelect.value === 'increase') {
            if (!searchPokemonsOrder || (searchPokemonsOrder.length === 0)) {
                pokemonsOrder.sort(sortInArr('increase'));
                await searchPagination(pokemonsOrder);
            } else {
                searchPokemonsOrder.sort(sortInArr('increase'));
                await searchPagination(searchPokemonsOrder);
            }
        } else if (orderSelect.value === 'decrease') {
            if (!searchPokemonsOrder || (searchPokemonsOrder.length === 0)) {
                pokemonsOrder.sort(sortInArr('decrease'));
                await searchPagination(pokemonsOrder);
            } else {
                searchPokemonsOrder.sort(sortInArr('decrease'));
                await searchPagination(searchPokemonsOrder);
            }
        }
    }

    const addClassActive = ( page ) => {
        const activePage = document.querySelector('.active');
        if (activePage) {
            activePage.classList.remove('active');
        }
        page.classList.add('active');
    }

    const searchPagination = async arr => {
        const onPage = parseInt(localStorage.getItem('onPaginationPage'));
        const limitLocal = parseInt(JSON.parse(localStorage.getItem('limit')));
        paginationBlock.innerHTML = "";
        resultsBlock.innerHTML = "";
        paginationBlock.innerHTML = paintPaginationButton(numberOfButtons(arr, limitLocal));
        if (onPage) {
            resultsBlock.innerHTML = await paintResult(arr.slice((limitLocal * (onPage - 1)), limitLocal * onPage));
            const page = document.querySelectorAll('.pagination-button');
            for (let i = 0; i < page.length; i++) {
                if (page[i].textContent === onPage.toString()) {
                    addClassActive(page[i]);
                }
            }
            hideOverPages();
        } else {
            paginationBlock.children[0].classList.add('active');
            resultsBlock.innerHTML = await paintResult(arr.slice(0, limitLocal));
            hideOverPages();
        }
    }

    function sortInArr (order) {
        if (order === 'increase') {
            return (a, b) => a.name > b.name ? 1 : -1;
        } else if (order === 'decrease') {
            return (a, b) => a.name > b.name ? -1 : 1;
        }
        return 0;
    }

    const submit = async (arr, input) => {
        paginationBlock.innerHTML = '';
        orderSelect.value = '';
        if (!(input === '')) {
            let pokemonData = [];
            arr.forEach(pokemon => {
                if (pokemon.name.includes(input.toLowerCase())) {
                    pokemonData.push(pokemon);
                }
            });

            if (pokemonData.length <= 0) {
                resultsBlock.innerHTML = `
                   <p>Извините, по вашему запросу ничего не найдено. Измените параметры поиска</p>
               `;
            } else {
                localStorage.setItem('searchPokemons', JSON.stringify(pokemonData));
                await searchPagination(pokemonData);
            }

        } else {
            localStorage.setItem('input', '');
            localStorage.setItem('searchPokemons', JSON.stringify(arr));
            await searchPagination(arr);
        }
    }

    const run = async () => {
        let pokemons = JSON.parse(localStorage.getItem('pokemons'));
        let limit = parseInt(localStorage.getItem('limit'));
        if (!limit) {
            localStorage.setItem('limit', '10');
        } else {
            inputNumber.value = limit;
        }

        if (!pokemons) {
            loader.style.display = 'block';
            let data = await fetchData(url + '?limit=100000&offset=0');
            localStorage.setItem('pokemons', JSON.stringify(data.results));
        }

        pokemons = JSON.parse(localStorage.getItem('pokemons'));
        let searchPokemons = JSON.parse(localStorage.getItem('searchPokemons'));
        loader.style.display = 'none';

        if (!searchPokemons || (searchPokemons.length === 0)) {
           await searchPagination(pokemons);
        } else {
           await searchPagination(searchPokemons);
        }


        document.addEventListener('click',async function (event){
            if ([...event.target.classList].includes("pagination-button")) {
                await paginationButton(event, pokemons);
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


        textBtn.addEventListener('click', async e => {
            localStorage.setItem('onPaginationPage', '1');
            if (!(inputText.value === '')) {
                localStorage.setItem('input', inputText.value);
            }
            loader.style.display = 'block';
            await submit(pokemons, inputText.value);
            loader.style.display = 'none';
        });

        numberMinus.addEventListener('click', async e => {
            if (inputNumber.value === 5) {
                return;
            }
            e.target.nextElementSibling.stepDown();
            localStorage.setItem('limit', inputNumber.value.toString());
            let minPokemons = JSON.parse(localStorage.getItem('pokemons'));
            let searchMinPokemons = JSON.parse(localStorage.getItem('searchPokemons'));
            loader.style.display = 'block';

            if (!searchMinPokemons || (searchMinPokemons.length === 0)) {
                await searchPagination(minPokemons);
            } else {
                await searchPagination(searchMinPokemons);
            }
            loader.style.display = 'none';
        });

        numberPlus.addEventListener('click', async e => {
            if (inputNumber.value === 20) {
                e.preventDefault();
                return;
            }
            e.target.previousElementSibling.stepUp();
            localStorage.setItem('limit', inputNumber.value.toString());
            let plusPokemons = JSON.parse(localStorage.getItem('pokemons'));
            let searchPlusPokemons = JSON.parse(localStorage.getItem('searchPokemons'));
            loader.style.display = 'block';

            if (!searchPlusPokemons || (searchPlusPokemons.length === 0)) {
                await searchPagination(plusPokemons);
            } else {
                await searchPagination(searchPlusPokemons);
            }
            loader.style.display = 'none';
        });

        orderSelect.addEventListener('change', async () => {
           await orderSort()
        });

        btnNext.addEventListener('click', async () => {
            loader.style.display = 'block';
            resultsBlock.innerHTML = "";

            const activePage = document.querySelector('.active');
            const nextElement = activePage.nextElementSibling;

            if (!nextElement) {
                btnNext.setAttribute("disabled", "disabled");
            } else if (nextElement){
                if (activePage) {
                    activePage.classList.remove('active');
                }
                localStorage.setItem('onPaginationPage', nextElement.textContent);
                nextElement.classList.add('active');
                let searchData = JSON.parse(localStorage.getItem('searchPokemons'));
                if (!searchData || (searchData.length === 0)) {
                    await searchPagination(pokemons);
                } else {
                    await searchPagination(searchData);
                }
            }
            loader.style.display = 'none';
        });

        btnPrevious.addEventListener('click', async () => {
            loader.style.display = 'block';
            resultsBlock.innerHTML = "";
            const activePage = document.querySelector('.active');

            const previousElement = activePage.previousElementSibling;
            if (!previousElement) {
                btnPrevious.setAttribute("disabled", "disabled");
            } else if (previousElement) {
                if (activePage) {
                    activePage.classList.remove('active');
                }
                localStorage.setItem('onPaginationPage', previousElement.textContent);
                previousElement.classList.add('active');
                let searchData = JSON.parse(localStorage.getItem('searchPokemons'));
                if (!searchData || (searchData.length === 0)) {
                    await searchPagination(pokemons);
                } else {
                    await searchPagination(searchData);
                }
            }
            loader.style.display = 'none';
        });
    };

    run();
});

