const householdTasks = [
    'lavar el baño', 'barrer el suelo', 'lavar los platos', 'ordenar la sala',
    'hacer la cama', 'sacar la basura', 'limpiar las ventanas', 'planchar la ropa',
    'cocinar la cena', 'regar las plantas', 'limpiar la cocina', 'aspirar la alfombra'
];

export function generateRandomItemName(): string {
    const randomIndex = Math.floor(Math.random() * householdTasks.length);
    const task = householdTasks[randomIndex];
    return `Tarea: ${task}`;
}
