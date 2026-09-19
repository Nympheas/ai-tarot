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
