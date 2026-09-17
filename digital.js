(() => {
  'use strict';
  const { wrap, formatDigitalGerman, randomTime } = globalThis.LernuhrCore;
  const hourDisplay = document.getElementById('digital-hour');
  const minuteDisplay = document.getElementById('digital-minute');
  const secondDisplay = document.getElementById('digital-second');
  const textOutput = document.getElementById('time-text');
  const textButton = document.getElementById('toggle-text');
  const systemButton = document.getElementById('system-time');
  const modeLabel = document.getElementById('mode-label');
  let hour = 0;
  let minute = 0;
  let automatic = false;
  let showText = false;
  let timer;

  function pad(value) { return String(value).padStart(2, '0'); }

  function render() {
    hourDisplay.textContent = pad(hour);
    minuteDisplay.textContent = pad(minute);
    const words = formatDigitalGerman(hour, minute);
    textOutput.replaceChildren();
    if (showText) {
      const hourWord = document.createElement('strong');
      hourWord.className = 'hour-word';
      hourWord.textContent = words.hour;
      textOutput.append(hourWord, document.createTextNode(' Uhr'));
      if (words.minute) {
        const minuteWord = document.createElement('strong');
        minuteWord.className = 'minute-word';
        minuteWord.textContent = ` ${words.minute}`;
        textOutput.append(minuteWord);
      }
      textOutput.append(document.createTextNode('.'));
    } else {
      textOutput.textContent = 'Den tyske teksten er skjult.';
    }
    textOutput.classList.toggle('is-hidden', !showText);
    textButton.classList.toggle('is-active', showText);
    textButton.setAttribute('aria-pressed', String(showText));
    textButton.textContent = showText ? 'Text ausblenden' : 'Text anzeigen';
  }

  function tick() {
    const now = new Date();
    hour = now.getHours();
    minute = now.getMinutes();
    secondDisplay.textContent = `:${pad(now.getSeconds())}`;
    render();
  }

  function startSystemTime() {
    clearInterval(timer);
    automatic = true;
    systemButton.classList.add('is-active');
    systemButton.setAttribute('aria-pressed', 'true');
    modeLabel.textContent = 'Systemzeit';
    secondDisplay.hidden = false;
    tick();
    timer = setInterval(tick, 500);
  }

  function stopSystemTime() {
    automatic = false;
    clearInterval(timer);
    systemButton.classList.remove('is-active');
    systemButton.setAttribute('aria-pressed', 'false');
    modeLabel.textContent = 'Eingestellte Zeit';
    secondDisplay.hidden = true;
  }

  function adjust(type, delta) {
    stopSystemTime();
    if (type === 'hour') hour = wrap(hour + delta, 24);
    else minute = wrap(minute + delta, 60);
    render();
  }

  document.getElementById('hour-up').addEventListener('click', () => adjust('hour', 1));
  document.getElementById('hour-down').addEventListener('click', () => adjust('hour', -1));
  document.getElementById('minute-up').addEventListener('click', () => adjust('minute', 1));
  document.getElementById('minute-down').addEventListener('click', () => adjust('minute', -1));
  document.getElementById('random-time').addEventListener('click', () => {
    stopSystemTime();
    ({ hour, minute } = randomTime());
    render();
  });
  systemButton.addEventListener('click', () => automatic ? stopSystemTime() : startSystemTime());
  textButton.addEventListener('click', () => { showText = !showText; render(); });
  startSystemTime();
})();
