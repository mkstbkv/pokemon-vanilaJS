document.addEventListener('DOMContentLoaded', () => {
    const resultsBlock = document.getElementById('result-block');
    const loader = document.getElementById('preloader');
    let pokemon = null;

    function paintResult (pok) {
        return `
           <div class="result-card">
                <img src="${  pok.img ? pok.img : `../images/no-image.png`} " alt="${  pok.name }"/>
                <p>${  pok.name }</p>
                <p>Рост: ${  pok.height }</p>
                <p>Вес: ${  pok.weight }</p>
                <p>Тип: ${ pok.types.type_1 }</p>
               
            </div>
        `;
    }

    const run = async () => {
        resultsBlock.innerHTML = '';
        loader.style.display = 'block';
        const pokemonName = localStorage.getItem('pokemon');
        let pokemons = JSON.parse(localStorage.getItem('pokemons'));
        for (let i = 0; i < pokemons.length; i++) {
            if (pokemons[i].name === pokemonName) {
                pokemon = pokemons[i];
            }
        }
        loader.style.display = 'none';
        console.log(pokemon)
        resultsBlock.innerHTML = paintResult(pokemon);
    };
    run();
});
