class Correos {
    #destinatario;
    #remitente;
    #asunto;
    #mensaje;
    #numero;

    constructor(destinatario, remitente, asunto, mensaje, numero) {
        this.#destinatario = destinatario
        this.#remitente = remitente
        this.#asunto = asunto
        this.#mensaje = mensaje
        this.#numero = numero
    }

    get destinatario() {
        return this.#destinatario
    }

    get remitente() {
        return this.#remitente
    }

    get asunto() {
        return this.#asunto
    }

    get mensaje() {
        return this.#mensaje
    }

    get numero() {
        return this.#numero
    }

    enEspera(correosGuardados) {
        botonEnivar.addEventListener('click', (event) => {
            correosGuardados = correosGuardados.shift()

        })
    }

    porEnviar(correosGuardados) {

    }
}


let redactarNuevoCorreo = document.querySelector('.redactar')
let popUp = document.querySelector('#gmail-popup')
let cerrarX = document.querySelector('#btn-close-composer')
let agregarALaCola = document.querySelector('#mail-form')
// let quienLomanda = document.querySelector('#remitente')
// let aQuienLlega = document.querySelector('#destinatario')
let botonEnivar = document.querySelector('#btn-send')
let colaDeEspera = document.querySelector('#queue-list')

let contador = 1
let controlCorreos = []

redactarNuevoCorreo.addEventListener('click', (event) => {
    popUp.classList.remove('d-none')
})


agregarALaCola.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log(event.target.remitente)
    let correoUsuario = new Correos(event.target.destinatario.value, event.target.remitente.value, event.target.asunto.value, event.target.mensaje.value, contador++)
    controlCorreos.push(correoUsuario)
    console.log(correoUsuario)
    console.log(controlCorreos)
    renderizar()
});



function renderizar() {
    let html = ''
    for (let correo of controlCorreos) {
        if (correo.numero == 1) {
            html += `<div class="mail-card p-3 w-100 position-relative mb-2">
                        <span class="mail-id">#${correo.numero}</span>
                        <h4 class="fs-6 mb-1 text-truncate">Asunto:${correo.asunto}</h4>
                        <div class="small text-light">
                         <p class="m-0 mb-2"><span class="text-purple-novo">No.Correo:</span> ${correo.numero}</p>
                            <p class="m-0 mb-1"><span class="text-purple-novo">De:</span>${correo.destinatario}</p>
                            <p class="m-0 mb-2"><span class="text-purple-novo">Para:</span> ${correo.remitente}</p>
                        </div>
                <div class="d-flex justify-content-between align-items-center">
                    <button id="btn-send" class="btn-send-gmail px-4 py-2">Enviar</button>
                </div>
                </div>`
        } else {
            html += `<div class="mail-card p-3 w-100 position-relative mb-2">
                        <span class="mail-id">#${correo.numero}</span>
                        <h4 class="fs-6 mb-1 text-truncate">Asunto:${correo.asunto}</h4>
                        <div class="small text-light">
                         <p class="m-0 mb-2"><span class="text-purple-novo">No.Correo:</span> ${correo.numero}</p>
                            <p class="m-0 mb-1"><span class="text-purple-novo">De:</span>${correo.destinatario}</p>
                            <p class="m-0 mb-2"><span class="text-purple-novo">Para:</span> ${correo.remitente}</p>
                        </div>
                </div>`
        correo.porEnviar()
        }
    }

    colaDeEspera.innerHTML = html
    agregarALaCola.reset()
}



cerrarX.addEventListener('click', (event) => {
    popUp.classList.add('d-none')
})

// // agregarALaCola.addEventListener('submit', (event) => {

// // })