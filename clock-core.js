(() => {
  'use strict';

  const hourNames = ['zwölf', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf'];
  const smallNumbers = {0:'null',1:'eins',2:'zwei',3:'drei',4:'vier',5:'fünf',6:'sechs',7:'sieben',8:'acht',9:'neun',10:'zehn',11:'elf',12:'zwölf',13:'dreizehn',14:'vierzehn',15:'fünfzehn',16:'sechzehn',17:'siebzehn',18:'achtzehn',19:'neunzehn'};
  const tens = {20:'zwanzig',30:'dreißig',40:'vierzig',50:'fünfzig'};

  function wrap(value, size) {
    return ((value % size) + size) % size;
  }

  function cardinal(number) {
    const value = Number(number);
    if (!Number.isInteger(value) || value < 0 || value > 59) throw new RangeError('Tallet må være et heltall mellom 0 og 59.');
    if (value < 20) return smallNumbers[value];
    const ten = Math.floor(value / 10) * 10;
    const unit = value % 10;
    if (unit === 0) return tens[ten];
    return `${unit === 1 ? 'ein' : smallNumbers[unit]}und${tens[ten]}`;
  }

  function normalizeAnalog(totalMinutes) {
    const total = wrap(Math.round(totalMinutes), 720);
    return { total, hour: Math.floor(total / 60), minute: total % 60 };
  }

  function formatAnalogGerman(hour, minute) {
    const h = wrap(Math.trunc(hour), 12);
    const m = wrap(Math.trunc(minute), 60);
    const next = (h + 1) % 12;
    if (m === 0) return `Es ist ${hourNames[h]} Uhr`;
    if (m < 15) return `Es ist ${cardinal(m)} nach ${hourNames[h]}`;
    if (m === 15) return `Es ist Viertel nach ${hourNames[h]}`;
    if (m < 30) return `Es ist ${cardinal(30 - m)} vor halb ${hourNames[next]}`;
    if (m === 30) return `Es ist halb ${hourNames[next]}`;
    if (m < 45) return `Es ist ${cardinal(m - 30)} nach halb ${hourNames[next]}`;
    if (m === 45) return `Es ist Viertel vor ${hourNames[next]}`;
    return `Es ist ${cardinal(60 - m)} vor ${hourNames[next]}`;
  }

  function formatDigitalGerman(hour, minute) {
    const h = wrap(Math.trunc(hour), 24);
    const m = wrap(Math.trunc(minute), 60);
    return {
      hour: cardinal(h),
      minute: m === 0 ? '' : cardinal(m),
      text: `${cardinal(h)} Uhr${m === 0 ? '.' : ` ${cardinal(m)}.`}`
    };
  }

  function randomTime(random = Math.random) {
    return { hour: Math.floor(random() * 24), minute: Math.floor(random() * 60) };
  }

  globalThis.LernuhrCore = { wrap, cardinal, normalizeAnalog, formatAnalogGerman, formatDigitalGerman, randomTime };
})();
