import ChatComponent from './ChatComponent';
import { createWebComponent } from '@/widgets/utils/createWebComponent.ts';

// Register the chat component as a web component
createWebComponent({
  tagName: 'wg-chat',
  component: ChatComponent,
  onConnected: (el) => {
      // Set as float
      el.style.position = 'fixed';
      el.style.bottom = '40px';
      el.style.right = '40px';
      el.style.zIndex = '100';
  }
});
