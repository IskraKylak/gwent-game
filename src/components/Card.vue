<template>
  <div>
    <div class="card" v-if="!hide">
      <div class="card-name">{{ card.name }}</div>
      <div class="card-power">⚡ {{ card.power }}</div>
      <div class="card-type">({{ card.type }})</div>
    </div>
    <div class="card" v-else>
      Рубашка карти
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Card } from '@/data/cards_gwent'

defineProps<{
  card: Card
  hide?: boolean
}>()
</script>

<style scoped>
.card {
  width: 100px;
  height: 140px;
  border: 2px solid #333;
  border-radius: 8px;
  padding: 6px;
  background: #f4f4f4;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: transform 0.2s;
}

.card:hover {
  transform: scale(1.05);
  background: #fff8dc;
}

.card-name {
  font-weight: bold;
  font-size: 14px;
}

.card-power {
  font-size: 18px;
  color: darkred;
  text-align: center;
}

.card-type {
  font-size: 12px;
  text-align: right;
  color: gray;
}
</style>
