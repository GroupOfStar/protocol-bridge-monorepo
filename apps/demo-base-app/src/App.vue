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
      @load="ev => protocolCtx.onContainerLoaded(createWebChannelPlugin(ev))"></iframe>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { createWebChannelPlugin } from "protocol-bridge";
import { protocolCtx } from './utils/protocolBridge'

// 触发的事件
const eventName = ref('')
// 接受到的参数
const eventParams = ref('')
// 接受的消息
const eventResData = ref('')


onMounted(() => {
  protocolCtx.on('selectDate', (str, successCallback, errorCallback) => {
    eventName.value = 'selectDate'
    eventParams.value = str
    if (Math.random() > 0.5) {
      const res = `${str ?? ''}-${Math.random()}`
      eventResData.value = res
      successCallback(res)
    } else {
      errorCallback()
    }
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
})

onUnmounted(() => {
  protocolCtx.off()
})

function onClick() {
  // const newCount = count.value + 1
  // myIframeRef.value?.contentWindow?.postMessage(`ha ${count.value}`, '*')
  // const contentWindow = myIframeRef.value?.contentWindow
  // console.log('newCount :>> ', newCount);
  // if (contentWindow) {
  // handleSendMessage(contentWindow, `ha ${newCount}`).then(res => {
  //   count.value = newCount
  //   state.value = '成功'
  //   resInfo.value = res as string
  // }).catch(err => {
  //   state.value = '失败'
  //   console.log('vue err :>> ', err);
  //   resInfo.value = JSON.stringify(err, null, 2)
  // })
  // const channel = new MessageChannel();

  // const port1 = channel.port1;
  // port1.onmessage = function (event) {
  //   console.log('Received from iframe:', event.data);
  // };
  // contentWindow.postMessage({ type: '__init_port__' }, '*', [channel.port2])
  // }
}

</script>

<style scoped>
.body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.my-iframe {
  height: 500px;
  margin-top: 12px;
  margin-left: 24px;
}
</style>
