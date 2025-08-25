<template>
  <div class="board">
    <h1>🃏 Гвінт (спрощена версія)</h1>

    <!-- Статистика -->
    <div class="stats">
      <div>
        👤 Ти ({{ player.race?.name }}): {{ player.score }}
        <span v-if="player.passed">(Пас)</span>
      </div>
      <div>
        🤖 Ворог ({{ enemy.race?.name }}): {{ enemy.score }} 
        <span v-if="enemy.passed">(Пас)</span>
      </div>
      <div>Раунд: {{ game.round }}</div>
      <div>Хід: {{ game.turn }}</div>
      <div>Перемоги: Ти {{ game.roundsWon.player }} – {{ game.roundsWon.enemy }} Ворог</div>
    </div>

    <!-- Рука гравця -->
    <h2>Рука ворога</h2>
    <div class="hand">
      <Card
        v-for="card in enemy.hand"
        :key="card.id"
        :card="card"
        :class="{ clickable: game.turn === 'player' && !player.passed }"
        hide
        @click="playCardClick(card)"
      />
    </div>

    <!-- Поле ворога -->
    <h2>Поле ворога</h2>
    <div class="field">
      <Card v-for="card in enemy.board" :key="card.id" :card="card" />
    </div>

    <hr />

    <!-- Поле гравця -->
    <h2>Твоє поле</h2>
    <div class="field">
      <Card v-for="card in player.board" :key="card.id" :card="card" />
    </div>

    <hr />

    <!-- Рука гравця -->
    <h2>Твоя рука</h2>
    <div class="hand">
      <Card
        v-for="card in player.hand"
        :key="card.id"
        :card="card"
        :class="{ clickable: game.turn === 'player' && !player.passed }"
        @click="playCardClick(card)"
      />
    </div>

    <!-- Кнопки -->
    <div class="controls">
      <button @click="passRound" :disabled="game.turn !== 'player' || player.passed">
        Пас
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useGameStore } from '@/stores/game'
import { usePlayerStore } from '@/stores/player'
import { useEnemyStore } from '@/stores/enemy'
import Card from '@/components/Card.vue'
import type { Card as CardType } from '@/data/cards_gwent'

const game = useGameStore()
const player = usePlayerStore()
const enemy = useEnemyStore()

onMounted(() => {
  game.startGame()
})

function playCardClick(card: CardType) {
  if (game.turn !== 'player' || player.passed) return
  game.playerPlayCard(card.id)
}

function finishTurn() {
  console.log('🔹 Гравець завершує хід')
  // У нашій логіці "завершити хід" = просто нічого не грати,
  // а от "пас" явно передаємо в store
}

function passRound() {
  console.log('🔹 Гравець пасує')
  game.playerPass()
}
</script>

<style scoped>
.board {
  padding: 20px;
  font-family: sans-serif;
}

.stats {
  margin-bottom: 10px;
}

.field,
.hand {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 10px 0;
}

.controls {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 16px;
  cursor: pointer;
}

.clickable {
  cursor: pointer;
  transition: transform 0.2s;
}
.clickable:hover {
  transform: scale(1.05);
}
</style>
