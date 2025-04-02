let typeWords = [];
wordsCount = 50;
gameTime = 10;
lettersTyped = 0;
errorCnt = 0;

let mode = 0;
let gameTimer = null;
let gameStart = null;

let pauseTimer = null;
let pauseStart = null;
let pauseTime = 0;

let bgColor = '#333333';
let textPrimary = '#ffffff';
let panelColor = '#2c2c2c';
let panelText = '#525252';
let textSecondary = '#666666';
let primaryColor = '#ffdd44';

function addClass(el, name) {
    el.className += ' ' + name;
}
function removeClass(el, name) {
    el.className = el.className.replace(" " + name, '');
}

function randomWord() {

    const randomIndex = Math.ceil(Math.random() * typeWords.length);
    return typeWords[randomIndex - 1];
}

function formatWord(word) {
    return `<div class="word"><span class="letter">${(word + " ").split('').join('</span><span class="letter">')}</span></div>`;
}

function toggleAdditionalButtons(show) {
    additionalButtons.style.display = show ? 'flex' : 'none';
}

function setActiveButton(activeButton, deactivade) {
    deactivade.forEach(btn => btn.classList.remove('active'));
    activeButton.forEach(btn => btn.classList.add('active'));
}

function set_hand(){
    currentKey = document.querySelector('.key.current');
    currentLetter = document.querySelector('.letter.current');
    let letter = currentKey.innerHTML.toLowerCase();
    let rect = currentKey.getBoundingClientRect();
    
    let keyBottom = rect.bottom;
    let keyLeft = rect.left;
    let keyWidth = rect.width;
    let keyCenterX = keyLeft + keyWidth / 2;

    let hand = document.getElementById('hand');
    let handImg = document.getElementById('handImage');
    let handRect = hand.getBoundingClientRect();
    let handWidth = handRect.width;


    hand.style.top = keyBottom + 'px';
    hand.style.left = (keyCenterX - handWidth / 2) + 'px';
    
    if ('qwertasdfgzxcvb'.includes(letter)) hand_type = 'left';
    else hand_type = 'right';
    if ('rtfgvbnmhjyu4567'.includes(letter)) finger = "2";
    else if ('edcik,38'.includes(letter)) finger = "3";
    else if ('wsxol.,29'.includes(letter)) finger = "4";
    else if ('qazp;/10'.includes(letter)) finger = "5";
    // console.log(letter);
    if (letter === "space"){
        finger = "1";
        if ('qwertasdfgzxcvb'.includes(currentLetter.previousSibling.innerHTML.toLowerCase())) hand_type = 'right';
        else hand_type = 'left'
    }
    handImg.src = `static/deps/images/hands/${hand_type}_${finger}.png`;;
}
function newGame() {
    updateProfile();
    lettersTyped = 0;
    errorCnt = 0;
    pauseTime = 0;
    pauseStart = null;

    document.getElementById('words').innerHTML = '';
    // console.log(typeWords);
    for (let i = 0; i < wordsCount; i++) {
        document.getElementById('words').innerHTML += formatWord(randomWord());
    }
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.letter'), 'current');
    if (mode === 0) {
        document.getElementById('info').innerHTML = gameTime;
    }
    else if (mode === 1) {
        document.getElementById('info').innerHTML = 0;
    }
    else if (mode === 2) {
        document.getElementById('info').innerHTML = '‎';
    }

    clearInterval(gameTimer);
    gameTimer = null;
    gameStart = null;

    removeClass(document.getElementById('typingTest'), 'over');
    words = document.getElementById('words');
    words.style.marginTop = 0 + 'px';
    const firstLetter = document.querySelector('.letter.current');
    // console.log(firstLetter.innerHTML);
    const cursor = document.getElementById('cursor');
    cursor.style.top = firstLetter.getBoundingClientRect().top +3+ 'px';
    // console.log('1');
    cursor.style.left = words.getBoundingClientRect().left + 5 + 'px';
    

    const keys = [...document.querySelectorAll('.key')]
    keys.forEach(key => {
        if (key.classList.contains("current")) {
            removeClass(key, 'current');
        }
    });

    key = document.getElementById('key_' + firstLetter.innerHTML);
    addClass(key, 'current');
    set_hand();
}




function updateProfile() {
    wpm = getWpm();
    if (lettersTyped === 0) return;
    var newGameButton = $('#newGameButton');
    var url = newGameButton.data('url'); 
    var csrfToken = $("[name=csrfmiddlewaretoken]").val();
    var data = {
        csrfmiddlewaretoken: csrfToken,
        lettersTyped: lettersTyped
    };
    lettersTyped = 0;
    if (mode !== 2) {
        data.wpm = wpm;
        data.accuracy = getAccuracy()*100;
        data.error_cnt = errorCnt;
        data.mode = (mode === 1 ? "words"  + wordsCount : "time" + gameTime);
    }
    
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function (data) {
            // Обработка успешного ответа
        },
        error: function (data) {
            console.log("Ошибка при добавлении символов");
        },
    });
}




function getWpm() {
    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const lastTypedWordIndex = words.indexOf(lastTypedWord) + 1;
    const typedWords = words.slice(0, lastTypedWordIndex);
    const correctWords = typedWords.filter(word => {
        letters = [...word.children];
        letters.splice(letters.length -1, 1);
        const incorrectLetters = letters.filter(letter => letter.className.includes('incorrect'));
        errorCnt += incorrectLetters.length;
        const correctLetters = letters.filter(letter => letter.className.includes('correct'));
        lettersTyped += correctLetters.length;
        return incorrectLetters.length === 0 && correctLetters.length === letters.length;
    });
    const currentTime = (new Date()).getTime();
    const msPassed = currentTime - gameStart - pauseTime;
    const sPassed = Math.round(msPassed / 1000);
    return (correctWords.length  / (mode === 0 ? gameTime : sPassed) * 60).toFixed(0);
}

function getAccuracy() {
    const correct = document.querySelectorAll('.letter.correct');
    const incorrect = document.querySelectorAll('.letter.incorrect');
    return ((correct.length / (correct.length + incorrect.length)) * 100).toFixed(2);
}

function gameOver() {

    clearInterval(gameTimer);
    const keys = [...document.querySelectorAll('.key')]
    keys.forEach(key => {
        if (key.classList.contains("current")) {
            removeClass(key, 'current');
        }
    });
    cursor = document.getElementById('cursor');
    cursor.classList = '';
    addClass(document.getElementById('typingTest'), 'over');
    updateProfile();
    document.getElementById('info').innerHTML =
        `<div id="statsContainer">
                    <div id="wpm"> WPM: ${getWpm()}</div>
                    <div id="accuracy">ACC: ${getAccuracy()}%</div>
                </div>`

}

document.getElementById('typingTest').addEventListener('blur', ev => {
    if (gameTimer) {

        clearInterval(gameTimer);
        if (!pauseStart) {
            pauseStart = (new Date()).getTime();
        }
    }
});

document.getElementById('typingTest').addEventListener('focus', ev => {
    if (document.querySelector('#typingTest.over'))return;
    if (gameStart) {
        const currentTime = (new Date()).getTime();

        pauseTime += currentTime - pauseStart;
        // console.log(currentTime- gameStart, pauseTime);
        pauseStart = null;

        gameTimer = setInterval(() => {
            const currentTime = (new Date()).getTime();
            // console.log(currentTime, gameStart, pauseTime);
            const msPassed = currentTime - gameStart - (mode === 1? 0: pauseTime);
            const sPassed = Math.round(msPassed / 1000);
            const sLeft = gameTime - sPassed;
            if (mode == 0) {
                if (sLeft <= 0) {
                    gameOver();
                    return;
                }
                document.getElementById('info').innerHTML = sLeft + '';
            }
            else if (mode == 1) {
                document.getElementById('info').innerHTML = sPassed + '';
            }
        }, 100);
    }
});

document.getElementById('typingTest').addEventListener('keydown', ev => {
    const key = ev.key;
    const currentWord = document.querySelector('.word.current');
    currentLetter = document.querySelector('.letter.current');
    const firstWord = document.querySelector('.word');
    const isFirst = firstWord === currentWord && firstWord.firstChild === currentLetter;
    const expected = currentLetter?.innerHTML || ' ';
    const isLetter = (key.length === 1 && key !== ' ') || key === ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace' && !isFirst;
    const isFirstLetter = currentWord.firstChild.classList.contains('current');
    const isFirstWord = currentWord === firstWord.firstChild;
    const container = document.getElementById('wordsContainer');
    if (document.querySelector('#typingTest.over') || document.activeElement != document.getElementById('typingTest')) {
        return;
    }


    if (mode != 2) {
        if (!gameTimer && (isLetter || isSpace)) {
            gameStart = (new Date()).getTime();
            gameTimer = setInterval(() => {
                const currentTime = (new Date()).getTime();
                const msPassed = currentTime - gameStart - pauseTime;
                const sPassed = Math.round(msPassed / 1000);
                const sLeft = gameTime - sPassed;
                if (mode == 0) {
                    if (sLeft <= 0) {
                        gameOver();
                        return;
                    }
                    document.getElementById('info').innerHTML = sLeft + '';
                }
                else if (mode == 1) {
                    document.getElementById('info').innerHTML = sPassed + '';
                }
            }, 100);

        }
    }

    if (isLetter) {
        // console.log('key_' + currentLetter !== null ? currentLetter.innerHTML : " ");
        currentKey = document.getElementById('key_' + (currentLetter !== null ? currentLetter.innerHTML : " "));
        removeClass(currentKey, 'current');

        if (expected !== " " || key === " ") {
            addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
            removeClass(currentLetter, 'current');
            if (currentLetter.nextSibling) {
                addClass(currentLetter.nextSibling, 'current');
            }
        } else {
            const incorrectLetter = document.createElement('span');
            incorrectLetter.innerHTML = key;
            incorrectLetter.className = 'letter incorrect extra';
            tmp = currentWord.lastChild;
            currentWord.removeChild(currentWord.lastChild);
            currentWord.appendChild(incorrectLetter);
            currentWord.appendChild(tmp);
        }

        currentKey = document.querySelector('.letter.current')
        addClass(document.getElementById('key_' + (currentKey !== null ? currentKey.innerHTML : " ")), 'current');
    }

    if (expected == " " && !isBackspace && key === " ") {
        currentKey = document.querySelector('.letter.current')
        currentKey = document.getElementById('key_' + (currentKey !== null ? currentKey.innerHTML : " "));
        removeClass(currentKey, 'current');

        removeClass(currentWord, 'current');
        addClass(currentWord.nextSibling, 'current');
        if (currentLetter) {
            removeClass(currentLetter, 'current');
        }
        addClass(currentWord.nextSibling.firstChild, 'current');

        addClass(document.getElementById('key_' + document.querySelector('.letter.current').innerHTML), 'current');
    }

    if (isBackspace) {
        if (isFirstWord) return;
        currentKey = document.getElementById('key_' + (currentLetter !== null ? currentLetter.innerHTML : " "));
        removeClass(currentKey, 'current');

        if (currentLetter.innerHTML && isFirstLetter) {
            // make prev word current, last letter current
            addClass(currentWord.previousSibling, 'current');
            removeClass(currentWord, 'current');
            removeClass(currentLetter, 'current');

            addClass(currentWord.previousSibling.lastChild, 'current');
            removeClass(currentWord.previousSibling.lastChild, 'incorrect');
            removeClass(currentWord.previousSibling.lastChild, 'correct');
        }
        if (currentLetter.innerHTML && !isFirstLetter) {
            // move back one letter, invalidate letter
            removeClass(currentLetter, 'current');
            addClass(currentLetter.previousSibling, 'current');
            removeClass(currentLetter.previousSibling, 'incorrect');
            removeClass(currentLetter.previousSibling, 'correct');
        }
        if (!currentLetter.innerHTML) {
            addClass(currentWord.lastChild, 'current');
            removeClass(currentWord.lastChild, 'incorrect');
            removeClass(currentWord.lastChild, 'correct');
        }
        const isExtra = currentWord.lastChild.previousSibling?.classList.contains('extra') || false;
        if (isExtra) {
            tmp = currentWord.lastChild;
            currentWord.removeChild(currentWord.lastChild);
            currentWord.removeChild(currentWord.lastChild);
            currentWord.appendChild(tmp);
            addClass(currentWord.lastChild, 'current');
        }
        addClass(document.getElementById('key_' + document.querySelector('.letter.current').innerHTML), 'current');
        
        
    }

    // move lines / words

    if (currentWord.getBoundingClientRect().bottom > container.getClientRects()[0].bottom - currentWord.getBoundingClientRect().height / 3) {
        const words = document.getElementById('words');
        const margin = parseFloat(words.style.marginTop || '0px');
        // console.log(container.getClientRects()[0].height / 3);
        words.style.marginTop = (margin - currentWord.getClientRects()[0].height) + 'px';
        if (mode != 1 && words.getBoundingClientRect().bottom < container.getClientRects()[0].bottom + 2 * container.getClientRects()[0].height / 3){
            cnt = 0;
            while (words.getBoundingClientRect().bottom < container.getClientRects()[0].bottom + 2 * container.getClientRects()[0].height / 3){
                document.getElementById('words').innerHTML += formatWord(randomWord());
                cnt +=1;
                if (cnt > 100) break;
            }
            
        }
    }

    // move cursor
    const nextLetter = document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current');
    const cursor = document.getElementById('cursor');
    const curLeft = cursor.getBoundingClientRect().left;
    const curTop = cursor.getBoundingClientRect().top;
    const targetTop = (nextLetter || nextWord).getBoundingClientRect().top;
    const targetLeft = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'];
    if (Math.abs(targetTop - curTop) > 30) {
        cursor.style.top = targetTop +5 + 'px';
    }

    cursor.style.setProperty('--distance', (targetLeft - curLeft) + 'px');
    addClass(cursor, 'animate');
    cursor.addEventListener('animationend', () => {
        cursor.style.left = targetLeft + 'px';
        removeClass(cursor, 'animate');
    });
    if (!currentWord.nextElementSibling && currentWord.lastChild.classList.contains('current')) gameOver();
    set_hand();
});

document.getElementById('newGameButton').addEventListener('click', () => {
    newGame();
});

addEventListener("resize", (event) => {
    const nextLetter = document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current');
    const cursor = document.getElementById('cursor');
    const targetTop = (nextLetter || nextWord).getBoundingClientRect().top;
    const targetLeft = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'];
    cursor.style.top = targetTop +5 + 'px';
    cursor.style.left = targetLeft + 'px';
});
document.addEventListener('DOMContentLoaded', () => {
    const learnBtn = document.getElementById('learnMode');
    const wordsBtn = document.getElementById('wordsMode');
    const timeBtn = document.getElementById('timeMode');
    const cnt10 = document.getElementById('cnt10');
    const cnt25 = document.getElementById('cnt25');
    const cnt100 = document.getElementById('cnt100');
    const keyboardBtn = document.getElementById('keyboardModifier');
    const handBtn = document.getElementById('handModifier');
    const additionalButtons = document.getElementById('additional-buttons');
    const keyboard = document.getElementById('keyboard');
    const hand = document.getElementById('hand');

    handBtn.addEventListener('click', () => {
        if (document.querySelector('#typingTest.over')) return;
        if (handBtn.classList.contains('active'))
        {
            handBtn.classList.remove('active');
            
            hand.style.display = 'none';

        }
        else{
            if (keyboardBtn.classList.contains('active')){
            handBtn.classList.add('active');
            hand.style.display = 'block';
            set_hand();
            
            
            }
        }
        }
    );
    keyboardBtn.addEventListener('click', () => {
        if (keyboardBtn.classList.contains('active'))
        {
            keyboardBtn.classList.remove('active');
            keyboard.style.display = 'none';
            if (handBtn.classList.contains('active'))
        {
            handBtn.classList.remove('active');
            hand.style.display = 'none';
        }
        }
        else{
            keyboardBtn.classList.add('active');
            keyboard.style.display = 'grid';
        }
        }
    );

    learnBtn.addEventListener('click', () => {
        toggleAdditionalButtons(false);
        setActiveButton([learnBtn], [learnBtn, wordsBtn, timeBtn, cnt10, cnt25, cnt100]);
        wordsCount = 50;
        mode = 2;
        newGame();
    });

    wordsBtn.addEventListener('click', () => {
        toggleAdditionalButtons(true);

        
        if (timeBtn.classList.contains('active')) {
            if (cnt10.classList.contains('active')) {
                wordsCount = 10;
            }
            else if (cnt25.classList.contains('active')) {
                wordsCount = 25;
            }
            else if (cnt100.classList.contains('active')) {
                wordsCount = 100;
            }
            else {
                wordsCount = 10;
            }
            mode = 1;
            if (!wordsBtn.classList.contains('active') ) newGame();
            setActiveButton([wordsBtn], [learnBtn, wordsBtn, timeBtn]);
        }
        else if (learnBtn.classList.contains('active')) {
            updateProfile();
            mode = 1;
            wordsCount = 10;
            if (!wordsBtn.classList.contains('active') ) newGame();
            setActiveButton([wordsBtn, cnt10], [learnBtn, wordsBtn, timeBtn, cnt10, cnt25, cnt100]);
            
        }
    });

    timeBtn.addEventListener('click', () => {
        toggleAdditionalButtons(true);
        
        if (wordsBtn.classList.contains('active')) {
            if (cnt10.classList.contains('active')) {
                gameTime = 10;
            }
            else if (cnt25.classList.contains('active')) {
                gameTime = 25;
            }
            else if (cnt100.classList.contains('active')) {
                gameTime = 100;
            }
            else {
                gameTime = 10;
            }
            wordsCount = 50;
             mode = 0;
            if (!timeBtn.classList.contains('active') ) newGame();
            setActiveButton([timeBtn], [learnBtn, wordsBtn, timeBtn]);

        }
        else if (learnBtn.classList.contains('active')) {
            updateProfile();
            wordsCount = 50;
             mode = 0;
            gameTime = 10;
            if (!timeBtn.classList.contains('active') ) newGame();
            setActiveButton([timeBtn, cnt10], [learnBtn, wordsBtn, timeBtn, cnt10, cnt25, cnt100]);
        }     
    });

    cnt10.addEventListener('click', () => {
        
        if (timeBtn.classList.contains('active')) {
            gameTime = 10;
            wordsCount = 50;
        }
        else if (wordsBtn.classList.contains('active')) {
            wordsCount = 10;
        }
        if (!cnt10.classList.contains('active') ) newGame();
        setActiveButton([cnt10], [cnt10, cnt25, cnt100]);
    });

    cnt25.addEventListener('click', () => {
        if (timeBtn.classList.contains('active')) {
            gameTime = 25;
            wordsCount = 50;
        }
        else if (wordsBtn.classList.contains('active')) {
            wordsCount = 25;
        }
        if (!cnt25.classList.contains('active') ) newGame();
        setActiveButton([cnt25], [cnt10, cnt25, cnt100]);
    });

    cnt100.addEventListener('click', () => {
        if (timeBtn.classList.contains('active')) {
            gameTime = 100;
            wordsCount = 50;
        }
        else if (wordsBtn.classList.contains('active')) {
            wordsCount = 100;
        }
        if (!cnt100.classList.contains('active')) newGame();
        setActiveButton([cnt100], [cnt10, cnt25, cnt100]);
    });
});
const cnt10 = document.getElementById('cnt10');
const timeBtn = document.getElementById('timeMode');
const additionalButtons = document.getElementById('additional-buttons');
toggleAdditionalButtons(true);
setActiveButton([timeBtn], []);
setActiveButton([cnt10], []);

async function getWords(cnt, len) {
    try {
        const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${cnt}&length=${len}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}
(async () => {
    await Promise.all([
        getWords(100, 4),
        getWords(100, 5),
        getWords(100, 6)
    ]).then(([words1, words2, words3]) => {
        typeWords = [...words1, ...words2, ...words3];
        newGame();
    });
})();