import { generateRandomItemName } from '../utilities/randomItems';
import { LoginCreateItems } from '../pages/loginCreateItems.page';
import { test, expect } from '@playwright/test';

test.describe('Pruebas', () => {
    let loginCreateItems: LoginCreateItems;

    test.beforeEach(async ({ page }) => {
        loginCreateItems = new LoginCreateItems(page);
        await loginCreateItems.goto();

        await loginCreateItems.clearAllItems();
    });

    /*test('Iniciar sesión', async ({ page }) => {
        await loginCreateItems.login('felipeperez@gmail.com', 'felipecontrasena');
    });*/

    test('Agregar ítems y asignar fecha de entrega', async ({ page }) => {
        await loginCreateItems.login('felipeperez@gmail.com', 'felipecontrasena');

        // Selecciona un proyecto vacío
        await loginCreateItems.selectEmptyProject();

        const firstItem = generateRandomItemName();
        const secondItem = generateRandomItemName();
        await loginCreateItems.addItem(firstItem);
        await loginCreateItems.addItem(secondItem);

        // Asignar una fecha aleatoria al primer ítem
        await loginCreateItems.setDueDateToFirstItem(firstItem);

        const mainItemList = page.locator('#mainItemList');
        const firstItemLocator = mainItemList.locator('li', { hasText: firstItem });
        await expect(firstItemLocator).toBeVisible();

        // Verifica que la fecha asignada sea visible (sin comparar con un valor específico)
        const dueDateLocator = firstItemLocator.locator('.ItemDueDateInner');
        await expect(dueDateLocator).toBeVisible();

        // Opcional: Capturar y mostrar la fecha asignada en consola
        const assignedDate = await dueDateLocator.innerText();
        console.log(`Fecha asignada al ítem "${firstItem}": ${assignedDate}`);

    });

});