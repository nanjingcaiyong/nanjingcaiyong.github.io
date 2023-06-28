<template>
  <div>
    <Card 
      v-for="(item, index) in news"
      :data="item"
      :class="{'mb-[25px]': index < news.length - 1}"
    />
  </div>
</template>
<script>
import Card from './Card.vue';
import { defineComponent, inject, toRefs } from 'vue';
export default defineComponent({
  name: 'NewsCard',
  components: { Card },
  setup () {
    const state = inject('store')
    return {
      ...toRefs(state)
    }
  }
})
</script>