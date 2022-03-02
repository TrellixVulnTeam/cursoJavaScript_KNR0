// variables
let pokes = document.getElementById(`pokes`)
let elegir = document.getElementById(`elegir`)
let selec = document.getElementById(`selec`)
let buscar = document.getElementById(`buscar`)
let botonTheme = document.getElementById(`botonTheme`)
let botonPokeBalls = document.getElementById(`pokeBalls`)
let botonBerries = document.getElementById(`berries`)
let botonMedicinas = document.getElementById(`medicina`)
let botonBatalla = document.getElementById(`batalla`)
let loader = document.getElementById(`loader`)
let theme
// elimina todos los elementos dentro del elemento indicado
function limpiarPantalla(padre) {
    while (padre.lastChild) {
        padre.removeChild(padre.lastChild)
    }
}
// muestra error si el nombre del pokemon ingresado no coincide con ninguno
function mostrarError(error) {
    pokes.innerHTML += `
    <div class="row justify-content-center">
        <div class="pokes__error col-4">
            <h2 class="pokes__error-tit">Ha ocurrido un error</h2>
            <h3 class="pokes__error-actual">${error}</h3>
            <p class="pokes__error-texto">Por favor asegúrese de haber escrito bien el nombre.</p>
        </div>
    </div>
    `
}
// Trae la generacion del Pokemon
function traerGen(poke) {
    fetch(`https://pokeapi.co/api/v2/generation/`)
        .then(response => response.json())
        .then(generation => generation.results.forEach(resul => {
            fetch(`https://pokeapi.co/api/v2/generation/${resul.name}/`)
                .then(response => response.json())
                .then(data => {
                    if (data.pokemon_species.find(elem => elem.name == poke.name)) {
                        document.getElementById(`${poke.name}generacion`).innerHTML += `
                            ${data.names.find(nombre=> nombre.language.name=="es").name}
                            `
                    }
                })
        }))
}
// trae los items de la categoria buscada
function traerItems(item) {
    // trae la categoria seleccionada
    item.categories.forEach((categoria) => {
        fetch(`https://pokeapi.co/api/v2/item-category/${categoria.name}/`)
            .then(response => response.json())
            .then(categoria => {
                // trae cada item de la categoria
                categoria.items.forEach((nombre) =>
                    fetch(`https://pokeapi.co/api/v2/item/${nombre.name}/`)
                    .then(response => response.json())
                    .then(item => {
                        pokes.innerHTML += `
                        <section id="item" class="row col-5 justify-content-center pokes__poke">
                                <h2 class="col-12 item__tit">${item.names[5].name}</h2>
                                <img class="col-12 item__img" src="${item.sprites.default}" alt="${item.name}">
                                <p class="col-10 item__p" id="${item.name}text"></p>
                        </section>
                        `
                        // trae la descripcion en espanol del item
                        document.getElementById(`${item.name}text`).innerHTML += `
                        ${item.flavor_text_entries.find(elem => elem.language.name == "es").text}
                        `
                    })
                )
            })
    })
}
// Trae los items que puede tener un pokemon
function traerItemsPoke(poke) {
    // Arreglo donde se cargan los nombres de los items que tiene el pokemon si es que este tiene
    let arregloItems = []
    if (poke.held_items[0]) {
        // carga los nombres en el arreglo
        poke.held_items.forEach((itemObj) => arregloItems.push(itemObj.item.name))
        // busca cada item por su nombre, trae su nombre y descripcion en espanol
        arregloItems.forEach(item => {
            fetch(`https://pokeapi.co/api/v2/item/${item}/`)
                .then(response => response.json())
                .then(itemDatos => {
                    document.getElementById(`objetosPoke`).innerHTML += `
                <div class="col-4 row justify-content-around">
                    <h3 class="col-12 pokes__obj">${itemDatos.names.find(item => item.language.name == "es").name}</h3>
                    <img class="pokes__obj-img" src="${itemDatos.sprites.default}" alt="${itemDatos.names.find(item => item.language.name == "es").name}">
                    <div>
                        <p>${itemDatos.flavor_text_entries.find(item=> item.language.name == "es").text}</p>
                    </div>
                </div>
                `
                })
        })
    } else if (!poke.held_items[0]) {
        document.getElementById(`objetosPoke`).innerHTML += `
                <div class="col-4">
                    <h3 class="col-12 pokes__noObj">Este pokemon no porta items</h3>
                </div>
                `
    }
}
// Trae las habilidades y sus descripciones
function traerHabilidades(poke) {
    // trae los nombres en español de las habilidades del pokemon
    poke.abilities.forEach((habilidad) =>
        fetch(`https://pokeapi.co/api/v2/ability/${Object.entries(habilidad)[0][1].name}/`)
        .then(response => response.json())
        .then(poder =>
            document.getElementById(`${poke.name}habilidades`).innerHTML += `
        <div id="${Object.entries(poder)[7][1][5].name}descr">
            <h3 class="pokes__habilidades-tit">${Object.entries(poder)[7][1][5].name}</h3>
            <div class="pokes__habilidades-texto" id="${Object.entries(poder)[7][1][5].name}texto">
        </div>
    </div>
            `
        ))
    // trae las descripciones en español de cada habilidad
    poke.abilities.forEach((habilidad) =>
        fetch(`https://pokeapi.co/api/v2/ability/${Object.entries(habilidad)[0][1].name}/`)
        .then(response => response.json())
        .then(poder =>
            document.getElementById(`${Object.entries(poder)[7][1][5].name}texto`).innerHTML += `
            <p>${poder.flavor_text_entries.find(texto => texto.language.name == "es").flavor_text}</p>
            `
        )
    )
}
// trae una breve descripcion de cada pokemon dependiendo de su estadistica base mas alta
function traerDescrip(poke) {
    let a = [0, ""]
    poke.stats.forEach((estadistica) => {
        if (estadistica.base_stat > a[0]) {
            a.splice(0, 1, estadistica.base_stat)
            a.splice(1, 1, estadistica.stat.name)
        }
    })
    if (a[1] == "hp") {
        // los numeros dentro de arrayDescrip corresponden a las diferentes descripciones que tiene cada estadistica dentro de la API
        let arrayDescrip = [1, 7, 13, 19, 25]
        let descrip = arrayDescrip[Math.floor(Math.random() * arrayDescrip.length)]
        fetch(`https://pokeapi.co/api/v2/characteristic/${descrip}/`)
            .then(response => response.json())
            .then(char => {
                let desEs = char.descriptions.find(obj => obj.language.name == "es")
                document.getElementById(`descrip`).innerHTML += `
                <p>...${desEs.description}</p>
                `
            })
    } else if (a[1] == "attack") {
        let arrayDescrip = [2, 8, 14, 20, 26]
        let descrip = arrayDescrip[Math.floor(Math.random() * arrayDescrip.length)]
        fetch(`https://pokeapi.co/api/v2/characteristic/${descrip}/`)
            .then(response => response.json())
            .then(char => {
                let desEs = char.descriptions.find(obj => obj.language.name == "es")
                document.getElementById(`descrip`).innerHTML += `
                <p>...${desEs.description}</p>
                `
            })
    } else if (a[1] == "defense") {
        let arrayDescrip = [3, 9, 15, 21, 27]
        let descrip = arrayDescrip[Math.floor(Math.random() * arrayDescrip.length)]
        fetch(`https://pokeapi.co/api/v2/characteristic/${descrip}/`)
            .then(response => response.json())
            .then(char => {
                let desEs = char.descriptions.find(obj => obj.language.name == "es")
                document.getElementById(`descrip`).innerHTML += `
                <p>...${desEs.description}</p>
                `
            })
    } else if (a[1] == "special-attack") {
        let arrayDescrip = [4, 10, 16, 22, 28]
        let descrip = arrayDescrip[Math.floor(Math.random() * arrayDescrip.length)]
        fetch(`https://pokeapi.co/api/v2/characteristic/${descrip}/`)
            .then(response => response.json())
            .then(char => {
                let desEs = char.descriptions.find(obj => obj.language.name == "es")
                document.getElementById(`descrip`).innerHTML += `
                <p>...${desEs.description}</p>
                `
            })
    } else if (a[1] == "special-defense") {
        let arrayDescrip = [5, 11, 17, 23, 29]
        let descrip = arrayDescrip[Math.floor(Math.random() * arrayDescrip.length)]
        fetch(`https://pokeapi.co/api/v2/characteristic/${descrip}/`)
            .then(response => response.json())
            .then(char => {
                let desEs = char.descriptions.find(obj => obj.language.name == "es")
                document.getElementById(`descrip`).innerHTML += `
                <p>...${desEs.description}</p>
                `
            })
    } else if (a[1] == "speed") {
        let arrayDescrip = [6, 12, 18, 24, 30]
        let descrip = arrayDescrip[Math.floor(Math.random() * arrayDescrip.length)]
        fetch(`https://pokeapi.co/api/v2/characteristic/${descrip}/`)
            .then(response => response.json())
            .then(char => {
                let desEs = char.descriptions.find(obj => obj.language.name == "es")
                document.getElementById(`descrip`).innerHTML += `
                <p>...${desEs.description}</p>
                `
            })
    }
}
// funcion para traer informacion mas detallada de un pokemon elegido
function pokemonComplejo(poke) {
    if (poke.types[1]) {
        // para pokemones con 2 tipos
        pokes.innerHTML += `
            <div id="${poke.name}" class="row justify-content-end pokes__detalle">
                <div class="col-12">
                    <h2 id="${poke.name}" class="pokes__nombre">${poke.name}</h2>
                    <div class="col-3 pokes__imagen">
                        <img class="pokes__imagen-actual" src="${poke.sprites.front_default}" alt="${poke.name}">
                    </div>
                </div>
                <div class="col-5 pokes__datos row align-items-center">
                    <h2 class="pokes__detalle-tit">Datos</h2>
                    <div class="pokes__datos-actual">
                        <h4>Numero: ${poke.id}</h4>
                        <h3>Tipo : ${poke.types[0].type.name}</h3>
                        <h4>Tipo Secundario: ${poke.types[1].type.name}</h4>
                        <h4>Altura : ${poke.height}</h4>
                        <h4>Peso : ${poke.weight}</h4>
                        <h4>Experiencia base: ${poke.base_experience}</h4>
                    </div>
                </div>
                <div class="col-5 pokes__habilidades row align-items-center">
                    <h2 class="pokes__detalle-tit">Habilidades</h2>
                    <div class="pokes__habilidades-actual" id="${poke.name}habilidades"></div>
                </div>
                <div class="col-5 pokes__habilidades row align-items-center">
                    <h2 class="pokes__detalle-tit">Estadisticas Base</h2>
                    <div class="row col-12 justify-items-around">
                        <h3 class="col-2">HP</h3>
                        <h3 class="col-2">Ataque</h3>
                        <h3 class="col-2">Defensa</h3>
                        <h3 class="col-2">Ataque Especial</h3>
                        <h3 class="col-2">Defensa Especial</h3>
                        <h3 class="col-2">Velocidad</h3>
                        <h4 class="col-2  pokes__habilidades-stat">${poke.stats[0].base_stat}</h4>
                        <h4 class="col-2  pokes__habilidades-stat">${poke.stats[1].base_stat}</h4>
                        <h4 class="col-2  pokes__habilidades-stat">${poke.stats[2].base_stat}</h4>
                        <h4 class="col-2  pokes__habilidades-stat">${poke.stats[3].base_stat}</h4>
                        <h4 class="col-2  pokes__habilidades-stat">${poke.stats[4].base_stat}</h4>
                        <h4 class="col-2  pokes__habilidades-stat">${poke.stats[5].base_stat}</h4>
                    </div>
                </div>
                <div class="col-5 pokes__habilidades row align-items-center">
                    <h2 class="pokes__detalle-tit">${poke.name}...</h2>
                    <div class="row col-12 justify-items-around" id="descrip"></div>
                </div>
                <div id="objetosPoke" class="col-10 row justify-content-around pokes__habilidades-obj"></div>
            </div>
            `


    } else {
        // para pokemones con un solo tipo, hace lo mismo que el if superior
        pokes.innerHTML += `
            <div id="${poke.name}" class="row justify-content-end pokes__detalle">
                <div class="col-12 justify-items-center">
                    <h2 class="pokes__nombre">${poke.name}</h2>
                    <div class="col-3 pokes__imagen">
                        <img class="pokes__imagen-actual"src="${poke.sprites.front_default}" alt="${poke.name}">
                    </div>
                </div>
                <div class="col-5 pokes__datos row align-items-center">
                    <h2 class="pokes__detalle-tit">Datos</h2>
                    <div class="pokes__datos-actual">
                        <h4>Numero: ${poke.id}</h4>
                        <h3 id="${poke.name}generacion"></h3>
                        <h3>Tipo : ${poke.types[0].type.name}</h3>
                        <h4>Altura : ${poke.height}</h4>
                        <h4>Peso : ${poke.weight}</h4>
                        <h4>Experiencia base: ${poke.base_experience}</h4>
                    </div>
                </div>
                <div class="col-5 pokes__habilidades row align-items-center">
                    <h2 class="pokes__detalle-tit">Habilidades</h2>
                    <div class="pokes__habilidades-actual" id="${poke.name}habilidades"></div>
                </div>
                <div class="col-5 pokes__habilidades row align-items-center">
                    <h2 class="pokes__detalle-tit">Estadisticas Base</h2>
                    <div class="row col-12 justify-items-around">
                        <h3 class="col-2">HP</h3>
                        <h3 class="col-2">Ataque</h3>
                        <h3 class="col-2">Defensa</h3>
                        <h3 class="col-2">Ataque Especial</h3>
                        <h3 class="col-2">Defensa Especial</h3>
                        <h3 class="col-2">Velocidad</h3>
                        <h4 class="col-2 pokes__habilidades-stat">${poke.stats[0].base_stat}</h4>
                        <h4 class="col-2 pokes__habilidades-stat">${poke.stats[1].base_stat}</h4>
                        <h4 class="col-2 pokes__habilidades-stat">${poke.stats[2].base_stat}</h4>
                        <h4 class="col-2 pokes__habilidades-stat">${poke.stats[3].base_stat}</h4>
                        <h4 class="col-2 pokes__habilidades-stat">${poke.stats[4].base_stat}</h4>
                        <h4 class="col-2 pokes__habilidades-stat">${poke.stats[5].base_stat}</h4>
                    </div>
                </div>
                <div class="col-5 pokes__habilidades row align-items-center">
                    <h2 class="pokes__detalle-tit">${poke.name}...</h2>
                    <div class="row col-12 justify-items-around" id="descrip"></div>
                </div>
                <div id="objetosPoke" class="col-10 row justify-content-around pokes__habilidades-obj"></div>
            </div>
            `

    }
    traerHabilidades(poke)
    traerGen(poke)
}
// funcion para traer datos basicos de los pokemones de un tipo
function pokemonSimpleTipo(data) {
    data.pokemon.forEach(element => {
        // trae los datos especificos de cada pokemon de ese tipo
        fetch(`https://pokeapi.co/api/v2/pokemon/${element.pokemon.name}/`)
            .then(response => response.json())
            .then(poke => {
                // Si el pokemon tiene dos tipos, muestra el segundo como secundario
                if (poke.types[1]) {
                    pokes.innerHTML += `
                <section id="poke" class="col-5 pokes__poke"> 
                        <img src="${poke.sprites.front_default}" alt="${poke.name}">
                        <h2>${poke.name}</h2>
                        <h4>Numero: ${poke.id}</h4>
                        <h3>Tipo : ${poke.types[0].type.name}</h3>
                        <h4>Tipo secundario: ${poke.types[1].type.name}</h4>
                </section>
                `
                    // Si el pokemon tiene un solo tipo, muestra solo ese
                } else {
                    pokes.innerHTML += `
                <section id="poke" class="col-5 pokes__poke">
                        <img src="${poke.sprites.front_default}" alt="${poke.name}">
                        <h2>${poke.name}</h2>
                        <h4>Numero: ${poke.id}</h4>
                        <h3>Tipo : ${poke.types[0].type.name}</h3>
                </section>
                `
                }
            })
    })
}

// busca pokemones de un tipo
elegir.addEventListener(`submit`, (e) => {
    e.preventDefault()
    // trae todos los pokemones del tipo elegido
    fetch(`https://pokeapi.co/api/v2/type/${selec.value - 1}/`)
        .then(response => response.json())
        .then(data => pokemonSimpleTipo(data))
    //Resetea el selector 
    elegir.reset()
    //Elimina todos los datos mostrados anteriormente
    limpiarPantalla(pokes)
})
// busca el pokemon ingresado
buscar.addEventListener(`submit`, (e) => {
    e.preventDefault()
    let form = new FormData(e.target)
    fetch(`https://pokeapi.co/api/v2/pokemon/${form.get(`nombrePoke`).toLowerCase()}/`)
        .then(response => response.json())
        .then(poke => pokemonComplejo(poke))
        .catch(error => mostrarError(error))
    fetch(`https://pokeapi.co/api/v2/pokemon/${form.get(`nombrePoke`).toLowerCase()}/`)
        .then(response => response.json())
        .then(poke => traerDescrip(poke))
    fetch(`https://pokeapi.co/api/v2/pokemon/${form.get(`nombrePoke`).toLowerCase()}/`)
        .then(response => response.json())
        .then(poke => traerItemsPoke(poke))
    buscar.reset()
    limpiarPantalla(pokes)
})
botonPokeBalls.addEventListener(`click`, () => {
    fetch(`https://pokeapi.co/api/v2/item-pocket/pokeballs/`)
        .then(response => response.json())
        .then(pokebolas => traerItems(pokebolas))
    limpiarPantalla(pokes)
})
botonBerries.addEventListener(`click`, () => {
    fetch(`https://pokeapi.co/api/v2/item-pocket/berries/`)
        .then(response => response.json())
        .then(berries => traerItems(berries))
    limpiarPantalla(pokes)
})
botonMedicinas.addEventListener(`click`, () => {
    fetch(`https://pokeapi.co/api/v2/item-pocket/medicine/`)
        .then(response => response.json())
        .then(medicinas => traerItems(medicinas))
    limpiarPantalla(pokes)
})
botonBatalla.addEventListener(`click`, () => {
    fetch(`https://pokeapi.co/api/v2/item-pocket/battle/`)
        .then(response => response.json())
        .then(batItems => traerItems(batItems))
    limpiarPantalla(pokes)
})