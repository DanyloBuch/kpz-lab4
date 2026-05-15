// Базовий клас для всіх рівнів підтримки
class SupportHandler {
    constructor() {
        this.nextHandler = null; // Посилання на наступний рівень
    }

    // Метод для встановлення наступного рівня в ланцюжку
    setNext(handler) {
        this.nextHandler = handler;
        // Повертаємо handler, щоб можна було будувати зручні ланцюжки: a.setNext(b).setNext(c)
        return handler; 
    }

    // Метод обробки запиту
    handle(request) {
        // Якщо є наступний обробник — передаємо запит йому
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }
        // Якщо ніхто не зміг обробити запит, повертаємо null
        return null; 
    }
}

// Рівень 1: Бот (Загальні питання)
class BotSupport extends SupportHandler {
    handle(request) {
        if (request === '1') {
            console.log(" Бот: Ви обрали загальні питання. Відправляю вам посилання на сторінку з частими запитаннями (FAQ).");
            return true; 
        }
        console.log(" Бот: Я лише бот і не можу це вирішити. З'єдную з живим оператором...");
        return super.handle(request);
    }
}

// Рівень 2: Оператор (Фінансові питання)
class OperatorSupport extends SupportHandler {
    handle(request) {
        if (request === '2') {
            console.log(" Оператор: Ви обрали питання щодо рахунку. Ваш баланс становить 150 грн. Чим ще можу допомогти?");
            return true;
        }
        console.log(" Оператор: Це технічне питання або скарга. Перемикаю на технічний відділ...");
        return super.handle(request);
    }
}

// Рівень 3: Технічний відділ (Проблеми зі зв'язком)
class TechSupport extends SupportHandler {
    handle(request) {
        if (request === '3') {
            console.log(" Техпідтримка: Перевіряємо ваше з'єднання... Спробуйте перезавантажити пристрій.");
            return true;
        }
        console.log(" Техпідтримка: Це питання поза нашою компетенцією. З'єдную з головним менеджером...");
        return super.handle(request);
    }
}

// Рівень 4: Менеджер (Скарги та пропозиції)
class ManagerSupport extends SupportHandler {
    handle(request) {
        if (request === '4') {
            console.log(" Менеджер: Приносимо вибачення за незручності. Ми обов'язково розглянемо вашу скаргу.");
            return true;
        }
        // Це остання ланка. Якщо жоден варіант не підійшов:
        console.log(" Менеджер: На жаль, такого пункту меню не існує. Спробуйте ще раз.");
        return super.handle(request);
    }
}

// Підключаємо модуль для роботи з консоллю
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 1. Створюємо екземпляри наших рівнів підтримки
const bot = new BotSupport();
const operator = new OperatorSupport();
const tech = new TechSupport();
const manager = new ManagerSupport();

// 2. БУДУЄМО ЛАНЦЮЖОК (Ось тут магія патерну!)
// Бот -> Оператор -> Техпідтримка -> Менеджер
bot.setNext(operator).setNext(tech).setNext(manager);

// 3. Створюємо функцію для показу меню
function showMenu() {
    console.log("\n====== СЛУЖБА ПІДТРИМКИ ======");
    console.log("1. Загальні питання (FAQ)");
    console.log("2. Фінансові питання (Баланс)");
    console.log("3. Технічні проблеми (Немає зв'язку)");
    console.log("4. Скарги та пропозиції (Зв'язок з менеджером)");
    console.log("0. Вихід");
    console.log("================================");

    // Чекаємо на вибір користувача
    rl.question('Оберіть пункт меню: ', (answer) => {
        if (answer === '0') {
            console.log("Дякуємо за звернення! До побачення.");
            rl.close();
            return;
        }

        console.log("\n--- ОБРОБКА ЗАПИТУ ---");
        // Передаємо запит у ланцюжок, завжди починаючи з першого (бота)
        const isResolved = bot.handle(answer);

        // Якщо повернулося не true (тобто жоден Handler не підійшов)
        if (!isResolved) {
            console.log("-> Правильний рівень не знайдено. Спробуйте ще раз.");
            showMenu(); // Запускаємо меню наново
        } else {
            // Якщо питання вирішено, меню закінчується
            console.log("--- Діалог завершено ---");
            rl.close();
        }
    });
}

// Запускаємо нашу програму
showMenu();