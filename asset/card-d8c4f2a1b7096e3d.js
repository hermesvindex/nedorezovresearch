"use strict";
function unpackTables(value) {
  if (Array.isArray(value)) return value.map(unpackTables);
  if (value && typeof value === "object") {
    if (Object.keys(value).length === 1 && Array.isArray(value.$t)) {
      const [keys, rows] = value.$t;
      return rows.map(row => Object.fromEntries(keys.map((key, index) => [key, unpackTables(row[index])])));
    }
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, unpackTables(item)]));
  }
  return value;
}
const ASSETS = unpackTables(window.NED_ASSET_PACKED || window.NED_ASSET_DATA || []);
if (!ASSETS.length) throw new Error("Asset payload is empty");
document.title = `${ASSETS[0].title || ASSETS[0].secid || "Актив"} · Карточка актива`;
const state = {
  assetIndex: 0,
  range: ASSETS[0].assetType === "macro" ? "5Y" : "ALL",
  mode: ASSETS[0].assetType === "macro" ? "monthlyAnnual" : "price",
};
    if (new URLSearchParams(location.search).get("drawer") === "1" || window.self !== window.top) document.body.classList.add("in-drawer");

    const rub = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });
    const rubFine = new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    const rubTiny = new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 0, maximumFractionDigits: 6 });
    const trimFixed = (value, digits = 2) => {
      if (value === null || value === undefined || Number.isNaN(value)) return "—";
      let out = Number(value).toFixed(digits);
      if (out.includes(".")) out = out.replace(/0+$/g, "").replace(/\.$/g, "");
      return out.replace(".", ",");
    };
    const pct = (value, digits = 2) => value === null || value === undefined || Number.isNaN(value) ? "—" : `${trimFixed(value, digits)}%`;
    const num = (value, digits = 2) => trimFixed(value, digits);
    const nb = value => String(value).replaceAll(" ", "\u00a0");
    /* exact-brand-accent-v48 */
    const normalizeAccent = value => /^#[0-9a-fA-F]{6}$/.test(value || "")
      ? value.toUpperCase()
      : "#274C63";
    const hexToSoft = value => `${normalizeAccent(value)}22`;
    const currencyLabel = value => (value || "RUB").replace("SUR", "RUB") === "RUB" ? "₽" : (value || "RUB");
    const money = (value, currency = "RUB", digits = 0) => {
      if (value === null || value === undefined || Number.isNaN(value)) return "—";
      const abs = Math.abs(value);
      const formatter = digits > 0 ? (abs > 0 && abs < 0.01 ? rubTiny : rubFine) : rub;
      return `${nb(formatter.format(value))}\u00a0${currencyLabel(currency)}`;
    };
    const dividendMoney = (item, asset) => money(item.value, item.currency || asset.currency, 2);
    const dividendYield = item => item.yieldPct === null || item.yieldPct === undefined || Number.isNaN(item.yieldPct) ? null : pct(item.yieldPct);
    const dividendValue = (item, asset) => {
      const yieldText = dividendYield(item);
      return yieldText ? `${dividendMoney(item, asset)} · ${yieldText}` : dividendMoney(item, asset);
    };
    const dividendNote = item => item.yieldPct === null || item.yieldPct === undefined || Number.isNaN(item.yieldPct) ? "процент не рассчитан" : "история выплат";
    const compactMoney = (value, currency = "RUB") => {
      if (value === null || value === undefined || Number.isNaN(value)) return "—";
      const unit = currencyLabel(currency);
      const abs = Math.abs(value);
      if (abs >= 1_000_000_000_000) return `${num(value / 1_000_000_000_000, 2)}\u00a0трлн\u00a0${unit}`;
      if (abs >= 1_000_000_000) return `${num(value / 1_000_000_000, 2)}\u00a0млрд\u00a0${unit}`;
      if (abs >= 1_000_000) return `${num(value / 1_000_000, 1)}\u00a0млн\u00a0${unit}`;
      return money(value, currency);
    };
    const couponStatus = value => value === "estimate" || value === "forecast" ? "прогноз" : value === "known" ? "по графику" : value === "schedule" ? "по графику" : "факт";
    const signedPct = value => value === null || value === undefined || Number.isNaN(value)
      ? "—"
      : Math.abs(value) < .005
        ? "0%"
        : `${value >= 0 ? "+" : ""}${pct(value)}`;
    const signedPoints = value => value === null || value === undefined || Number.isNaN(value)
      ? "—"
      : Math.abs(value) < .005
        ? "0 п.п."
        : `${value > 0 ? "+" : "−"}${num(Math.abs(value), 2)} п.п.`;
    const periodLabel = value => ({ D: "День", W: "Неделя", M: "Месяц", "3M": "3М", "6M": "6М", YTD: "YTD", "1Y": "Год", "3Y": "3Г", "5Y": "5Л", ALL: "Всё" }[value] || value);
    const htmlEsc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
    const dateRu = value => {
      if (!value) return "—";
      const d = new Date(`${value}T00:00:00`);
      return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("ru-RU");
    };
    const dateShort = value => {
      if (!value) return "—";
      const d = new Date(`${value}T00:00:00`);
      return Number.isNaN(d.getTime())
        ? "—"
        : d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
    };

    function rgbToHex(r, g, b) {
      return "#" + [r, g, b].map(value => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0")).join("").toUpperCase();
    }

    function rgbSaturation(r, g, b) {
      const high = Math.max(r, g, b) / 255;
      const low = Math.min(r, g, b) / 255;
      return high ? (high - low) / high : 0;
    }

    function applyLogoAccentFromImage() {
      const img = document.querySelector("#logo img");
      if (!img || !img.complete || !img.naturalWidth || !img.naturalHeight) return;
      try {
        const canvas = document.createElement("canvas");
        const size = 48;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;
        const buckets = new Map();
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          if (alpha < 80) continue;
          const r = data[i], g = data[i + 1], b = data[i + 2];
          const lightness = (Math.max(r, g, b) + Math.min(r, g, b)) / 510;
          if (lightness > .92 || lightness < .08 || rgbSaturation(r, g, b) < .16) continue;
          const key = `${Math.round(r / 18)}:${Math.round(g / 18)}:${Math.round(b / 18)}`;
          const current = buckets.get(key) || { r: 0, g: 0, b: 0, weight: 0 };
          const weight = alpha / 255 * (0.6 + rgbSaturation(r, g, b));
          current.r += r * weight;
          current.g += g * weight;
          current.b += b * weight;
          current.weight += weight;
          buckets.set(key, current);
        }
        let best = null;
        for (const bucket of buckets.values()) {
          if (!best || bucket.weight > best.weight) best = bucket;
        }
        if (!best || best.weight <= 0) return;
        const color = rgbToHex(best.r / best.weight, best.g / best.weight, best.b / best.weight);
        document.documentElement.style.setProperty("--accent", normalizeAccent(color));
        document.documentElement.style.setProperty("--accent-soft", hexToSoft(color));
      } catch (error) {
        return;
      }
    }

    function adaptiveAxisRange(values, mode = "price") {
      const clean = values.map(Number).filter(Number.isFinite);
      if (clean.length < 2) return undefined;
      const min = Math.min(...clean);
      const max = Math.max(...clean);
      if (min === max) {
        const padFlat = Math.max(Math.abs(min) * .03, mode === "turnover" ? 1 : .01);
        return [min - padFlat, max + padFlat];
      }
      const span = max - min;
      const mid = (max + min) / 2;
      const pad = Math.max(span * .12, Math.abs(mid) * .006, mode === "turnover" ? 1 : .01);
      return [mode === "signed" ? min - pad : Math.max(0, min - pad), max + pad];
    }

    function setActiveButtons(containerId, attr, value) {
      document.querySelectorAll(`#${containerId} button`).forEach(button => {
        const selected = button.dataset[attr] === value;
        button.classList.toggle("active", selected);
        button.setAttribute("aria-selected", String(selected));
      });
    }

    function filteredHistory(asset) {
      const rows = asset.history || [];
      if (state.range === "ALL" || rows.length === 0) return rows;
      const last = new Date(`${rows[rows.length - 1].date}T00:00:00`);
      const start = new Date(last);
      if (state.range === "D") start.setDate(start.getDate() - 1);
      if (state.range === "W") start.setDate(start.getDate() - 7);
      if (state.range === "1M") start.setMonth(start.getMonth() - 1);
      if (state.range === "3M") start.setMonth(start.getMonth() - 3);
      if (state.range === "6M") start.setMonth(start.getMonth() - 6);
      if (state.range === "1Y") start.setFullYear(start.getFullYear() - 1);
      if (state.range === "3Y") start.setFullYear(start.getFullYear() - 3);
      if (state.range === "5Y") start.setFullYear(start.getFullYear() - 5);
      if (state.range === "10Y") start.setFullYear(start.getFullYear() - 10);
      if (state.range === "YTD") {
        start.setMonth(0);
        start.setDate(1);
      }
      return rows.filter(row => new Date(`${row.date}T00:00:00`) >= start);
    }

    function annualInflationRows(rows) {
      const latestByYear = new Map();
      (rows || []).forEach(row => {
        const date = new Date(`${row.date}T00:00:00`);
        if (Number.isNaN(date.getTime())) return;
        latestByYear.set(date.getFullYear(), row);
      });
      return [...latestByYear.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([year, row]) => {
          const date = new Date(`${row.date}T00:00:00`);
          return {
            ...row,
            year,
            complete: date.getMonth() === 11,
            annualValue: Number(row.ytd),
          };
        });
    }


    function syncMacroSelects(asset) {
      const controls = document.getElementById("macroSelectControls");
      if (!controls) return;
      const isMacro = asset.assetType === "macro";
      controls.hidden = !isMacro;
      if (!isMacro) return;
      document.getElementById("macroModeSelect").value = state.mode;
      document.getElementById("macroRangeSelect").value = state.range;
    }

    function renderButtons() {
      const wrap = document.getElementById("assetButtons");
      const switcher = document.querySelector(".asset-switcher");
      if (ASSETS.length < 2) {
        if (switcher) switcher.style.display = "none";
      }
      wrap.innerHTML = ASSETS.map((asset, index) => `<button type="button" data-asset="${index}" aria-selected="${index === state.assetIndex}" class="${index === state.assetIndex ? "active" : ""}">${asset.title}</button>`).join("");
      wrap.querySelectorAll("button").forEach(button => button.addEventListener("click", () => {
        state.assetIndex = Number(button.dataset.asset);
        render();
      }));
      document.querySelectorAll("#rangeButtons button").forEach(button => button.addEventListener("click", () => {
        state.range = button.dataset.range;
        render();
      }));
      document.querySelectorAll("#modeButtons button").forEach(button => button.addEventListener("click", () => {
        state.mode = button.dataset.mode;
        render();
      }));
      const macroModeSelect = document.getElementById("macroModeSelect");
      const macroRangeSelect = document.getElementById("macroRangeSelect");
      if (macroModeSelect) macroModeSelect.addEventListener("change", () => {
        state.mode = macroModeSelect.value;
        render();
      });
      if (macroRangeSelect) macroRangeSelect.addEventListener("change", () => {
        state.range = macroRangeSelect.value;
        render();
      });

    }

    function renderLogo(asset) {
      const logo = document.getElementById("logo");
      const marketIdentity = ["index", "currency", "rate", "commodity"].includes(asset.assetType);
      logo.classList.toggle("market-identity", marketIdentity);
      logo.classList.toggle("market-identity--image", Boolean(asset.logo) && marketIdentity);
      if (asset.logo) {
        logo.innerHTML = `<img src="${asset.logo}" alt="">`;
        const img = logo.querySelector("img");
        if (img) img.addEventListener("load", () => {
          applyLogoAccentFromImage();
          renderChart(ASSETS[state.assetIndex]);
        }, { once: true });
      } else {
        logo.innerHTML = `<span class="logo-fallback">${marketIdentity ? asset.secid : asset.title.slice(0, 3)}</span>`;
      }
    }

    function isDateValue(value) {
      return /^\d{2}\.\d{2}\.\d{4}$/.test(String(value || "").trim());
    }

    function metricValueClass(value) {
      const textValue = !String(value).includes("%") && String(value).length > 8;
      const longValue = !String(value).includes("%") && String(value).length > 13;
      return ["metric-value", textValue ? "text" : "", longValue ? "long" : "", isDateValue(value) ? "date" : ""].filter(Boolean).join(" ");
    }

    function tileValueHtml(value) {
      const raw = String(value ?? "—");
      const parts = raw.split(" · ");
      if (parts.length === 2 && isDateValue(parts[1])) {
        return `<strong class="money">${parts[0]}<span class="tile-date">${parts[1]}</span></strong>`;
      }
      if (isDateValue(raw)) {
        return `<strong class="tile-date solo">${raw}</strong>`;
      }
      const moneyLike = /[₽$€¥]|млн|млрд|тыс/i.test(raw);
      const fit = raw.length > 14 || moneyLike;
      const size = moneyLike && raw.length > 12 ? Math.max(13, 19 - (raw.length - 12) * 0.9).toFixed(1) + "px" : "";
      const style = size ? ` style="--fit-size:${size}"` : "";
      return `<strong class="${[fit ? "fit" : "", moneyLike ? "money" : ""].filter(Boolean).join(" ")}"${style}>${raw}</strong>`;
    }

    function renderTiles(rows) {
      return rows.map(([value, label]) => `<div class="tile">${tileValueHtml(value)}<span>${label}</span></div>`).join("");
    }

    function valueTone(value) {
      return value > 0 ? "positive" : value < 0 ? "negative" : "";
    }

    function setDelta(value, text) {
      const delta = document.getElementById("delta");
      delta.textContent = text;
      delta.className = `delta ${valueTone(value)}`;
    }

    function renderPeriodReturns(asset) {
      const wrap = document.getElementById("periodReturns");
      if (!asset.assetType || asset.assetType === "bond") {
        wrap.innerHTML = "";
        return;
      }
      const periods = ["D", "W", "M", "3M", "6M", "YTD", "1Y", "3Y", "5Y", "ALL"];
      wrap.innerHTML = periods.map(period => {
        const value = asset.returns?.[period];
        const note = period === "ALL" && asset.firstObservation ? `с ${dateRu(asset.firstObservation)}` : "";
        return `<div class="return-pill"><div class="return-label">${periodLabel(period)}</div><div class="return-value ${valueTone(value)}">${signedPct(value)}</div>${note ? `<div class="return-note">${note}</div>` : ""}</div>`;
      }).join("");
    }

    function renderSummary(asset) {
      const hasYieldSeries = (asset.history || []).some(row => Number(row.yield || 0) > 0);
      const marketOnlyMode = ["currency", "index", "commodity", "rate"].includes(asset.assetType);
      const hideSingleIndexMode = marketOnlyMode || (asset.assetType === "index" && !hasYieldSeries);
      if ((!hasYieldSeries && state.mode === "yield") || hideSingleIndexMode) state.mode = "price";
      const yieldButton = document.querySelector('[data-mode="yield"]');
      const modeButtons = document.getElementById("modeButtons");
      if (yieldButton) yieldButton.style.display = hasYieldSeries ? "" : "none";
      if (modeButtons) modeButtons.style.display = hideSingleIndexMode ? "none" : "";
      document.documentElement.style.setProperty("--accent", normalizeAccent(asset.accent));
      document.documentElement.style.setProperty("--accent-soft", hexToSoft(asset.accent));
      document.body.classList.toggle("key-rate-card", asset.assetType === "rate");
      document.body.classList.toggle("macro-card", asset.assetType === "macro");
      const assetTitle = document.getElementById("title");
      assetTitle.textContent = asset.title;
      const assetTitleLength = Array.from((asset.title || "").replace(/\s+/g, " ").trim()).length;
      assetTitle.classList.toggle("asset-title--medium", assetTitleLength >= 19 && assetTitleLength < 31);
      assetTitle.classList.toggle("asset-title--long", assetTitleLength >= 31 && assetTitleLength < 47);
      assetTitle.classList.toggle("asset-title--xlong", assetTitleLength >= 47);
      if (asset.assetType && asset.assetType !== "bond") {
        if (asset.assetType === "rate") {
          document.getElementById("periodReturns").innerHTML = "";
          document.getElementById("subtitle").textContent = asset.subtitle || "";
          document.getElementById("chips").innerHTML = [
            asset.publisher || "Банк России",
            asset.quoteUnit || "% годовых",
          ].map(item => `<span class="chip tint">${item}</span>`).join("");
          document.querySelector('[data-mode="price"]').textContent = "Ставка";
          document.getElementById("price").textContent = `${num(asset.price, asset.valueDigits ?? 2)} %`;
          document.getElementById("dirtyPrice").textContent = "Ключевая ставка Банка России";
          setDelta(
            asset.deltaPoints,
            `${signedPoints(asset.deltaPoints)} · решение ${dateShort(asset.lastDecisionDate)}`
          );
          document.getElementById("metrics").innerHTML = "";
          document.getElementById("tiles").innerHTML = "";
          document.getElementById("description").innerHTML = "";
          document.getElementById("footerNote").textContent =
            `Фактический ряд — Банк России · прогноз Quantis вынесен из графика · данные на ${dateRu(asset.asof)}`;
          return;
        }
        if (asset.assetType === "macro") {
          document.getElementById("periodReturns").innerHTML = "";
          document.getElementById("subtitle").textContent = asset.subtitle || "";
          const macroSummary = {
            annual: {
              value: asset.ytdChange,
              unit: "% с начала года",
              label: `Годовая инфляция · на ${dateRu(asset.asof)}`,
              delta: "накопленным итогом · неполный год",
            },
            monthly: {
              value: asset.monthlyChange,
              unit: "% за месяц",
              label: `Помесячная инфляция · ${asset.periodLabel || dateRu(asset.asof)}`,
              delta: "изменение потребительских цен за месяц",
            },
            monthlyAnnual: {
              value: asset.price,
              unit: "% год к году",
              label: `Помесячная инфляция в годовом выражении · ${asset.periodLabel || dateRu(asset.asof)}`,
              delta: `${signedPoints(asset.deltaPoints)} к предыдущему месяцу`,
            },
          }[state.mode] || {
            value: asset.price,
            unit: "% год к году",
            label: `Помесячная инфляция в годовом выражении · ${asset.periodLabel || dateRu(asset.asof)}`,
            delta: `${signedPoints(asset.deltaPoints)} к предыдущему месяцу`,
          };
          document.getElementById("chips").innerHTML = [
            asset.publisher,
            macroSummary.unit,
            "Ежемесячно",
          ].filter(Boolean).map(item => `<span class="chip tint">${item}</span>`).join("");
          document.getElementById("price").textContent = `${num(macroSummary.value, 2)} %`;
          document.getElementById("dirtyPrice").textContent = macroSummary.label;
          setDelta(0, macroSummary.delta);
          const metrics = [
            ["За месяц", `${num(asset.monthlyChange, 2)}%`, "изменение потребительских цен", false],
            ["С начала года", `${num(asset.ytdChange, 2)}%`, "накопленным итогом", false],
            ["Год к году", `${num(asset.price, 2)}%`, asset.periodLabel || "", false],
          ];
          document.getElementById("metrics").innerHTML = metrics.map(([label, value, note, hot]) => {
            return `<div class="metric ${hot ? "hot" : ""}"><div class="${metricValueClass(value)}">${value}</div><div class="metric-label">${label}</div>${note ? `<div class="metric-note">${note}</div>` : ""}</div>`;
          }).join("");
          const recentYears = annualInflationRows(asset.history).slice(-6).reverse();
          document.getElementById("tiles").innerHTML = renderTiles(recentYears.map(row => [
            `${num(row.annualValue, 2)}%`,
            row.complete ? `${row.year} год` : `${row.year} · на ${dateRu(row.date)}`,
          ]));
          const source = asset.sourceUrl
            ? `<a href="${htmlEsc(asset.sourceUrl)}" target="_blank" rel="noopener noreferrer">${htmlEsc(asset.sourceLabel || "Источник")}</a>`
            : htmlEsc(asset.sourceLabel || "Предоставленная таблица");
          document.getElementById("description").innerHTML =
            `${htmlEsc(asset.description || "")}<div class="formula"><strong>${htmlEsc(asset.methodology || "")}</strong><span>${htmlEsc(asset.marketNote || "")}</span><span>Источник: ${source}</span></div>`;
          document.getElementById("footerNote").textContent =
            `Месячный ряд · данные за ${asset.periodLabel || dateRu(asset.asof)}`;
          return;
        }
        renderPeriodReturns(asset);
        const isFund = asset.assetType === "fund";
        const isMarketAsset = ["currency", "index", "commodity", "rate"].includes(asset.assetType);
        document.getElementById("subtitle").textContent = asset.subtitle || "";
        document.getElementById("chips").innerHTML = [
          asset.isin,
          asset.secid,
          asset.board,
          isMarketAsset ? asset.class : (isFund ? "БПИФ" : "Акция"),
          isMarketAsset ? asset.marketClass : (isFund ? asset.etfStructure : asset.sector),
          isMarketAsset ? asset.quoteUnit : asset.currency
        ].filter(Boolean).map((item, i) => `<span class="chip ${i === 2 || i === 3 ? "tint" : ""}">${item}</span>`).join("");
        const marketValue = (value, digits = asset.valueDigits ?? 2) => value === null || value === undefined || Number.isNaN(value)
          ? "—"
          : `${asset.valuePrefix || ""}${num(value, digits)}${asset.valueSuffix ? ` ${asset.valueSuffix}` : ""}`;
        document.getElementById("price").textContent = isMarketAsset ? marketValue(asset.price) : money(asset.price, asset.currency, 2);
        document.getElementById("dirtyPrice").textContent = isMarketAsset ? (asset.valueLabel || "Последнее значение") : (isFund ? "Расчётная цена пая" : "Цена закрытия");
        const dayDelta = asset.priceDeltaDay;
        const dayDeltaPct = asset.priceDeltaDayPct;
        const absoluteSign = (dayDelta || 0) > 0 ? "+" : (dayDelta || 0) < 0 ? "−" : "";
        setDelta(dayDelta, dayDelta === null || dayDelta === undefined ? "—" : isMarketAsset
          ? `${absoluteSign}${marketValue(Math.abs(dayDelta))} за день (${signedPct(dayDeltaPct)})`
          : `${absoluteSign}${money(Math.abs(dayDelta), asset.currency, 2)} за день (${signedPct(dayDeltaPct)})`);
        const metrics = isMarketAsset ? [
          ["День", signedPct(asset.priceDeltaDayPct), "изменение последнего значения", false],
          ["Риск", pct(asset.annualVol), "годовая волатильность", false],
          ["Класс", asset.marketClass || asset.class || "—", "", false],
        ] : isFund ? [
          ["Годовая доходность", pct(asset.annualReturn), asset.note || "из портфельной модели", false],
          ["Риск", pct(asset.annualVol), "годовая волатильность", false],
          [asset.rating ? "Рейтинг" : "УК", asset.rating || asset.etfCompany || "—", asset.rating ? "MOEX" : "", false],
          ["Структура", asset.etfStructure || "—", "", false],
        ] : [
          ["День", signedPct(asset.priceDeltaDayPct), "изменение цены закрытия", false],
          ["Риск", pct(asset.annualVol), "годовая волатильность", false],
          ["Оборот", asset.turnover ? compactMoney(asset.turnover) : "—", "последний торговый день", false],
          [asset.rating ? "Рейтинг" : "Сектор", asset.rating || asset.sector || "—", asset.rating ? "MOEX" : "", false],
        ];
        document.getElementById("metrics").innerHTML = metrics.map(([label, value, note, hot]) => {
          return `<div class="metric ${hot ? "hot" : ""}"><div class="${metricValueClass(value)}">${value}</div><div class="metric-label">${label}</div>${note ? `<div class="metric-note">${note}</div>` : ""}</div>`;
        }).join("");
        const lastDividend = asset.latestDividend ? `${dividendValue(asset.latestDividend, asset)} · ${dateRu(asset.latestDividend.date)}` : "—";
        document.getElementById("tiles").innerHTML = renderTiles(isMarketAsset ? [
          [signedPct(asset.returns?.W), "Неделя"],
          [signedPct(asset.returns?.M), "Месяц"],
          [signedPct(asset.returns?.YTD), "С начала года"],
          [signedPct(asset.returns?.["1Y"]), "Один год"],
          [dateRu(asset.firstObservation), "Начало ряда"],
          [num(asset.observationCount, 0), "Наблюдений"],
        ] : isFund ? [
          [asset.etfCompany || "—", "Управляющая компания"],
          [asset.etfStructure || "—", "Структура"],
          [asset.avgTurnover ? compactMoney(asset.avgTurnover) : "—", "Средний оборот за 60 торговых дней"],
          [pct(asset.annualReturn), "Ожидаемая доходность"],
          [pct(asset.annualVol), "Риск"],
          [asset.isin || "—", "ISIN"],
        ] : [
          [asset.marketCap ? compactMoney(asset.marketCap) : "—", "Капитализация"],
          [asset.turnover ? compactMoney(asset.turnover) : "—", "Оборот за день"],
          [asset.volume ? nb(rub.format(asset.volume)) : "—", "Объем, шт."],
          [asset.open ? money(asset.open, asset.currency, 2) : "—", "Цена открытия"],
          [asset.high && asset.low ? `${money(asset.high, asset.currency, 2)} / ${money(asset.low, asset.currency, 2)}` : "—", "High / Low"],
          [lastDividend, "Последний дивиденд"],
        ]);
        const extra = isMarketAsset
          ? `<div class="formula"><strong>${asset.methodology || asset.class || "Рыночный индикатор"}</strong><span>${asset.marketNote || "Историческая динамика рассчитана по локальному временному ряду."}</span></div>`
          : isFund
          ? `<div class="formula"><strong>${asset.etfStructure || "Состав БПИФ"}</strong><span>УК: ${asset.etfCompany || "—"}</span>${asset.note ? `<span>${asset.note}</span>` : ""}</div>`
          : `<div class="formula"><strong>${asset.sector || "Сектор"}</strong><span>${[asset.industry, asset.issuer].filter(Boolean).join(" · ") || "Отраслевые данные из локального справочника"}</span></div>`;
        document.getElementById("description").innerHTML = `${asset.description || "Описание недоступно."}${extra}`;
        document.getElementById("footerNote").textContent = isMarketAsset
          ? `Данные на ${dateRu(asset.asof)}`
          : `Источник: local moex_library/packages/${asset.secid} · portfolio_interactive · данные на ${dateRu(asset.asof)}`;
        return;
      }
      renderPeriodReturns(asset);
      document.getElementById("subtitle").textContent = `${asset.subtitle} · ${asset.issuer}`;
      document.getElementById("chips").innerHTML = [
        asset.isin,
        asset.board,
        asset.isCurrencyBond ? "Валютная" : "",
        asset.couponType,
        asset.class,
        asset.currency
      ].filter(Boolean).map((item, i) => `<span class="chip ${i >= 2 && i <= 4 ? "tint" : ""}">${item}</span>`).join("");
      document.getElementById("price").textContent = pct(asset.price, 2);
      document.getElementById("dirtyPrice").textContent = asset.dirtyPrice !== null && asset.dirtyPrice !== undefined
        ? money(asset.dirtyPrice, asset.currency, 2)
        : asset.price !== null && asset.price !== undefined
          ? `${num(asset.price * (asset.faceValue || 1000) / 100, 2)}\u00a0${currencyLabel(asset.currency)}`
          : "Котировка MOEX отсутствует";
      const dayDelta = asset.priceDeltaDay;
      const dayDeltaPct = asset.priceDeltaDayPct;
      const sign = (dayDelta || 0) >= 0 ? "+" : "";
      setDelta(dayDelta, dayDelta === null || dayDelta === undefined ? "—" : `${sign}${num(dayDelta)} п.п. за день (${sign}${pct(dayDeltaPct)})`);
      const floatingRateReference = asset.couponBenchmark === "Ключевая ставка Банка России" && asset.keyRate
        ? ` · КС ЦБ ${pct(asset.keyRate.value)}`
        : "";
      const floatingYieldNote = asset.couponFormulaShort
        ? `${asset.couponFormulaShort}${floatingRateReference}`
        : "";
      const couponNote = asset.couponValue ? `${money(asset.couponValue, asset.currency, 2)} · ${dateRu(asset.nextCouponDate)} · ${couponStatus(asset.couponStatus)}` : "";
      const metrics = [];
      if (asset.couponType === "Структурная") {
        metrics.push(["Тип", "Структурная", "купон/доходность зависят от условий продукта", false]);
        metrics.push(["Погашение", dateRu(asset.maturityDate), "", false]);
        metrics.push(["НКД", money(asset.accint), "", false]);
        metrics.push(["Рейтинг", asset.rating || "—", "", false]);
      } else if (asset.couponType === "Флоатер") {
        metrics.push(["Купонная доходность", pct(asset.couponRate), couponNote || floatingYieldNote, false]);
        metrics.push(["Текущая доходность", pct(asset.currentYield), floatingYieldNote || "годовой купон / чистая цена", false]);
        metrics.push(["НКД", money(asset.accint), "", false]);
        metrics.push(["Рейтинг", asset.rating || "—", "", false]);
      } else {
        metrics.push(["Купон", pct(asset.couponRate), couponNote, false]);
        metrics.push(["Текущая доходность", pct(asset.currentYield), "годовой купон / чистая цена", false]);
        metrics.push(["Доходность к погашению / MOEX", pct(asset.ytm), "", false]);
        metrics.push(["Рейтинг", asset.rating || "—", "", false]);
      }
      document.getElementById("metrics").innerHTML = metrics.map(([label, value, note, hot]) => {
        return `<div class="metric ${hot ? "hot" : ""}"><div class="${metricValueClass(value)}">${value}</div><div class="metric-label">${label}</div>${note ? `<div class="metric-note">${note}</div>` : ""}</div>`;
      }).join("");
      document.getElementById("tiles").innerHTML = renderTiles([
        [money(asset.faceValue, asset.currency), "Номинал"],
        [asset.avgTurnover ? compactMoney(asset.avgTurnover) : "—", "Средний оборот за 60 торговых дней"],
        [asset.frequency ? num(asset.frequency, 0) : "—", "Купонов в год"],
        [dateRu(asset.issueDate), "Начало торгов"],
        [dateRu(asset.nextCouponDate), "Ближайший купон"],
        [dateRu(asset.maturityDate), `Погашение${asset.yearsToMaturity ? ` · ${num(asset.yearsToMaturity, 1)} г.` : ""}`]
      ]);
      const formulaReference = asset.couponBenchmark === "Ключевая ставка Банка России" && asset.keyRate
        ? `<span>Ориентир: ключевая ставка Банка России ${pct(asset.keyRate.value)} на ${dateRu(asset.keyRate.date)}.</span>`
        : asset.couponBenchmark
          ? `<span>Ориентир: ${asset.couponBenchmark}.</span>`
          : "";
      document.getElementById("description").innerHTML = `${asset.description}${asset.couponFormula ? `<div class="formula"><strong>${asset.couponFormulaShort || asset.couponType}</strong><span>${asset.couponFormula}</span>${formulaReference}</div>` : ""}`;
      document.getElementById("footerNote").textContent = `Источник: local moex_library/packages/${asset.secid} · данные на ${dateRu(asset.asof)}`;
    }

    function renderDetailCta(asset) {
      const wrap = document.getElementById("detailCta");
      const detailPath = asset.detailPageUrl || "";
      const detailRaw = String(detailPath).trim();
      let url = "";
      if (detailRaw) {
        try {
          const normalizedPath = detailRaw
            .replace(/^(\.\.\/)+/, "")
            .replace(/^(\.\/)+/, "");
          const detailUrl = new URL(normalizedPath, "https://nedorezov-research.ru/");
          const isStatementRoute = detailUrl.pathname.endsWith("/statements/company.html")
            || detailUrl.pathname.endsWith("/company.html")
            || detailUrl.pathname === "/reports"
            || detailUrl.pathname === "/reports/";
          if (isStatementRoute) {
            const reportUrl = new URL("https://nedorezov-research.ru/reports");
            detailUrl.searchParams.forEach((value, key) => {
              reportUrl.searchParams.set(key, value);
            });
            if (!reportUrl.searchParams.has("from")) {
              reportUrl.searchParams.set("from", "asset");
            }
            reportUrl.hash = detailUrl.hash || "#instruments";
            url = reportUrl.href;
          } else {
            url = detailUrl.href;
          }
        } catch {
          url = "";
        }
      }
      if (!url) {
        wrap.style.display = "none";
        wrap.innerHTML = "";
        return;
      }
      wrap.style.display = "flex";
      wrap.innerHTML = `<a class="detail-link" href="${htmlEsc(url)}" target="_top">Финансовая отчетность</a>`;
    }

    function renderCashflow(asset) {
      if (asset.assetType === "macro") {
        document.getElementById("cashflowTitle").textContent = "Инфляция по годам";
        const rows = annualInflationRows(asset.history).slice(-12).reverse();
        document.getElementById("cashflow").innerHTML = rows.map(item => `<div class="flow-row">
          <div class="flow-date">${item.year}</div>
          <div class="flow-main">
            <div class="flow-title">${item.complete
              ? `В ${item.year} году инфляция составила ${num(item.annualValue, 2)}%`
              : `В ${item.year} году к ${dateRu(item.date)} инфляция составила ${num(item.annualValue, 2)}%`}</div>
            <div class="flow-note">${item.complete
              ? "итог за январь–декабрь"
              : `неполный год · за последний месяц ${num(item.monthly, 2)}% · год к году ${num(item.price, 2)}%`}</div>
          </div>
          <div class="flow-value">${num(item.annualValue, 2)}%</div>
        </div>`).join("");
        return;
      }
      if (asset.assetType === "rate") {
        document.getElementById("cashflowTitle").textContent = "Решения и прогноз";
        const rows = asset.rateSchedule || [];
        document.getElementById("cashflow").innerHTML = rows.map(item => {
          const isForecast = item.status === "forecast";
          const note = isForecast
            ? item.label || "Прогноз Quantis"
            : `Факт · действует с ${dateShort(item.effectiveDate)}`;
          return `<div class="flow-row ${isForecast ? "rate-forecast" : "past"}">
            <div class="flow-date">${dateShort(item.date)}</div>
            <div class="flow-main">
              <div class="flow-title">${isForecast ? "Заседание" : "Последнее решение"}</div>
              <div class="flow-note">${note}</div>
            </div>
            <div class="flow-value">${item.rate === null || item.rate === undefined ? "—" : `${num(item.rate, 2)}%`}<span class="rate-change">${signedPoints(item.changePoints)}</span></div>
          </div>`;
        }).join("");
        return;
      }
      if (["currency", "index", "commodity", "rate"].includes(asset.assetType)) {
        document.getElementById("cashflowTitle").textContent = "Характеристики";
        document.getElementById("cashflow").innerHTML = (asset.marketDetails || []).map(item => `<div class="flow-row">
          <div class="flow-date">${item.label}</div>
          <div class="flow-main"><div class="flow-title">${item.value || "—"}</div><div class="flow-note">${item.note || ""}</div></div>
          <div class="flow-value"></div>
        </div>`).join("");
        return;
      }
      if (asset.assetType === "stock") {
        document.getElementById("cashflowTitle").textContent = "Дивиденды";
        const rows = (asset.dividends || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 8);
        document.getElementById("cashflow").innerHTML = rows.length ? rows.map(item => `<div class="flow-row">
          <div class="flow-date">${dateRu(item.date)}</div>
          <div class="flow-main"><div class="flow-title">Дивиденд</div><div class="flow-note">${dividendNote(item)}</div></div>
          <div class="flow-value">${dividendValue(item, asset)}</div>
        </div>`).join("") : `<div class="desc">В локальном пакете нет дивидендного календаря.</div>`;
        return;
      }
      if (asset.assetType === "fund") {
        document.getElementById("cashflowTitle").textContent = "Состав БПИФ";
        document.getElementById("cashflow").innerHTML = (asset.fundComposition || []).map(item => `<div class="flow-row">
          <div class="flow-date">${item.label}</div>
          <div class="flow-main"><div class="flow-title">${item.value || "—"}</div><div class="flow-note">${asset.secid}</div></div>
          <div class="flow-value"></div>
        </div>`).join("");
        return;
      }
      document.getElementById("cashflowTitle").textContent = "Денежный поток";
      const couponRows = (asset.futureCoupons || []).map(item => ({ ...item, type: "Купон" })).sort((a, b) => String(a.date).localeCompare(String(b.date)));
      const yearEnd = `${new Date().getFullYear()}-12-31`;
      const coupons = asset.couponType === "Флоатер" ? couponRows.filter(item => String(item.date) <= yearEnd) : couponRows.slice(0, 6);
      const amort = (asset.futureAmortizations || []).map(item => ({ ...item, type: "Погашение" })).sort((a, b) => String(a.date).localeCompare(String(b.date))).slice(0, 2);
      if (!amort.length && asset.maturityDate) amort.push({ date: asset.maturityDate, value: asset.faceValue, rate: 100, currency: asset.currency, type: "Погашение" });
      const rows = [...coupons, ...amort].sort((a, b) => String(a.date).localeCompare(String(b.date)));
      const historyRows = (asset.allCoupons || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
      const missingCouponHtml = !couponRows.length
        ? `<div class="desc">Будущие купоны не раскрыты в локальном пакете${asset.couponType === "Флоатер" ? ": ставка появится ближе к купонному периоду." : "."}</div>`
        : "";
      const cashflowHtml = rows.length ? rows.map(item => {
        return `<div class="flow-row">
          <div class="flow-date">${dateRu(item.date)}</div>
          <div class="flow-main"><div class="flow-title">${item.type}${item.type === "Купон" && item.rate ? ` · ${pct(item.rate)}` : ""}</div><div class="flow-note">${item.type === "Погашение" ? "номинал · плановая выплата" : item.status ? couponStatus(item.status) : "плановая выплата"}</div></div>
          <div class="flow-value">${money(item.value, item.currency || asset.currency, item.type === "Купон" ? 2 : 0)}</div>
        </div>`;
      }).join("") : `<div class="desc">Будущие купоны не раскрыты в локальном пакете. Для флоатеров это нормально: ставка часто появляется ближе к купонному периоду.</div>`;
      const historyHtml = historyRows.length ? `<details class="coupon-history"><summary><span>Прошлые купоны</span><span>${historyRows.length} выплат</span></summary><div class="coupon-table">${historyRows.map(item => {
        return `<div class="flow-row past">
          <div class="flow-date">${dateRu(item.date)}</div>
          <div class="flow-main"><div class="flow-title">Купон${item.rate ? ` · ${pct(item.rate)}` : ""}</div><div class="flow-note">факт</div></div>
          <div class="flow-value">${money(item.value, item.currency || asset.currency, 2)}</div>
        </div>`;
      }).join("")}</div></details>` : "";
      document.getElementById("cashflow").innerHTML = missingCouponHtml + cashflowHtml + historyHtml;
    }

    const assetChartBindings = new WeakMap();

    function bindAssetChartTooltip(chart, asset, rows, yTitle, lineColor, valueKey) {
      if (!chart?.on) return;
      chart.dataset.assetTooltipBound = "core";
      let tooltip = chart.querySelector(".asset-chart-tooltip");
      if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.className = "asset-chart-tooltip";
        tooltip.setAttribute("role", "status");
        chart.appendChild(tooltip);
      }
      let guide = chart.querySelector(".asset-chart-hover-line");
      if (!guide) {
        guide = document.createElement("span");
        guide.className = "asset-chart-hover-line";
        guide.setAttribute("aria-hidden", "true");
        chart.appendChild(guide);
      }
      const previous = assetChartBindings.get(chart);
      if (previous?.show && chart.removeListener) chart.removeListener("plotly_hover", previous.show);
      if (previous?.click && chart.removeListener) chart.removeListener("plotly_click", previous.click);
      if (previous?.unhover && chart.removeListener) chart.removeListener("plotly_unhover", previous.unhover);
      if (previous?.track) chart.removeEventListener("mousemove", previous.track, true);
      if (previous?.leave) chart.removeEventListener("mouseleave", previous.leave);
      if (previous?.scrollHide) window.removeEventListener("scroll", previous.scrollHide, true);
      const coarse = window.matchMedia?.("(pointer: coarse)")?.matches === true;
      const binding = { pointer: null, touchLocked: false };
      const hide = force => {
        if (!force && coarse && binding.touchLocked) return;
        tooltip.classList.remove("is-visible");
        guide.classList.remove("is-visible");
      };
      const track = source => {
        const rect = chart.getBoundingClientRect();
        const plotRect = chart.querySelector(".nsewdrag")?.getBoundingClientRect();
        const x = source.clientX - rect.left;
        const y = source.clientY - rect.top;
        const insideChart = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
        const insidePlot = !plotRect || (source.clientX >= plotRect.left && source.clientX <= plotRect.right && source.clientY >= plotRect.top && source.clientY <= plotRect.bottom);
        binding.pointer = insideChart && insidePlot ? { x, y, at: Date.now() } : null;
      };
      const place = (point, source) => {
        const rect = chart.getBoundingClientRect();
        const axisPoint = point.xaxis?.d2p ? point.xaxis.d2p(point.x) : point.xaxis?.l2p ? point.xaxis.l2p(point.x) : NaN;
        const axisX = (Number.isFinite(axisPoint) ? axisPoint : rect.width / 2) + (point.xaxis?._offset || 0);
        const eventX = Number(source?.clientX) - rect.left;
        const eventY = Number(source?.clientY) - rect.top;
        const pointerFresh = binding.pointer && Date.now() - binding.pointer.at < 400;
        const rawX = pointerFresh ? binding.pointer.x : (Number.isFinite(eventX) && eventX >= 0 && eventX <= rect.width ? eventX : axisX);
        const rawY = pointerFresh ? binding.pointer.y : (Number.isFinite(eventY) && eventY >= 0 && eventY <= rect.height ? eventY : rect.height / 2);
        const width = tooltip.offsetWidth;
        const height = tooltip.offsetHeight;
        let left = rawX + 16;
        if (left + width > rect.width - 8) left = rawX - width - 16;
        tooltip.style.left = `${Math.max(8, Math.min(rect.width - width - 8, left))}px`;
        tooltip.style.top = `${Math.max(8, Math.min(rect.height - height - 8, rawY - height / 2))}px`;
        const plotRect = chart.querySelector(".nsewdrag")?.getBoundingClientRect();
        guide.style.left = `${axisX}px`;
        guide.style.top = `${plotRect ? plotRect.top - rect.top : 10}px`;
        guide.style.height = `${plotRect ? plotRect.height : Math.max(0, rect.height - 48)}px`;
        guide.classList.add("is-visible");
      };
      const showModel = (event, lock = false) => {
        const point = event.points?.[0];
        if (!point) return hide(true);
        const row = rows.find(item => String(item.date) === String(point.x));
        if (!row) return hide(true);
        binding.touchLocked = lock;
        const displayDate = dateRu(row.date);
        const metricValue = state.mode === "yield"
          ? pct(row.yield, 2)
          : asset.assetType === "macro"
            ? `${num(row[valueKey], 2)}%`
            : asset.assetType === "rate"
            ? `${num(row.price, 2)}%`
            : ["currency", "index", "commodity"].includes(asset.assetType)
              ? `${asset.valuePrefix || ""}${num(row.price, asset.valueDigits ?? 2)}${asset.valueSuffix ? ` ${asset.valueSuffix}` : ""}`
: `${num(row.price, 2)}${asset.assetType === "bond" ? "%" : ` ${currencyLabel(asset.currency)}`}`;
        const turnoverMetric = ["rate", "macro"].includes(asset.assetType) || !Number(row.turnover)
          ? ""
          : `<span class="asset-chart-tooltip__metric"><i style="--tooltip-color:rgba(16,18,21,.20)"></i>Оборот</span><strong>${htmlEsc(money(row.turnover || 0, "RUB", 0))}</strong>`;
        tooltip.innerHTML = `<span class="asset-chart-tooltip__period">${htmlEsc(displayDate)}</span>
          ${turnoverMetric}
          <span class="asset-chart-tooltip__metric"><i style="--tooltip-color:${htmlEsc(lineColor)}"></i>${htmlEsc(yTitle)}</span><strong>${htmlEsc(metricValue)}</strong>`;
        tooltip.classList.add("is-visible");
        requestAnimationFrame(() => place(point, event.event || {}));
      };
      const show = event => showModel(event, false);
      const click = event => showModel(event, true);
      const unhover = () => hide(false);
      const leave = () => { binding.pointer = null; hide(false); };
      const scrollHide = () => hide(true);
      Object.assign(binding, { show, click, unhover, track, leave, scrollHide });
      assetChartBindings.set(chart, binding);
      chart.addEventListener("mousemove", track, { capture: true, passive: true });
      chart.addEventListener("mouseleave", leave, { passive: true });
      window.addEventListener("scroll", scrollHide, { capture: true, passive: true });
      chart.on("plotly_hover", show);
      chart.on("plotly_click", click);
      chart.on("plotly_unhover", unhover);
    }

    function renderChart(asset) {
      const allRows = filteredHistory(asset);
      const macroSeries = {
        annual: { key: "ytd", label: "Годовая инфляция с начала года, %" },
        monthly: { key: "monthly", label: "Помесячная инфляция, %" },
        monthlyAnnual: { key: "price", label: "Помесячная инфляция в годовом выражении, %" },
      };
      const selectedMacroSeries = asset.assetType === "macro"
        ? (macroSeries[state.mode] || macroSeries.monthlyAnnual)
        : null;
      const valueKey = selectedMacroSeries?.key || (state.mode === "yield" ? "yield" : "price");
      const seriesRows = asset.assetType === "macro" && state.mode === "annual"
        ? annualInflationRows(allRows).map(row => ({ ...row, ytd: row.annualValue }))
        : allRows;
      const rows = seriesRows.filter(row => asset.assetType === "macro"
        ? Number.isFinite(Number(row[valueKey]))
        : Number(row[valueKey]) > 0);
      const x = rows.map(row => row.date);
      const price = rows.map(row => row.price);
      const yieldClose = rows.map(row => row.yield);
      const turnover = rows.map(row => row.turnover || 0);
      const showTurnover = !["rate", "macro"].includes(asset.assetType) && turnover.some(value => Number(value) > 0);
      const y = selectedMacroSeries
        ? rows.map(row => Number(row[valueKey]))
        : state.mode === "yield" ? yieldClose : price;
      const yTitle = selectedMacroSeries?.label
        || (state.mode === "yield" ? "Доходность, %" : (asset.chartLabel || (asset.assetType && asset.assetType !== "bond" ? `Цена, ${asset.currency || "RUB"}` : "Цена, %")));
      const yRange = adaptiveAxisRange(
        y,
        asset.assetType === "macro" && state.mode === "monthly"
          ? "signed"
          : state.mode === "yield" ? "yield" : "price"
      );
      const turnoverRange = adaptiveAxisRange(turnover, "turnover");
      const lineColor = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
      const hasPlotly = typeof Plotly !== "undefined";
      if (!hasPlotly) {
        document.getElementById("chart").innerHTML = "<div class='desc'>Plotly.js не загрузился. Подключите интернет или положите локальный plotly.min.js рядом с HTML.</div>";
        return;
      }
      if (!rows.length) {
        Plotly.purge("chart");
        document.getElementById("chart").innerHTML = `<div class="chart-empty">${state.mode === "yield" ? "История доходности MOEX отсутствует" : "История котировок MOEX отсутствует"}</div>`;
        return;
      }
      const traces = [
        ...(showTurnover ? [{
          type: "bar",
          x,
          y: turnover,
          yaxis: "y2",
          marker: { color: "rgba(16,18,21,.10)", line: { width: 0 } },
          hoverinfo: "none",
          name: "Оборот"
        }] : []),
        {
          type: "scatter",
          mode: "lines",
          x,
          y,
          connectgaps: true,
          line: {
            color: lineColor,
            width: 4,
            shape: asset.assetType === "rate" ? "hv" : "spline",
            smoothing: asset.assetType === "rate" ? 0 : 1.15
          },
          fill: "none",
          fillcolor: `${lineColor}18`,
          hoverinfo: "none",
          name: yTitle
        }
      ];
      Plotly.react("chart", traces, {
        margin: { l: 42, r: showTurnover ? 42 : 18, t: 10, b: 38 },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        hovermode: "x unified",
        showlegend: false,
        xaxis: {
          tickfont: { color: "rgba(16,18,21,.48)", size: 11 },
          gridcolor: "rgba(16,18,21,.06)",
          zeroline: false,
          rangeslider: { visible: false }
        },
        yaxis: {
          title: "",
          tickfont: { color: "rgba(16,18,21,.50)", size: 11 },
          gridcolor: "rgba(16,18,21,.08)",
          zeroline: false,
          range: yRange
        },
        yaxis2: {
          visible: showTurnover,
          overlaying: "y",
          side: "right",
          showgrid: false,
          tickfont: { color: "rgba(16,18,21,.38)", size: 11 },
          zeroline: false,
          range: turnoverRange
        },
      }, { responsive: true, displayModeBar: false }).then(() => bindAssetChartTooltip(document.getElementById("chart"), asset, rows, yTitle, lineColor, valueKey));
    }

    function render() {
      const asset = ASSETS[state.assetIndex];
      const marketOnlyCard = ["currency", "index", "commodity", "rate"].includes(asset.assetType);
      document.body.classList.toggle("index-card", marketOnlyCard);
      renderLogo(asset);
      renderSummary(asset);
      renderDetailCta(asset);
      renderCashflow(asset);
      renderChart(asset);
      setActiveButtons("assetButtons", "asset", String(state.assetIndex));
      setActiveButtons("rangeButtons", "range", state.range);
      const macroRangeButtons = document.getElementById("rangeButtons");
      const activeMacroRange = macroRangeButtons?.querySelector('button[aria-selected="true"]');
      if (asset.assetType === "macro" && activeMacroRange && macroRangeButtons.scrollWidth > macroRangeButtons.clientWidth) {
        macroRangeButtons.scrollTo({
          left: activeMacroRange.offsetLeft - (macroRangeButtons.clientWidth - activeMacroRange.offsetWidth) / 2,
          behavior: "auto",
        });
      }
      setActiveButtons("modeButtons", "mode", state.mode);
      syncMacroSelects(asset);
      requestAnimationFrame(() => {
        applyLogoAccentFromImage();
        renderChart(ASSETS[state.assetIndex]);
      });
    }

    renderButtons();
    render();
    window.addEventListener("resize", () => renderChart(ASSETS[state.assetIndex]));
  
