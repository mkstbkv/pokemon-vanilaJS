document.addEventListener('DOMContentLoaded', () => {
    const resultsBlock = document.getElementById('result-block');
    const loader = document.getElementById('preloader');
    let pokemon = null;
    const url = 'https://pokeapi.co/api/v2/pokemon/';
    const fetchData = async url => {
        const response = await fetch(url);
        if (response.ok) {
            return await response.json();
        } else {
            console.log('Что то пошло не так. Ошибка: ' + response.status);
        }
    };

    function paintResult (pok) {
        return `
           <div class="pokemon-card">
                <img src="${  pok.sprites.other["official-artwork"].front_default ? pok.sprites.other["official-artwork"].front_default : `../images/no-image.png`} "
                    alt="${  pok.name }"/>
                <div class="pokemon-info">
                    <p>${  pok.name }</p>
                    <p>Рост: ${  pok.height }</p>
                    <p>Вес: ${  pok.weight }</p>
                    <p>Тип: ${ pok.types[0].type.name }</p>
                    <p>Способность:: ${ pok.abilities[0].ability.name }</p>
                    <p>Здоровье: ${  pok.stats[0].base_stat }</p>
                    <p>Урон: ${  pok.stats[1].base_stat }</p>
                    <p>Защита: ${  pok.stats[2].base_stat }</p>
                    <p>Скорость: ${  pok.stats[5].base_stat }</p>
                </div>
            </div>
        `;
    }

    const run = async () => {
        resultsBlock.innerHTML = '';
        loader.style.display = 'block';
        const pokemonName = localStorage.getItem('pokemon');
        pokemon = await fetchData(url + pokemonName);

        loader.style.display = 'none';
        resultsBlock.innerHTML = paintResult(pokemon);
    };
    run();
});
