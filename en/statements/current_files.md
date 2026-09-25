# Aktualnye fayly

| Naznachenie | Fayl | Status |
|---|---|---|
| Vkhodnaya vitrina | `statements.html` | aktualnyy rezultat |
| Generator | `build_statements.py` | kanonicheskiy source sborki |
| Index dannykh | `data/index.json` | lokalnaya kopiya proizvodnogo sloya |
| Data issuers | `data/companies/*.json` | 217 faylov |
| Detalnye stranitsy | `company.html?ticker=*` | 217 faylov, generiruyutsya avtomaticheski |
| Stili vitriny | `assets/statements.css` | lokalnyy vizualnyy sloy |
| Logika vitriny | `assets/statements.js` | poisk, filtry, paginatsiya |
| Stili issuer | `assets/company.css` | lokalnyy vizualnyy sloy |
| Logika issuer | `assets/company.js` | filtry, KPI, grafiki, tablitsy |
| Result sborki | `build_summary.json` | mashinnyy kontrol |
| Vizualnaya proverka | `design-qa.md`, `qa/*.png` | priemka desktop and mobile |

Fayly `company.html?ticker=*`, `build_summary.json` and lokalnye logotipy peresozdayutsya generatorom. Ruchnoe redaktirovanie sgenerirovannykh HTML ne primenyaetsya.
