# Quantis Design Lab — Component Collection

Papka soderzhit edinuyu kollektsiyu khederov and produktovykh UI-komponentov Quantis.

## Composition

- `index.html` — vitrina vsekh gotovykh khederov;
- `assets/header-system.css` — obshchiy vizualnyy kontrakt, tokeny, adaptivnost and Liquid Glass;
- `assets/header-system.js` — pereklyuchateli, sinkhronizatsiya znacheniy and mini-grafiki;
- `assets/product-system.css` — produktovye tokeny, knopki, filtry, dropdown, tablitsa and paginatsiya;
- `assets/product-system.js` — sostoyaniya vybora, add/remove/reset/collapse and demo-poisk;
- `headers/` — chetyre samostoyatelnykh gotovykh khedera;
- `systems/` — polnye interaktivnye UI-kit vitriny;
- `rules/` — komponentnye kontrakty and acceptance criteria;
- `components/` — chistye HTML-fragmenty for sborki novykh variantov.

## Produktovye sistemy

- `systems/bondsmap-product-kit.html` — palitra, geometriya, actions, filters, choice states, table and pagination;
- `rules/bondsmap-product-system.md` — pravila primeneniya in novykh produktakh.

## Gotovye khedery

- `headers/bonds-map.html`;
- `headers/heatmap.html`;
- `headers/portfolio-constructor.html`;
- `headers/short-bonds-portfolio.html`.

## Details konstruktora

- `components/header-copy.html` — nadkategoriya, zagolovok and opisanie;
- `components/period-segmented-control.html` — vybor perioda;
- `components/currency-segmented-control.html` — vybor valyuty;
- `components/date-field.html` — pole gorizonta;
- `components/information-strip.html` — informatsionnye plashki;
- `components/market-indicator-card.html` — indeksnaya kartochka with grafikom;
- `components/metric-card.html` — kompaktnaya KPI-kartochka.
- `components/product-action-bar.html` — group from trekh produktovykh deystviy;
- `components/search-filter-card.html` — edinyy udalyaemyy poisk;
- `components/enum-filter-card.html` — kategorialnyy filtr;
- `components/brand-choice-list.html` — brendovye krugovye selected/unselected states;
- `components/delta-badges.html` — positive/negative/neutral izmeneniya;
- `components/product-table.html` — tablichnaya poverkhnost;
- `components/product-pagination.html` — paginatsiya with osnovnoy knopkoy.
- `asset_close_button.html` — samostoyatelnaya Liquid Glass-knopka zakrytiya kartochki, 46×46 pikseley.

## Podklyuchenie

In tselevoy HTML podklyuchit:

```html
<link rel="stylesheet" href="assets/header-system.css">
<script src="assets/header-system.js" defer></script>
```

Posle podklyucheniya mozhno kopirovat nuzhnye fragmenty from `components/` or gotovyy kheder from `headers/`. Znacheniya, identifikatory and `data-points` zamenyayutsya dannymi konkretnogo proekta.

For produktovykh komponentov podklyuchit:

```html
<link rel="stylesheet" href="assets/product-system.css">
<script src="assets/product-system.js" defer></script>
```
