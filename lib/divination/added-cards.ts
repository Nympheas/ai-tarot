import { ALL_CARDS } from "./tarot-cards";
import { addedCardList, type AddedReading } from "../prompts/mass-added-card";

export function drawAddedCards(n: number, reading?: AddedReading) {
    const used = new Set(reading ? addedCardList(reading).map(c => c.name) : []);
    const pool = ALL_CARDS.filter(c => !used.has(c.name));
    // Sample without replacement, including cards already used by earlier additions.
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, n).map(c => ({ name: c.name, nameZh: c.nameZh, isReversed: Math.random() > 0.5 }));
  }
