document.addEventListener('DOMContentLoaded', () => {
    // Элементы UI
    const screens = document.querySelectorAll('.screen');
    const mainTitle = document.getElementById('main-title');
    const notALohButton = document.getElementById('not-a-loh-button');
    const spentAmountDisplay = document.getElementById('spent-amount');

    const buyLootboxButton = document.getElementById('buy-lootbox-button');
    const backToStart1Button = document.getElementById('back-to-start-1');

    const lootboxAnimation = document.getElementById('lootbox-animation');
    const lootboxResultText = document.getElementById('lootbox-result');
    // const continueFromLootboxButton = document.getElementById('continue-from-lootbox'); // Будем создавать динамически

    const envelopeRarityText = document.getElementById('envelope-rarity-text');
    const envelopeDisplay = document.getElementById('envelope-display');
    const openEnvelopeButton = document.getElementById('open-envelope-button');
    const backToStart2Button = document.getElementById('back-to-start-2');

    const winningCombinationDisplay = document.getElementById('winning-combination-display');
    const playerTicketDisplay = document.getElementById('player-ticket-display');
    const participateLotteryButton = document.getElementById('participate-lottery-button');
    const backToStart3Button = document.getElementById('back-to-start-3');
    
    const finalWinningCombinationDisplay = document.getElementById('final-winning-combination');
    const finalPlayerTicketDisplay = document.getElementById('final-player-ticket');
    const lotteryOutcomeMessage = document.getElementById('lottery-outcome-message');
    const toMainScreenButton = document.getElementById('to-main-screen-button');


    // Игровые переменные
    let spentMoney = 0;
    let winningCombination = [];
    let playerTicket = [];
    let currentEnvelopeRarity = ''; // 'white', 'blue', 'gold'
    let hasWonGame = false;

    // --- Функции ---

    function showScreen(screenId) {
        screens.forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }

    function updateSpentMoney(amount) {
        spentMoney += amount;
        spentAmountDisplay.textContent = spentMoney;
    }

    function resetGame() {
        spentMoney = 0;
        spentAmountDisplay.textContent = spentMoney;
        mainTitle.textContent = "Ты лох!";
        mainTitle.classList.remove('victory');
        notALohButton.style.display = 'block';
        hasWonGame = false;
        generateNewWinningCombination();
        showScreen('start-screen');
    }
    
    function generateNewWinningCombination() {
        winningCombination = [];
        for (let i = 0; i < 6; i++) {
            winningCombination.push(Math.floor(Math.random() * 10));
        }
        console.log("Новая выигрышная комбинация: ", winningCombination.join(''));
    }

    function determineEnvelopeRarity() {
        const rand = Math.random() * 100;
        if (rand < 5) return 'gold';    // 5%
        if (rand < 30) return 'blue';   // 25% (5 + 25)
        return 'white';                 // 70%
    }
    
    function displayEnvelope() {
        let rarityName = "";
        envelopeDisplay.className = 'envelope-display'; // Сброс предыдущих классов

        switch (currentEnvelopeRarity) {
            case 'white': 
                rarityName = "Белый (обычный)";
                envelopeDisplay.classList.add('envelope-white');
                break;
            case 'blue':
                rarityName = "Синий (необычный)";
                envelopeDisplay.classList.add('envelope-blue');
                break;
            case 'gold':
                rarityName = "Золотой (редкий)";
                envelopeDisplay.classList.add('envelope-gold');
                break;
        }
        envelopeRarityText.textContent = rarityName;
        showScreen('envelope-offer-screen');
    }

    function generatePlayerTicket() {
        playerTicket = [];
        for (let i = 0; i < 6; i++) {
            playerTicket.push(Math.floor(Math.random() * 10));
        }

        let openDigitsCount = 0;
        switch (currentEnvelopeRarity) {
            case 'white': openDigitsCount = Math.random() < 0.5 ? 0 : 1; break; // 0 или 1
            case 'blue':  openDigitsCount = Math.random() < 0.5 ? 2 : 3; break; // 2 или 3
            case 'gold':  openDigitsCount = 4; break;
        }
        
        let revealedTicket = [];
        for(let i=0; i<6; i++) {
            if (i < openDigitsCount) {
                revealedTicket.push(playerTicket[i]);
            } else {
                revealedTicket.push('?');
            }
        }
        // Перемешаем, чтобы открытые цифры были не всегда в начале (для интереса)
        // Создадим массив индексов, перемешаем его, и откроем первые N цифр по этим индексам
        let indices = [0, 1, 2, 3, 4, 5];
        for (let i = indices.length - 1; i > 0; i--) { // Fisher-Yates shuffle
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        revealedTicket = ['?', '?', '?', '?', '?', '?'];
        for (let i = 0; i < openDigitsCount; i++) {
            revealedTicket[indices[i]] = playerTicket[indices[i]];
        }
        
        playerTicketDisplay.textContent = revealedTicket.join('');
        winningCombinationDisplay.textContent = winningCombination.join('');
        showScreen('lottery-ticket-screen');
    }

    function checkLotteryResult() {
        let isWin = true;
        for (let i = 0; i < 6; i++) {
            if (playerTicket[i] !== winningCombination[i]) {
                isWin = false;
                break;
            }
        }

        finalPlayerTicketDisplay.textContent = playerTicket.join('');
        finalWinningCombinationDisplay.textContent = winningCombination.join('');

        if (isWin) {
            lotteryOutcomeMessage.textContent = "НЕВЕРОЯТНО! ВЫ ВЫИГРАЛИ! ПОЗДРАВЛЯЕМ!";
            lotteryOutcomeMessage.style.color = 'green';
            hasWonGame = true;
        } else {
            lotteryOutcomeMessage.textContent = "Увы, вы не угадали ни одной цифры... ну, или не все. Ты все еще лох.";
            lotteryOutcomeMessage.style.color = 'red';
            hasWonGame = false; // Убедимся, что если проиграли, то это так
        }
        showScreen('lottery-result-screen');
    }

    // --- Обработчики Событий ---

    notALohButton.addEventListener('click', () => {
        if (hasWonGame) return; // Если уже выиграл, кнопка неактивна (хотя она должна быть скрыта)
        // Генерируем новую комбинацию только если начинаем игру сначала (не после возврата)
        if (document.getElementById('start-screen').classList.contains('active')) {
            generateNewWinningCombination();
        }
        showScreen('lootbox-offer-screen');
    });

    buyLootboxButton.addEventListener('click', () => {
        updateSpentMoney(100);
        showScreen('lootbox-opening-screen');
        
        lootboxResultText.textContent = ""; // Очищаем предыдущий результат
        lootboxAnimation.style.animation = 'shake 0.5s infinite alternate'; // Возобновляем анимацию, если была
        lootboxAnimation.innerHTML = '?'; // Возвращаем вопросик

        // "Анимация" открытия лутбокса
        setTimeout(() => {
            lootboxAnimation.style.animation = 'none'; // Останавливаем тряску
            currentEnvelopeRarity = determineEnvelopeRarity();
            let envelopeIcon = '✉️';
            if (currentEnvelopeRarity === 'blue') envelopeIcon = '🗳️';
            if (currentEnvelopeRarity === 'gold') envelopeIcon = '🏆'; // Или что-то золотое
            lootboxAnimation.innerHTML = envelopeIcon;

            lootboxResultText.innerHTML = `Вам выпал ${currentEnvelopeRarity === 'white' ? 'Белый' : currentEnvelopeRarity === 'blue' ? 'Синий' : 'Золотой'} конвертик! <br> <button id="continue-from-lootbox-btn">Продолжить</button>`;
            
            // Добавляем слушатель на новую кнопку
            document.getElementById('continue-from-lootbox-btn').addEventListener('click', () => {
                displayEnvelope();
            });

        }, 2000); // 2 секунды "открытия"
    });

    openEnvelopeButton.addEventListener('click', () => {
        updateSpentMoney(100);
        // "Анимация" открытия конверта (можно добавить позже, пока сразу билет)
        generatePlayerTicket();
    });
    
    participateLotteryButton.addEventListener('click', () => {
        updateSpentMoney(100);
        checkLotteryResult();
    });

    toMainScreenButton.addEventListener('click', () => {
        if (hasWonGame) {
            mainTitle.textContent = "Я не лох!";
            mainTitle.classList.add('victory');
            notALohButton.style.display = 'none'; // Скрываем кнопку, так как игрок "не лох"
            showScreen('start-screen');
        } else {
            // Если проиграл, начинаем все сначала, но с обновленным счетчиком
            // Сброс игры к состоянию "Ты лох!", но счетчик денег сохраняется до перезагрузки страницы.
            // Чтобы полностью начать заново (сбросить счетчик и выигрышную комбинацию), 
            // нужно перезагрузить страницу или сделать кнопку "Начать заново"
            // Текущая логика - возврат к "Ты лох!" с новой выигрышной комбинацией для следующей попытки.
            //spentMoney = 0; // Если хотим сбрасывать деньги при каждом проигрыше - раскомментировать
            //spentAmountDisplay.textContent = spentMoney;
            
            mainTitle.textContent = "Ты лох!";
            mainTitle.classList.remove('victory');
            notALohButton.style.display = 'block';
            generateNewWinningCombination(); // Генерируем новую комбинацию для следующей попытки
            showScreen('start-screen');
        }
    });


    // Кнопки "Назад"
    backToStart1Button.addEventListener('click', () => {
        showScreen('start-screen');
    });
    backToStart2Button.addEventListener('click', () => { // Потеря конвертика
        currentEnvelopeRarity = ''; 
        showScreen('start-screen');
    });
    backToStart3Button.addEventListener('click', () => { // Сброс билета
        playerTicket = [];
        showScreen('start-screen');
    });

    // --- Инициализация игры ---
    generateNewWinningCombination(); // Генерируем первую выигрышную комбинацию при загрузке
    showScreen('start-screen');
});