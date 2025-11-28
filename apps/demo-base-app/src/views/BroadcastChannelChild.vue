<template>
  <h1>跨页签 BroadcastChannel 子页签</h1>
  <div class="body">
    <div class="card">
      <div class="card_body">
        <button @click="onCountClick">点击count++</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { channelEmitter } from '../utils/channelEmitter';

const count = ref(0);

function onCountClick() {
  channelEmitter
    .emit('setCount', count.value)
    .then(res => {
      count.value = res + 1;
    })
    .catch(err => {
      console.log('🚀 ~ BroadcastChannelChild.vue:20 ~ onCountClick ~ err:', err);
    });
}
</script>

<style scoped>
.body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
