// 📂 stores/abilities.ts
import { defineStore } from 'pinia'
import type { UnitCard } from '@/data/cards_gwent'

export type UnitAbility =
  | { type: 'buffAllyRandom'; multiplier: number }   // множить силу випадкового союзника
  | { type: 'weakenEnemyRandom'; divisor: number }   // ділить силу випадкового ворога
  | { type: 'destroyEnemyRandom' }                   // знищує випадкового ворога

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
      }
    }
  }
})
