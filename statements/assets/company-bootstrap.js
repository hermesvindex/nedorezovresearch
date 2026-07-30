(function () {
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
  const data = unpackTables(window.STATEMENTS_PACKED || window.STATEMENTS_COMPANY || {});
  window.STATEMENTS_COMPANY = data;
  window.QUANTIS_ISSUER_MARKET = data.market;
  const title = data.company_name || data.ticker || "Эмитент";
  document.title = title + " — финансовая отчетность";
  const titleNode = document.getElementById("companyTitle");
  if (titleNode) titleNode.textContent = title;
  const logoNode = document.getElementById("companyLogo");
  const logo = data.logo_path || data.logo || (data.market && data.market.logo_path);
  if (logoNode && logo) {
    const image = document.createElement("img");
    image.src = logo;
    image.alt = "";
    image.decoding = "async";
    logoNode.replaceChildren(image);
  }
  const chips = document.getElementById("companyChips");
  if (chips) {
    const values = [data.ticker, data.isin, data.sector];
    if (Array.isArray(data.records)) values.push(data.records.length.toLocaleString("ru-RU") + " наблюдений");
    chips.replaceChildren(...values.filter(Boolean).map(function (value) {
      const item = document.createElement("span");
      item.className = "company-chip";
      item.textContent = value;
      return item;
    }));
  }
  const peerTitle = document.getElementById("peerTitle");
  if (peerTitle) peerTitle.textContent = (data.sector ? data.sector + ": " : "") + "эмитент и сопоставимые компании";
}());
