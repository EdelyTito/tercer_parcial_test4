const householdTasks = [
    'lavar el baño', 'barrer el suelo', 'lavar los platos', 'ordenar la sala',
    'hacer la cama','avanzar con un proyecto','estudiar', 'hacer tarea', 'leer un libro', 'ver un video de programación',
    'personalizar mi perfil', 'hacer ejercicio', 'comer sano', 'tomar agua', 'meditar', 'dormir bien',
    'hacer la compra', 'comprar pan', 'comprar leche', 'comprar frutas', 'comprar verduras',
];

export function generateRandomItemName(): string {
    const randomIndex = Math.floor(Math.random() * householdTasks.length);
    const task = householdTasks[randomIndex];
    return `Tarea: ${task}`;
}
