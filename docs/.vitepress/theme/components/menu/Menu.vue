<template>
  <main class="doc-menu">
    <div 
      class="vp-doc _large-front-end_css_" 
      style="position: relative;"
    >
      <div>
        <h1 :id="menu.title" tabindex="-1">
          {{ menu.title }} <a class="header-anchor" :href="`#${menu.title}`" aria-hidden="true">#</a>
        </h1>
        <p>{{ menu.description }}</p>
        <template v-if="list.length > 0">
          <h2 id="目录" tabindex="-1">目录<a class="header-anchor" href="#目录" aria-hidden="true">#</a></h2>
          <ul>
            <li v-for="item in list">
              <a :href="item.link">{{ item.title }}</a>
            </li>
          </ul>
        </template>
        <p v-else>努力写作中……</p>

      </div>
    </div>
    <el-pagination 
      v-if="totalPage > 1"
      :page-count="totalPage"
      :page-size="pageSize"
      class="mt-[50px]"
      background
      layout="prev, pager, next"
      @current-change="onChangePage"
    />
  </main>
</template>

<script>
import { defineComponent } from 'vue';
import { useData } from 'vitepress';
import { reactive, toRefs } from 'vue';
export default defineComponent({
  setup() {
    const { page } = useData();
    const state = reactive({
      pageIndex: 1,
      pageSize: 15,
      totalPage: 0,
      list: [],
    })
    const menu = page.value?.frontmatter?.menu || []
    state.totalPage = Math.ceil((menu.list?.length || 0) / state.pageSize);
    console.log(state.totalPage)
   
    const onChangePage = (index) => {
      state.pageIndex = index;
      queryList(index)
    }
   
    const queryList = (pageIndex) => {
      const skip = (pageIndex - 1) * state.pageSize;
      state.list = (menu.list || []).slice(skip, skip + state.pageSize)
    }
    queryList(state.pageIndex)
    return {
      menu,
      onChangePage,
      ...toRefs(state)
    }
  }
})
</script>

<style>
.doc-menu {
  max-width: 768px;
  width: 100%;
  margin: auto;
  padding: 0 16px;
  padding-top: 20px;
}

@media screen and (min-width: 768px) {
  .doc-menu {
    padding-top: 50px;
  }
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: var(--vp-c-brand);
}
</style>