import { test, expect } from '@playwright/test';
import { SesionCrearItemFecha} from '../pages/sesionCrearItemFecha.pagina';
import { nombreItemsAleatorio } from '../utilities/nombreItemsAleatorio';

let sesionCrearItemFecha: SesionCrearItemFecha; // Variable para almacenar la instancia de la clase SesionCrearItemFecha

// Se ejecuta antes de cada prueba
test.beforeEach(async ({ page }) => {
    // Inicializa la clase SesionCrearItemFecha con la página actual de Playwright
    sesionCrearItemFecha = new SesionCrearItemFecha(page);
    
    // Navega al enlace inicial y realiza el inicio de sesión con las credenciales especificadas
    await sesionCrearItemFecha.irAlEnlace();
    await sesionCrearItemFecha.iniciarSesion('felipeperez@gmail.com', 'felipecontrasena');
});

// Prueba principal que agrega ítems y asigna una fecha de entrega
test('Agregar ítems y asignar fecha de entrega', async ({ page }) => {
    // Selecciona un proyecto vacío para trabajar en él
    await sesionCrearItemFecha.seleccionarProyectoVacio();

    // Genera dos ítems con nombres aleatorios
    console.log('Agregando primer ítem...');
    const primerItem = nombreItemsAleatorio();
    console.log('Agregando segundo ítem...');
    const segundoItem = nombreItemsAleatorio();
    
    // Agrega ambos ítems al proyecto seleccionado
    await sesionCrearItemFecha.agregarItem(primerItem);
    await sesionCrearItemFecha.agregarItem(segundoItem);

    // Asigna una fecha aleatoria de entrega al primer ítem agregado
    await sesionCrearItemFecha.asignarFechaEntregaAlPrimerItem(primerItem);

    // Localiza la lista de ítems en la página
    const listaDeItems = page.locator('#mainItemList');

    // Localiza el primer ítem dentro de la lista basado en su nombre aleatorio
    const localizadorPrimerItem = listaDeItems.locator('li', { hasText: primerItem });
    
    // Verifica que el primer ítem sea visible en la página
    await expect(localizadorPrimerItem).toBeVisible();

    // Localiza la fecha de entrega asignada al primer ítem
    const localizadorFechaDeEntrega = localizadorPrimerItem.locator('.ItemDueDateInner');
    
    // Verifica que la fecha de entrega esté visible
    await expect(localizadorFechaDeEntrega).toBeVisible();

    // Opcional: Captura la fecha de entrega asignada y la muestra en la consola
    const fechaAsignada = await localizadorFechaDeEntrega.innerText();
    console.log(`Fecha asignada: ${fechaAsignada}`);
});