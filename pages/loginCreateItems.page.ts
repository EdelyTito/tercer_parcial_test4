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

    async setDueDateToFirstItem(day: string) {
        const items = this.page.locator('#mainItemList li');
        await expect(items).toHaveCount(1, { timeout: 5000 });

        const firstItem = items.first();
        await expect(firstItem).toBeVisible();
    
        // Hacer hover sobre el primer ítem para que el botón "Set Due Date" se haga visible
        await firstItem.hover();
    
        const setDueDateButton = firstItem.locator('.ItemDueDate');
        await setDueDateButton.waitFor({ state: 'attached', timeout: 5000 });
        await expect(setDueDateButton).toBeVisible({ timeout: 5000 });
        await setDueDateButton.click();
    
        await this.page.getByRole('link', { name: day }).click();
    
        await this.dueDateSaveButton.click();
    }

}