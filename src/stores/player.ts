import { defineStore } from 'pinia'
import type { Card, Race } from '@/data/cards_gwent'
import { createDeckForRace, getRandomRace } from '@/utils/deck_gwent'
import { useAbilitiesStore } from './abilities'
import { useEnemyStore } from './enemy'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    race: null as Race | null,        // расa гравця (люди, чудовиська і т.д.)
    deck: [] as Card[],              // повна колода гравця
    hand: [] as Card[],              // карти на руках
    board: [] as Card[],             // карти, які вже розіграні на полі                       // загальна сила на полі
    passed: false                    // чи гравець вже "паснув" у раунді
  }),
  getters: {
    score: (state) => state.board.reduce((s, c) => s + (c.power ?? 0), 0)
  },
  actions: {
    init() {
      this.race = getRandomRace()
      this.deck = createDeckForRace(this.race)
      this.hand = this.deck.splice(0, 5)
      this.board = []
      this.passed = false
    },
    playCard(card: Card) {
      this.board.push(card)

      if (card.ability) {
        console.log('🧙‍♂️ Гравець використовує здатність:', card.ability)
        const abilities = useAbilitiesStore()
        abilities.runAbility(card.ability, {
          ownerBoard: this.board,
          enemyBoard: useEnemyStore().board
        })
      }

      this.hand = this.hand.filter(c => c.id !== card.id)
    },
    pass() {
      this.passed = true
    }
  }
})
