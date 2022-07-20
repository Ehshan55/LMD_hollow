# Nodejs version used
v14.15.0

# NPM version
6.14.8

# Start
```
nodemon app.js
```

or

```
npm run nextdev
```

# Script tag

places where you need to update in `themes_script.js` :

```
let themes = [
    {
        name: 'debut',
        collectionPageMainSelectors: ['#Collection .medium-up--one-quarter', '#Collection .medium-up--one-fifth'],
        productPageMainSelectors: ['.grid__item.product-single__media-group.medium-up--one-half']
    },
    {
        name: 'venture',
        collectionPageMainSelectors: ['#MainContent .medium-up--one-quarter', '#MainContent .medium-up--one-fifth'],
        productPageMainSelectors: ['.product-single__media-wrapper', '.grid.product-single .photos']
    }
]
```

and

```
switch(currentTheme) {
    case 'debut':
        style = debutStyle(pp_image_zoom, cp_image_zoom, pp_thumbnail_position, themes[themeIndex]);
        break;
    case 'venture':
        style = ventureStyle(pp_image_zoom, cp_image_zoom, pp_thumbnail_position, themes[themeIndex]);
        break;
    default:
        break;
}
```

then add method for each theme just like
`ventureStyle` and `debutStyle`


# Adding script tag to store

1. Open the app's settings page
2. Enable zoom for collection/product page
3. Hit Save