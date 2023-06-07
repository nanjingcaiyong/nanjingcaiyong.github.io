import DefaultTheme from 'vitepress/theme';
import { ElCarousel, ElCard, ElCarouselItem } from 'element-plus';
import 'element-plus/dist/index.css';
import { Carousel, News } from './components';
import { Home } from './pages/home'
// import './tailwindcss.css'
import './style.css'
export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('ElCarousel', ElCarousel);
    app.component('ElCard', ElCard)
    app.component('ElCarouselItem', ElCarouselItem)
    app.component('Carousel', Carousel);
    app.component('News', News)
    app.component('Home', Home)
  }
}