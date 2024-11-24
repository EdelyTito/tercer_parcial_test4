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

    async selectEmptyProject() {
        // Seleccionar todos los proyectos principales
        const mainProjects = this.page.locator('#mainProjectList > li.BaseProjectLi');
        const projectCount = await mainProjects.count();
    
        for (let i = 0; i < projectCount; i++) {
            const project = mainProjects.nth(i);
    
            // Verificar si el proyecto contiene subproyectos (descartar si tiene un ul.ItemSubList)
            const hasSubProjects = await project.locator('ul.ItemSubList').count();
            if (hasSubProjects > 0) {
                console.log(`Skipping subproject container: ${i}`);
                continue; // Salta los contenedores de subproyectos
            }
    
            // Verificar si el proyecto está vacío
            const projectIndicator = project.locator('.ItemIndicator .ListCount');
            const itemCountText = await projectIndicator.innerText();
    
            if (itemCountText === '0') {
                // Hacer clic en el proyecto vacío
                await project.click();
                console.log(`Selected empty project at index: ${i}`);
                return;
            }
        }
    
        throw new Error('No empty project found');
    }
    
    async addItem(itemContent: string) {
        await this.newItemInput.fill(itemContent);
        await this.addButton.click();
    }

    async goToRandomNextMonth() {
        const nextButton = this.page.locator('.ui-datepicker-next');
        await expect(nextButton).toBeVisible({ timeout: 5000 });
    
        // Generar un número aleatorio entre 1 y 12
        const randomClicks = Math.floor(Math.random() * 12) + 1;
        console.log(`Avanzando ${randomClicks} meses...`);
    
        // Hacer clic en el botón "Next" el número de veces generado
        for (let i = 0; i < randomClicks; i++) {
            await nextButton.click();
            // Esperar un pequeño intervalo para asegurar que la transición se complete
            await this.page.waitForTimeout(500);
        }
    
        // Verificar que el mes haya cambiado correctamente (opcional)
        const currentMonth = await this.page.locator('.ui-datepicker-month').innerText();
        console.log(`Mes actual después de avanzar: ${currentMonth}`);
    }


    async setDueDateToFirstItem(itemContent: string) {
        const item = this.page.locator('#mainItemList li', { hasText: itemContent });
        await expect(item).toBeVisible();
    
        // Hacer hover sobre el primer ítem para que el botón "Set Due Date" se haga visible
        await item.hover();
    
        const setDueDateButton = item.locator('.ItemDueDate');
        await setDueDateButton.waitFor({ state: 'attached', timeout: 5000 });
        await expect(setDueDateButton).toBeVisible({ timeout: 5000 });
        await setDueDateButton.click();
    
        // Avanzar a un mes aleatorio
        await this.goToRandomNextMonth();

        // Generar un día aleatorio entre 1 y 28 (para garantizar compatibilidad con todos los meses)
        const randomDay = Math.floor(Math.random() * 28) + 1;
        console.log(`Seleccionando día aleatorio: ${randomDay}`);

        // Seleccionar el día aleatorio
        await this.page.locator('.ui-datepicker-calendar').getByRole('link', { name: String(randomDay) }).click();

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
