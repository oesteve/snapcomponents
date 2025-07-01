## Product Card Widget

<wg-product-card image="/images/products/apple-watch.png"
                 price="599"
                 title="Apple Watch Series 7 GPS, Aluminium Case, Starlight Sport">
</wg-product-card>

### Description

A product card widget that displays product information in an attractive card format. It shows the product image, title,
rating, price, and an "Add to cart" button.

### Props/Attributes

| Prop/Attribute | Type   | Description                      |
|----------------|--------|----------------------------------|
| image          | string | URL of the product image         |
| title          | string | Title/name of the product        |
| price          | number | Price of the product (without $) |

## Usage Example

```html
<!-- Basic product card -->
<wg-product-card
    image="/images/products/apple-watch.png"
    price="599"
    title="Apple Watch Series 7 GPS, Aluminium Case, Starlight Sport"
></wg-product-card>
```
