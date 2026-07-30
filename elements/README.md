# Quantis Design Lab — Component Collection

Папка содержит единую коллекцию хедеров и продуктовых UI-компонентов Quantis.

## Структура

- `index.html` — витрина всех готовых хедеров;
- `assets/header-system.css` — общий визуальный контракт, токены, адаптивность и Liquid Glass;
- `assets/header-system.js` — переключатели, синхронизация значений и мини-графики;
- `assets/product-system.css` — продуктовые токены, кнопки, фильтры, dropdown, таблица и пагинация;
- `assets/product-system.js` — состояния выбора, add/remove/reset/collapse и demo-поиск;
- `headers/` — четыре самостоятельных готовых хедера;
- `systems/` — полные интерактивные UI-kit витрины;
- `rules/` — компонентные контракты и acceptance criteria;
- `components/` — чистые HTML-фрагменты для сборки новых вариантов.

## Продуктовые системы

- `systems/bondsmap-product-kit.html` — палитра, геометрия, actions, filters, choice states, table и pagination;
- `rules/bondsmap-product-system.md` — правила применения в новых продуктах.

## Готовые хедеры

- `headers/bonds-map.html`;
- `headers/heatmap.html`;
- `headers/portfolio-constructor.html`;
- `headers/short-bonds-portfolio.html`.

## Детали конструктора

- `components/header-copy.html` — надкатегория, заголовок и описание;
- `components/period-segmented-control.html` — выбор периода;
- `components/currency-segmented-control.html` — выбор валюты;
- `components/date-field.html` — поле горизонта;
- `components/information-strip.html` — информационные плашки;
- `components/market-indicator-card.html` — индексная карточка с графиком;
- `components/metric-card.html` — компактная KPI-карточка.
- `components/product-action-bar.html` — группа из трёх продуктовых действий;
- `components/search-filter-card.html` — единый удаляемый поиск;
- `components/enum-filter-card.html` — категориальный фильтр;
- `components/brand-choice-list.html` — брендовые круговые selected/unselected states;
- `components/delta-badges.html` — positive/negative/neutral изменения;
- `components/product-table.html` — табличная поверхность;
- `components/product-pagination.html` — пагинация с основной кнопкой.
- `asset_close_button.html` — самостоятельная Liquid Glass-кнопка закрытия карточки, 46×46 пикселей.

## Подключение

В целевой HTML подключить:

```html
<link rel="stylesheet" href="assets/header-system.css">
<script src="assets/header-system.js" defer></script>
```

После подключения можно копировать нужные фрагменты из `components/` или готовый хедер из `headers/`. Значения, идентификаторы и `data-points` заменяются данными конкретного проекта.

Для продуктовых компонентов подключить:

```html
<link rel="stylesheet" href="assets/product-system.css">
<script src="assets/product-system.js" defer></script>
```
