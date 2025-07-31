const cardsData = [
  { name: '🐧' },  
  { name: '🐼' },  
  { name: '🐱' },  
  { name: '🐶' },  
  { name: '🐹' },  
  { name: '🐦' }, 
  { name: '🦭' },  
  { name: '🐬' }   
];

let cardPairs = [...cardsData, ...cardsData];

const gameContainer = document.querySelector('.game-container');
gameContainer.innerHTML = '';  

cardPairs.forEach(card => {
  const cardElement = createCard(card);
  gameContainer.appendChild(cardElement);
});


const attemptsSpan = document.getElementById('attempts');
const restartBtn = document.getElementById('restart-btn');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let attempts = 0;
let matches = 0;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createCard(card) {
  const cardEl = document.createElement('div');
  cardEl.classList.add('card');
  cardEl.dataset.name = card.name;

  cardEl.innerHTML = `
    <div class="card-inner">
      <div class="card-front">❦</div>
      <div class="card-back">${card.name}</div>
    </div>
  `;

  cardEl.addEventListener('click', flipCard);
  return cardEl;
}

function setupGame() {
  gameContainer.innerHTML = '';
  cardPairs = shuffle(cardPairs);
  attempts = 0;
  matches = 0;
  attemptsSpan.textContent = attempts;
  resetBoardState();

  cardPairs.forEach(card => {
    const cardElement = createCard(card);
    gameContainer.appendChild(cardElement);
  });
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flipped');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  attempts++;
  attemptsSpan.textContent = attempts;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    disableCards();
    matches++;
    if (matches === cardsData.length) {
      setTimeout(() => alert(`🎉 You won! Attempts: ${attempts}`), 500);
    }
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoardState();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoardState();
  }, 1000);
}

function resetBoardState() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

restartBtn.addEventListener('click', setupGame);

