import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';

const dependency = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, '..');

// Exercise the real route, replacing only authentication, billing and Gemini.
function loadTs(file, mocks = {}) {
  const filename = path.resolve(root, file);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const compiled = { exports: {} };
  const localRequire = id => {
    if (id in mocks) return mocks[id];
    if (id.startsWith('@/')) return loadTs(`${id.slice(2)}.ts`, mocks);
    if (id.startsWith('.')) return loadTs(path.resolve(path.dirname(filename), `${id}.ts`), mocks);
    return dependency(id);
  };
  new Function('require', 'module', 'exports', code)(localRequire, compiled, compiled.exports);
  return compiled.exports;
}

const cards = ['圣杯四', '魔鬼', '恋人', '圣杯五'].map((name, i) => ({ name, nameZh: name, isReversed: i === 3 }));
const payload = { type: 'mass', theme: 'love', groupNumber: 2, groupSymbol: '🌙', question: '关于与伴侣的关系，我应有什么了解？', messages: [] };
function harness() {
  const seen = { credits: 0 };
  const route = loadTs('app/api/divination/route.ts', {
    '@clerk/nextjs/server': { auth: async () => ({ userId: 'test-user' }) },
    '@/lib/credits': {
      getUserCreditStatus: async () => ({ canRead: true }),
      consumeCredit: async () => { seen.credits++; return true; },
    },
    '@google/generative-ai': { GoogleGenerativeAI: class {
      getGenerativeModel(config) {
        seen.system = config.systemInstruction;
        return { startChat: () => ({ sendMessageStream: async prompt => {
          seen.user = prompt;
          return { stream: (async function* () { yield { text: () => 'test reading' }; })() };
        } }) };
      }
    } },
  });
  return { seen, post: body => route.POST(new Request('http://localhost/api/divination', { method: 'POST', body: JSON.stringify(body) })) };
}

async function inMode(mock, run) {
  const old = [process.env.GEMINI_API_KEY, process.env.NEXT_PUBLIC_USE_MOCK];
  process.env.GEMINI_API_KEY = 'test-key';
  process.env.NEXT_PUBLIC_USE_MOCK = String(mock);
  try { await run(); } finally {
    for (const [i, key] of ['GEMINI_API_KEY', 'NEXT_PUBLIC_USE_MOCK'].entries()) {
      if (old[i] === undefined) delete process.env[key]; else process.env[key] = old[i];
    }
  }
}

for (const personality of ['default', 'intp']) {
  for (const spread of [undefined, 'three-card', 'four-card']) {
    test(`${personality}: ${spread ?? 'original'} selects the correct personality, cards and prompt`, async () => inMode(false, async () => {
      const { post, seen } = harness();
      const prompts = loadTs('lib/prompts/mass.ts');
      const three = loadTs('lib/prompts/mass-three-card.ts');
      const four = loadTs('lib/prompts/mass-four-card.ts');
      const readingCards = spread === 'three-card' ? cards.slice(0, 3) : spread === 'four-card' ? cards : [...cards, { name: '太阳', nameZh: '太阳', isReversed: false }];
      const verificationCards = spread ? [] : cards.slice(0, 3);
      const response = await post({ ...payload, personality, spread, readingCards, verificationCards });
      assert.equal(response.status, 200);
      assert.equal(await response.text(), 'test reading');
      assert.equal(seen.credits, 1);
      const base = personality === 'intp' ? prompts.getMassINTPSystemPrompt() : prompts.getMassSystemPrompt();
      const args = [payload.theme, payload.groupNumber, payload.groupSymbol, payload.question];
      if (!spread) {
        assert.equal(seen.system, base);
        assert.equal(seen.user, prompts.buildMassUserPrompt(...args, verificationCards, readingCards));
      } else if (spread === 'three-card') {
        assert.equal(seen.system, three.withThreeCardSpread(base, personality));
        assert.equal(seen.user, three.buildThreeCardUserPrompt(...args, readingCards));
      } else {
        assert.ok(seen.system.startsWith(base + '\n'));
        assert.equal(seen.user, four.buildFourCardUserPrompt(...args, readingCards));
        assert.match(seen.user, /第4张 · 关系人：圣杯五.*逆位/);
        assert.match(seen.system, /第四张独立于前三张/);
        assert.match(seen.system, /案例10：担心异地男友出轨/);
        assert.doesNotMatch(seen.user, /验证牌/);
      }
    }));
  }
}

test('four-card invalid input is rejected before billing', async () => {
  const { post, seen } = harness();
  for (const readingCards of [null, [], cards.slice(0, 3), [...cards, cards[0]], [null, ...cards.slice(1)], [{ ...cards[0], isReversed: 'false' }, ...cards.slice(1)], [{ ...cards[0], nameZh: ' ' }, ...cards.slice(1)]]) {
    assert.equal((await post({ ...payload, spread: 'four-card', readingCards })).status, 400);
  }
  assert.equal((await post({ ...payload, spread: 'four-card', readingCards: cards, question: ' ' })).status, 400);
  assert.equal(seen.credits, 0);
});

test('four-card mock uses the actual four cards and positions', async () => inMode(true, async () => {
  const { post } = harness();
  const response = await post({ ...payload, spread: 'four-card', readingCards: cards });
  const output = await response.text();
  assert.match(output, /演示模式/);
  assert.equal((output.match(/### /g) ?? []).length, 4);
  assert.match(output, /### 关系人\n圣杯五（逆位）/);
}));

test('ten book cases retain four positions and separate exceptional clarifiers', () => {
  const { FOUR_CARD_CASES } = loadTs('lib/prompts/mass-four-card.ts');
  assert.equal(FOUR_CARD_CASES.length, 10);
  for (const c of FOUR_CARD_CASES) assert.equal(c.cards.length, 4);
  assert.match(FOUR_CARD_CASES[5].lesson, /是儿女，不是/);
  assert.match(FOUR_CARD_CASES[6].clarifiers, /同位两牌/);
  assert.match(FOUR_CARD_CASES[7].clarifiers, /关系人位英勇补休战/);
});

const extraCards = ['太阳', '月亮', '世界', '女皇'].map(name => ({ name, nameZh: name, isReversed: false }));
const addedReading = {
  readingCards: cards.slice(0, 3),
  additions: [
    { target: 2, purpose: '结果需要落实什么？', cards: extraCards.slice(0, 1) },
    { target: 3, purpose: '这一步的具体方向是什么？', cards: extraCards.slice(1, 3) },
    { target: 0, purpose: '头脑的顾虑是什么？', cards: extraCards.slice(3) },
  ],
};
for (const personality of ['default', 'intp']) {
  test(`added-card ${personality}: base, chained and branched additions keep original personality`, async () => inMode(false, async () => {
    const { post, seen } = harness();
    const prompts = loadTs('lib/prompts/mass.ts');
    const base = personality === 'intp' ? prompts.getMassINTPSystemPrompt() : prompts.getMassSystemPrompt();
    for (const reading of [{ readingCards: cards, additions: [] }, addedReading]) {
      const response = await post({ ...payload, personality, spread: 'added-card', ...reading });
      assert.equal(response.status, 200);
      assert.equal(await response.text(), 'test reading');
      assert.ok(seen.system.startsWith(base + '\n'));
      assert.match(seen.system, /案例10：论文研究访谈/);
      assert.match(seen.system, /不能覆盖、替换/);
      if (reading.additions.length) {
        assert.match(seen.user, /第2次加牌，补充第4张 太阳/);
        assert.match(seen.user, /第3次加牌，补充第1张 圣杯四/);
        assert.match(seen.user, /第6张 · 补充牌：世界/);
        assert.match(seen.user, /结果需要落实什么/);
      } else {
        assert.match(seen.user, /第4张 · 关系人：圣杯五.*逆位/);
        assert.doesNotMatch(seen.user, /次加牌/);
      }
    }
    assert.equal(seen.credits, 2);
  }));
}
test('added-card invalid targets, duplicate cards, empty purposes and malformed batches reject before billing', async () => {
  const { post, seen } = harness();
  const first = addedReading.additions[0];
  const invalid = [
    { readingCards: cards.slice(0, 2), additions: [] },
    { readingCards: [cards[0], cards[0], cards[1]], additions: [] },
    { readingCards: cards, additions: null },
    ...[
      { ...first, target: -1 }, { ...first, target: 3 }, { ...first, target: 0.5 },
      { ...first, purpose: ' ' }, { ...first, cards: [] },
      { ...first, cards: extraCards.slice(0, 3) }, { ...first, cards: [cards[0]] },
      { ...first, cards: [{ ...extraCards[0], isReversed: 'false' }] },
    ].map(addition => ({ readingCards: cards.slice(0, 3), additions: [addition] })),
    { ...addedReading, additions: [first, { ...first, cards: first.cards }] },
  ];
  for (const reading of invalid) assert.equal((await post({ ...payload, spread: 'added-card', ...reading })).status, 400);
  assert.equal(seen.credits, 0);
});
test('added-card mock keeps actual additions, purpose and source card', async () => inMode(true, async () => {
  const { post, seen } = harness();
  const response = await post({ ...payload, spread: 'added-card', ...addedReading, messages: [{ role: 'user', content: 'continue' }] });
  assert.equal(response.status, 200);
  const output = await response.text();
  assert.match(output, /演示模式/);
  assert.match(output, /第2次加牌，补充第4张 太阳/);
  assert.match(output, /第7张 · 补充牌：女皇/);
  assert.equal(seen.credits, 1, 'additions cannot bypass billing by sending messages');
}));
test('ten addition cases retain sequential, simultaneous and independent branches', () => {
  const { ADDED_CARD_CASES } = loadTs('lib/prompts/mass-added-card.ts');
  assert.equal(ADDED_CARD_CASES.length, 10);
  assert.match(ADDED_CARD_CASES[1].chain, /同时加出残酷.*挫败/);
  assert.match(ADDED_CARD_CASES[2].chain, /教皇 → 宝剑一 → 改变.*→ 奢华/);
  assert.match(ADDED_CARD_CASES[7].chain, /头脑.*和平.*；忠告.*女皇/);
  assert.match(ADDED_CARD_CASES[8].base, /同属头脑位/);
});

test('addition draws preserve the old deck and never reuse a base or supplementary card', () => {
  const { drawAddedCards } = loadTs('lib/divination/added-cards.ts');
  const { ALL_CARDS, drawCards } = loadTs('lib/divination/tarot-cards.ts');
  assert.equal(drawCards(78).length, 22, 'original draw behavior remains unchanged');
  const drawn = drawAddedCards(78);
  assert.equal(drawn.length, 78);
  assert.equal(new Set(drawn.map(c => c.name)).size, 78);
  assert.ok(drawn.every(c => typeof c.isReversed === 'boolean'));
  const used = { readingCards: drawn.slice(0, 3), additions: [{ target: 2, purpose: 'clarify', cards: drawn.slice(3, 5) }] };
  const remainder = drawAddedCards(78, used);
  assert.equal(remainder.length, ALL_CARDS.length - 5);
  assert.ok(remainder.every(c => !drawn.slice(0, 5).some(old => old.name === c.name)));
});

const thirteenCards = loadTs('lib/divination/tarot-cards.ts').ALL_CARDS.slice(0, 13).map((c, i) => ({ name: c.name, nameZh: c.nameZh, isReversed: i === 12 }));
for (const personality of ['default', 'intp']) {
  test(`thirteen-card ${personality}: preserves personality and uses all positions and fifteen examples`, async () => inMode(false, async () => {
    const { post, seen } = harness();
    const prompts = loadTs('lib/prompts/mass.ts');
    const spread = loadTs('lib/prompts/mass-thirteen-card.ts');
    const response = await post({ ...payload, personality, spread: 'thirteen-card', readingCards: thirteenCards });
    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'test reading');
    assert.equal(seen.credits, 1);
    const base = personality === 'intp' ? prompts.getMassINTPSystemPrompt() : prompts.getMassSystemPrompt();
    assert.ok(seen.system.startsWith(base + '\n'));
    assert.match(seen.system, /案例15：近期烦乱与动荡不安/);
    assert.match(seen.system, /13→1→9→8/);
    assert.match(seen.system, /11号如何支持10号/);
    assert.match(seen.system, /不将教材加牌塞入实际13张/);
    for (let i = 0; i < 13; i++) assert.ok(seen.user.includes(`第${i + 1}张 · ${spread.THIRTEEN_POSITIONS[i]}：${thirteenCards[i].nameZh}`));
    assert.match(seen.user, /第13张 · 综观：.*逆位/);
    assert.doesNotMatch(seen.user, /验证牌/);
  }));
}
test('thirteen-card malformed counts, duplicate cards and missing questions reject before billing', async () => {
  const { post, seen } = harness();
  for (const readingCards of [null, [], thirteenCards.slice(0, 12), [...thirteenCards, cards[0]], [null, ...thirteenCards.slice(1)], [thirteenCards[1], ...thirteenCards.slice(1)], [{ ...thirteenCards[0], nameZh: ' ' }, ...thirteenCards.slice(1)], [{ ...thirteenCards[0], isReversed: 'false' }, ...thirteenCards.slice(1)]]) {
    assert.equal((await post({ ...payload, spread: 'thirteen-card', readingCards })).status, 400);
  }
  assert.equal((await post({ ...payload, spread: 'thirteen-card', readingCards: thirteenCards, question: ' ' })).status, 400);
  assert.equal(seen.credits, 0);
});
test('thirteen-card mock uses actual cards in the book reading order without dropping positions', async () => inMode(true, async () => {
  const { post } = harness();
  const response = await post({ ...payload, spread: 'thirteen-card', readingCards: thirteenCards });
  assert.equal(response.status, 200);
  const output = await response.text();
  const order = [...output.matchAll(/(?:^|\n)(\d+)\. /g)].map(m => Number(m[1]));
  assert.deepEqual(order, [13, 1, 9, 8, 5, 7, 4, 6, 2, 3, 10, 11, 12]);
  assert.match(output, /13\. 综观：倒吊人（逆位）/);
}));
test('fifteen thirteen-card book cases retain numbered positions and supplemental exceptions', () => {
  const { THIRTEEN_CARD_CASES, THIRTEEN_POSITIONS, THIRTEEN_LAYERS } = loadTs('lib/prompts/mass-thirteen-card.ts');
  assert.equal(THIRTEEN_POSITIONS.length, 13);
  assert.equal(new Set(THIRTEEN_LAYERS.flat()).size, 13);
  assert.equal(THIRTEEN_CARD_CASES.length, 15);
  for (const c of THIRTEEN_CARD_CASES) assert.equal(c.cards.length, 13, c.title);
  assert.equal(THIRTEEN_CARD_CASES[2].cards[12], '艺术');
  assert.match(THIRTEEN_CARD_CASES[2].lesson, /主要关系是同事/);
  assert.match(THIRTEEN_CARD_CASES[3].clarifiers, /8号宝剑一.*茅塞顿开.*失败/);
  assert.match(THIRTEEN_CARD_CASES[11].clarifiers, /13号.*12号/);
  assert.match(THIRTEEN_CARD_CASES[14].cards[5], /宝剑公主／科学/);
  assert.match(THIRTEEN_CARD_CASES[14].clarifiers, /不新增第14个位置/);
});

const fifteenCards = loadTs('lib/divination/tarot-cards.ts').ALL_CARDS.slice(0, 15).map((c, i) => ({ name: c.name, nameZh: c.nameZh, isReversed: [5, 14].includes(i) }));
for (const personality of ['default', 'intp']) {
  test(`fifteen-card ${personality}: keeps persona and preserves all three groups in draw order`, async () => inMode(false, async () => {
    const { post, seen } = harness();
    const prompts = loadTs('lib/prompts/mass.ts');
    const spread = loadTs('lib/prompts/mass-fifteen-card.ts');
    const response = await post({ ...payload, personality, spread: 'fifteen-card', readingCards: fifteenCards });
    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'test reading');
    assert.equal(seen.credits, 1);
    const base = personality === 'intp' ? prompts.getMassINTPSystemPrompt() : prompts.getMassSystemPrompt();
    assert.ok(seen.system.startsWith(base + '\n'));
    assert.match(seen.system, /案例10：结束生意后工作的方向/);
    assert.match(seen.system, /全局第1、6、11张/);
    assert.match(seen.system, /头脑2号→忠告2号→结果2号/);
    assert.match(seen.system, /本次固定15张/);
    for (let i = 0; i < 15; i++) assert.ok(seen.user.includes(`第${i + 1}张 · ${spread.FIFTEEN_POSITIONS[i]}：${fifteenCards[i].nameZh}`));
    assert.match(seen.user, /第6张 · 忠告 · 1号核心主题：教皇.*逆位/);
    assert.match(seen.user, /第15张 · 结果 · 5号发展：节制.*逆位/);
    assert.match(seen.user, /观众第2组/);
    assert.doesNotMatch(seen.user, /验证牌/);
  }));
}
test('fifteen-card malformed and duplicate cards reject before billing', async () => {
  const { post, seen } = harness();
  for (const readingCards of [null, [], fifteenCards.slice(0, 14), [...fifteenCards, cards[0]], [null, ...fifteenCards.slice(1)], [fifteenCards[1], ...fifteenCards.slice(1)], [{ ...fifteenCards[0], name: ' ' }, ...fifteenCards.slice(1)], [{ ...fifteenCards[0], isReversed: 'false' }, ...fifteenCards.slice(1)]]) {
    assert.equal((await post({ ...payload, spread: 'fifteen-card', readingCards })).status, 400);
  }
  assert.equal((await post({ ...payload, spread: 'fifteen-card', readingCards: fifteenCards, question: ' ' })).status, 400);
  assert.equal(seen.credits, 0);
});
test('fifteen-card mock uses actual cards in three groups of five', async () => inMode(true, async () => {
  const { post } = harness();
  const response = await post({ ...payload, spread: 'fifteen-card', readingCards: fifteenCards });
  assert.equal(response.status, 200);
  const output = await response.text();
  assert.match(output, /### 头脑组/);
  assert.match(output, /### 忠告组/);
  assert.match(output, /### 结果组/);
  assert.equal((output.match(/核心主题/g) ?? []).length, 3);
  assert.equal((output.match(/号基础/g) ?? []).length, 3);
  assert.deepEqual([...output.matchAll(/第(\d+)张/g)].map(m => Number(m[1])), Array.from({ length: 15 }, (_, i) => i + 1));
  assert.match(output, /第15张 · 5号发展：节制（逆位）/);
}));
test('ten fifteen-card cases and cross layout retain source group roles and exceptions', () => {
  const { FIFTEEN_CARD_CASES, FIFTEEN_POSITIONS, FIFTEEN_LAYOUT } = loadTs('lib/prompts/mass-fifteen-card.ts');
  assert.equal(FIFTEEN_POSITIONS.length, 15);
  assert.deepEqual(FIFTEEN_LAYOUT, [{ row: 2, col: 2 }, { row: 2, col: 1 }, { row: 2, col: 3 }, { row: 3, col: 2 }, { row: 1, col: 2 }]);
  assert.equal(FIFTEEN_CARD_CASES.length, 10);
  for (const c of FIFTEEN_CARD_CASES) {
    assert.equal(c.groups.length, 3, c.title);
    for (const g of c.groups) assert.equal(g.length, 5, c.title);
  }
  assert.deepEqual(FIFTEEN_CARD_CASES[0].groups.map(g => g[0]), ['倒吊人', '放纵（圣杯七）', '失望（圣杯五）']);
  assert.match(FIFTEEN_CARD_CASES[2].clarifiers, /第三组误标为头脑/);
  assert.match(FIFTEEN_CARD_CASES[5].lesson, /同一人相隔约一个月/);
  assert.match(FIFTEEN_CARD_CASES[7].clarifiers, /结果组3号.*4号.*5号/);
});
