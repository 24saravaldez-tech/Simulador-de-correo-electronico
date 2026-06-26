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

    constructor(destinatario, remitente, asunto, mensaje, numero) {
        this.#destinatario = destinatario
        this.#remitente = remitente
        this.#asunto = asunto
        this.#mensaje = mensaje
        this.#numero = numero

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
// let quienLomanda = document.querySelector('#remitente')
// let aQuienLlega = document.querySelector('#destinatario')
let botonEnviar = document.querySelector('#btn-send')
let colaDeEspera = document.querySelector('#queue-list')
let contenedorCorreosActuales = document.querySelector('#current-mail')
let historialLista = document.querySelector('#history-list')
let contenedorSiguienteCorreo = document.querySelector('#next-mail')
let cantidad = document.querySelector('#counter-badge')
let contadorDeLaCola = document.querySelector('#queue-count')
let banderita = false
let estaEnviando = false

let contador = 1
let colaHistorial = new ControlDeCorreos() //para el historial, va a ser el mismo sistema pero con la idea de que se van formando segun se van enviando.
let controlCorreos = []
let colaDeCorreos = new ControlDeCorreos() //creo la instancia del control de correos para poder separar las acciones individuales de los correos de las acciones conjuntas de las colas.

redactarNuevoCorreo.addEventListener('click', (event) => {
    popUp.classList.remove('d-none') //cuando se da en redactar correo, se abre o aparece el popup
})

cerrarX.addEventListener('click', (event) => {
    popUp.classList.add('d-none') //si se le da en la x, cierra el popup
})

agregarALaCola.addEventListener('submit', (event) => {
    event.preventDefault(); //se le da el prevent default a todo el formulario para que no de problemas de recargas la pagina. Darle el pevent default a los botones de nada sirve pues el evento defavult es propio del formulario.
    let correoUsuario = new Correos(event.target.destinatario.value, event.target.remitente.value, event.target.asunto.value, event.target.mensaje.value, contador++)
    controlCorreos.push(correoUsuario)
    colaDeCorreos.enEspera(correoUsuario) //meto el correo del usuario, el que acaba de crear, a la fila de correos para ahorrarnos pleitos.
    popUp.classList.add('d-none')
    agregarALaCola.reset()
    renderizar();
});

botonEnviar.addEventListener('click', () => {
    let correoPorEnviarse = colaDeCorreos.porEnviar();

    if (correoPorEnviarse) {
        //aqui iria el sonidito de enviado
        contenedorCorreosActuales.innerHTML = `
            <div class="mail-card p-3 w-100 position-relative status-success">
                <span class="mail-id">#${correoPorEnviarse.numero}</span>
                <h4 class="fs-6 mb-1 text-truncate">Asunto: ${correoPorEnviarse.asunto}</h4>
                <p class="m-0 small text-muted">Enviado con éxito a: ${correoPorEnviarse.destinatario}</p>
            </div>

        `
        renderizar() // renderizo la cola de espera para removerlo visualmente
    } else {
        contenedorCorreosActuales.innerHTML = `<p class="m-0 text-muted italic">No hay correos en la cola para enviar</p>`;
    }
});



function enviar() {
    contenedorCorreosActuales.innerHTML = 'No se esta enviando nada'

    if (banderita) {
        return // si ya hay un correo enviandose, no hace absolutmente nada
    }

    banderita = true;
    let correoAEnviar = colaDeCorreos.first// busco cual es el primero

    let correoEnviado = colaDeCorreos.porEnviar() //una vez pasado el tiempo, lo saco de la cola
    if (correoEnviado) {
        colaHistorial.enEspera(correoEnviado)//entra al historial de enviados
        estaEnviando = true
        contenedorCorreosActuales.innerHTML = `
                <div class="p-2 alert alert-success m-0 text-center">
                    Enviado con éxito.
                </div>`;

        setTimeout(() => {
            banderita = false // banderita pasa a false lo que indica que ya se pude enviar el siguiente
            estaEnviando = false
            renderizar()// volvemos a renderizar.
            contenedorCorreosActuales.innerHTML = 'No se esta enviando nada'
        }, 2000)
    }
    estaEnviando = true
    // setTimeout(() => { //para darle show de tiempo de envio.
    //     // actualizo el panel central para indicar que se está procesando
    //     contenedorCorreosActuales.innerHTML = `
    //     <div class="p-2 alert alert-warning m-0 text-center">
    //         <strong>Enviando #${correoAEnviar.numero}...</strong>
    //         <div class="spinner-border spinner-border-sm text-warning ms-2" role="status"></div>
    //     </div>`

    //     renderizar() // renderizo de nuevo para que el boton se borre durante el envío

    //     
    // }, 2000)
}


function renderizar() {
    cantidad.textContent = colaDeCorreos.length;
    contadorDeLaCola.textContent = colaDeCorreos.length;

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
            // si el primero se eesta enviando, muestro un estado de desabilitado
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

    let siguienteCorreo = !estaEnviando && colaDeEspera.first ? colaDeEspera.first.next : colaDeEspera.first; // El siguiente sera el segundo en la cola si el primero se esta enviando

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

    let htmlHistorial = '';
    let actualHistorial = colaHistorial.first;

    while (actualHistorial) {
        let correo = actualHistorial.value;
        htmlHistorial += `
            <div class="mail-card p-3 w-100 position-relative mb-2" style="opacity: 0.7;">
                <span class="mail-id text-success">✓ #${correo.numero}</span>
                <h4 class="fs-6 mb-1 text-truncate text-muted">Asunto: ${correo.asunto}</h4>
                <div class="small text-muted">
                    <p class="m-0"><span class="text-purple-novo">Para:</span> ${correo.destinatario}</p>
                </div>
            </div>`;


        // if (!actualHistorial.next && !estaEnviando) { //coloco el ultimo en la lista
        //     setTimeout(() => {
        //         contenedorCorreosActuales.innerHTML = `
        //         <div class="p-2 alert alert-success m-0 text-center">
        //             <strong>${correo.numero}</strong> Enviado con éxito.
        //         </div>`;
        //     }, 2000)

        // }

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
}

