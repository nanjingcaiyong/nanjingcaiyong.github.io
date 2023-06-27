import DefaultTheme from 'vitepress/theme';
// import { h } from 'vue';
import { 
  ElCarousel,
  ElCard,
  ElCarouselItem,
  ElPopover,
  ElTimeline,
  ElTimelineItem,
  ElPagination
 } from 'element-plus';
import 'element-plus/dist/index.css';
import { Carousel, News, Menu } from './components';
import { Home } from './pages/home';
import { About } from './pages/about';
import './style.css';

// export function withConfigProvider(App) {
//   return defineComponent({
//     name: 'ConfigProvider',
//     props: {
//       handleChangeSlogan: {
//         type: Function,
//         required: false
//       }
//     },
//     setup(props, { slots }) {
//       provide(homeConfigSymbol, props)

//       const { theme } = useData()
//       const config = computed(() => resolveConfig(theme.value))
//       provide(configSymbol, config)
//       provide(
//         userWorks,
//         ref(
//           config.value.blog?.works || {
//             title: '',
//             description: '',
//             list: []
//           }
//         )
//       )

//       const activeTag = ref({
//         label: '',
//         type: ''
//       })
//       provide(activeTagSymbol, activeTag)

//       const pageNum = ref(1)
//       provide(currentPageNum, pageNum)
//       return () => h(App, null, slots)
//     }
//   })
// }

const components = {
  ElCarousel,
  ElCard,
  ElCarouselItem,
  ElPopover,
  ElTimeline,
  ElTimelineItem,
  ElPagination,
  News,
  Home,
  Carousel,
  About,
  Menu
}
export default {
  ...DefaultTheme,
  // Layout: h(Layout),
  enhanceApp({ app }) {
    Object.keys(components)
      .map(name => app.component(name, components[name]))
  }
}