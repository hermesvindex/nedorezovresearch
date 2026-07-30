# Portfolio Manager Design Lock

Актуальный HTML и генератор синхронизированы 14.07.2026.

Перед любым запуском `build_portfolio_interactive.py` требуется:

1. сравнить header в `build_html()` с `elements/headers/portfolio-constructor.html`;
2. проверить подключение `portfolio-header-design.css`;
3. проверить общий URL карточек `../asset_cards/<SECID>.html`;
4. не генерировать локальный `portfolio_manager_interactive/asset_cards/`;
5. зафиксировать копию текущего HTML до сборки;
6. после сборки выполнить HTTP-проверку header, таблицы, donut, drawer и консоли.

Запуск полного генератора для обычной CSS/HTML-правки не требуется.
