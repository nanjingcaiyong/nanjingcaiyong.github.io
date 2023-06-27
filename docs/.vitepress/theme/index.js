import DefaultTheme from 'vitepress/theme';
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
  enhanceApp({ app }) {
    Object.keys(components)
      .map(name => app.component(name, components[name]))
  }
}