// 📂 stores/abilities.ts
import { defineStore } from 'pinia'
import type { Card, UnitCard } from '@/data/cards_gwent'
import { useEnemyStore } from './enemy';
import { usePlayerStore } from './player';

export type UnitAbility =
  | { type: 'buffAllyRandom'; multiplier: number; owner: string  }
  | { type: 'weakenEnemyRandom'; divisor: number; owner: string  }
  | { type: 'destroyEnemyRandom'; owner: string  }
  | { type: 'summonFromDeck'; owner: string  }
  | { type: 'takeEnemyRandom'; owner: string  }

export const useAbilitiesStore = defineStore('abilities', {
  actions: {
    runAbility(
      ability: UnitAbility,
      context: { ownerBoard: UnitCard[]; enemyBoard: UnitCard[] }
    ) {
      const { ownerBoard, enemyBoard } = context

      switch (ability.type) {
        case 'buffAllyRandom': {
          const targets = ownerBoard.filter(c => c.type === 'unit')
          if (targets.length === 0) return

          const card = targets[Math.floor(Math.random() * targets.length)]
          card.power = Math.floor(card.power * ability.multiplier)
          card.isBuffed = true
          console.log(`✨ Баф союзника: ${card.name} тепер має ${card.power} сили`)
          break
        }

        case 'weakenEnemyRandom': {
          const targets = enemyBoard.filter(c => c.type === 'unit')
          if (targets.length === 0) return

          const card = targets[Math.floor(Math.random() * targets.length)]
          card.power = Math.max(1, Math.floor(card.power / ability.divisor))
          card.isBuffed = true
          console.log(`💀 Дебаф ворога: ${card.name} тепер має ${card.power} сили`)
          break
        }

        case 'destroyEnemyRandom': {
          const targets = enemyBoard.filter(c => c.type === 'unit')
          if (targets.length === 0) return

          const idx = Math.floor(Math.random() * targets.length)
          const card = targets[idx]
          enemyBoard.splice(idx, 1)
          console.log(`🔥 Знищено карту ворога: ${card.name}`)
          break
        }

        case 'summonFromDeck': {
          const ownerStore = ability.owner === 'enemy'
            ? useEnemyStore()
            : usePlayerStore()

          // знаходимо першого доступного юніта
          const idx = ownerStore.deck.findIndex(c => c.type === 'unit')
          if (idx !== -1) {
            const [card] = ownerStore.deck.splice(idx, 1) as UnitCard[]
            context.ownerBoard.push(card)
          }
          break
        }

        case 'takeEnemyRandom': {
          if (context.enemyBoard.length === 0) return
          const idx = Math.floor(Math.random() * context.enemyBoard.length)
          const [card] = context.enemyBoard.splice(idx, 1) as UnitCard[]
          context.ownerBoard.push(card)
          break
        }
      }
    }
  }
})
