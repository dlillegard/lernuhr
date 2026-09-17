import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';
import '../clock-core.js';

const { wrap, cardinal, normalizeAnalog, formatAnalogGerman, formatDigitalGerman, randomTime } = globalThis.LernuhrCore;

test('nettleserskriptene kan leses uten modullaster', () => {
  for (const name of ['theme.js', 'clock-core.js', 'analog.js', 'digital.js']) {
    const source = readFileSync(new URL('../' + name, import.meta.url), 'utf8');
    assert.doesNotThrow(() => new Script(source, { filename: name }));
  }
});

test('tyske tallord dekker digital klokke', () => {
  assert.equal(cardinal(0), 'null');
  assert.equal(cardinal(16), 'sechzehn');
  assert.equal(cardinal(21), 'einundzwanzig');
  assert.equal(cardinal(38), 'achtunddreißig');
  assert.equal(cardinal(59), 'neunundfünfzig');
  assert.throws(() => cardinal(60), RangeError);
});

test('analog tekst følger muntlige tyske klokkeuttrykk', () => {
  assert.equal(formatAnalogGerman(2, 0), 'Es ist zwei Uhr');
  assert.equal(formatAnalogGerman(2, 10), 'Es ist zehn nach zwei');
  assert.equal(formatAnalogGerman(2, 15), 'Es ist Viertel nach zwei');
  assert.equal(formatAnalogGerman(2, 20), 'Es ist zehn vor halb drei');
  assert.equal(formatAnalogGerman(2, 30), 'Es ist halb drei');
  assert.equal(formatAnalogGerman(2, 40), 'Es ist zehn nach halb drei');
  assert.equal(formatAnalogGerman(2, 45), 'Es ist Viertel vor drei');
  assert.equal(formatAnalogGerman(2, 50), 'Es ist zehn vor drei');
});

test('analog tid går riktig rundt tolv', () => {
  assert.deepEqual(normalizeAnalog(720), { total: 0, hour: 0, minute: 0 });
  assert.deepEqual(normalizeAnalog(-1), { total: 719, hour: 11, minute: 59 });
  assert.equal(formatAnalogGerman(11, 30), 'Es ist halb zwölf');
});

test('digital tekst bruker 24-timersformat', () => {
  assert.deepEqual(formatDigitalGerman(13, 0), { hour:'dreizehn', minute:'', text:'dreizehn Uhr.' });
  assert.deepEqual(formatDigitalGerman(23, 25), { hour:'dreiundzwanzig', minute:'fünfundzwanzig', text:'dreiundzwanzig Uhr fünfundzwanzig.' });
  assert.equal(wrap(-1, 24), 23);
  assert.equal(wrap(60, 60), 0);
});

test('tilfeldig tid dekker hele døgnet uten å gå utenfor', () => {
  const values = [0.999, 0.999];
  assert.deepEqual(randomTime(() => values.shift()), { hour:23, minute:59 });
});

test('begge sider har klokkevelger, tema og riktig versjon', () => {
  const analog = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const digital = readFileSync(new URL('../digitaluhr.html', import.meta.url), 'utf8');
  for (const html of [analog, digital]) {
    assert.match(html, /href="index\.html"/);
    assert.match(html, /href="digitaluhr\.html"/);
    assert.match(html, /id="theme-toggle"/);
    assert.match(html, /<h1>Wie viel Uhr ist es\?<\/h1>/);
    assert.match(html, /Versjon 2\.0\.2/);
    assert.doesNotMatch(html, /fonts\.googleapis/);
  }
});
