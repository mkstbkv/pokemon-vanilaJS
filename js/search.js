document.addEventListener('DOMContentLoaded', () => {
    const url = 'https://pokeapi.co/api/v2/pokemon/';
    let data = null;
    let newData = [];
    let limit = 10;
    const resultsBlock = document.getElementById('result-block');
    const paginationBlock = document.getElementById('pagination');
    const form = document.getElementById('form');
    const inputText = document.getElementById('inputText');
    const inputNumber = document.getElementById('inputNumber');
    const sortSelect = document.getElementById('sortSelect');
    const orderSelect = document.getElementById('orderSelect');

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
        for ( i = 0, r = ""; i < arr.length; i++ ) {
            const getPokemonInfo = await fetchData(url + arr[i].name);
            const types = getPokemonInfo.types.map(t => t.type.name);

            r += `
                <div class="result-card">
                    <img src="${ getPokemonInfo['sprites']['front_default'] }" alt="${ getPokemonInfo.name }"/>
                    <p>${ getPokemonInfo.name }</p>
                    <p>Рост: ${ getPokemonInfo.height }</p>
                    <p>Вес: ${ getPokemonInfo.weight }</p>
                    <p>Тип: ${ types.join(', ') }</p>
                    <button>Добавить в избранное</button>
                    <a href="../pages/pokemon-info.html" id="pokemon-info">More info</a>  
                </div>
            `;
        }
        return r;
    }

    const addClassActive = (page) => {
        const activePage = document.querySelector('.active');
        activePage.classList.remove('active');
        page.classList.add('active');
    }

    const searchPagination = async arr => {
        resultsBlock.innerHTML = await paintResult(arr.slice(0, limit));
        paginationBlock.innerHTML = paintPaginationButton(numberOfButtons(data.results, limit));
        paginationBlock.children[0].classList.add('active');
    }

    function sortInArr (field, order) {
        if (order === 'increase') {
            if (field === 'type') {
                return (a, b) => a.types[0].type.name > b.types[0].type.name ? 1 : -1;
            } else {
                return (a, b) => a[field] > b[field] ? 1 : -1;
            }
        } else if (order === 'decrease') {
            if (field === 'type') {
                return (a, b) => a.types[0].type.name > b.types[0].type.name ? -1 : 1;
            } else {
                return (a, b) => a[field] > b[field] ? -1 : 1;
            }
        }
        return 0;
    }

    const submit = async (input, sort, order,) => {
        let pokemonData = [];

        if (!(input === '')) {
            data.results.forEach( pokemon => {
                if (pokemon.name.includes(input)) {
                    newData.push(pokemon);
                }
            });

            for (let i = 0; i < newData.length; i++) {
                let pokemon = await fetchData(url + newData[i].name)
                pokemonData.push(pokemon);
            }
        } else {
            for (let i = 0; i < data.results.length; i++) {
                let pokemon = await fetchData(url + data.results[i].name)
                pokemonData.push(pokemon);
            }
        }

        data = {...data, results: pokemonData};
        data.results.sort(sortInArr(sort, order));

        paginationBlock.innerHTML = '';
    }


    const run = async () => {
        data = await fetchData(url + '?limit=100000&offset=0');
        await searchPagination(data.results);

        document.addEventListener('click', async function (event){
            if ([...event.target.classList].includes("pagination-button")) {
                addClassActive(event.target);
                const y = event.target.textContent;
                const start = limit * (y - 1);
                const end = limit * y;
                resultsBlock.innerHTML = await paintResult(data.results.slice(start, end));
            }
        });

        form.addEventListener('submit', async e => {
            e.preventDefault();
            data = await fetchData(url + '?limit=100000&offset=0');
            if (!data || (data.results.length === 0)) {
                return;
            }
            newData = [];
            limit = inputNumber.value;
            await submit(inputText.value, sortSelect.value, orderSelect.value);
            await searchPagination(data.results);
        });
    };

    run();
});
