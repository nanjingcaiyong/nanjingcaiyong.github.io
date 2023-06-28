import { BlogTheme } from '@vegetable/theme'

import './style.css';

export default {
  ...BlogTheme,
  enhanceApp(ctx) {
    BlogTheme.enhanceApp(ctx)
  }
}