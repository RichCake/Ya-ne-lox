document.addEventListener('DOMContentLoaded', () => {
    // Получение элементов DOM
    const screens = document.querySelectorAll('.screen');
    const startScreen = document.getElementById('start-screen');
    const mainMessage = document.getElementById('main-message');
    const startButton = document.getElementById('start-button');
    const lootboxOfferScreen = document.getElementById('lootbox-offer-screen');
    const buyLootboxButton = document.getElementById('buy-lootbox-button');
    const envelopeRevealScreen = document.getElementById('envelope-reveal-screen');
    const envelopeDisplay = document.getElementById('envelope-display');
    const envelopeRarityText = document.getElementById('envelope-rarity-text');
    const openEnvelopeButton = document.getElementById('open-envelope-button');
    const ticketScreen = document.getElementById('ticket-screen');
    const winningCombinationDisplay = document.getElementById('winning-combination');
    const playerTicketDisplay = document.getElementById('player-ticket');
    const participateLotteryButton = document.getElementById('participate-lottery-button');
    const winScreen = document.getElementById('win-screen');
    const moneyCounter = document.getElementById('money-counter');
    const backButtons = document.querySelectorAll('.back-button');

    // Состояние игры
    let spentMoney = 0;
    let currentEnvelopeRarity = null; // 'white', 'blue', 'gold'
    let winningCombination = [];
    let playerTicket = [];
    let revealedIndices = [];
    let gameWon = false; // Флаг победы в текущей сессии

    const TICKET_LENGTH = 6;

    // --- Функции Управления Экранами ---
    function showScreen(screenId) {
        if (gameWon && screenId === 'start-screen') {
            showScreen('win-screen'); // Если уже выиграли, показываем экран победы
            return;
        }
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        const screenToShow = document.getElementById(screenId);
        if (screenToShow) {
            screenToShow.classList.add('active');
        }
        // Убираем кнопку "Я не лох" после победы
        if (gameWon && startButton) {
             startButton.style.display = 'none';
             mainMessage.textContent = "Я НЕ ЛОХ!"; // Обновляем текст и на стартовом (теперь победном)
             mainMessage.style.color = '#5cb85c'; // Зеленый цвет
        } else if (startButton) {
            startButton.style.display = 'block'; // Показываем кнопку, если не выиграли
            mainMessage.textContent = "Ты лох!";
            mainMessage.style.color = '#d9534f'; // Красный цвет
        }
    }

    // --- Функции Игровой Логики ---

    function updateMoneyCounter() {
        moneyCounter.textContent = `Потрачено: ${spentMoney} руб.`;
    }

    function generateCombination(length) {
        const combination = [];
        for (let i = 0; i < length; i++) {
            combination.push(Math.floor(Math.random() * 10)); // Цифры от 0 до 9
        }
        return combination;
    }

    function determineRarity() {
        const rand = Math.random() * 100;
        if (rand < 5) return 'gold';    // 5% шанс
        if (rand < 30) return 'blue';   // 25% шанс (30 - 5)
        return 'white';                 // 70% шанс (100 - 30)
    }

    function getRevealedCount(rarity) {
        switch (rarity) {
            case 'gold': return 4;        // 4 открыто
            case 'blue': return Math.random() < 0.5 ? 2 : 3; // 2-3 открыто
            case 'white': return Math.random() < 0.5 ? 0 : 1; // 0-1 открыто
            default: return 0;
        }
    }

    function getRandomIndices(count, totalLength) {
        const indices = new Set();
        while (indices.size < count) {
            indices.add(Math.floor(Math.random() * totalLength));
        }
        return Array.from(indices);
    }

    function displayTicket(ticket, revealedIdx, displayElement, hideChar = 'X') {
        let html = '';
        for (let i = 0; i < ticket.length; i++) {
            const isRevealed = revealedIdx.includes(i);
            html += `<span class="${isRevealed ? 'revealed' : 'hidden'}">${isRevealed ? ticket[i] : hideChar}</span>`;
        }
        displayElement.innerHTML = html;
    }

    function displayWinningCombination(combination, displayElement) {
         displayElement.innerHTML = combination.map(digit => `<span>${digit}</span>`).join('');
    }

    function resetGame() {
        // Не сбрасываем spentMoney, если нужно накапливать траты за сессию
        // spentMoney = 0; // Раскомментируйте, если нужно сбрасывать счетчик при каждом проигрыше/возврате
        currentEnvelopeRarity = null;
        winningCombination = generateCombination(TICKET_LENGTH); // Новая комбинация каждый раз
        playerTicket = [];
        revealedIndices = [];
        // updateMoneyCounter(); // Обновить, если сбрасываете счетчик
        showScreen('start-screen');
    }

    function initializeGame() {
        resetGame(); // Начать игру с начального экрана
        updateMoneyCounter(); // Инициализировать счетчик
    }

    // --- Обработчики Событий ---

    startButton.addEventListener('click', () => {
        if (gameWon) return; // Ничего не делаем, если уже выиграли
        showScreen('lootbox-offer-screen');
    });

    buyLootboxButton.addEventListener('click', () => {
        spentMoney += 100;
        updateMoneyCounter();
        currentEnvelopeRarity = determineRarity();

        envelopeDisplay.className = 'envelope'; // Сброс классов
        envelopeDisplay.classList.add(`envelope-${currentEnvelopeRarity}`);
        envelopeDisplay.textContent = `${currentEnvelopeRarity.charAt(0).toUpperCase() + currentEnvelopeRarity.slice(1)} Конвертик`; // Название конвертика
        envelopeRarityText.textContent = `Редкость: ${
            currentEnvelopeRarity === 'white' ? 'Обычный' :
            currentEnvelopeRarity === 'blue' ? 'Необычный' : 'Редкий'
        }`;

        showScreen('envelope-reveal-screen');
    });

    openEnvelopeButton.addEventListener('click', () => {
        spentMoney += 100;
        updateMoneyCounter();

        playerTicket = generateCombination(TICKET_LENGTH); // Генерируем билет игрока
        const revealedCount = getRevealedCount(currentEnvelopeRarity);
        revealedIndices = getRandomIndices(revealedCount, TICKET_LENGTH);

        displayWinningCombination(winningCombination, winningCombinationDisplay);
        displayTicket(playerTicket, revealedIndices, playerTicketDisplay);

        showScreen('ticket-screen');
    });

    participateLotteryButton.addEventListener('click', () => {
        spentMoney += 100;
        updateMoneyCounter();

        // Показываем все цифры билета игрока
        const allIndices = Array.from(Array(TICKET_LENGTH).keys());
        displayTicket(playerTicket, allIndices, playerTicketDisplay);

        // Проверяем выигрыш
        const isWinner = JSON.stringify(playerTicket) === JSON.stringify(winningCombination);

        // Небольшая задержка для показа результата перед переходом
        setTimeout(() => {
            if (isWinner) {
                gameWon = true;
                showScreen('win-screen');
                // Дополнительно обновляем стартовый экран на случай, если пользователь как-то вернется
                mainMessage.textContent = "Я НЕ ЛОХ!";
                mainMessage.style.color = '#5cb85c'; // Зеленый цвет
                if(startButton) startButton.style.display = 'none';

            } else {
                alert("Не повезло! Твой билет не совпал. Ты всё ещё лох!"); // Можно заменить на экран проигрыша
                resetGame();
            }
        }, 1500); // Задержка 1.5 секунды для просмотра результата
    });

    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Все кнопки "Назад" ведут на стартовый экран и сбрасывают прогресс
            resetGame();
        });
    });

    // --- Запуск Игры ---
    initializeGame();

});