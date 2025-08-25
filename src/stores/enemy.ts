import { defineStore } from 'pinia'
import type { Card, Race } from '@/data/cards_gwent'
import { createDeckForRace, getRandomRace } from '@/utils/deck_gwent'
import { useAbilitiesStore } from './abilities'
import { usePlayerStore } from './player'

export const useEnemyStore = defineStore('enemy', {
  state: () => ({
    race: null as Race | null,
    deck: [] as Card[],
    hand: [] as Card[],
    board: [] as Card[],
    passed: false,
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
        const abilities = useAbilitiesStore()
        const player = usePlayerStore()
        abilities.runAbility(card.ability, {
          ownerBoard: this.board,   // карти ворога
          enemyBoard: player.board  // карти гравця
        })
      }

      this.hand = this.hand.filter(c => c.id !== card.id)
    },
    autoPlay(playerScore: number) {
      if (this.passed) return

      if (playerScore < this.score) {
        this.passed = true
      }

      const enoughCards = this.hand.filter(c => c.power + this.score >= playerScore)
      let cardToPlay: Card | null = null

      if (enoughCards.length > 0) {
        cardToPlay = enoughCards.reduce((prev, curr) =>
          (prev.power ?? 0) < (curr.power ?? 0) ? prev : curr
        )
      } else {
        this.passed = true
        return
      }

      console.log(`🤖 Ворог викладає карту: ${cardToPlay?.name}`)

      if (cardToPlay) this.playCard(cardToPlay)
    },
    pass() {
      this.passed = true
    },
    finishRound(playerScore: number, isFinalRound: boolean) {
      if (this.passed) return

      if (isFinalRound) {
        // Якщо це останній шанс → граємо всі карти
        console.log('🤖 Останній шанс ворога! Викладає всі карти!')
        while (this.hand.length > 0) {
          this.playCard(this.hand[0])
        }
        this.pass()
        return
      }

      // Якщо не останній раунд → граємо мінімальні карти для перемоги
      while (this.score <= playerScore && this.hand.length > 0) {
        // вибираємо мінімальну карту, яка підвищить наш результат
        let bestCard = this.hand.reduce((prev, curr) =>
          prev.power < curr.power ? prev : curr
        )
        this.playCard(bestCard)
      }

      console.log('🤖 Ворог зіграв карти і пасує')
      this.pass()
    }
  }
})
