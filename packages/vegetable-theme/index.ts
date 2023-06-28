import DefaultTheme from 'vitepress/theme';
import { Theme } from 'vitepress'
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
import { Carousel, News, Menu } from './src/components';
import { Home } from './src/pages/home';
import { About } from './src/pages/about';
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
export const BlogTheme: Theme = {
  ...DefaultTheme,
  enhanceApp({app}) {
    Object.keys(components)
      .map(name => app.component(name, components[name]))
  }
}

export default BlogTheme;