<template>
  <div class="body">
    <h1>postMessage 测试</h1>
    <div class="card">
      <div class="card_body">
        <div>
          <p>触发的事件: {{ eventName }}</p>
          <p>接受到的参数: {{ eventParams }}</p>
          <p>返回的值: {{ eventResData }}</p>
        </div>
      </div>
    </div>
    <iframe src="http://localhost:6173/" frameborder="0" class="my-iframe"
      @load="ev => protocolCtx.onContainerLoaded(createWebChannelPlugin(ev))"
      :style="{ minHeight: `${minIframeHeight ?? 0}px` }"></iframe>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { createWebChannelPlugin } from "protocol-bridge";
import { protocolCtx } from './utils/protocolBridge'

// iframe的高度
const minIframeHeight = ref(0)
// 触发的事件
const eventName = ref('')
// 接受到的参数
const eventParams = ref('')
// 接受的消息
const eventResData = ref('')

onMounted(() => {
  protocolCtx.on('resize', (str, successCallback) => {
    minIframeHeight.value = str
    successCallback()
  })

  protocolCtx.on('showLoading', (str, successCallback, errorCallback) => {
    eventName.value = 'showLoading'
    eventParams.value = str ?? ''
    if (Math.random() > 0.5) {
      eventResData.value = `${str ?? ''}-${Math.random()}`
      successCallback()
    } else {
      errorCallback()
    }
  })

  protocolCtx.on('selectDate', (str, successCallback, errorCallback) => {
    eventName.value = 'selectDate'
    eventParams.value = str
    if (Math.random() > 0) {
      const res = `${str ?? ''}-${Math.random()}`
      eventResData.value = res
      successCallback(res)
    } else {
      errorCallback()
    }
  })
})

onUnmounted(() => {
  protocolCtx.off()
})
</script>

<style scoped>
.body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.my-iframe {
  margin-top: 12px;
  margin-left: 24px;
}
</style>
