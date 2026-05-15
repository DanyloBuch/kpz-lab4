// 1. Посередник (Диспетчерський центр)
class CommandCentre {
    constructor() {
        this.runways = [];
        this.aircrafts = [];
    }

    addRunway(runway) {
        this.runways.push(runway);
        runway.setCommandCentre(this);
    }

    addAircraft(aircraft) {
        this.aircrafts.push(aircraft);
        aircraft.setCommandCentre(this);
    }

    // Логіка посадки тепер знаходиться в центрі, літаки сюди просто звертаються
    requestLand(aircraft) {
        console.log(` Диспетчер: Літак ${aircraft.name} запитує посадку.`);
        
        // Шукаємо першу вільну смугу
        const availableRunway = this.runways.find(r => !r.isBusy);

        if (availableRunway) {
            console.log(` Диспетчер: Дозволяю посадку літаку ${aircraft.name} на ${availableRunway.name}.`);
            availableRunway.isBusy = true;
            availableRunway.highLightRed();
            aircraft.currentRunway = availableRunway;
            console.log(`   -> Літак ${aircraft.name} успішно сів.\n`);
        } else {
            console.log(` Диспетчер: Відмова. Всі смуги зайняті. Літак ${aircraft.name} очікує в повітрі.\n`);
        }
    }

    // Логіка зльоту
    requestTakeOff(aircraft) {
        console.log(` Диспетчер: Літак ${aircraft.name} запитує зліт.`);
        if (aircraft.currentRunway) {
            const runway = aircraft.currentRunway;
            runway.isBusy = false;
            runway.highLightGreen();
            aircraft.currentRunway = null;
            console.log(` Диспетчер: Літак ${aircraft.name} успішно злетів. ${runway.name} тепер вільна.\n`);
        } else {
            console.log(` Диспетчер: Помилка. Літак ${aircraft.name} зараз не знаходиться на злітній смузі.\n`);
        }
    }
}

// 2. Злітна смуга (Тепер нічого не знає про клас Літак)
class Runway {
    constructor(name) {
        this.name = name;
        this.isBusy = false;
        this.commandCentre = null;
    }

    setCommandCentre(commandCentre) {
        this.commandCentre = commandCentre;
    }

    highLightRed() {
        console.log(`   [${this.name}] світиться ЧЕРВОНИМ (зайнята)`);
    }

    highLightGreen() {
        console.log(`   [${this.name}] світиться ЗЕЛЕНИМ (вільна)`);
    }
}

// 3. Літак (Тепер нічого не знає про клас Злітної смуги)
class Aircraft {
    constructor(name) {
        this.name = name;
        this.currentRunway = null;
        this.commandCentre = null; // Літак знає ТІЛЬКИ про диспетчера
    }

    setCommandCentre(commandCentre) {
        this.commandCentre = commandCentre;
    }

    // Літак просто просить дозволу у Посередника
    land() {
        if (this.commandCentre) this.commandCentre.requestLand(this);
    }

    takeOff() {
        if (this.commandCentre) this.commandCentre.requestTakeOff(this);
    }
}

// === ГОЛОВНИЙ МЕТОД ДЛЯ ПЕРЕВІРКИ ===
function main() {
    // Створюємо Посередника
    const dispatcher = new CommandCentre();

    // Створюємо смуги і реєструємо їх у центрі
    const runway1 = new Runway("Смуга-1");
    const runway2 = new Runway("Смуга-2");
    dispatcher.addRunway(runway1);
    dispatcher.addRunway(runway2);

    // Створюємо літаки і реєструємо їх
    const boeing = new Aircraft("Boeing-747");
    const mriya = new Aircraft("Ан-225 Мрія");
    const f16 = new Aircraft("F-16");
    dispatcher.addAircraft(boeing);
    dispatcher.addAircraft(mriya);
    dispatcher.addAircraft(f16);

    // Тестуємо логіку
    console.log("=== СЦЕНАРІЙ 1: Масова посадка ===");
    boeing.land(); // Має сісти на Смугу-1
    mriya.land();  // Має сісти на Смугу-2
    f16.land();    // Має отримати відмову, бо в нас лише 2 смуги

    console.log("=== СЦЕНАРІЙ 2: Зліт і звільнення смуги ===");
    boeing.takeOff(); // Злітає, звільняє Смугу-1

    console.log("=== СЦЕНАРІЙ 3: Посадка після очікування ===");
    f16.land(); // Тепер Смуга-1 вільна, і F-16 успішно сідає
}

// Запускаємо програму
main();