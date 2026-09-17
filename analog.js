(() => {
  'use strict';
  const { normalizeAnalog, formatAnalogGerman, randomTime } = globalThis.LernuhrCore;
  const svg = document.getElementById('clock');
  const hourHand = document.getElementById('hour-hand');
  const minuteHand = document.getElementById('minute-hand');
  const secondHand = document.getElementById('second-hand');
  const textOutput = document.getElementById('time-text');
  const randomButton = document.getElementById('random-time');
  const systemButton = document.getElementById('system-time');
  const textButton = document.getElementById('toggle-text');
  const modeLabel = document.getElementById('mode-label');
  let time = { total: 0, hour: 0, minute: 0 };
  let automatic = false;
  let showText = false;
  let timer;
  let drag = null;

  function drawFace() {
    const marks = document.getElementById('clock-marks');
    const numbers = document.getElementById('clock-numbers');
    for (let i = 0; i < 60; i += 1) {
      const angle = i * 6 * Math.PI / 180;
      const length = i % 5 === 0 ? 10 : 4;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', 100 + Math.sin(angle) * 90);
      line.setAttribute('y1', 100 - Math.cos(angle) * 90);
      line.setAttribute('x2', 100 + Math.sin(angle) * (90 - length));
      line.setAttribute('y2', 100 - Math.cos(angle) * (90 - length));
      line.classList.add('clock-mark');
      marks.append(line);
    }
    for (let i = 1; i <= 12; i += 1) {
      const angle = i * 30 * Math.PI / 180;
      const number = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      number.setAttribute('x', 100 + Math.sin(angle) * 74);
      number.setAttribute('y', 100 - Math.cos(angle) * 74 + 5);
      number.setAttribute('text-anchor', 'middle');
      number.textContent = i;
      numbers.append(number);
    }
  }

  function render() {
    minuteHand.setAttribute('transform', `rotate(${time.minute * 6} 100 100)`);
    hourHand.setAttribute('transform', `rotate(${(time.hour + time.minute / 60) * 30} 100 100)`);
    const phrase = formatAnalogGerman(time.hour, time.minute);
    textOutput.textContent = showText ? phrase : 'Den tyske teksten er skjult.';
    textOutput.classList.toggle('is-hidden', !showText);
    textButton.classList.toggle('is-active', showText);
    textButton.setAttribute('aria-pressed', String(showText));
    textButton.textContent = showText ? 'Text ausblenden' : 'Text anzeigen';
    svg.setAttribute('aria-label', `Analog klokke, ${time.hour || 12}:${String(time.minute).padStart(2, '0')}`);
  }

  function setTotal(total) {
    time = normalizeAnalog(total);
    render();
  }

  function updateSystemTime() {
    const now = new Date();
    setTotal((now.getHours() % 12) * 60 + now.getMinutes());
    secondHand.setAttribute('transform', `rotate(${now.getSeconds() * 6} 100 100)`);
  }

  function startSystemTime() {
    clearInterval(timer);
    automatic = true;
    systemButton.classList.add('is-active');
    systemButton.setAttribute('aria-pressed', 'true');
    modeLabel.textContent = 'Systemzeit';
    secondHand.hidden = false;
    updateSystemTime();
    timer = setInterval(updateSystemTime, 1000);
  }

  function stopSystemTime() {
    automatic = false;
    clearInterval(timer);
    systemButton.classList.remove('is-active');
    systemButton.setAttribute('aria-pressed', 'false');
    modeLabel.textContent = 'Eingestellte Zeit';
    secondHand.hidden = true;
  }

  function pointerAngle(event) {
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const local = point.matrixTransform(svg.getScreenCTM().inverse());
    return (Math.atan2(local.y - 100, local.x - 100) * 180 / Math.PI + 90 + 360) % 360;
  }

  function angularDifference(a, b) {
    return Math.min((a - b + 360) % 360, (b - a + 360) % 360);
  }

  svg.addEventListener('pointerdown', event => {
    event.preventDefault();
    svg.setPointerCapture(event.pointerId);
    stopSystemTime();
    const angle = pointerAngle(event);
    const minuteAngle = time.minute * 6;
    const hourAngle = (time.hour + time.minute / 60) * 30;
    drag = angularDifference(angle, minuteAngle) < angularDifference(angle, hourAngle)
      ? { hand: 'minute', previousAngle: angle, previousTotal: time.total }
      : { hand: 'hour' };
  });

  svg.addEventListener('pointermove', event => {
    if (!drag) return;
    const angle = pointerAngle(event);
    if (drag.hand === 'hour') {
      setTotal(angle / 360 * 720);
      return;
    }
    let delta = angle - drag.previousAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    setTotal(drag.previousTotal + delta / 6);
    drag.previousTotal = time.total;
    drag.previousAngle = angle;
  });

  function endDrag(event) {
    if (!drag) return;
    drag = null;
    if (svg.hasPointerCapture(event.pointerId)) svg.releasePointerCapture(event.pointerId);
  }
  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointercancel', endDrag);

  randomButton.addEventListener('click', () => {
    stopSystemTime();
    const random = randomTime();
    setTotal((random.hour % 12) * 60 + random.minute);
  });
  systemButton.addEventListener('click', () => automatic ? stopSystemTime() : startSystemTime());
  textButton.addEventListener('click', () => { showText = !showText; render(); });

  drawFace();
  startSystemTime();
})();
