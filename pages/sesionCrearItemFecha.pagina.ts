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
        await this.pagina.goto(this.enlace, { waitUntil: 'domcontentloaded', timeout: 60000 });
        console.log('Página cargada con éxito');
    }    

    // Método para iniciar sesión con el correo electrónico y contraseña proporcionados
    async iniciarSesion(correoElectronico: string, contrasena: string) {
        // Verificar que el botón de inicio de sesión sea visible y hacer clic en él
        await expect(this.botonFormularioInicioDeSesion).toBeVisible();
        await this.botonFormularioInicioDeSesion.click();

        //Verificar que los campos de correo electrónico y contraseña sean visibles y llenarlos con los datos proporcionados
        await expect(this.entradaCorreoElectronico).toBeVisible();
        await this.entradaCorreoElectronico.fill(correoElectronico);

        //Verificar que el campo de contraseña sea visible y llenarlo con la contraseña proporcionada
        await expect(this.entradaContrasena).toBeVisible();
        await this.entradaContrasena.fill(contrasena);

        //Verificar que el botón de inicio de sesión sea visible y hacer clic en él
        await expect(this.botonIniciarSesion).toBeVisible();
        await this.botonIniciarSesion.click();
        console.log('Inicio de sesión completado');
    }

    // Método para seleccionar un proyecto vacío de la lista de proyectos
    async seleccionarProyectoVacio() {
        const proyectosPrincipales = this.pagina.locator('#mainProjectList > li.BaseProjectLi');
        const contadorDeProyectos = await proyectosPrincipales.count();
    
        for (let i = 0; i < contadorDeProyectos; i++) {
            const proyecto = proyectosPrincipales.nth(i);
            const tieneSubProyectos = await proyecto.locator('ul.ItemSubList').count();
            if (tieneSubProyectos > 0) {
                continue; // Saltar proyectos con subproyectos
            }
    
            const indicadorProyectoVacio = proyecto.locator('.ItemIndicator .ListCount');
            const contadorDeItems = await indicadorProyectoVacio.innerText();
    
            if (contadorDeItems === '0') {
                console.log(`Proyecto vacío encontrado`);
                //Verificar que se pueda hacer clic en el proyecto vacío y hacer clic en él
                await expect(proyecto).toBeVisible();
                await proyecto.click();
                return;
            }
        }
        throw new Error('No se encontraron proyectos vacíos');
    }
    
    // Método para agregar un nuevo ítem con el contenido proporcionado
    async agregarItem(contenidoDelItem: string) {
        //Verificar que se pueda hacer clic en el campo de entrada de un nuevo ítem y llenarlo con el contenido proporcionado
        await expect(this.entradaNuevoItem).toBeVisible();
        await this.entradaNuevoItem.fill(contenidoDelItem);

        await expect(this.botonAgregarItem).toBeVisible();
        await this.botonAgregarItem.click();
        console.log('Ítem agregado con éxito');
    }

    // Método para seleccionar un mes aleatorio en el calendario
    async seleccionarMesAleatorio() {
        const botonSiguienteMes = this.pagina.locator('.ui-datepicker-next');
        //Verificar que se pueda hacer clic en el botón de siguiente mes
        await expect(botonSiguienteMes).toBeVisible({ timeout: 5000 });
    
        const clicksAleatorios = Math.floor(Math.random() * 12) + 1;
        console.log(`Avanzando ${clicksAleatorios} meses...`);
    
        for (let i = 0; i < clicksAleatorios; i++) {
            await botonSiguienteMes.click();
            await this.pagina.waitForTimeout(500);
        }
    
        const mesSeleccionado = await this.pagina.locator('.ui-datepicker-month').innerText();
        console.log(`Mes seleccionado después de avanzar: ${mesSeleccionado}`);
    }

    // Método para asignar una fecha de entrega aleatoria al primer ítem con el contenido especificado
    async asignarFechaEntregaAlPrimerItem(contenidoDelItem: string) {
        console.log(`Asignando fecha de entrega al ítem: ${contenidoDelItem}`);
        const item = this.pagina.locator('#mainItemList li', { hasText: contenidoDelItem });
        const count = await item.count();
    
        if (count !== 1) {
            throw new Error(`Se encontraron ${count} ítems con el texto: ${contenidoDelItem}`);
        }
        
        //Verificar que se pueda hacer clic en el ítem y hacer clic en él
        await expect(item).toBeVisible();
        await item.hover();

        const botonAsignarFechaDeEntrega = item.locator('.ItemDueDate');
        //Verificar que esté visible el botón para asignar la fecha de entrega y hacer clic en él
        await expect(botonAsignarFechaDeEntrega).toBeVisible({ timeout: 5000 });
        await botonAsignarFechaDeEntrega.click();

        await this.seleccionarMesAleatorio();

        const diaAleatorio = Math.floor(Math.random() * 28) + 1;
        console.log(`Día aleatorio seleccionado: ${diaAleatorio}`);

        await this.pagina.locator('.ui-datepicker-calendar').getByRole('link', { name: String(diaAleatorio) }).first().click();

        //Verificar que se pueda hacer clic en el botón de guardar la fecha de entrega y hacer clic en él
        await expect(this.botonGuardarFechaEntrega).toBeVisible();
        await this.botonGuardarFechaEntrega.click();
        console.log('Fecha de entrega asignada con éxito');
    }
}
