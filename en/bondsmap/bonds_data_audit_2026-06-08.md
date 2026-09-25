# Audit dannykh karty bonds

Osnovanie: proverka zapolneniya YTM and kreditnykh reytingov in `bonds.html` posle zhaloby on pustye znacheniya in kartochkakh and tablitse.

Date proverki: 2026-06-08.

## YTM

Allgo issues in karte: 3 045.

Fixed rateirovannykh issues: 1 450.

Fixed rateirovannykh issues, gde odnovremenno est tsena, kupon and current yield, no otsutstvuet YTM: 26.

Dekompozitsiya prichiny:

- without daty pogasheniya: 24 issue;
- nepolnoe pokrytie cash-flow: 26 issues;
- with datoy pogasheniya, no without polnogo cash-flow: 2 issue.

Vyvod by YTM: otsutstvie pokazatelya in osnovnom svyazano with nevozmozhnostyu korrektno postroit cash flow until pogasheniya. For bessrochnykh, subordinirovannykh or nepolno opisannykh issues calculation YTM without daty pogasheniya budet metodologicheski nestabilen. For takikh issues trebuetsya otdelnaya logika call yield / oferty libo yavnaya pometka prichiny otsutstviya YTM.

Primery issues:

| SECID | Name | ISIN | Maturity date | Next coupon | Current yield |
|---|---|---|---:|---:|---:|
| RU000A0JWMZ1 | Rosselkhozbank obl.06T1 | RU000A0JWMZ1 | net | 2026-07-03 | 11,13% |
| RU000A0JWN22 | Rosselkhozbank obl. 07T1 | RU000A0JWN22 | net | 2026-07-06 | 11,13% |
| RU000A0JWV63 | Rosselkhozbank obl.08T1 | RU000A0JWV63 | net | 2026-09-23 | 15,05% |
| RU000A0ZZ4T1 | Rosselkhozbank obl. 01T1 | RU000A0ZZ4T1 | net | 2026-10-14 | 13,94% |
| RU000A0ZZ505 | Rosselkhozbank obl. 09T1 | RU000A0ZZ505 | net | 2026-10-15 | 13,89% |
| RU000A102QJ7 | Bank VTB SUB-T1-1 | RU000A102QJ7 | net | 2026-08-03 | 6,56% |
| RU000A103QN7 | Gazprom kapital 001B-03 | RU000A103QN7 | net | net | 17,06% |

## Credit ratings

Corporate issues: 2 879.

Corporate issues without kreditnogo reytinga: 610, or 21,2% from korporativnoy vyborki.

Corporate issues without reytinga so srednednevnym oborotom from 50 RUB mn.: 31.

Krupneyshie by oborotu vypuski without reytinga:

| SECID | Name | Average daily turnover | YTM |
|---|---|---:|---:|
| RU000A10F801 | GTLK BO 002P-13 | 608,9 RUB mn. | 17,41% |
| RU000A10FA72 | Sistema2P14 | 569,9 RUB mn. | 17,43% |
| RU000A10F8P9 | RZD BO 001P-53R | 481,4 RUB mn. | 15,17% |
| RU000A10F7R7 | SBER56 | 350,4 RUB mn. | 14,15% |
| RU000A10F504 | VEB.RF PBO-002P-58 | 299,0 RUB mn. | 1,92% |
| RU000A10F7L0 | Atomenergoprom 001P-12 | 261,2 RUB mn. | 14,46% |
| RU000A10F827 | MegaFon BO-002P-13 | 194,5 RUB mn. | 14,00% |
| RU000A10F470 | TransContainer P02-03 | 180,9 RUB mn. | 17,37% |
| RU000A10EW44 | Polyus PBO-05 | 167,3 RUB mn. | 6,90% |
| RU000A10F6U3 | RusHydro BO-002P-13 | 157,4 RUB mn. | 14,66% |

Vyvod by reytingam: pokrytie reytingov nedostatochno for krupnykh issuers and likvidnykh issues. Trebuetsya otdelnyy sloy normalizatsii reytingov on urovne issuer with kontrolem istochnika, daty reytinga and razlichiya mezhdu reytingom issuer and reytingom konkretnogo issue.
