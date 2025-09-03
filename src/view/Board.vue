<template>
  <div class="Board">
    <!-- Статистика -->
    <div class="Board-stats">
      <div class="Board-top">
        🤖 Ворог ({{ enemy.race }}): {{ enemy.score }} 
        <span v-if="enemy.passed">(Пас)</span>
      </div>
      <div class="Board-middle">
        <div>Раунд: {{ game.round }}</div>
        <div>Хід: {{ game.turn }}</div>
        <div>Перемоги: Ти {{ game.roundsWon.player }} – {{ game.roundsWon.enemy }} Ворог</div>
      </div>
      <div class="Board-bottom">
        👤 Ти ({{ player.race }}): {{ player.score }}
        <span v-if="player.passed">(Пас)</span>
        <button @click="passRound" :disabled="game.turn !== 'player' || player.passed">
          Пас
        </button>
      </div>
    </div>
    <div class="Board-field">
            <!-- Рука ворога -->
      <h2 class="Board-title">Рука ворога</h2>
      <div class="Board-handEnemy">
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
      <div class="Board-battlefield">
        <img class="Board-fieldImage" src="@/assets/img/2.jpg" alt="img">
        <Card v-for="card in enemy.board" :key="card.id" :card="card" />
      </div>

      <div class="Board-battlefield">
        <img class="Board-fieldImage" src="@/assets/img/1.webp" alt="img">
        <Card v-for="card in player.board" :key="card.id" :card="card" />
      </div>

      <!-- Рука гравця зі слайдером -->
      <h2 class="Board-title">Твоя рука</h2>
      <Swiper
        :slides-per-view="5"
        :grab-cursor="true"
        pagination
        class="Board-mySwiper"
      >
        <SwiperSlide v-for="card in player.hand" :key="card.id">
          <Card
            :card="card"
            :class="{ clickable: game.turn === 'player' && !player.passed }"
            @click="playCardClick(card)"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Swiper, SwiperSlide } from "swiper/vue"

import "swiper/css"
import "swiper/css/pagination"

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
}

function passRound() {
  console.log('🔹 Гравець пасує')
  game.playerPass()
}
</script>

<style scoped lang="scss">
.Board {
  padding: adaptive(20);
  font-family: sans-serif;
  display: grid;
  grid-template-columns: adaptive(200) 1fr;
  width: 100%;

  &-separator {
    border: none;
    border-top: 2px solid #ccc;
    margin: adaptive(10) 0;
    width: 100%;
  }

  &-title {
    font-size: adaptive(22);
    font-weight: bold;
    margin-bottom: adaptive(10);
  }

  &-stats {
    margin-bottom: adaptive(10);
  }

  &-field {
    display: flex;
    flex-direction: column;
    gap: adaptive(10);
    flex-wrap: wrap;
    margin: adaptive(10) auto;
    width: adaptive(1000);
    padding: adaptive(10);
    border: 4px solid #404637;
    background: #e9ece1;
  }

  &-battlefield {
    display: flex;
    gap: adaptive(10);
    align-items: center;
    flex-wrap: wrap;
    height: adaptive(180);
    overflow: hidden;
    position: relative;
    border: 5px solid #ccc;
    padding: adaptive(10);
  }

  &-fieldImage {
    width: 100%;
    height: auto;
    position: absolute;
    object-fit: cover;
    left: 0;
  }

  &-handEnemy {
    display: flex;
    gap: adaptive(10);
    margin-bottom: adaptive(15);
    overflow: hidden;
    padding: adaptive(10);
  }

  /* Рука тепер у Swiper */
  &-mySwiper {
    width: 100%;
    padding: adaptive(10);
  }

  &-controls {
    margin-top: adaptive(15);
    display: flex;
    gap: adaptive(10);
  }

  &-button {
    padding: adaptive(8) adaptive(16);
    cursor: pointer;
  }

  &-clickable {
    cursor: pointer;
    transition: transform 0.2s;
  }

  &-clickable:hover {
    transform: scale(1.05);
  }

  &-stats {
    flex-direction: column;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: adaptive(600);
    padding: adaptive(10);
    border: 4px solid #ee940e;
    background: #f3cb90;
    font-size: adaptive(20);
    margin: auto;
  }
}
</style>
