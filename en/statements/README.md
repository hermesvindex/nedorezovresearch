# Quantis Statements

## Naznachenie

Proekt formiruet avtonomnuyu HTML-vitrinu finansovoy otchetnosti issuers aktsiy Moskovskoy birzhi in dizayn-sisteme Quantis Design Lab.

Osnovnoy rezultat: `statements.html`. Detalnaya otchetnost razmeshchaetsya in `company_pages/<TICKER>.html`.

## Sostav dannykh

- 217 issuers;
- 546 589 normalizovannykh nablyudeniy;
- 16 sektorov;
- period pokrytiya: 2000–2026 gody;
- standarty: IFRS and RAS;
- tipy periodov: annual and quarterly.

Data pereneseny from proizvodnogo sloya `library/reports`. Iskhodnye CSV from kataloga `smart` in proekt ne vklyucheny.

## Sborka

From kataloga proekta:

```bash
python3 build_statements.py
```

Cherez obshchiy orkestrator Design Lab:

```bash
python3 ../generate_projects.py statements
```

Generator sozdaet:

- `statements.html`;
- 217 indeksiruemykh stranits in `company_pages`;
- lokalnye kopii 208 dostupnykh logotipov;
- `build_summary.json` with rezultatami sborki.

Under otsutstvii lokalnogo logotipa interfeys vyvodit tekstovyy tiker in kachestve rezervnogo sostoyaniya.

## Funktsionalnyy kontrakt

Vkhodnaya vitrina podderzhivaet poisk by nazvaniyu, tikeru and ISIN, filtry by standartu and sektoru, vybor chisla strok and paginatsiyu.

Stranitsa issuer podderzhivaet:

- pereklyuchenie IFRS and RAS;
- pereklyuchenie godovykh and kvartalnykh dannykh;
- KPI with tekushchim znacheniem, periodom and izmeneniem year on year;
- sgruppirovannuyu stolbchatuyu diagrammu vyruchki, EBITDA and chistoy pribyli;
- grafik rentabelnosti EBITDA, chistoy rentabelnosti and ROE;
- sravnenie with vosemyu kompaniyami sektora by finansovym pokazatelyam, marzhinalnosti and multiplikatoram;
- vydelenie current issuer and calculation otkloneniya from mediany gruppy;
- vybor finansovogo pokazatelya, stolbchatuyu istoriyu and tablitsu izmeneniy.

For bankov primenyaetsya otdelnaya model: chistyy operatsionnyy income, chistyy protsentnyy income, net profit, net protsentnaya marzha, CIR and ROE.

## Ogranicheniya dannykh

Date versii proizvodnogo sloya: 15 iyulya 2026 year. Kachestvo and polnota otdelnykh pokazateley zavisyat from iskhodnoy otchetnosti and pravil normalizatsii. Denezhnye pokazateli for otraslevogo sravneniya ispolzuyut `normalized_value` in RUBlyakh. Vitrina ne vypolnyaet konvertatsiyu pokazateley, predstavlennykh in inoy valyute. Pervichnye formy otchetnosti sokhranyayutsya kak kontrolnyy source.
