window.NR_BETA_DATA = {
  asOf: "2026-09-11",
  rateScenario: {
    currentKeyRate: 14.0,
    firstYearAverageKeyRate: 12.35,
    firstYearTerminalKeyRate: 10.0,
    longRunKeyRate: 8.0,
    longRunReachedYears: 5,
    moneyMarketTrackingSpread: 0.55
  },
  brokers: {
    vtb: { ru: "ВТБ", en: "VTB", manager: "ВИМ Инвестиции", funds: { money: "LQDT", bonds: "OBLG", equity: "EQMX", gold: "GOLD" } },
    alfa: { ru: "Альфа-Инвестиции", en: "Alfa Investments", manager: "Альфа-Капитал", funds: { money: "AKMM", bonds: "AKFB", equity: "AKME", gold: "AKGD" } },
    aton: { ru: "АТОН", en: "ATON", manager: "Атон-менеджмент", funds: { money: "AMNR", bonds: "AMFL", equity: "AMRE", gold: "AMGL" } },
    sber: { ru: "СберИнвестиции", en: "SberInvestments", manager: "Первая", funds: { money: "SBMM", bonds: "SBFR", equity: "SBMX", gold: "SBGD" } },
    tbank: { ru: "Т-Инвестиции", en: "T-Investments", manager: "Т-Капитал", funds: { money: "TMON", bonds: "TBRU", equity: "TMOS", gold: "TGLD" } },
    bcs: { ru: "БКС", en: "BCS", manager: "БКС", funds: { money: "BCSD", bonds: "OBLG", equity: "BCSR", gold: "BCSG" } },
    finam: { ru: "Финам", en: "Finam", manager: "Финам Менеджмент", funds: { money: "FMMM", bonds: "FMBR", equity: "SBMX", gold: "GOLD" } },
    other: { ru: "Другой брокер", en: "Other broker", manager: "", funds: { money: "AKMM", bonds: "SBFR", equity: "SBMX", gold: "GOLD" } }
  },
  instruments: {
    AKMM: { kind: "money", manager: "Альфа-Капитал", ru: "БПИФ Альфа Денежный рынок", en: "Alfa Money Market fund", risk: 0.2, return: 11.28, liquidity: "high" },
    LQDT: { kind: "money", manager: "ВИМ Инвестиции", ru: "БПИФ Ликвидность", en: "Liquidity money market fund", risk: 0.2, return: 11.28, liquidity: "high" },
    SBMM: { kind: "money", manager: "Первая", ru: "БПИФ Первая Сберегательный", en: "Pervaya Savings fund", risk: 0.2, return: 11.28, liquidity: "high" },
    BCSD: { kind: "money", manager: "БКС", ru: "БПИФ БКС Денежный рынок", en: "BCS Money Market fund", risk: 0.2, return: 11.28, liquidity: "high" },
    AMNR: { kind: "money", manager: "Атон-менеджмент", ru: "АТОН — Накопительный в рублях", en: "ATON RUB Accumulation fund", risk: 0.2, return: 11.28, liquidity: "high" },
    TMON: { kind: "money", manager: "Т-Капитал", ru: "Т-Капитал Денежный рынок", en: "T-Capital Money Market fund", risk: 0.24, return: 11.28, liquidity: "medium" },
    FMMM: { kind: "money", manager: "Финам Менеджмент", ru: "Финам Денежный рынок", en: "Finam Money Market fund", risk: 0.26, return: 11.28, liquidity: "medium" },

    SBFR: { kind: "bonds", manager: "Первая", rateType: "floater", rateSpread: 0.55, ru: "БПИФ Первая Облигации флоатеры", en: "Pervaya Floating-Rate Bonds fund", risk: 3.0, return: 11.35, liquidity: "high" },
    AKFB: { kind: "bonds", manager: "Альфа-Капитал", rateType: "floater", rateSpread: 0.65, ru: "БПИФ Альфа Облигации с переменным купоном", en: "Alfa Floating-Rate Bonds fund", risk: 3.0, return: 11.45, liquidity: "high" },
    OBLG: { kind: "bonds", manager: "ВИМ Инвестиции", rateType: "fixedFund", yield: 14.1, duration: 2.1, ru: "БПИФ Российские облигации", en: "Russian Bonds fund", risk: 3.0, return: 10.24, liquidity: "medium" },
    AMFL: { kind: "bonds", manager: "Атон-менеджмент", rateType: "floater", rateSpread: 1.08, ru: "БПИФ АТОН — Флоатеры", en: "ATON Floaters fund", risk: 3.0, return: 11.88, liquidity: "medium" },
    TBRU: { kind: "bonds", manager: "Т-Капитал", rateType: "fixedFund", yield: 14.0, duration: 2.0, ru: "БПИФ Т-Капитал Облигации", en: "T-Capital Bonds fund", risk: 3.2, return: 9.77, liquidity: "medium" },
    FMBR: { kind: "bonds", manager: "Финам Менеджмент", rateType: "fixedFund", yield: 14.4, duration: 1.8, ru: "БПИФ Финам Облигации с выплатой", en: "Finam Income Bonds fund", risk: 3.0, return: 12.2, liquidity: "medium" },
    OFZ26232: { ticker: "SU26232RMFS7", kind: "bonds", rateType: "fixed", yield: 13.05, ru: "ОФЗ-ПД 26232", en: "OFZ-PD 26232", risk: 1.87, return: 13.05, rating: "AAA", duration: 1.01, liquidity: "high" },
    OFZ26236: { ticker: "SU26236RMFS8", kind: "bonds", rateType: "fixed", yield: 14.64, ru: "ОФЗ-ПД 26236", en: "OFZ-PD 26236", risk: 2.34, return: 14.64, rating: "AAA", duration: 1.59, liquidity: "high" },
    OFZ26248: { ticker: "SU26248RMFS3", kind: "bonds", rateType: "fixed", yield: 16.20, ru: "ОФЗ-ПД 26248 16/05/2040", en: "OFZ-PD 26248 16/05/2040", risk: 7.70, return: 22.36, rating: "AAA", duration: 6.04, liquidity: "high" },
    OFZ26254: { ticker: "SU26254RMFS1", kind: "bonds", rateType: "fixed", yield: 16.19, ru: "ОФЗ-ПД 26254 03/10/2040", en: "OFZ-PD 26254 03/10/2040", risk: 7.06, return: 22.17, rating: "AAA", duration: 5.91, liquidity: "high" },
    AEP12: { ticker: "RU000A10F7L0", kind: "bonds", ru: "Атомэнергопром 001Р-12", en: "Atomenergoprom 001R-12", risk: 4.67, return: 15.83, rating: "AAA", duration: 2.26, liquidity: "high" },
    SIBUR07: { ticker: "RU000A10C8T4", kind: "bonds", ru: "СИБУР Холдинг 001Р-07", en: "SIBUR Holding 001R-07", risk: 3.95, return: 15.16, rating: "AAA", duration: 2.04, liquidity: "high" },
    GLORAX21: { ticker: "RU000A10FMQ8", kind: "bonds", ru: "ГЛОРАКС 002Р-01", en: "GLORAX 002R-01", risk: 12.0, return: 21.12, rating: "BBB+", duration: 2.50, liquidity: "high" },
    ASV05: { ticker: "RU000A10FJJ9", kind: "bonds", ru: "АСВ БО-05-001Р", en: "ASV BO-05-001R", risk: 18.0, return: 24.98, rating: "BB+", duration: 2.08, liquidity: "high" },
    VERNEM13: { ticker: "RU000A10FM03", kind: "bonds", ru: "ПКО Вернём 1Р3", en: "PKO Vernyom 1R3", risk: 25.0, return: 28.74, rating: "B", duration: 2.07, liquidity: "medium" },

    SIBURFX: { ticker: "RU000A10AXW4", kind: "bonds", currency: "USD", isFxBond: true, entryLotRub: 7946.98, ru: "СИБУР Холдинг, валютный выпуск", en: "SIBUR Holding foreign-currency bond", risk: 10.06, return: 22.40, rating: "AAA", liquidity: "high" },
    NOVATEKFX: { ticker: "RU000A10AUX8", kind: "bonds", currency: "USD", isFxBond: true, entryLotRub: 7874.24, ru: "НОВАТЭК, валютный выпуск", en: "NOVATEK foreign-currency bond", risk: 10.00, return: 22.59, rating: "AAA", liquidity: "high" },
    NORNICKELFX: { ticker: "RU000A10BTU4", kind: "bonds", currency: "USD", isFxBond: true, entryLotRub: 8215.40, ru: "Норильский никель, валютный выпуск", en: "Norilsk Nickel foreign-currency bond", risk: 12.13, return: 19.93, rating: "AAA", liquidity: "medium" },

    SBMX: { kind: "equity", manager: "Первая", ru: "БПИФ Первая Топ российских акций", en: "Pervaya Top Russian Equities fund", risk: 23.84, return: 7.2, liquidity: "high" },
    EQMX: { kind: "equity", manager: "ВИМ Инвестиции", ru: "БПИФ Индекс МосБиржи", en: "MOEX Index fund", risk: 23.55, return: 7.38, liquidity: "high" },
    AKME: { kind: "equity", manager: "Альфа-Капитал", ru: "БПИФ Альфа Управляемые акции", en: "Alfa Managed Equities fund", risk: 23.6, return: 7.17, liquidity: "high" },
    AMRE: { kind: "equity", manager: "Атон-менеджмент", ru: "БПИФ АТОН — Российские акции +", en: "ATON Russian Equities Plus fund", risk: 24.72, return: 6.23, liquidity: "medium" },
    TMOS: { kind: "equity", manager: "Т-Капитал", ru: "БПИФ Т-Капитал Индекс МосБиржи", en: "T-Capital MOEX Index fund", risk: 23.7, return: 7.41, liquidity: "medium" },
    BCSR: { kind: "equity", manager: "БКС", ru: "БПИФ БКС Индекс российского рынка", en: "BCS Russian Market Index fund", risk: 24.26, return: 6.79, liquidity: "medium" },
    SBER: { kind: "equity", ru: "Сбербанк, ао", en: "Sberbank ordinary shares", risk: 20.22, return: 11.16, liquidity: "high", sector: "finance" },
    LKOH: { kind: "equity", ru: "ЛУКОЙЛ, ао", en: "LUKOIL ordinary shares", risk: 28.45, return: 13.76, liquidity: "high", sector: "energy" },
    YDEX: { kind: "equity", ru: "Яндекс", en: "Yandex", risk: 26.99, return: 7.43, liquidity: "high", sector: "technology" },
    GMKN: { kind: "equity", ru: "Норильский никель", en: "Norilsk Nickel", risk: 29.19, return: 15.51, liquidity: "high", sector: "materials" },

    GOLD: { kind: "gold", manager: "ВИМ Инвестиции", ru: "БПИФ ВИМ Золото", en: "VIM Gold fund", risk: 19.66, return: 8.0, liquidity: "high" },
    SBGD: { kind: "gold", manager: "Первая", ru: "БПИФ Первая Доступное золото", en: "Pervaya Accessible Gold fund", risk: 19.32, return: 8.02, liquidity: "high" },
    AKGD: { kind: "gold", manager: "Альфа-Капитал", ru: "БПИФ Альфа-Капитал Золото", en: "Alfa-Capital Gold fund", risk: 20.16, return: 7.35, liquidity: "high" },
    TGLD: { kind: "gold", manager: "Т-Капитал", ru: "БПИФ Т-Капитал Золото", en: "T-Capital Gold fund", risk: 19.66, return: 8.49, liquidity: "medium" },
    AMGL: { kind: "gold", manager: "Атон-менеджмент", ru: "АТОН — Накопительный в золоте", en: "ATON Gold Accumulation fund", risk: 19.56, return: 7.64, liquidity: "medium" },
    BCSG: { kind: "gold", manager: "БКС", ru: "БПИФ БКС Золото", en: "BCS Gold fund", risk: 19.89, return: 9.32, liquidity: "medium" }
  }
};
