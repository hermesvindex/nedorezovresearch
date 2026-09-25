# Portfolio Manager Design Lock

Aktualnyy HTML and generator sinkhronizirovany 14.07.2026.

Pered lyubym zapuskom `build_portfolio_interactive.py` trebuetsya:

1. sravnit header in `build_html()` with `elements/headers/portfolio-constructor.html`;
2. proverit podklyuchenie `portfolio-header-design.css`;
3. proverit obshchiy URL kartochek `../asset_cards/<SECID>.html`;
4. ne generirovat lokalnyy `portfolio_manager_interactive/asset_cards/`;
5. zafiksirovat kopiyu current HTML until sborki;
6. posle sborki vypolnit HTTP-proverku header, tablitsy, donut, drawer and konsoli.

Zapusk polnogo generatora for obychnoy CSS/HTML-pravki ne trebuetsya.
