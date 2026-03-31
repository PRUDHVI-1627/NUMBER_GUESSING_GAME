const MIN = 1;
const MAX = 100;

let answer, attempts, running, guessHistory;

const guessInput    = document.getElementById('guessInput');
const guessBtn      = document.getElementById('guessBtn');
const feedbackText  = document.getElementById('feedbackText');
const errorMsg      = document.getElementById('errorMsg');
const statAttempts  = document.getElementById('statAttempts');
const statLow       = document.getElementById('statLow');
const statHigh      = document.getElementById('statHigh');
const historyWrap   = document.getElementById('historyWrap');
const historyList   = document.getElementById('historyList');
const winCard       = document.getElementById('winCard');
const winSub        = document.getElementById('winSub');
const restartBtn    = document.getElementById('restartBtn');
const rangeFill     = document.getElementById('rangeFill');
const rangeIndicator = document.getElementById('rangeIndicator');

function initGame() {
  answer       = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
  attempts     = 0;
  running      = true;
  guessHistory = [];

  guessInput.value    = '';
  guessInput.disabled = false;
  guessBtn.disabled   = false;

  feedbackText.className   = 'feedback-text idle';
  feedbackText.textContent = 'Waiting for your first guess';

  errorMsg.textContent     = '';
  statAttempts.textContent = '0';
  statLow.textContent      = '—';
  statHigh.textContent     = '—';

  historyWrap.style.display = 'none';
  historyList.innerHTML     = '';
  winCard.classList.remove('visible');

  rangeFill.style.width      = '0%';
  rangeIndicator.style.left  = '0%';

  guessInput.focus();
}

function updateRangeBar(guess) {
  const pct = ((guess - MIN) / (MAX - MIN)) * 100 + '%';
  rangeFill.style.width     = pct;
  rangeIndicator.style.left = pct;
}

function shakeInput() {
  guessInput.classList.remove('shake');
  void guessInput.offsetWidth;
  guessInput.classList.add('shake');
}

function addHistoryChip(guess, direction) {
  const chip = document.createElement('span');
  chip.className   = `history-chip ${direction}`;
  chip.textContent = guess;
  historyList.appendChild(chip);
  historyWrap.style.display = 'block';
}

function processGuess() {
  if (!running) return;

  errorMsg.textContent = '';
  const raw = guessInput.value.trim();

  if (raw === '' || isNaN(Number(raw))) {
    errorMsg.textContent = 'Enter a valid number';
    shakeInput();
    return;
  }

  const guess = Number(raw);

  if (guess < MIN || guess > MAX) {
    errorMsg.textContent = `Must be between ${MIN} and ${MAX}`;
    shakeInput();
    return;
  }

  if (guessHistory.includes(guess)) {
    errorMsg.textContent = 'Already tried that one';
    shakeInput();
    return;
  }

  attempts++;
  guessInput.value = '';
  updateRangeBar(guess);
  statAttempts.textContent = attempts;
  guessHistory.push(guess);

  if (guess < answer) {
    statLow.textContent = Math.max(...guessHistory.filter(g => g < answer));
    feedbackText.className   = 'feedback-text low';
    feedbackText.textContent = `${guess} is too low — go higher`;
    addHistoryChip(guess, 'low');

  } else if (guess > answer) {
    statHigh.textContent = Math.min(...guessHistory.filter(g => g > answer));
    feedbackText.className   = 'feedback-text high';
    feedbackText.textContent = `${guess} is too high — go lower`;
    addHistoryChip(guess, 'high');

  } else {
    running = false;
    guessInput.disabled = true;
    guessBtn.disabled   = true;

    feedbackText.className   = 'feedback-text win';
    feedbackText.textContent = `${guess} — yes, that's it!`;

    const rating = attempts <= 5 ? 'Impressive' : attempts <= 8 ? 'Not bad' : 'Eventually';
    winSub.textContent = `${answer} was the number · ${attempts} attempt${attempts !== 1 ? 's' : ''} · ${rating}`;
    winCard.classList.add('visible');
  }

  guessInput.focus();
}

guessBtn.addEventListener('click', processGuess);
guessInput.addEventListener('keydown', e => { if (e.key === 'Enter') processGuess(); });
restartBtn.addEventListener('click', initGame);

initGame();