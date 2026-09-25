# Aktualnye fayly proekta

Date aktualizatsii: 14 iyulya 2026 year.

## Osnovnye fayly

- `mature_bonds_report.html` — itogovyy interaktivnyy otchet.
- `generate_report.py` — generator otcheta, universalnykh kartochek and JSON-sloya.
- `backtest_runtime.py` — raschetnaya logika otbora, denezhnykh potokov and istoricheskogo testa.
- `mature_bonds_report_data.json` — strukturirovannye data itogovogo otcheta.
- `transaction_ledger.json` — polnyy mashinnyy zhurnal pokupok, prodazh, pogasheniy and sostava posle kazhdoy operatsii.
- `audit_report_2026-07-14.md` — rezultaty raschetnogo, tranzaktsionnogo and vizualnogo audita.
- `mature_bonds_report.ipynb` — vosproizvodimyy scenario formirovaniya otcheta.
- `portfolio_lock_2026-06-18.json` — kanonicheskiy neizmenyaemyy srez sostava, istorii sdelok, krivoy kapitala and benchmarkov by 18 iyunya 2026 year.
- `freeze_portfolio.py` — odnorazovyy sluzhebnyy scenario pervichnoy fiksatsii; povtornaya zapis sushchestvuyushchego lock-fayla zapreshchena.
- `../asset_cards/` — obshchaya biblioteka kartochek aktivov Design Lab; lokalnye dubli in kataloge otcheta ne formiruyutsya.
- `assets/background-water.png` — fonovaya tekstura from deystvuyushchey dizayn-sistemy.

## Kontrolnaya date

- Date kanonicheskoy fiksatsii: 18 iyunya 2026 year.
- Portfolio value on datu fiksatsii: 1 514 156,62 RUB.
- Chislo zafiksirovannykh sobytiy: 13.
- Iskhodnyy kapital: 1 000 000 RUB.

Istoriya by 18 iyunya 2026 year chitaetsya from lock-fayla and proveryaetsya by SHA-256. Novye sobytiya dobavlyayutsya tolko posle daty fiksatsii. Pered zapisyu otcheta generator sveryaet vse izmeneniya sostava with zhurnalom operatsiy. Povrezhdenie lock-fayla or nesvodimost tranzaktsiy privodit to ostanovke generatsii.
