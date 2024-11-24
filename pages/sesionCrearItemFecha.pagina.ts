import {expect, Locator, Page} from '@playwright/test';

export class SesionCrearItemFecha {
    // Propiedades que definen los elementos en la página web
    readonly pagina: Page; // Página web donde se realizan las interacciones
    readonly enlace = 'https://todo.ly/'; // URL base para navegar a la aplicación
    readonly botonFormularioInicioDeSesion: Locator; // Botón para abrir el formulario de inicio de sesión
    readonly entradaCorreoElectronico: Locator; // Campo para ingresar el correo electrónico
    readonly entradaContrasena: Locator; // Campo para ingresar la contraseña
    readonly botonIniciarSesion: Locator; // Botón para iniciar sesión
    readonly entradaNuevoItem: Locator; // Campo para ingresar el contenido de un nuevo ítem
    readonly botonAgregarItem: Locator; // Botón para agregar un nuevo ítem
    readonly botonAsignarFechaEntrega: Locator; // Botón para asignar fecha de entrega
    readonly botonGuardarFechaEntrega: Locator; // Botón para guardar la fecha de entrega

    // Constructor que inicializa los elementos de la página
    constructor(pagina: Page) {
        this.pagina = pagina;
        this.botonFormularioInicioDeSesion = pagina.locator('.HPHeaderLogin > a');
        this.entradaCorreoElectronico = pagina.locator('#ctl00_MainContent_LoginControl1_TextBoxEmail');
        this.entradaContrasena = pagina.locator('#ctl00_MainContent_LoginControl1_TextBoxPassword');
        this.botonIniciarSesion = pagina.getByRole('button', { name: 'Submit' });
        this.entradaNuevoItem = pagina.locator('#NewItemContentInput');
        this.botonAgregarItem = pagina.getByRole('button', { name: 'Add' });
        this.botonAsignarFechaEntrega = pagina.getByText('Set Due date').first();
        this.botonGuardarFechaEntrega = pagina.getByRole('button', { name: 'Save' });
    }

    // Método para navegar a la página de la aplicación
    async irAlEnlace() {
        // Navegar a la URL con espera hasta que se cargue el DOM
        await this.pagina.goto(this.enlace, { waitUntil: 'domcontentloaded', timeout: 60000 });
        console.log('Página cargada con éxito');
    }    

    // Método para iniciar sesión con el correo electrónico y contraseña proporcionados
    async iniciarSesion(correoElectronico: string, contrasena: string) {
        // Hacer clic en el botón de inicio de sesión
        await this.botonFormularioInicioDeSesion.click();
        // Rellenar los campos de correo y contraseña
        await this.entradaCorreoElectronico.fill(correoElectronico);
        await this.entradaContrasena.fill(contrasena);
        // Hacer clic en el botón para iniciar sesión
        await this.botonIniciarSesion.click();
        console.log('Inicio de sesión completado');
    }

    // Método para seleccionar un proyecto vacío de la lista de proyectos
    async seleccionarProyectoVacio() {
        // Localizar todos los proyectos principales
        const proyectosPrincipales = this.pagina.locator('#mainProjectList > li.BaseProjectLi');
        const contadorDeProyectos = await proyectosPrincipales.count();
    
        // Iterar sobre los proyectos y buscar uno vacío
        for (let i = 0; i < contadorDeProyectos; i++) {
            const proyecto = proyectosPrincipales.nth(i);
    
            // Verificar si el proyecto tiene subproyectos (y descartarlo si los tiene)
            const tieneSubProyectos = await proyecto.locator('ul.ItemSubList').count();
            if (tieneSubProyectos > 0) {
                continue; // Saltar proyectos con subproyectos
            }
    
            // Verificar si el proyecto está vacío (sin ítems)
            const indicadorProyectoVacio = proyecto.locator('.ItemIndicator .ListCount');
            const contadorDeItems = await indicadorProyectoVacio.innerText();
    
            if (contadorDeItems === '0') {
                console.log(`Proyecto vacío encontrado`);
                // Si el proyecto está vacío, hacer clic en él
                await proyecto.click();
                return;
            }
        }
        // Si no se encuentra un proyecto vacío, lanzar un error
        throw new Error('No se encontraron proyectos vacíos');
    }
    
    // Método para agregar un nuevo ítem con el contenido proporcionado
    async agregarItem(contenidoDelItem: string) {
        // Rellenar el campo de contenido del ítem
        await this.entradaNuevoItem.fill(contenidoDelItem);
        // Hacer clic en el botón para agregar el ítem
        await this.botonAgregarItem.click();
        console.log('Ítem agregado con éxito');
    }

    // Método para seleccionar un mes aleatorio en el calendario
    async seleccionarMesAleatorio() {
        // Localizar el botón para avanzar al siguiente mes
        const botonSiguienteMes = this.pagina.locator('.ui-datepicker-next');
        await expect(botonSiguienteMes).toBeVisible({ timeout: 5000 });
    
        // Generar un número aleatorio entre 1 y 12 (representando los meses del año)
        const clicksAleatorios = Math.floor(Math.random() * 12) + 1;
        console.log(`Avanzando ${clicksAleatorios} meses...`);
    
        // Hacer clic en el botón de siguiente mes el número de veces aleatorio generado
        for (let i = 0; i < clicksAleatorios; i++) {
            await botonSiguienteMes.click();
            // Esperar un pequeño intervalo para asegurar que la transición del mes se complete
            await this.pagina.waitForTimeout(500);
        }
    
        // Verificar que el mes haya cambiado correctamente (opcional)
        const mesSeleccionado = await this.pagina.locator('.ui-datepicker-month').innerText();
        console.log(`Mes seleccionado después de avanzar: ${mesSeleccionado}`);
    }


    // Método para asignar una fecha de entrega aleatoria al primer ítem con el contenido especificado
    async asignarFechaEntregaAlPrimerItem(contenidoDelItem: string) {
        // Localizar el ítem en la lista con el contenido proporcionado
        console.log(`Asignando fecha de entrega al ítem: ${contenidoDelItem}`);
        const item = this.pagina.locator('#mainItemList li', { hasText: contenidoDelItem });
        await expect(item).toBeVisible();
    
        // Hacer hover sobre el ítem para que el botón de "Set Due Date" se haga visible
        await item.hover();
    
        // Localizar y hacer clic en el botón de asignar fecha de entrega
        const botonAsignarFechaDeEntrega = item.locator('.ItemDueDate');
        await botonAsignarFechaDeEntrega.waitFor({ state: 'attached', timeout: 5000 });
        await expect(botonAsignarFechaDeEntrega).toBeVisible({ timeout: 5000 });
        await botonAsignarFechaDeEntrega.click();
    
        // Seleccionar un mes aleatorio
        await this.seleccionarMesAleatorio();

        // Generar un día aleatorio entre 1 y 28 (para evitar problemas con meses de 30 días)
        const diaAleatorio = Math.floor(Math.random() * 28) + 1;
        console.log(`Día aleatorio seleccionado: ${diaAleatorio}`);

        // Seleccionar el día aleatorio en el calendario
        await this.pagina.locator('.ui-datepicker-calendar').getByRole('link', { name: String(diaAleatorio) }).click();

        // Hacer clic en el botón para guardar la fecha de entrega seleccionada
        await this.botonGuardarFechaEntrega.click();
        console.log('Fecha de entrega asignada con éxito');
    }

}
