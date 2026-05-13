import icon from 'astro-icon';
console.log('Default export:', typeof icon);
import * as iconModule from 'astro-icon';
console.log('All exports:', Object.keys(iconModule));
