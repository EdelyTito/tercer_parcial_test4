// Array que contiene una lista de tareas predefinidas
const tareas = [
    'lavar el baño', 'barrer el suelo', 'lavar los platos', 'ordenar la sala',
    'hacer la cama', 'avanzar con un proyecto', 'estudiar', 'hacer tarea', 'leer un libro', 'ver un video de programación',
    'personalizar mi perfil', 'hacer ejercicio', 'comer sano', 'tomar agua', 'meditar', 'dormir bien',
    'hacer la compra', 'comprar pan', 'comprar leche', 'comprar frutas', 'comprar verduras',
];

// Función que devuelve un nombre de tarea aleatorio de la lista
export function nombreItemsAleatorio(): string {
    // Genera un índice aleatorio basado en el tamaño del array 'tareas'
    const randomIndex = Math.floor(Math.random() * tareas.length);
    
    // Obtiene la tarea correspondiente al índice aleatorio
    const task = tareas[randomIndex];
    
    // Devuelve la tarea seleccionada
    return `${task}`;
}
