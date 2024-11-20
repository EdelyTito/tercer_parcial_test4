import {expect, Locator, Page} from '@playwright/test';

export class LoginCreateItems {
    readonly page: Page;
    readonly url = 'https://todo.ly/';
    readonly loginButton: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitLoginButton: Locator;
    readonly homeTab: Locator;
    readonly newItemInput: Locator;
    readonly addButton: Locator;
    readonly setDueDateButton: Locator;
    readonly dueDateSaveButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginButton = page.locator('.HPHeaderLogin > a');
        this.emailInput = page.locator('#ctl00_MainContent_LoginControl1_TextBoxEmail');
        this.passwordInput = page.locator('#ctl00_MainContent_LoginControl1_TextBoxPassword');
        this.submitLoginButton = page.getByRole('button', { name: 'Submit' });
        this.homeTab = page.getByRole('cell', { name: 'Home', exact: true });
        this.newItemInput = page.locator('#NewItemContentInput');
        this.addButton = page.getByRole('button', { name: 'Add' });
        this.setDueDateButton = page.getByText('Set Due date').first();
        this.dueDateSaveButton = page.getByRole('button', { name: 'Save' });
    }

    async goto() {
        await this.page.goto(this.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    }

    async login(email: string, password: string) {
        await this.loginButton.click();
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.submitLoginButton.click();
    }

    async navigateToHome() {
        await this.homeTab.click();
    }

    async addItem(itemContent: string) {
        await this.newItemInput.fill(itemContent);
        await this.addButton.click();
    }

    async setDueDateToFirstItem(itemContent: string, day: string) {
        const item = this.page.locator('#mainItemList li', { hasText: itemContent });
        await expect(item).toBeVisible();
    
        // Hacer hover sobre el primer ítem para que el botón "Set Due Date" se haga visible
        await item.hover();
    
        const setDueDateButton = item.locator('.ItemDueDate');
        await setDueDateButton.waitFor({ state: 'attached', timeout: 5000 });
        await expect(setDueDateButton).toBeVisible({ timeout: 5000 });
        await setDueDateButton.click();
    
        await this.page.getByRole('link', { name: day }).click();
    
        await this.dueDateSaveButton.click();
    }

    async clearAllItems() {
        const items = this.page.locator('#mainItemList li');
        const count = await items.count();
    
        // Elimina cada ítem existente
        for (let i = 0; i < count; i++) {
            const deleteButton = items.nth(i).locator('.delete-button'); // Ajusta el selector según tu HTML
            await deleteButton.click();
        }
    
        // Espera a que no queden elementos
        await expect(items).toHaveCount(0);
    }

}