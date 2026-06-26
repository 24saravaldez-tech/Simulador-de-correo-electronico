class Nodo {
    constructor(correo) {
        this.value = correo; //se guarda el correo como tal
        this.next = null
    }
}

class Correos {
    #destinatario;
    #remitente;
    #asunto;
    #mensaje;
    #numero;
    #estado;

    constructor(destinatario, remitente, asunto, mensaje, numero, estado) {
        this.#destinatario = destinatario
        this.#remitente = remitente
        this.#asunto = asunto
        this.#mensaje = mensaje
        this.#numero = numero
        this.#estado = estado

        this.first = null;
        this.last = null;
        this.length = 0;
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

    get estado() {
        return this.#estado
    }
}

class ControlDeCorreos {
    first;
    last;
    length;
    constructor() {
        this.first = null;
        this.last = null;
        this.length = 0;
    }

    enEspera(correosGuardados) { //los que voy a agregar al final de la cola, o un enqueue
        let nuevaCola = new Nodo(correosGuardados)
        if (this.length == 0) {
            this.first = nuevaCola;
            this.last = nuevaCola
        } else {
            this.last.next = nuevaCola;
            this.last = nuevaCola;
        }
        this.length++
    }

    porEnviar(correosGuardados) { //el primero que se va a enviar, o un dequeue
        let correoAEnviar = this.first; //le doy el valor del primer correo en la cola
        if (this.first == this.last) { //si el inicio y la cola son lo mismo, el next se declara null
            this.last = null;
        }
        this.first = this.first.next; //ahora el primero va ser al siguiente del primero anterior
        this.length--; //reduzco el length
        return correoAEnviar.value; //devuelvo el primero siempre, habiendo a guardado el siguiente valor, o sea, la primera cabeza.
    }
}

let redactarNuevoCorreo = document.querySelector('.redactar')
let popUp = document.querySelector('#gmail-popup')
let cerrarX = document.querySelector('#btn-close-composer')
let agregarALaCola = document.querySelector('#mail-form')
let colaDeEspera = document.querySelector('#queue-list')
let contenedorCorreosActuales = document.querySelector('#current-mail')
let historialLista = document.querySelector('#history-list')
let contenedorSiguienteCorreo = document.querySelector('#next-mail')
let cantidad = document.querySelector('#counter-badge')
let contadorDeLaCola = document.querySelector('#queue-count')

let colaDeCorreos = new ControlDeCorreos() //creo la instancia del control de correos para poder separar las acciones individuales de los correos de las acciones conjuntas de las colas.
let colaHistorial = new ControlDeCorreos() //para el historial, va a ser el mismo sistema pero con la idea de que se van formando segun se van enviando.

let controlCorreos = []

let banderita = false
let estaEnviando = false

let contador = 1


//LOGICA PARA ESCOGER UN ESTADO
//========================================================================================

function escogerEstado() {
    let indice = Math.floor(Math.random() * 3) + 1
    console.log(indice)
    if (indice == 1) {
        return 'Envio exitoso'
    } else if (indice == 2) {
        return 'Reintentar envio'
    } else if (indice == 3) {
        return 'Envio fallido'
    }
}
//========================================================================================


//LOGICA PARA REDACTAR UN CORREO Y PARA CERRAR O ABRIR EL PUPOP
//========================================================================================
redactarNuevoCorreo.addEventListener('click', (event) => {
    popUp.classList.remove('d-none') //cuando se da en redactar correo, se abre o aparece el popup
})

cerrarX.addEventListener('click', (event) => {
    popUp.classList.add('d-none') //si se le da en la x, cierra el popup
})
//========================================================================================


//LOGICA PARA AGREGAR A LA COLA DE ESPERA, DONDE ESPERAN A SER ENVIADOS
//========================================================================================
agregarALaCola.addEventListener('submit', (event) => {
    event.preventDefault();
    //se le da el prevent default a todo el formulario para que no de problemas de 
    // recargas la pagina. Darle el pevent default a los botones de nada sirve pues 
    // el evento defavult es propio del formulario.

    let correoUsuario = new Correos(event.target.destinatario.value,
        event.target.remitente.value,
        event.target.asunto.value,
        event.target.mensaje.value,
        contador++,
        escogerEstado())

    controlCorreos.push(correoUsuario) //para ver que este tomando los datos correctos.
    colaDeCorreos.enEspera(correoUsuario) //meto el correo del usuario, el que acaba de crear, a la fila de correos para ahorrarnos pleitos.
    popUp.classList.add('d-none') //cierro el pupop
    agregarALaCola.reset() //reseteo el popup

    renderizar() //renderizo de nuevo.
})
//========================================================================================


//LOGICA PARA REDACTAR UN CORREO Y PARA CERRAR O ABRIR EL PUPOP
//========================================================================================
function enviar() {

    if (banderita) {
        return // si ya hay un correo enviandose, no hace absolutmente nada
    }

    banderita = true;
    let correoAPuntoDeEnviarse = colaDeCorreos.first// busco cual es el primero

    let correoEnviado = colaDeCorreos.porEnviar(correoAPuntoDeEnviarse) //una vez pasado el tiempo, lo saco de la cola
    if (correoEnviado) {
        colaHistorial.enEspera(correoEnviado)//entra al historial de enviados

        contenedorCorreosActuales.innerHTML = `
                        <div class="p-2 alert alert-warning m-0 text-center">
                            <strong>Enviando #${correoEnviado.numero}...</strong>
                            <div class="spinner-border spinner-border-sm text-warning ms-2" role="status"></div>
                        </div>`

        let estadoSetTimeOut;
        console.log(correoEnviado.estado)
        if (correoEnviado.estado == 'Envio exitoso') {
            estadoSetTimeOut = `<div class="p-2 alert alert-success m-0 text-center">
                    ${correoEnviado.estado}
                </div>`
        } else if (correoEnviado.estado == 'Reintentar envio') {
            estadoSetTimeOut = `<div class="p-2 alert alert-info m-0 text-center">
                     ${correoEnviado.estado}
                </div>`
        } else if (correoEnviado.estado == 'Envio fallido') {
            estadoSetTimeOut = `<div class="p-2 alert alert-danger m-0 text-center">
                    ${correoEnviado.estado}
                 </div>`
        }

        setTimeout(() => { //para darle show de tiempo de envio.
            // actualizo el panel central para indicar que se está procesando
            contenedorCorreosActuales.innerHTML = estadoSetTimeOut
        }, 2000)

        renderizar() // renderizo de nuevo para que el boton se borre durante el envío
        estaEnviando = true

        setTimeout(() => {
            contenedorCorreosActuales.innerHTML = `<div id="current-mail" class="mail-card-placeholder p-3 text-center">
                                <p class="m-0">No hay correos procesándose en este momento</p>
                            </div>`
        }, 4000)

        banderita = false // banderita pasa a false lo que indica que ya se pude enviar el siguiente

        estaEnviando = false //ya termino el envio luego de tanto setTimeOt, asi que ya pasa a decir que no esta enviando.
        renderizar()// volvemos a renderizar.

    }
    estaEnviando = true

}
//========================================================================================


function renderizar() {

    cantidad.textContent = colaDeCorreos.length;
    contadorDeLaCola.textContent = colaDeCorreos.length;

    let siguienteCorreo = estaEnviando && colaDeCorreos.first ? colaDeCorreos.first.next : colaDeCorreos.first; // El siguiente sera el segundo en la cola si el primero se esta enviando

    let htmlDeSiguienteCorreo = ''
    if (siguienteCorreo) {
        htmlDeSiguienteCorreo = `
            <div class="p-2 bg-dark rounded">
                <strong>#${siguienteCorreo.value.numero}</strong> - ${siguienteCorreo.value.asunto}
            </div>`

        contenedorSiguienteCorreo.innerHTML = htmlDeSiguienteCorreo

    } else {
        htmlDeSiguienteCorreo = `<p class="m-0">Cola vacía</p>`
        contenedorSiguienteCorreo.innerHTML = htmlDeSiguienteCorreo
    }


    setTimeout(() => {
        let htmlHistorial = '';
        let actualHistorial = colaHistorial.first;

        while (actualHistorial) {
            let correo = actualHistorial.value;
            htmlHistorial += `
            <div class="mail-card p-3 w-100 position-relative mb-2" style="opacity: 0.7;">
                <span class="mail-id text-success">✓ #${correo.numero}</span>
                <h4 class="fs-6 mb-1 text-truncate text-white">Asunto: ${correo.asunto}</h4>
                <div class="small text-white">
                    <p class="m-0"><span class="text-purple-novo">Para:</span> ${correo.destinatario}</p>
                </div>
                <div class="small text-white">
                    <p class="m-0"><span class="text-purple-novo">De:</span> ${correo.remitente}</p>
                </div>
                <div class="small text-white">
                    <p class="m-0"><span class="text-purple-novo">Estado:</span> ${correo.estado}</p>
                </div>
            </div>`;

            actualHistorial = actualHistorial.next;
        }

        if (historialLista.innerHTML = htmlHistorial) {
            htmlHistorial
        } else {
            historialLista.innerHTML = `<p class="text-muted text-center m-0">Sin envíos</p>`
        }

        if (colaHistorial.length == 0 && !estaEnviando) {
            contenedorCorreosActuales.innerHTML = '<p class="m-0 text-center">No hay correos procesándose</p>'
        }

    }, 5000)


    let html = '';
    let actual = colaDeCorreos.first// voy haciendolo de la cabeza para la cola
    let banderitaEsPrimero = true // otra banderita para saber quien esta de primero

    while (actual) {
        let correo = actual.value;


        let botonHTML = ''
        if (banderitaEsPrimero && !estaEnviando) { //si es el primero en la fila y no se esta enviando nada, le pongo el boton.
            botonHTML = `
                <div class="d-flex justify-content-end align-items-center mt-2">
                    <button id="btn-send-inline" class="btn-send-gmail px-3 py-1 bg-success border-0 text-white rounded">Enviar Ahora</button>
                </div>`;
        } else if (banderitaEsPrimero && estaEnviando) {
            botonHTML = ` 
                <div class="d-flex justify-content-end align-items-center mt-2">
                    <button id="btn-send-inline" class="btn-send-gmail px-3 py-1 bg-success border-0 text-white rounded">Enviar Ahora</button>
                </div>`;
        }

        html += `
            <div class="mail-card p-3 w-100 position-relative mb-2 ${banderitaEsPrimero ? 'border border-primary' : ''}">
                <span class="mail-id">#${correo.numero}</span>
                <h4 class="fs-6 mb-1 text-truncate">Asunto: ${correo.asunto}</h4>
                <div class="small text-light">
                    <p class="m-0 mb-1"><span class="text-purple-novo">De:</span> ${correo.remitente}</p>
                    <p class="m-0 mb-2"><span class="text-purple-novo">Para:</span> ${correo.destinatario}</p>
                </div>
                ${botonHTML} 
            </div>`;

        actual = actual.next
        banderitaEsPrimero = false // asegura que el resto de los correos ya no sean el siguiente.
    }

    colaDeEspera.innerHTML = html

    let btnEnvio = document.querySelector('#btn-send-inline') // como el boton se borra, hay que buscarlo de nuevo en el html al renderizar
    if (btnEnvio) {
        btnEnvio.addEventListener('click', enviar)
    }

}

