// Оновлений базовий клас з підтримкою Спостерігача
class LightNode {
    constructor() {
        // Словник для зберігання підписників
        // Формат: { 'click': [func1, func2], 'mouseover': [func3] }
        this.listeners = {};
    }

    // --- ПАТЕРН СПОСТЕРІГАЧ (Observer) ---
    addEventListener(eventType, callback) {
        // Якщо масиву для такої події ще немає - створюємо його
        if (!this.listeners[eventType]) {
            this.listeners[eventType] = [];
        }
        // Додаємо функцію-слухача до масиву
        this.listeners[eventType].push(callback);
    }

    dispatchEvent(eventType, eventData = null) {
        // Якщо на цю подію є підписники, викликаємо їх усіх
        if (this.listeners[eventType]) {
            this.listeners[eventType].forEach(callback => callback(eventData));
        }
    }

    // --- ПАТЕРН ШАБЛОННИЙ МЕТОД (твій попередній код) ---
    render() {
        this.onBeforeRender(); 
        const html = this.generateHTML(); 
        this.onAfterRender();  
        return html;
    }

    onCreated() {}
    onInserted() {}
    onBeforeRender() {}
    onAfterRender() {}

    generateHTML() { throw new Error("Not implemented"); }
    accept(visitor) { throw new Error("Not implemented"); }
}

// Конкретний елемент для демонстрації (наприклад, Кнопка)
class LightElement extends LightNode {
    constructor(tagName, text) {
        super(); // Обов'язково викликаємо конструктор базового класу
        this.tagName = tagName;
        this.text = text;
    }

    generateHTML() {
        return `<${this.tagName}>${this.text}</${this.tagName}>`;
    }

    // Симулюємо дію користувача: КЛІК
    click() {
        console.log(`\n[Браузер] -> Користувач клікнув на <${this.tagName}>`);
        // Запускаємо подію 'click'
        this.dispatchEvent('click', { target: this.tagName, time: new Date().toLocaleTimeString() });
    }

    // Симулюємо дію користувача: НАВЕДЕННЯ МИШКОЮ
    hover() {
        console.log(`\n[Браузер] -> Користувач навів мишку на <${this.tagName}>`);
        // Запускаємо подію 'mouseover'
        this.dispatchEvent('mouseover');
    }
}

// === ГОЛОВНИЙ МЕТОД ДЛЯ ПЕРЕВІРКИ ===
function main() {
    // 1. Створюємо елемент
    const submitBtn = new LightElement('button', 'Відправити');
    console.log("HTML:", submitBtn.render());

    // 2. Підписуємо Спостерігачів (додаємо EventListeners)
    
    // Перший слухач на клік
    submitBtn.addEventListener('click', (event) => {
        console.log(` Спостерігач 1: Обробка кліку! Час події: ${event.time}`);
    });

    // Другий слухач на клік (наприклад, для аналітики)
    submitBtn.addEventListener('click', () => {
        console.log(` Спостерігач 2: Відправляю дані про клік в Google Analytics...`);
    });

    // Слухач на наведення мишки
    submitBtn.addEventListener('mouseover', () => {
        console.log(` Спостерігач 3: Змінюю колір кнопки на синій (hover ефект)`);
    });

    // 3. Демонстрація роботи
    submitBtn.hover(); // Симулюємо наведення миші
    submitBtn.click(); // Симулюємо клік
}

main();