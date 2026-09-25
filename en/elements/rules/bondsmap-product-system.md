# Quantis Bondsmap Product System

## Osnovanie

Sistema vydelena from prinyatoy versii `bondsmap_beta/bondsmap.html` posle iteratsiy 14 iyulya 2026 year. Sourceom geometrii header ostaetsya `elements/headers/bonds-map.html`. Ostalnye kontrakty razmeshcheny in `elements/assets/product-system.css`.

## Brend-palitra

| Token | Hex | Naznachenie |
|---|---:|---|
| Atlantic Navy | `#0F2233` | Osnovnoy tekst Quantis by umolchaniyu, glubokie poverkhnosti |
| Ocean Blue | `#15324A` | Header and temnye produktovye poverkhnosti |
| North Sea | `#274C63` | Osnovnye knopki, neaktivnyy kontur vybora |
| Deep Ocean | `#355E78` | Focus-state and vtorichnyy aktsent |
| Sea Foam | `#D8E2E7` | Sploshnoy fon produkta |
| Pure White | `#FFFFFF` | Tekst on osnovnykh deystviyakh, svetlye poverkhnosti |
| Lifebuoy Orange | `#FF6A00` | Vybrannoe sostoyanie and tochechnyy brendovyy aktsent |

Semanticheskie tsveta dinamiki: positive `#16815C`, negative `#C53D50`, neutral `#66707F`. On tsvetnoy podlozhke ispolzuetsya belyy tekst.

On temnom, gradientnom or tsvetnom fone znacheniya KPI vsegda nabirayutsya belym. Vsya kartochka KPI ne poluchaet semanticheskiy zelenyy or krasnyy kontur. Esli status dinamiki neobkhodimo vydelit, ispolzuetsya otdelnyy kompaktnyy beydzh with odnoznachnoy podpisyu. Zelenyy or krasnyy tekst neposredstvenno on temnoy kartochke ne ispolzuetsya.

Fon stranitsy formiruetsya odnim sloem `#D8E2E7`. Gradient, psevdoelement, vneshniy otstup `body` or neprozrachnyy fon kornevogo konteynera ne dolzhny sozdavat vtoruyu podlozhku by perimetru interfeysa.

Obshchie stili header ne dolzhny pereopredelyat nesvyazannye globalnye tokeny produkta. Teni kontentnykh kartochek zadayutsya in oblasti `.page` or konkretnogo komponenta. Group kartochek with krupnymi poluprozrachnymi tenyami ne razmeshchaetsya vnutri konteynera with `overflow:hidden`: nalozhenie and obrezanie teney formiruyut lozhnuyu pryamougolnuyu podlozhku.

## Geometriya

- vneshniy desktop-konteyner: until `2048px`, vnutrenniy otstup `clamp(18px, 3vw, 44px)`;
- osnovnoy mezhblochnyy shag: `12px`;
- header radius: `34px`;
- panel and filter-card radius: `28px`;
- field radius: `14px`;
- action height: `54px`, radius `27px`, font `14px/700`;
- field height: `44px`, font `14px/600`;
- minimalnaya zona kasaniya: `44px`;
- desktop-setka filtrov: `1.35fr 1fr 1fr 1fr`;
- tablet: dve ravnye kolonki;
- mobile: odna kolonka.

## Typeografika

Osnovnoy stek: `Graphik`, `Graphik LCG`, `Graphik LC`, `Graphik Web`, sistemnye fallback. Tekst in polyakh and nadpis `Select` dolzhny imet odinakovye computed styles. Pustoe pole poiska ne soderzhit placeholder. Vvedennoe polzovatelem znachenie ispolzuet tsvet `#111111`.

Osnovnoy tsvet teksta produktov Quantis — Atlantic Navy `#0F2233`. Drugoy tsvet primenyaetsya by semantike komponenta: belyy on temnoy or tsvetnoy poverkhnosti, muted-token for vtorichnykh podpisey, positive/negative for dinamiki and sostoyaniy.

## Komponentnye pravila

### Header

Ispolzovat gotovyy `elements/headers/bonds-map.html` and obshchie `header-system.css/js`. In karte bonds period by umolchaniyu — YTD. Ispolzuyutsya tri indeksa: RUSFAR, RGBI and USD/RUB. Tooltip and crosshair in mini-kartochkakh otsutstvuyut.

### Panel deystviy

`Add filter`, `Reset vse` and `Hide filters` ispolzuyut razmer 98 × 44 px. Osnovnoe deystvie ispolzuet North Sea, vtorichnye – svetluyu poverkhnost. On mobile knopki vyravnivayutsya by levomu krayu and razdelyayutsya intervalom 8 px; wrapper and klikabelnaya poverkhnost imeyut odinakovye granitsy, under nedostatke shiriny group perenositsya on sleduyushchuyu stroku.

### Filters

Search yavlyaetsya obychnoy udalyaemoy kartochkoy and ishchet by polnomu search blob. Otdelnyy synthetic search-card zapreshchen. Pustaya stroka ne soderzhit placeholder. Filter-card imeet obshchiy header with label and knopkoy udaleniya.

### Kategorialnyy vybor

Nativnyy checkbox skryt cherez `appearance: none`. Neaktivnoe sostoyanie — prozrachnyy krug 18×18 px with konturom North Sea. Aktivnoe sostoyanie — prozrachnyy krug with oranzhevym konturom and tsentralnoy tochkoy diametrom 8 px. Galochka and rozovye tsveta zapreshcheny.

### Menu dobavleniya

All dostupnye filtry formiruyutsya vertikalnym spiskom. For dropdown obyazatelno zadayutsya `white-space: normal`, odnokolonochnyy grid and `overflow: auto`. Nelzya nasledovat `nowrap` from `details` or toolbar.

### Tablitsa

Tablitsa ispolzuet spokoynuyu svetluyu poverkhnost. Chisla vyravnivayutsya vpravo and ispolzuyut tabular numerals. On uzkom ekrane tablitsa prokruchivaetsya gorizontalno vnutri sobstvennogo konteynera; viewport ne dolzhen poluchat gorizontalnoe perepolnenie.

## Accessibility and sostoyaniya

- u interaktivnykh elementov dolzhen byt vidimyy `:focus-visible`;
- remove-button imeet `aria-label`;
- dropdown realizuetsya cherez `details/summary` or ekvivalentnyy dostupnyy control;
- selected-state ne kodiruetsya tolko tsvetom: ispolzuetsya kontur plyus tsentralnaya tochka;
- `prefers-reduced-motion` otklyuchaet prodolzhitelnye transitions;
- `prefers-contrast: more` usilivaet granitsy.

## Priemka novogo produkta

1. Proverit desktop `1440px`, tablet `900px`, mobile `390px`.
2. Sverit computed width/height/radius/font vsekh controls.
3. Proverit open/close dropdown, add/remove/reset/collapse filtrov.
4. Proverit pustoy poisk and vvedennyy tekst.
5. Proverit selected/unselected/focus sostoyaniya krugovykh indikatorov.
6. Proverit otsutstvie viewport horizontal overflow.
7. Proverit fon `html`, `body`, `body::before`, `body::after`.
8. Zafiksirovat screenshot and `design-qa.md`.
