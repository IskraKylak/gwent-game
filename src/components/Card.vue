<template>
  <div>
    <div class="Сard" v-if="!hide">
      <div class="Сard-content">
        <div class="Сard-name">{{ card.name }}</div>
        <div class="Сard-power">{{ card.power }}</div>
        <div class="Сard-type">({{ card.type }})</div>
        <div v-if="card.ability" class="Сard-magic">⚡</div>
      </div>
    </div>
    <div class="Сard" v-else>
      <div class="Сard-content">
        Рубашка карти
      </div>
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

<style scoped lang="scss">
.Сard {
  width: adaptive(110);   // еквівалент 50px на 1920px
  height: adaptive(140);  // еквівалент 80px на 1920px
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background: #57441a;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: transform 0.2s;
  position: relative;
  padding: adaptive(5);

  &-content {
    position: absolute;
    width: calc(100% - adaptive(10));
    height: calc(100% - adaptive(10));
    background: #d2a1e1;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: adaptive(18);
  }

  &-power {
    font-size: adaptive(14);
    background: rgb(201, 3, 3);
    text-align: center;
    border-radius: 50%;
    color: #fff;
    position: absolute;
    bottom: adaptive(-10);
    left: adaptive(-10);
    height: adaptive(30);
    width: adaptive(30);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  &-magic {
    font-size: adaptive(14);
    background: rgb(151, 151, 236);
    text-align: center;
    border-radius: 50%;
    position: absolute;
    bottom: adaptive(-10);
    right: adaptive(-10);
    height: adaptive(30);
    width: adaptive(30);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  &-name {
    font-weight: bold;
    font-size: adaptive(14);
    border: 1px solid #333;
    border-radius: 4px;
    width: calc(100% - adaptive(20));
    top: adaptive(-15);
    background: #f4f4f4;
    position: absolute;
    z-index: 20;
    text-align: center;
    line-height: 100%;
    padding: 3px;
    white-space: nowrap;       /* текст в один рядок */
    overflow: hidden;          /* обрізати все, що не вміщається */
    text-overflow: ellipsis;
  }
}

.card:hover {
  transform: scale(1.05);
  background: #fff8dc;
}

.card-power {
  font-size: adaptive(18);
  color: darkred;
  text-align: center;
}

.card-type {
  font-size: adaptive(12);
  text-align: right;
  color: gray;
}
</style>
