document.addEventListener('DOMContentLoaded', () => {
    let data = null;
    let newData = [];
    const url = 'https://pokeapi.co/api/v2/pokemon/';
    let limit = 10;
    const resultsBlock = document.getElementById('result-block');
    const paginationBlock = document.getElementById('pagination');
    const form = document.getElementById('form');
    const inputText = document.getElementById('inputText');
    const inputNumber = document.getElementById('inputNumber');
    const sortSelect = document.getElementById('sortSelect');

    const fetchData = async url => {
        const response = await fetch(url);
        if (response.ok) {
            return await response.json();
        } else {
            console.log('Что то пошло не так. Ошибка: ' + response.status);
        }
    };

    function byField (field, order) {
        if (order === 'increase') {
            return (a, b) => a[field] > b[field] ? 1 : -1;
        } else if (order === 'decrease') {
            return (a, b) => b[field] > a[field] ? 1 : -1;
        }
    }

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
            r += `
                <div class="result-card">
                    <img src="${ getPokemonInfo['sprites']['front_default'] }" alt="${ getPokemonInfo.name }">
                    <p>${ getPokemonInfo.name }</p>
                    <p>Рост: ${ getPokemonInfo.height }</p>
                    <p>Вес: ${ getPokemonInfo.weight }</p>
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
        paginationBlock.innerHTML = paintPaginationButton(numberOfButtons(data['results'], limit));
        paginationBlock.children[0].classList.add('active');
    }

    const searchInArr = ()  => {
        data['results'].forEach( pokemon => {
            if (pokemon['name'].includes(inputText.value)) {
                newData.push(pokemon);
            }
        });
    }

    const run = async () => {
        data = await fetchData(url + '?limit=100000&offset=0');
        await searchPagination(data['results']);

        document.addEventListener('click', async function (event){
            if ([...event.target.classList].includes("pagination-button")) {
                addClassActive(event.target);
                const y = event.target.textContent;
                const start = limit * (y - 1);
                const end = limit * y;
                resultsBlock.innerHTML = await paintResult(data['results'].slice(start, end));
            } else {
                // console.log('');
            }
        });

        form.addEventListener('submit', async e => {
            e.preventDefault();
            data = await fetchData(url + '?limit=100000&offset=0');
            if (!data || (data['results'].length === 0)) {
                return;
            }
            newData = [];
            limit = inputNumber.value;

            if ((inputText.value) && (sortSelect.value === 'a-z')) {
                searchInArr();
                data = {...data, ['results']: newData.sort(byField('name', 'increase'))};
                paginationBlock.innerHTML = '';
            }

            if ((inputText.value) && (sortSelect.value === 'z-a')) {
                searchInArr();
                data = {...data, ['results']: newData.sort(byField('name', 'decrease'))};
                paginationBlock.innerHTML = '';
            }

            if ((inputText.value === '') && (sortSelect.value === 'a-z')) {
                data['results'].sort(byField('name', 'increase'))
                paginationBlock.innerHTML = '';
            }

            if ((inputText.value === '') && (sortSelect.value === 'z-a')) {
                data['results'].sort(byField('name', 'decrease'))
                paginationBlock.innerHTML = '';
            }

            await searchPagination(data['results'])
        });
    };
    run();
});
