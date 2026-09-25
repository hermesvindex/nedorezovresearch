# Audit metodologii, raschetov and dizayna

Date provedeniya: 11 iyunya 2026 year.

## Osnovanie

Proveden polnyy audit otcheta by obligatsiyam with pogasheniem until kontsa 2026 year. Tselyu yavlyalos privedenie interfeysa to deystvuyushchey dizayn-sisteme investitsionnykh proektov, proverka raschetnoy logiki and povyshenie effektivnosti model portfolio under kontroliruemom riske.

## Izmenenie rezultatov

| Metric | Iskhodnoe znachenie | Itogovoe znachenie | Absolyutnoe izmenenie | Otnositelnoe izmenenie |
|---|---:|---:|---:|---:|
| Konechnyy kapital, RUB. | 1 375 630,29 | 1 431 662,48 | +56 032,19 | +4,07% |
| Cumulative return | 37,563% | 43,166% | +5,603 pp | +14,92% |
| Srednegodovaya yield | 25,197% | 28,769% | +3,572 pp | +14,18% |
| Volatility | 4,596% | 4,928% | +0,332 pp | +7,22% |
| Koeffitsient Sharpa | 4,882 | 5,124 | +0,242 | +4,96% |
| Maksimalnaya prosadka | -2,049% | -1,932% | +0,117 pp | glubina snizhena on 5,72% |
| Chislo positions | 8 | 6 | -2 | -25,00% |

Period sravneniya: with 3 yanvarya 2025 year by 5 iyunya 2026 year. Rost return obuslovlen ispravleniem ucheta denezhnykh potokov and perekhodom to portfelyu from shesti issues. Kontsentratsiya ogranichena shestyu issuermi, maksimalnyy ves sostavlyaet 21,06%.

## Raschetnaya logika

1. Coupons and amortizatsii zachislyayutsya in pervyy commercial den posle daty paymentsy. Formerly uchityvalis tolko sobytiya, date kotorykh sovpadala with torgovym dnem, vsledstvie chego chast denezhnykh potokov vykhodnogo dnya vypadala from rascheta.
2. Effektivnaya godovaya yield rasschityvaetsya by datirovannym denezhnym potokam with uchetom coupons, amortizatsiy, ostatochnogo principala and tseny priobreteniya.
3. For amortiziruemykh issues vosstanovlen calculation iskhodnogo and ostatochnogo principala.
4. Provereny portfeli from 5, 6, 7, 8, 10 and 12 positions. Portfel from shesti issues vybran by sochetaniyu return 43,166%, koeffitsienta Sharpa 5,124 and maksimalnoy prosadki 1,932%.

## Dizayn

Interfeys priveden to palitre and geometrii karty bonds: neytralnyy fon, grafitovyy zagolovochnyy blok, bordovyy aktsent `#7A1027`, belye poluprozrachnye poverkhnosti, uvelichennye radiusy and unifitsirovannye elementy upravleniya. Kartochki bonds and otobrazhenie kreditnykh reytingov sformirovany cherez generator karty bonds.

Tsveta diagramm struktury portfolio, resheniy and issuers prodolzhayut formirovatsya on osnove logotipov. Neytralnaya palitra primenyaetsya to sluzhebnym grafikam, setkam, podpisyam and elementam interfeysa.

## Ogranicheniya

- Credit ratings otrazhayut tekushchiy srez and ne yavlyayutsya istoricheskimi point-in-time dannymi.
- Komissii, nalogi, proskalzyvanie and vliyanie zayavki on rynok ne uchityvayutsya.
- Liquidity otsenivaetsya by oborotu and chislu torgovykh dney without glubiny stakana.
- Cash-flow schedules MOEX mogut korrektirovatsya issuermi.
- Resulty istoricheskogo testa ne garantiruyut budushchuyu yield.

## Kontrol kachestva

Provedena proverka on razresheniyakh 1280 × 720 and 390 × 844. Horizonalnoe perepolnenie otsutstvuet. Provereny 16 interaktivnykh diagramm, polnoekrannaya kartochka bonds, sootvetstvie reytinga in tablitse and kartochke, summa vesov, chislo issuers and itogovye metricsand.
