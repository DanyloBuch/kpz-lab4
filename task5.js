// --- ПАТЕРН МЕМЕНТО ---

// 1. Мементо (Знімок стану)
// Зберігає текст документа. Його єдина задача - надійно берегти дані.
class DocumentMemento {
    constructor(content) {
        this._content = content;
    }

    // Віддає збережений текст
    getSavedContent() {
        return this._content;
    }
}

// 2. Originator (Творець) - наш текстовий документ
class TextDocument {
    constructor() {
        this.content = "";
    }

    // Додавання тексту
    write(text) {
        this.content += text;
    }

    getContent() {
        return this.content;
    }

    // СТВОРЕННЯ знімка (зберігає поточний стан у Мементо)
    save() {
        return new DocumentMemento(this.content);
    }

    // ВІДНОВЛЕННЯ зі знімка
    restore(memento) {
        this.content = memento.getSavedContent();
    }
}

// 3. Caretaker (Опікун) - сам текстовий редактор
// Він керує історією (знімками), але сам не лізе всередину документа
class TextEditor {
    constructor(document) {
        this.document = document;
        this.history = []; // Масив (стек) для зберігання всіх Мементо
    }

    // Друкуємо текст і одночасно робимо бекап
    type(text) {
        console.log(`[Редактор] Друкуємо: "${text}"`);
        // Спочатку зберігаємо поточний стан (ДО змін)
        this.history.push(this.document.save());
        // Потім додаємо новий текст
        this.document.write(text);
    }

    // Скасування останньої дії (Ctrl+Z)
    undo() {
        if (this.history.length > 0) {
            console.log("\n[Редактор]  Натиснуто 'Скасувати' (Undo)...");
            // Дістаємо останній збережений стан
            const previousState = this.history.pop();
            // Відновлюємо документ
            this.document.restore(previousState);
        } else {
            console.log("\n[Редактор]  Немає дій для скасування.");
        }
    }

    // Виведення поточного результату
    print() {
        console.log(` Поточний текст документа: "${this.document.getContent()}"\n`);
    }
}

// === ГОЛОВНИЙ МЕТОД ДЛЯ ПЕРЕВІРКИ ===
function main() {
    console.log("=== ТЕСТУВАННЯ ПАТЕРНУ МЕМЕНТО (Text Editor) ===\n");

    const doc = new TextDocument();
    const editor = new TextEditor(doc);

    // 1. Починаємо працювати в редакторі
    editor.type("Привіт, світ! ");
    editor.print();

    editor.type("Це мій новий текст. ");
    editor.print();

    editor.type("Ой, випадково додав помилку!");
    editor.print();

    // 2. Скасовуємо помилку (Undo)
    editor.undo();
    editor.print(); // Має зникнути "Ой, випадково додав помилку!"

    // 3. Скасовуємо ще раз
    editor.undo();
    editor.print(); // Має залишитися тільки "Привіт, світ! "
}

// Запуск програми
main();