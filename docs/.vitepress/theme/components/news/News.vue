<template>
  <div>
    <Card 
      v-for="item in news"
      :data="item"
      class="mb-[25px]"
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