# Audit otcheta by portfelyu korotkikh bonds

Date provedeniya: 14 iyulya 2026 year.

## Osnovanie

Provereny vosproizvodimost dizayna from Python-generatora, polnota zhurnala operatsiy, sopostavlenie with benchmarkami, sortirovka kreditnykh reytingov and vizualnaya tselostnost istorii model portfolio.

## Vyyavlennaya oshibka zhurnala operatsiy

Issue `RU000A106HF5` — ELRESh 1R1 — byl priobreten 18 iyunya 2026 year in kolichestve 52 lotov. Net tsena pokupki sostavila 99,39% of par, gryaznaya tsena — 1 018,50 RUB. on obligatsiyu, obshchiy turnover — 52 962,00 RUB.

Operatsiya prisutstvovala in kanonicheskom lock-fayle kak chast sobytiya `final_snapshot`. Funktsiya formirovaniya HTML isklyuchala vse sobytiya dannogo tipa from vidimogo zhurnala. Vsledstvie etogo pozitsiya otobrazhalas in sostave portfolio and under pogashenii 6 iyulya 2026 year, a pokupka 18 iyunya 2026 year otsutstvovala in otchetnosti.

Ispravlenie: sobytie 18 iyunya vklyucheno in zhurnal kak «Rebalans model portfolio». In nem otrazheny vosem zakrytiy prezhnego sostava and vosem pokupok novogo sostava, vklyuchaya ELRESh 1R1.

## Kontrol tranzaktsionnoy tselostnosti

In generator dobavlen obyazatelnyy raschetnyy gate. For kazhdoy kontrolnoy daty proveryaetsya ravenstvo:

`predydushchiy sostav − zakrytye pozitsii + pokupki = sostav posle operatsii`.

Dopolnitelno sveryayutsya kolichestvo and summa kazhdoy pokupki, summa investirovaniya, chislo positions, cash ostatok, stoimost aktivov and itogovyy kapital.

By itogam proverki:

- sobytiy provereno — 17;
- pokupok provereno — 33;
- zakrytiy and pogasheniy provereno — 25;
- neobyasnimykh poyavleniy, ischeznoveniy and izmeneniy kolichestva — 0;
- status — `passed`.

Polnyy mashinnyy zhurnal sokhranen in `transaction_ledger.json`.

## Izmeneniya otcheta

- In grafik and sravnitelnuyu tablitsu dobavlen BPIF «Alfa-Equity Upravlyaemye bonds» — `AKMB`.
- Tsvet strategii izmenen on Lifebuoy Orange `#FF6A00`.
- Tsvet RGBI TR izmenen on Atlantic Navy `#0F2233`.
- Tsvet RUCB TRNS izmenen on North Sea `#274C63`.
- Tsvet AKMB ustanovlen by krasnoy palitre Alfa-Banka — `#EF3124`.
- Podpis osi sravnitelnogo grafika izmenena on «Rebased to 1.0».
- Blok valyutnoy struktury udalen from DOM, JavaScript and generatora.
- Parametry strategii, metodika otbora and rasshifrovka Discount–Annualised return obedineny in odin kompaktnyy razdel.
- Mezhdu kartochkami sobytiy ustanovlen vertikalnyy interval 24 px.
- For reytingov vveden predmetnyy poryadok `AAA → AA+ → AA → AA- → A+ → … → BB-`.
- Deystvuyushchiy header, lokalnyy Plotly and obshchaya biblioteka kartochek aktivov pereneseny in Python-generator.

## Kontrol vosproizvodimosti and interfeysa

Generator povtorno zapushchen from kataloga Design Lab. Itogovyy HTML sformirovan without obrashcheniya to CDN and without sozdaniya lokalnykh dubley kartochek aktivov.

Proverka in brauzere vypolnena on razresheniyakh 1280 × 720 and 390 × 844:

- gorizontalnoe perepolnenie — 0 px;
- Plotly-grafikov — 20;
- kartochek sobytiy — 17;
- interval mezhdu sosednimi sobytiyami — 24 px;
- uzlov valyutnoy struktury — 0;
- oshibok and preduprezhdeniy konsoli — 0;
- pokupka `RU000A106HF5` from 18 iyunya 2026 year otobrazhaetsya in zhurnale;
- mobile-legenda benchmarkov sokrashchena until «Strategy», `RGBI TR`, `RUCB TRNS`, `AKMB`.

## Ogranicheniya

Credit ratingand in istoricheskom teste ostayutsya tekushchim spravochnikom, vsledstvie chego sokhranyaetsya risk retrospektivnogo znaniya. Komissii, nalogi, proskalzyvanie and glubina stakana in calculation ne vklyucheny. Kanonicheskiy lock-fayl ne izmenyalsya; ispravlena polnota predstavleniya uzhe zafiksirovannykh operatsiy and dobavlen kontrol posleduyushchikh izmeneniy sostava.

