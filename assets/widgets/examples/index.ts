import SimpleCounter from './SimpleCounter';
import { createWebComponent } from '../utils/createWebComponent';

// Register the SimpleCounter component as a web component
createWebComponent({
  tagName: 'wg-counter',
  component: SimpleCounter,
  observedAttributes: ['initial-value', 'label'],
  mapAttributesToProps: (el) => {
    // Convert HTML attributes to React props
    const initialValue = el.hasAttribute('initial-value')
      ? parseInt(el.getAttribute('initial-value')!, 10)
      : 0;

    const label = el.hasAttribute('label')
      ? el.getAttribute('label')!
      : 'Counter';

    return { initialValue, label };
  }
});

console.log('SimpleCounter web component registered as wg-counter');
