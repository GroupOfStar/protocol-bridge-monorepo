<template>
  <h1>跨页签 BroadcastChannel 测试</h1>
  <div class="card">
    <div class="card_body">
      <div>
        <router-link to="/broadcastChannelChild" target="_blank" tag="button">打开子页签</router-link>
        <div>{{ count }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { channelEmitter } from '../utils/channelEmitter';

const count = ref(0);

onMounted(() => {
  channelEmitter.on('setCount', (data, successCallback) => {
    count.value = data;
    successCallback(data);
  });
});

onUnmounted(() => {});
</script>
