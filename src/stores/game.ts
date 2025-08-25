import { defineStore } from 'pinia'
import { usePlayerStore } from './player'
import { useEnemyStore } from './enemy'

export const useGameStore = defineStore('game', {
  state: () => ({
    round: 1,
    turn: 'player' as 'player' | 'enemy',
    roundsWon: { player: 0, enemy: 0 }
  }),

  actions: {
    // Старт гри
    startGame() {
      const player = usePlayerStore()
      const enemy = useEnemyStore()

      player.init()
      enemy.init()

      this.round = 1
      this.turn = 'player'
      this.roundsWon = { player: 0, enemy: 0 }

      // Підписка на зміни стану гравця та ворога
      this.$subscribe(() => {
        this.checkRoundEnd()
      })
    },

    // Хід гравця
    playerPlayCard(cardId: string) {
      const player = usePlayerStore()
      const enemy = useEnemyStore()

      const card = player.hand.find(c => c.id === cardId)
      if (!card || player.passed) return

      player.playCard(card)

      // Після ходу гравця — хід ворога
      setTimeout(() => {
        this.turn = 'enemy'
        enemy.autoPlay(player.score)
        this.turn = 'player'
      }, 1000)
    },

    // Пас гравця
    playerPass() {
      const player = usePlayerStore()
      const enemy = useEnemyStore()
      player.pass()

      const isFinalRound = this.roundsWon.player === 1 && this.roundsWon.enemy === 1 // тобто якщо він вже виграв 1 раунд
      enemy.finishRound(player.score, isFinalRound)
      setTimeout(() => {
        this.checkRoundEnd()
      }, 1000)
    },

    // Перевірка кінця раунду
    checkRoundEnd() {
      const player = usePlayerStore()
      const enemy = useEnemyStore()

      if (player.passed && enemy.passed) {
        let winner: 'player' | 'enemy' | 'draw' = 'draw'

        if (player.score > enemy.score) {
          this.roundsWon.player++

          const card = player.deck.shift()!
          player.hand.push(card)


          console.log(`🎉 Гравець виграв раунд ${this.round}`)
        } else if (enemy.score > player.score) {
          this.roundsWon.enemy++

          const card = enemy.deck.shift()!
          enemy.hand.push(card)

          console.log(`💀 Ворог виграв раунд ${this.round}`)
        } else {
          this.roundsWon.enemy++
          this.roundsWon.player++
          console.log(`⚖️ Нічия у раунді ${this.round}`)
        }

        // Підготовка наступного раунду
        this.round++
        player.board = []
        enemy.board = []
        player.passed = false
        enemy.passed = false

                // Встановлюємо, хто ходить першим наступний раунд
        

        if (this.roundsWon.player === 2) {
          console.log('🏆 Гравець виграв гру!')
        }
        if (this.roundsWon.enemy === 2) {
          console.log('☠️ Ворог виграв гру!')
        }

        if (winner !== 'draw') {
          if (winner === 'enemy') {
            setTimeout(() => enemy.autoPlay(player.score), 500)
          }
        } else {
          setTimeout(() => enemy.autoPlay(player.score), 500) // за замовчуванням при нічії
        }
      }
    }
  }
})
