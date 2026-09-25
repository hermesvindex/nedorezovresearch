# Karta perenosa pilota otchetnosti

| ELEMENT iskhodnogo proekta | Status | Reshenie | Adaptatsiya |
|---|---|---|---|
| `library/reports/index.json` | rabochiy | perenesen | lokalnyy indeks `data/index.json` |
| `library/reports/companies/*.json` | rabochiy | pereneseny | lokalnyy sloy from 217 faylov |
| `build_reports_library.py` | zavisit from iskhodnykh CSV | ne vklyuchen | proekt ispolzuet gotovyy normalizovannyy sloy |
| `build_heatmap_card_lab.py` | sovmeshchaet kartu, kartochki and otchetnost | chastichno perenesen | logika otchetnosti vydelena in `build_statements.py` |
| `company.html?ticker=*` | rabochiy pilot | peresobrany | primeneny komponenty and tokeny Quantis Design Lab |
| CDN Plotly | vneshniy resurs | isklyuchen | ispolzuetsya `quantis_designlab/assets/vendor/plotly-2.35.2.min.js` |
| Logotipy data URI | uvelichivayut HTML | isklyucheny | lokalnye fayly by ISIN |
| Filters IFRS/RAS | rabochie | sokhraneny | russkie podpisi and segmentirovannye kontroly |
| Yearovye/quarterly data | rabochie | sokhraneny | adaptivnaya komponovka |
| KPI and mini-grafiki | nedostatochnyy analiticheskiy kontur | pererabotany | KPI with periodom and godovym izmeneniem, without dekorativnykh mini-grafikov |
| Stolbchatye financial diagrammy | otsutstvovali in perenesennoy versii | vosstanovleny | sgruppirovannye revenue, EBITDA and net profit |
| Profitability | byla rastvorena in obshchem spiske metrics | vydelena | EBITDA margin, net margin and ROE with izmeneniem in pp |
| Sravnenie with otraslyu | otsutstvovalo | dobavleno | until vosmi peers, mediana, vybor pokazatelya, accent issuer |
| Nepravilnye edinitsy protsentov and ratios | ispravleno formerly | pravilo sokhraneno | `%` and `x` vyvodyatsya otdelno from denezhnykh edinits |
| Korotkiy fuzzy-match issuers | ispravleno formerly | ne ispolzuetsya | stranitsy stroyatsya by tochnomu tikeru lokalnogo indeksa |
