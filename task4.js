// --- ПАТЕРН СТРАТЕГІЯ ---

// 1. Загальний "інтерфейс" для всіх стратегій завантаження
class ImageLoadStrategy {
    load(href) {
        throw new Error("Метод load() має бути реалізований!");
    }
}

// 2. Конкретна стратегія 1: Завантаження з мережі
class NetworkLoadStrategy extends ImageLoadStrategy {
    load(href) {
        console.log(`[Мережа]  Завантаження зображення через HTTP/HTTPS...`);
        console.log(`         -> Підключення до сервера за адресою: ${href}`);
        console.log(`         -> Зображення успішно завантажено у кеш браузера.\n`);
    }
}

// 3. Конкретна стратегія 2: Завантаження з файлової системи
class FileSystemLoadStrategy extends ImageLoadStrategy {
    load(href) {
        console.log(`[Диск]  Завантаження локального зображення...`);
        console.log(`       -> Читання файлу з диска за шляхом: ${href}`);
        console.log(`       -> Зображення успішно зчитано у пам'ять.\n`);
    }
}

// 4. Клас Image (Контекст), який використовує стратегію
class ImageElement {
    constructor(href) {
        this.href = href;
        this.strategy = null;

        // Автоматично визначаємо стратегію на основі href (як вимагається в завданні)
        if (this.href.startsWith('http://') || this.href.startsWith('https://')) {
            this.strategy = new NetworkLoadStrategy();
        } else {
            this.strategy = new FileSystemLoadStrategy();
        }
    }

    // Метод для ручної зміни стратегії "на льоту" (основа патерну Стратегія)
    setStrategy(strategy) {
        this.strategy = strategy;
    }

    // Викликаємо метод load() обраної стратегії
    loadImage() {
        if (!this.strategy) {
            console.log("Помилка: Стратегію не встановлено!");
            return;
        }
        this.strategy.load(this.href);
    }

    generateHTML() {
        return `<img src="${this.href}" alt="Image">`;
    }
}

// === ГОЛОВНИЙ МЕТОД ДЛЯ ПЕРЕВІРКИ ===
function main() {
    console.log("=== ТЕСТУВАННЯ ПАТЕРНУ СТРАТЕГІЯ ===\n");

    // Сценарій 1: Зображення з мережі
    const webImgUrl = "https://example.com/images/cat.png";
    const webImage = new ImageElement(webImgUrl);
    console.log("Згенерований HTML:", webImage.generateHTML());
    webImage.loadImage(); // Має спрацювати NetworkLoadStrategy

    // Сценарій 2: Локальне зображення
    const localImgPath = "C:/Users/Public/Pictures/avatar.jpg";
    const localImage = new ImageElement(localImgPath);
    console.log("Згенерований HTML:", localImage.generateHTML());
    localImage.loadImage(); // Має спрацювати FileSystemLoadStrategy
}

// Запуск програми [cite: 200]
main();