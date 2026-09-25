# Audit polnoty and strukturnoy tselostnosti dannykh

Date formirovaniya: 2026-07-20T23:51:38+03:00
Status strukturnoy proverki: **PASS**.

## Osnovanie

Proverka vypolnena posle sverki iskhodnogo kataloga `smart` with bibliotekoy otchetnosti and stranitsami proekta Statements.

## Result vosstanovleniya

- Issuers: 179 → 217; izmenenie +38 (+21.2%).
- Iskhodnye CSV: 822.
- Aktivnye versii faylov: 814.
- Arkhivnye dubli versiy: 8.
- Neraspoznannye iskhodnye fayly: 0.
- Zapisi pokazateley: 546 589.
- Sformirovannye stranitsy issuers: 217.

## Kontrolnye proverki

- unmatched source files: 0.
- duplicate tickers: 0.
- missing company JSON files: 0.
- missing company HTML pages: 0.
- duplicate metric grains: 0.
- tickers with several source entities: 0.

## Prichiny prezhnego sokrashcheniya vyborki

1. Sopostavlenie ispolzovalo polnoe normalizovannoe naimenovanie from spravochnika torgovykh instrumentov. Sostavnye nazvaniya istochnikov, vklyuchaya `X5 | IKS 5`, `OZON | OZON` and `VK | VK`, ne prokhodili tochnoe sopostavlenie.
2. Korotkie naimenovaniya mogli oshibochno uchastvovat in nechetkom poiske. In chastnosti, `En+` sozdavalo risk sopostavleniya with Arenadata.
3. Neskolko istoricheskikh and nepublichnykh sushchnostey otsutstvovali in tekushchem spravochnike torgovykh instrumentov and trebovali yavnogo reestra metadannykh.
4. Povtorno vygruzhennye fayly with suffiksom versii uchityvalis kak samostoyatelnye istochniki.

## Ogranicheniya

Audit podtverzhdaet polnotu perenosa faylov, unikalnost strukturnogo zerna and otsutstvie smesheniya iskhodnykh sushchnostey. Ekonomicheskoe soderzhanie vsekh pokazateley ne sveryalos postrochno with pervichnymi formami otchetnosti issuers. For istoricheskikh and nepublichnykh sushchnostey ISIN ostaetsya pustym, esli nadezhnyy identifikator otsutstvuet in ispolzuemom spravochnike.

## Isklyuchennye arkhivnye versii

- `KuĭbyshevAzot-IFRS-annual.csv`
- `KuĭbyshevAzot-RAS-annual.csv`
- `Samolet Group-IFRS-annual.csv`
- `Samolet Group-IFRS-quarterly.csv`
- `Samolet Group-RAS-annual.csv`
- `Samolet Group-RAS-quarterly.csv`
- `Cherkizovo-IFRS-annual.csv`
- `Cherkizovo-RAS-annual.csv`
