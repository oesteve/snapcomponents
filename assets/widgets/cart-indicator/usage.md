## Cart Indicator Widget

<wg-cart-indicator initial-value="3"></wg-cart-indicator>

### Description

A cart indicator widget that displays the number of items in a shopping cart. It shows a shopping cart icon with a badge indicating the item count, and provides buttons to increment and decrement the count.

### Props/Attributes

| Prop/Attribute | Type   | Default | Description                                |
|----------------|--------|---------|--------------------------------------------|
| initial-value  | number | 0       | The starting value for the cart item count |

### Usage Example

```html
<!-- Basic cart indicator starting at 0 -->
<wg-cart-indicator></wg-cart-indicator>

<!-- Cart indicator with custom initial value -->
<wg-cart-indicator initial-value="3"></wg-cart-indicator>
```
