// src/utils/deck_gwent.ts
import type { Card, Race } from '@/data/cards_gwent'

import { cards } from '@/data/cards_gwent'


// Фішка: тасування масиву (Fisher–Yates)
export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// Випадкова раса
export function getRandomRace(): Race {
  const races: Race[] = ['beasts', 'mages', 'undead', 'mechanical']
  const idx = Math.floor(Math.random() * races.length)
  return races[idx]
}

// Створити колоду для конкретної раси
export function createDeckForRace(race: Race): Card[] {
  const deck = cards.filter(c => c.race === race)
  return shuffle(deck)
}
