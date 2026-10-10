const API_URL = "https://countries.dev";

const listaPaises = document.getElementById("listaPaises");
const mensaje = document.getElementById("mensaje");
const contador = document.getElementById("contador");
const buscarPais = document.getElementById("buscarPais");
const btnBuscar = document.getElementById("btnBuscar");
const btnTodos = document.getElementById("btnTodos");

async function consultarPaises(url) {
    mensaje.textContent = "Cargando...";
    listaPaises.innerHTML = "";

    try {
        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error("Error en la consulta");
        }

        const paises = await respuesta.json();

        mostrarPaises(paises);
        mensaje.textContent = "";
    } catch (error) {
        console.log(error);
        mensaje.textContent = "Ocurrió un error al consultar la API.";
        contador.textContent = "";
    }
}

function mostrarPaises(paises) {
    listaPaises.innerHTML = "";

    paises.forEach(function(pais) {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("country-card");

        const nombre = pais.name || "Sin nombre";
        const capital = pais.capital || "No disponible";
        const poblacion = pais.population
            ? pais.population.toLocaleString("es-CO")
            : "No disponible";
        const region = pais.region || "No disponible";

        let bandera = "";

        if (pais.flags && pais.flags.png) {
            bandera = pais.flags.png;
        } else if (pais.flags && pais.flags.svg) {
            bandera = pais.flags.svg;
        }

        tarjeta.innerHTML = `
            <img src="${bandera}" alt="Bandera de ${nombre}">
            <div class="country-info">
                <h2>${nombre}</h2>
                <p><strong>Capital:</strong> ${capital}</p>
                <p><strong>Población:</strong> ${poblacion}</p>
                <p><strong>Región:</strong> ${region}</p>
            </div>
        `;

        listaPaises.appendChild(tarjeta);
    });

    const tarjetas = document.getElementsByClassName("country-card");
    contador.textContent = "Países mostrados: " + tarjetas.length;
}

async function buscar() {
    const texto = buscarPais.value.trim();

    if (texto === "") {
        alert("Escribe el nombre de un país.");
        return;
    }

    await consultarPaises(
        API_URL + "/name/" + encodeURIComponent(texto)
    );
}

btnBuscar.addEventListener("click", buscar);

buscarPais.addEventListener("keyup", function(evento) {
    if (evento.key === "Enter") {
        buscar();
    }
});

btnTodos.addEventListener("click", function() {
    buscarPais.value = "";
    consultarPaises(
        API_URL + "/countries?fields=name,capital,population,region,flags"
    );
});

consultarPaises(
    API_URL + "/countries?fields=name,capital,population,region,flags&limit=20"
);
