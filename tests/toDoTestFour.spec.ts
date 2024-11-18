import { LoginCreateItems } from '../pages/loginCreateItems.page';
import { test, expect } from '@playwright/test';
import { generateRandomItemName } from '../utilities/randomItems';

test.describe('Pruebas', () => {
    let loginCreateItems: LoginCreateItems;

    test.beforeEach(async ({ page }) => {
        loginCreateItems = new LoginCreateItems(page);
        await loginCreateItems.goto();
    });

    test('Iniciar sesión', async ({ page }) => {
        await loginCreateItems.login('felipeperez@gmail.com', 'felipecontrasena');
    });

    test('Agregar ítems y asignar fecha de entrega', async ({ page }) => {
        await loginCreateItems.login('felipeperez@gmail.com', 'felipecontrasena');
        await loginCreateItems.navigateToHome();

        const firstItem = generateRandomItemName();
        const secondItem = generateRandomItemName();
        await loginCreateItems.addItem(firstItem);
        await loginCreateItems.addItem(secondItem);

        const dueDateDay = '29';

        await loginCreateItems.setDueDateToFirstItem(dueDateDay);

        const mainItemList = page.locator('#mainItemList');

        const firstItemLocator = mainItemList.locator('li', { hasText: firstItem });
        await expect(firstItemLocator).toBeVisible();

        const firstItemDueDate = firstItemLocator.locator('.ItemDueDateInner', { hasText: dueDateDay });
        await expect(firstItemDueDate).toBeVisible();

    });

});

