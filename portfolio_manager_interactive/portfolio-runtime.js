(() => {
  "use strict";

  const DATA = window.NR_BETA_DATA;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const copy = {
    ru: {
      skip: "К содержанию", languageLabel: "Язык интерфейса", eyebrow: "КОНСТРУКТОР ПОРТФЕЛЯ",
      introTitle: "Разместите деньги в соответствии с вашей целью",
      introCopy: "Конструктор разделит капитал по срокам, ликвидности и риску, затем покажет три объяснимых сценария с облигациями, акциями, БПИФами и золотом.",
      start: "Начать расчет", method: "Как работает расчет", timeEstimate: "5 коротких этапов · около 3 минут · ответы можно изменить",
      trustLabel: "Основные свойства", trustLocalTitle: "Ответы остаются на устройстве", trustLocalText: "Без аккаунта и отправки на сервер. Данные сохраняются только в этом браузере.",
      trustRiskTitle: "Риск разложен по факторам", trustRiskText: "Ликвидность, просадка, кредитный, процентный и валютный риск.",
      trustChoiceTitle: "Решение остается за вами", trustChoiceText: "Сервис сравнивает сценарии и раскрывает ограничения расчета.",
      privacyTitle: "Конфиденциальность", privacyFull: "Мы не запрашиваем ФИО, телефон, email или реквизиты счета. Ответы и состав портфеля сохраняются только в локальном хранилище этого браузера, не передаются на сервер или в аналитику. Их можно удалить кнопкой сброса.", legalShort: "Информационный сервис · Не является индивидуальной инвестиционной рекомендацией · Стоимость активов может снизиться",
      privacyStatus: "Локальная обработка", progressLabel: "Прогресс анкеты", exit: "Выйти", liveProfile: "ТЕКУЩИЙ ПРОФИЛЬ", profilePending: "Уточняется",
      previewGoal: "Цель", previewHorizon: "Горизонт", previewLiquidity: "Ликвидный резерв", previewBroker: "Брокер", privacyShort: "Ответ сохраняется только локально в этом браузере.",
      back: "Назад", next: "Продолжить", calculate: "Сформировать портфель", resetSavedData: "Сбросить", resultEyebrow: "РЕЗУЛЬТАТ РАСЧЕТА", resultsTitle: "Сформированный портфель", editAnswers: "Изменить ответы", constructorMode: "Классический конструктор", constructorFrameTitle: "Интерактивный конструктор портфеля", constructorSection: "Настройте портфель", constructorSectionText: "Расчет перенесен в конструктор. Изменяйте сумму, веса и состав инструментов непосредственно в таблице.",
      scenarioLabel: "Сценарии", allocationEyebrow: "СТРУКТУРА", allocationTitle: "Распределение капитала", modelDate: "Модельные параметры · 11.09.2026",
      stressEyebrow: "СТРЕСС-ТЕСТ", stressTitle: "Что может произойти", cashflowEyebrow: "ДЕНЕЖНЫЙ ПОТОК", cashflowTitle: "Выплаты и реинвестирование",
      brokerEyebrow: "РЕАЛИЗАЦИЯ", brokerTitle: "Брокер и расходы", checksEyebrow: "КОНТРОЛЬ", checksTitle: "Ограничения портфеля",
      disclosureTitle: "", disclosureText: "Ожидаемая стоимость, доходность, денежный поток и стресс-сценарии являются модельными оценками. Комиссии, налоги, спреды, доступность инструментов и индивидуальные ограничения в расчет не включены. Перед сделкой проверьте дату данных и актуальные условия выбранных инструментов. Nedorezov Research не получает, не передает, не хранит и не анализирует ответы анкеты или состав Вашего портфеля.",
      restart: "Начать новый расчет", methodEyebrow: "МЕТОДИКА", methodTitle: "Как строятся сценарии", close: "Закрыть",
      methodStep1: "Определяется обязательный ликвидный резерв.", methodStep2: "Риск-способность и риск-готовность рассчитываются раздельно.", methodStep3: "Итоговый риск ограничивается более низкой оценкой.", methodStep4: "Инструменты фильтруются по сроку, доступу, ликвидности и структуре.", methodStep5: "Сформированный портфель проходит стресс-тест и проверку концентраций.", methodNote: "Ожидаемая доходность является модельной оценкой, а не обещанием результата.",
      q1k: "ЭТАП 1 · ЦЕЛЬ И СРОК", q1t: "Для чего и на какой срок размещаются деньги?", q1h: "Цель и срок задают основное ограничение риска.",
      q2k: "ЭТАП 2 · КАПИТАЛ И ЛИКВИДНОСТЬ", q2t: "Сколько размещается и какая часть может неожиданно понадобиться?", q2h: "",
      q3k: "ЭТАП 3 · РИСК", q3t: "Готовность к риску", q3h: "Укажите временное снижение стоимости портфеля, при котором вы сможете сохранить выбранный срок инвестирования.",
      q4k: "ЭТАП 4 · ВЫПЛАТЫ И ОПЫТ", q4t: "Как использовать выплаты и какой у вас опыт?", q4h: "Режим выплат влияет на денежный поток, опыт — на сложность доступных инструментов.",
      q5k: "ЭТАП 5 · ИНСТРУМЕНТЫ", q5t: "Какие классы активов использовать?", q5h: "Кредитное качество и лимиты концентрации рассчитываются автоматически по вашему профилю.",
      q6k: "ШАГ 6 · ПРОСАДКА", q6t: "Какое временное снижение приемлемо?", q6h: "Оценивайте падение стоимости в рублях, а не только в процентах.",
      q7k: "ШАГ 7 · ПОВЕДЕНИЕ", q7t: "Что вы сделаете при снижении портфеля?", q7h: "Ответ оценивает готовность сохранять выбранную стратегию в стрессовом периоде.",
      q8k: "ШАГ 8 · ОПЫТ", q8t: "Какой у вас опыт инвестирования?", q8h: "Сложность инструментов ограничивается опытом и частотой контроля.",
      q9k: "ШАГ 9 · СЧЕТ", q9t: "Через кого вы совершаете сделки?", q9h: "Брокер влияет на доступность инструментов и фактические расходы. Тарифы нужно проверять перед сделкой.",
      q10k: "ШАГ 10 · СОСТАВ", q10t: "Какие ограничения учитывать?", q10h: "Параметры используются для структуры модельных сценариев.",
      required: "Заполните обязательные поля.", invalidAmount: "Укажите сумму от 10 000 до 1 000 000 000 рублей.", invalidShare: "Укажите долю от 0 до 100%.", invalidAssets: "Выберите хотя бы один класс активов.",
      goalReserve: "Сберечь сумму", goalReserveDesc: "Ограничить колебания и риск потери капитала", goalIncome: "Получать выплаты", goalIncomeDesc: "Использовать купоны и дивиденды как регулярный доход", goalGrowth: "Нарастить капитал", goalGrowthDesc: "Оставлять доход в портфеле ради долгосрочного роста",
      amount: "Начальная сумма, ₽", monthly: "Ежемесячное пополнение, ₽", optional: "необязательно",
      horizon6: "До 6 месяцев", horizon12: "6–12 месяцев", horizon36: "1–3 года", horizon60: "3–5 лет", horizonLong: "Более 5 лет",
      flexible: "Срок можно перенести на 12 месяцев и более", currency: "Валюта будущих расходов", rub: "Расходы преимущественно в рублях", foreign: "Есть расходы, привязанные к валюте", currencyHint: "Выберите второй вариант, если стоимость цели зависит от курса: зарубежная недвижимость, обучение, поездки, автомобиль, оборудование или другие товары с валютным ценообразованием.",
      reserveMonths: "Существующий резерв вне портфеля", reserve0: "Нет", reserve1: "До 1 месяца расходов", reserve3: "1–3 месяца расходов", reserve6: "3–6 месяцев расходов", reserveMore: "Более 6 месяцев расходов",
      urgent: "Доля портфеля, которая может неожиданно понадобиться", reinvest: "Реинвестировать", withdraw: "Выводить",
      maxLoss: "Максимальное временное снижение", lossRub: "Это примерно {value} от начальной суммы", drawdownExplain: "Временное снижение — падение текущей стоимости портфеля ниже вложенной суммы. Убыток фиксируется при продаже активов до восстановления их стоимости.",
      sellAll: "Продам", sellPart: "Сокращу риск", hold: "Сохраню план", buy: "Продолжу покупки по плану",
      expNone: "Опыта нет", expBasic: "Вклады", expMixed: "Денежный рынок", expAdvanced: "Акции и облигации",
      review: "Как часто готовы проверять портфель?", reviewMonth: "Ежемесячно", reviewQuarter: "Раз в квартал", reviewYear: "Один-два раза в год",
      broker: "Брокер или банк", tariff: "Тариф или комиссия за сделки", tariffUnknown: "Не знаю", tariffLow: "До 0,1%", tariffMid: "0,1–0,3%", tariffHigh: "Выше 0,3%", qualified: "Есть статус квалифицированного инвестора", bondAccess: "Квалификация и тестирование", accessBasic: "Тесты не проходил", accessTested: "Проходил тестирование", accessQualified: "Есть статус квалифицированного инвестора", assetStocks: "Акции", assetFunds: "БПИФы", assetBonds: "Облигации",
      style: "Предпочтительная форма владения", styleFunds: "Преимущественно БПИФы", styleDirect: "Преимущественно прямые бумаги", styleMixed: "Смешанный состав",
      ofzCore: "Сформировать основу облигационной части из ОФЗ", rating: "Минимальный рейтинг корпоративных облигаций", ratingAAA: "AAA и выше", ratingAA: "AA− и выше", ratingA: "A− и выше", ratingBBB: "BBB− и выше", ratingBB: "BB− и выше", ratingB: "B− и выше", ratingScope: "Рейтинговый фильтр применяется к прямым облигациям. Для БПИФов требуется отдельный анализ состава фонда.", gold: "Добавить золото", maxIssuer: "Максимальная доля корпоративного эмитента", sectionGoal: "Цель", sectionHorizon: "Срок", sectionCapital: "Сумма", sectionLiquidity: "Доступность денег", sectionRisk: "Допустимое снижение", sectionBehavior: "Действие при снижении", sectionPayouts: "Выплаты", sectionExperience: "Опыт", sectionAccount: "Брокер и доступ", sectionAssets: "Состав",
      conservative: "Консервативный", cautious: "Осторожный", balanced: "Сбалансированный", growth: "Ростовой",
      capability: "Риск-способность", willingness: "Риск-готовность", liquidityFloor: "Минимальный резерв", horizon: "Горизонт", years: "лет", month: "мес.",
      resultLead: "Сценарии ограничены вашим сроком, ликвидным резервом и допустимой просадкой.",
      defensive: "Защитный", base: "Базовый", dynamic: "Динамичный", defensiveDesc: "Приоритет ликвидности и устойчивости к просадке.", baseDesc: "Баланс заданной цели, риска и ожидаемого результата.", dynamicDesc: "Максимальная доля роста в пределах рассчитанных ограничений.",
      expected: "Модельный диапазон", risk: "Комбинированный стресс", liquid: "Высоколиквидно", yearSuffix: "в год", riskLow: "низкая чувствительность", riskMedium: "средняя чувствительность", riskHigh: "высокая чувствительность",
      classMoney: "Ликвидный резерв", classBonds: "Облигации", classEquity: "Акции", classGold: "Золото", instrument: "Инструмент", share: "Доля", amountLabel: "Сумма", role: "Роль", currencyProtection: "Валютная защита",
      roleMoney: "Срочные расходы и стабилизация", roleBonds: "Купонный доход и срок", roleFxBonds: "Защита от ослабления рубля", roleEquity: "Долгосрочный рост", roleGold: "Диверсификация и валютный фактор",
      stressRate: "Ставки +2 п.п.", stressEquity: "Акции −30%", stressGold: "Золото −15%", stressCredit: "Кредитный стресс", stressFx: "Рубль укрепляется на 15%", stressCombined: "Комбинированный стресс", portfolioEffect: "эффект на портфель",
      paymentsReinvest: "Выплаты остаются в портфеле и участвуют в сложном проценте.", paymentsWithdraw: "Купоны и дивиденды направляются на счет. Для стабильной выплаты требуется отдельный календарь денежных потоков.",
      indicativeIncome: "Ориентир денежного потока", perMonth: "в месяц до налогов и комиссий", targetWithdrawal: "Заданное изъятие", coverage: "Расчетное покрытие",
      brokerCandidate: "Для {broker} в модель включены биржевые фонды-кандидаты, включая продукты управляющей компании {manager}. Доступность проверяется в приложении брокера.", brokerNeutral: "Выбран нейтральный набор ликвидных биржевых инструментов-кандидатов.",
      tariffCheck: "Комиссия брокера, спред, вознаграждение фонда и налоговый режим в расчет доходности не включены. Актуальный тариф не подтвержден.", affiliation: "Связь брокера и управляющей компании сама по себе не подтверждает меньшие совокупные расходы.",
      ok: "Выполнено", attention: "Проверить", checkLiquidity: "Ликвидный резерв соответствует заданной потребности", checkIssuer: "Доля одного прямого эмитента, включая отдельный выпуск ОФЗ, не превышает 15%", checkQualified: "Инструменты только для квалифицированных инвесторов не используются", checkBondTest: "Для облигаций ниже A+ брокер может потребовать тестирование. Статус квалифицированного инвестора сам по себе не обязателен", checkFees: "Фактические комиссии и спреды требуют проверки", checkCurrency: "Валютная защита сформирована прямыми валютными облигациями в пределах суммы и лимита эмитента", checkCurrencySmall: "Суммы недостаточно для минимального диверсифицированного набора валютных облигаций. Валютный блок появится от 250 000 ₽.",
      modelOnly: "Все значения являются модельными оценками", noGuarantee: "Комбинированный стресс не является волатильностью, VaR, максимальным убытком или вероятностью потери. Доходность, ликвидность и стоимость активов могут измениться. Налоги, комиссии и индивидуальные ограничения не учтены.",
      duration: "модифицированная дюрация", ratingShort: "рейтинг", fundDiversified: "диверсифицированный фонд", directSecurity: "прямая биржевая бумага", preference: "учтена выбранная форма владения",
      notAssessed: "Не оценена", actualLiquidity: "Ликвидная доля",
      defaultPayments: "Показан расчетный денежный поток текущего состава портфеля. Режим вывода или реинвестирования выплат определяется после прохождения анкеты.",
      defaultLiquidityCheck: "Минимальный резерв не задан: пройдите анкету для проверки достаточности ликвидной доли", defaultIssuerCheck: "Доля одного прямого эмитента, включая отдельный выпуск ОФЗ, не превышает 15%", defaultIssuerAttention: "Доля одного прямого эмитента, включая отдельный выпуск ОФЗ, превышает 15%", defaultCurrencyCheck: "В составе портфеля есть прямые валютные облигации", defaultCurrencyMissing: "Прямые валютные облигации в составе портфеля отсутствуют"
    },
    en: {
      skip: "Skip to content", languageLabel: "Interface language", eyebrow: "PORTFOLIO BUILDER · BETA",
      introTitle: "Allocate capital in line with your objective", introCopy: "The builder separates capital by horizon, liquidity and risk, then presents three explainable scenarios using bonds, equities, exchange-traded funds and gold.",
      start: "Start", method: "How the model works", timeEstimate: "5 short stages · about 3 minutes · answers can be changed",
      trustLabel: "Core properties", trustLocalTitle: "Answers stay on this device", trustLocalText: "No account or server submission. Data is stored only in this browser.", trustRiskTitle: "Risk is separated by factor", trustRiskText: "Liquidity, drawdown, credit, interest-rate and currency risk.", trustChoiceTitle: "You retain control", trustChoiceText: "The service compares scenarios and discloses model limitations.",
      privacyTitle: "Privacy", privacyFull: "We do not request your name, phone number, email address or account details. Answers and portfolio holdings are stored only in this browser's local storage and are not sent to a server or analytics service. You can delete them with the reset control.", privacyStatus: "Local processing", legalShort: "Information service · Not an individual investment recommendation · Asset values can fall",
      progressLabel: "Questionnaire progress", exit: "Exit", liveProfile: "CURRENT PROFILE", profilePending: "Being assessed", previewGoal: "Objective", previewHorizon: "Horizon", previewLiquidity: "Liquidity reserve", previewBroker: "Broker", privacyShort: "This answer is stored only locally in this browser.",
      back: "Back", next: "Continue", calculate: "Generate portfolio", resetSavedData: "Reset", resultEyebrow: "MODEL OUTPUT", resultsTitle: "Generated portfolio", editAnswers: "Edit answers", constructorMode: "Classic portfolio builder", constructorFrameTitle: "Interactive portfolio builder", constructorSection: "Fine-tune the portfolio", constructorSectionText: "The calculation is loaded into the builder. Edit capital, weights and instruments directly in the table.", scenarioLabel: "Scenarios",
      allocationEyebrow: "STRUCTURE", allocationTitle: "Capital allocation", modelDate: "Model parameters · 11 Sep 2026", stressEyebrow: "STRESS TEST", stressTitle: "Potential impact", cashflowEyebrow: "CASH FLOW", cashflowTitle: "Payments and reinvestment", brokerEyebrow: "IMPLEMENTATION", brokerTitle: "Broker and costs", checksEyebrow: "CONTROLS", checksTitle: "Portfolio constraints",
      disclosureTitle: "", disclosureText: "Expected value, return, cash flow and stress scenarios are model estimates. Fees, taxes, bid–ask spreads, instrument availability and individual restrictions are excluded. Check the data date and current instrument terms before trading. Nedorezov Research does not receive, transmit, store or analyze questionnaire answers or your portfolio holdings.", restart: "Start a new calculation",
      methodEyebrow: "METHODOLOGY", methodTitle: "How the portfolio is built", close: "Close", methodStep1: "A mandatory liquidity reserve is calculated.", methodStep2: "Risk capacity and risk willingness are assessed separately.", methodStep3: "The final risk level is capped by the lower score.", methodStep4: "Instruments are filtered by horizon, access, liquidity and structure.", methodStep5: "The generated portfolio undergoes stress and concentration checks.", methodNote: "Expected return is a model estimate and not a promise of performance.",
      q1k: "STAGE 1 · OBJECTIVE AND HORIZON", q1t: "What is the capital for and when will it be needed?", q1h: "The objective and horizon set the main risk constraint.", q2k: "STAGE 2 · CAPITAL AND LIQUIDITY", q2t: "How much will be invested and what share may be needed unexpectedly?", q2h: "", q3k: "STAGE 3 · RISK", q3t: "Risk tolerance", q3h: "Choose the temporary decline at which you could retain the selected investment horizon.", q4k: "STAGE 4 · DISTRIBUTIONS AND EXPERIENCE", q4t: "How will distributions be used and what is your experience?", q4h: "Distribution policy affects cash flow; experience limits instrument complexity.", q5k: "STAGE 5 · INSTRUMENTS", q5t: "Which asset classes should be used?", q5h: "Credit quality and concentration limits are calculated automatically from your profile.",
      required: "Complete the required fields.", invalidAmount: "Enter an amount between RUB 10,000 and RUB 1,000,000,000.", invalidShare: "Enter a percentage from 0 to 100%.", invalidAssets: "Select at least one asset class.",
      goalReserve: "Protect the amount", goalReserveDesc: "Limit fluctuations and the risk of capital loss", goalIncome: "Receive payments", goalIncomeDesc: "Use coupons and dividends as recurring income", goalGrowth: "Grow capital", goalGrowthDesc: "Keep income invested for long-term growth", amount: "Initial amount, RUB", monthly: "Monthly contribution, RUB", optional: "optional",
      horizon6: "Up to 6 months", horizon12: "6–12 months", horizon36: "1–3 years", horizon60: "3–5 years", horizonLong: "More than 5 years", flexible: "The date can be moved by 12 months or more", currency: "Currency of future spending", rub: "Spending mainly in Russian rubles", foreign: "Some spending is linked to foreign currency", currencyHint: "Choose the second option when the objective price moves with an exchange rate: overseas property, education, travel, a car, equipment or other goods priced with reference to foreign currency.",
      reserveMonths: "Existing reserve outside the portfolio", reserve0: "None", reserve1: "Less than one month of expenses", reserve3: "1–3 months of expenses", reserve6: "3–6 months of expenses", reserveMore: "More than 6 months of expenses", urgent: "Share that may be needed unexpectedly",
      reinvest: "Reinvest", withdraw: "Withdraw", maxLoss: "Maximum temporary decline", lossRub: "Approximately {value} of the initial amount", drawdownExplain: "A temporary decline means the portfolio's current value falls below the amount invested. Selling before prices recover makes the loss permanent.",
      sellAll: "Sell", sellPart: "Reduce risk", hold: "Stay with the plan", buy: "Continue scheduled purchases", expNone: "No experience", expBasic: "Deposits", expMixed: "Money market", expAdvanced: "Equities and bonds", review: "How often can you review the portfolio?", reviewMonth: "Monthly", reviewQuarter: "Quarterly", reviewYear: "Once or twice a year",
      broker: "Broker or bank", tariff: "Trading tariff or commission", tariffUnknown: "Unknown", tariffLow: "Up to 0.1%", tariffMid: "0.1–0.3%", tariffHigh: "Above 0.3%", qualified: "I have qualified investor status", bondAccess: "Qualification and testing", accessBasic: "No tests completed", accessTested: "Knowledge test completed", accessQualified: "Qualified investor status", assetStocks: "Equities", assetFunds: "ETFs", assetBonds: "Bonds", style: "Preferred holding format", styleFunds: "Primarily exchange-traded funds", styleDirect: "Primarily direct securities", styleMixed: "Mixed portfolio", ofzCore: "Use OFZ government bonds as the core bond allocation", rating: "Minimum corporate bond rating", ratingAAA: "AAA or higher", ratingAA: "AA− or higher", ratingA: "A− or higher", ratingBBB: "BBB− or higher", ratingBB: "BB− or higher", ratingB: "B− or higher", ratingScope: "The rating filter applies to direct bonds. Exchange-traded funds require separate holdings look-through.", gold: "Include gold", maxIssuer: "Maximum corporate issuer weight", sectionGoal: "Objective", sectionHorizon: "Horizon", sectionCapital: "Capital", sectionLiquidity: "Access to cash", sectionRisk: "Acceptable decline", sectionBehavior: "Action under stress", sectionPayouts: "Distributions", sectionExperience: "Experience", sectionAccount: "Broker and access", sectionAssets: "Composition",
      conservative: "Conservative", cautious: "Cautious", balanced: "Balanced", growth: "Growth", capability: "Risk capacity", willingness: "Risk willingness", liquidityFloor: "Minimum reserve", horizon: "Horizon", years: "years", month: "mo.", resultLead: "Scenarios are constrained by your horizon, liquidity reserve and acceptable drawdown.",
      defensive: "Defensive", base: "Base", dynamic: "Dynamic", defensiveDesc: "Prioritises liquidity and drawdown resilience.", baseDesc: "Balances the stated objective, risk and expected outcome.", dynamicDesc: "Uses the highest growth allocation within the calculated constraints.", expected: "Model range", risk: "Combined stress", liquid: "Highly liquid", yearSuffix: "per year", riskLow: "low sensitivity", riskMedium: "medium sensitivity", riskHigh: "high sensitivity",
      classMoney: "Liquidity reserve", classBonds: "Bonds", classEquity: "Equities", classGold: "Gold", instrument: "Instrument", share: "Weight", amountLabel: "Amount", role: "Role", currencyProtection: "Currency protection", roleMoney: "Near-term expenses and stabilisation", roleBonds: "Coupon income and horizon matching", roleFxBonds: "Protection against ruble depreciation", roleEquity: "Long-term growth", roleGold: "Diversification and currency sensitivity",
      stressRate: "Rates +2 pp", stressEquity: "Equities −30%", stressGold: "Gold −15%", stressCredit: "Credit stress", stressFx: "Ruble strengthens by 15%", stressCombined: "Combined stress", portfolioEffect: "portfolio impact",
      paymentsReinvest: "Distributions remain invested and participate in compounding.", paymentsWithdraw: "Coupons and dividends are transferred to cash. Stable withdrawals require a separate cash-flow calendar.", indicativeIncome: "Indicative cash flow", perMonth: "per month before tax and costs", targetWithdrawal: "Target withdrawal", coverage: "Model coverage",
      brokerCandidate: "For {broker}, the model includes candidate exchange-traded funds, including products managed by {manager}. Availability must be checked in the broker application.", brokerNeutral: "A neutral set of candidate liquid exchange-traded instruments is shown.", tariffCheck: "Broker commission, bid–ask spread, fund fee and tax treatment are excluded from expected return. The current tariff has not been verified.", affiliation: "Broker and asset-manager affiliation does not by itself demonstrate lower total costs.",
      ok: "Passed", attention: "Review", checkLiquidity: "The liquidity reserve covers the stated requirement", checkIssuer: "A single direct issuer, including an individual OFZ issue, does not exceed 15%", checkQualified: "No qualified-investor-only instruments are used", checkBondTest: "Bonds below A+ may require a broker knowledge test. Qualified-investor status is not automatically required", checkFees: "Actual commissions and bid–ask spreads require verification", checkCurrency: "Currency protection is formed with direct foreign-currency bonds within the capital and issuer limits", checkCurrencySmall: "The amount is insufficient for a minimally diversified set of foreign-currency bonds. The currency sleeve starts at RUB 250,000.", modelOnly: "All figures are model estimates", noGuarantee: "Combined stress is not volatility, VaR, maximum loss or a loss probability. Returns, liquidity and asset values may change. Tax, costs and individual restrictions are excluded.", duration: "modified duration", ratingShort: "rating", fundDiversified: "diversified fund", directSecurity: "direct exchange-traded security", preference: "selected holding format applied",
      notAssessed: "Not assessed", actualLiquidity: "Liquid allocation",
      defaultPayments: "The indicative cash flow is calculated from the current portfolio. The withdrawal or reinvestment policy is determined after the questionnaire.",
      defaultLiquidityCheck: "No minimum reserve is set: complete the questionnaire to assess the liquid allocation", defaultIssuerCheck: "A single direct issuer, including an individual OFZ issue, remains within 15%", defaultIssuerAttention: "A single direct issuer, including an individual OFZ issue, exceeds 15%", defaultCurrencyCheck: "The portfolio contains direct foreign-currency bonds", defaultCurrencyMissing: "The portfolio contains no direct foreign-currency bonds"
    }
  };

  const DEFAULT_STATE = Object.freeze({
    locale: "ru", step: 0, goal: "", amount: 1000000, monthly: 0,
    horizon: "36", flexible: false, currency: "rub", urgent: 20,
    payouts: "reinvest", maxLoss: 12,
    experience: "basic", broker: "other", tariff: "unknown", bondAccess: "basic",
    assetTypes: "stocks,funds,bonds", ofzCore: true, gold: true, maxIssuer: 15,
    selectedScenario: 1
  });
  const STATE_STORAGE_KEY = "nr_portfolio_state_v1";
  const CONSTRUCTOR_STORAGE_KEY = "portfolio_manager_state_v1";
  const CONSTRUCTOR_IMPORT_TOKEN_KEY = "portfolio_manager_import_token_v1";
  const PERSISTED_STATE_KEYS = Object.keys(DEFAULT_STATE);

  function loadSavedBetaState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STATE_STORAGE_KEY) || "null");
      if (!parsed || typeof parsed !== "object" || !parsed.state || typeof parsed.state !== "object") return null;
      const safeState = {};
      PERSISTED_STATE_KEYS.forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(parsed.state, key)) safeState[key] = parsed.state[key];
      });
      safeState.locale = copy[safeState.locale] ? safeState.locale : DEFAULT_STATE.locale;
      safeState.step = Math.max(0, Math.min(4, Number(safeState.step) || 0));
      return { state: safeState, generated: Boolean(parsed.generated), view: parsed.view === "wizard" ? "wizard" : "results" };
    } catch (_) {
      return null;
    }
  }

  const restoredBeta = loadSavedBetaState();
  const state = { ...DEFAULT_STATE, ...(restoredBeta?.state || {}), scenarios: [] };
  if (!["reinvest", "withdraw"].includes(state.payouts)) state.payouts = "reinvest";
  if (!state.assetTypes) state.assetTypes = DEFAULT_STATE.assetTypes;
  state.maxIssuer = 15;
  let hasGeneratedResult = Boolean(restoredBeta?.generated);

  function saveBetaState(view = "results") {
    try {
      const persisted = {};
      PERSISTED_STATE_KEYS.forEach((key) => { persisted[key] = state[key]; });
      localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify({
        version: 1,
        state: persisted,
        generated: state.scenarios.length > 0 || Boolean(restoredBeta?.generated),
        view: view === "wizard" ? "wizard" : "results"
      }));
    } catch (_) {}
  }

  const goalKeys = ["reserve", "income", "growth"];
  const horizonKeys = ["6", "12", "36", "60", "120"];

  function t(key, params = {}) {
    let value = copy[state.locale][key] ?? key;
    Object.entries(params).forEach(([name, replacement]) => { value = value.replace(`{${name}}`, replacement); });
    return value;
  }

  function money(value) {
    return new Intl.NumberFormat(state.locale === "ru" ? "ru-RU" : "en-US", {
      style: "currency", currency: "RUB", maximumFractionDigits: 0
    }).format(Math.round(value));
  }

  function pct(value, digits = 0) {
    const threshold = 0.5 * 10 ** (-digits);
    const normalized = Math.abs(Number(value) || 0) < threshold ? 0 : Number(value);
    return `${new Intl.NumberFormat(state.locale === "ru" ? "ru-RU" : "en-US", { maximumFractionDigits: digits }).format(normalized)}%`;
  }

  function managerName(name) {
    if (state.locale === "ru") return name;
    return {
      "ВИМ Инвестиции": "VIM Investments",
      "Альфа-Капитал": "Alfa-Capital",
      "Атон-менеджмент": "ATON Management",
      "Первая": "Pervaya",
      "Т-Капитал": "T-Capital",
      "БКС": "BCS",
      "Финам Менеджмент": "Finam Management"
    }[name] || name;
  }

  function applyTranslations() {
    document.documentElement.lang = state.locale;
    document.title = "Конструктор портфеля — Nedorezov Research";
    $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-aria]').forEach((el) => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
    $$('[data-i18n-title]').forEach((el) => { el.setAttribute("title", t(el.dataset.i18nTitle)); });
    $$("[data-locale]").forEach((button) => {
      const active = button.dataset.locale === state.locale;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function radioCards(name, options, current, compact = false, className = "") {
    return `<div class="option-grid${compact ? " option-grid--compact" : ""}${className ? ` ${className}` : ""}">${options.map(([value, label, description]) => `
      <label class="option-card">
        <input type="radio" name="${name}" value="${value}" ${current === value ? "checked" : ""}>
        ${description ? `<strong>${label}</strong><span>${description}</span>` : `<span>${label}</span>`}
      </label>`).join("")}</div>`;
  }

  function assetTypeCards() {
    const selected = new Set(String(state.assetTypes || "").split(",").filter(Boolean));
    return `<div class="option-grid option-grid--compact asset-type-grid">${[["stocks", t("assetStocks")], ["funds", t("assetFunds")], ["bonds", t("assetBonds")]].map(([value, label]) => `<label class="option-card"><input type="checkbox" name="assetTypes" value="${value}" ${selected.has(value) ? "checked" : ""}><span>${label}</span></label>`).join("")}</div>`;
  }

  function selectField(name, label, options, current, forceDropdown = false) {
    if (forceDropdown || options.length > 4) {
      return `<label class="field select-field"><span>${label}</span><select name="${name}">${options.map(([value, text]) => `<option value="${value}" ${String(current) === String(value) ? "selected" : ""}>${text}</option>`).join("")}</select></label>`;
    }
    return `<fieldset class="field choice-field"><legend>${label}</legend><div class="segmented-control segmented-control--count-${options.length}" role="radiogroup" aria-label="${label}">${options.map(([value, text]) => `<label class="segment-option"><input type="radio" name="${name}" value="${value}" ${String(current) === String(value) ? "checked" : ""}><span>${text}</span></label>`).join("")}</div></fieldset>`;
  }

  function toggleField(name, label, checked) {
    return `<label class="check-row"><input type="checkbox" name="${name}" ${checked ? "checked" : ""}><span>${label}</span><i aria-hidden="true"></i></label>`;
  }

  function numberField(name, label, value, min, max, optional = false) {
    return `<label class="field"><span>${label}${optional ? ` <small>(${t("optional")})</small>` : ""}</span><input type="text" inputmode="numeric" autocomplete="off" data-money name="${name}" value="${formatInputNumber(value)}" data-min="${min}" data-max="${max}"></label>`;
  }

  function formatInputNumber(value) {
    const rawDigits = String(value ?? "").replace(/\D/g, "");
    const digits = rawDigits.replace(/^0+(?=\d)/, "") || "0";
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  function parseInputNumber(value) {
    const digits = String(value || "").replace(/\D/g, "");
    return digits ? Number(digits) : 0;
  }

  function section(title, content) {
    return `<section class="question-section"><h2>${title}</h2>${content}</section>`;
  }

  function rangeField(name, label, value, min, max, suffix = "%") {
    return `<label class="range-field"><span><b>${label}</b><output id="${name}Output">${value}${suffix}</output></span><input type="range" name="${name}" min="${min}" max="${max}" value="${value}" step="1"></label>`;
  }

  function horizonField() {
    const labels = horizonKeys.map((key) => t(key === "120" ? "horizonLong" : `horizon${key}`));
    const index = Math.max(0, horizonKeys.indexOf(state.horizon));
    return `<label class="range-field horizon-field"><span><b>${t("horizon")}</b><output id="horizonOutput">${labels[index]}</output></span><input type="range" name="horizonStep" min="0" max="${horizonKeys.length - 1}" value="${index}" step="1"><span class="horizon-ticks" aria-hidden="true">${labels.map((label, tick) => `<small class="${tick === index ? "is-active" : ""}">${label}</small>`).join("")}</span></label>`;
  }

  const questions = [
    {
      kicker: "q1k", title: "q1t", help: "q1h",
      body: () => `${section(t("sectionGoal"), radioCards("goal", goalKeys.map((key) => [key, t(`goal${key[0].toUpperCase()}${key.slice(1)}`), t(`goal${key[0].toUpperCase()}${key.slice(1)}Desc`)]), state.goal, false, "option-grid--goals"))}${section(t("sectionHorizon"), horizonField())}`
    },
    {
      kicker: "q2k", title: "q2t", help: "q2h",
      body: () => `${section(t("sectionCapital"), `<div class="field-grid">${numberField("amount", t("amount"), state.amount, 10000, 1000000000)}${numberField("monthly", t("monthly"), state.monthly, 0, 100000000, true)}</div>`)}${section(t("sectionLiquidity"), rangeField("urgent", t("urgent"), state.urgent, 0, 100))}`
    },
    {
      kicker: "q3k", title: "q3t", help: "q3h",
      body: () => `${section(t("sectionRisk"), `${rangeField("maxLoss", t("maxLoss"), state.maxLoss, 0, 40)}<p class="range-context" id="lossContext">${t("lossRub", { value: money(state.amount * state.maxLoss / 100) })}</p><p class="field-hint drawdown-explain">${t("drawdownExplain")}</p>`)}`
    },
    {
      kicker: "q4k", title: "q4t", help: "q4h",
      body: () => `${section(t("sectionPayouts"), radioCards("payouts", [["reinvest", t("reinvest")], ["withdraw", t("withdraw")]], state.payouts, true))}${section(t("sectionExperience"), selectField("experience", t("q8t"), [["none", t("expNone")], ["basic", t("expBasic")], ["mixed", t("expMixed")], ["advanced", t("expAdvanced")]], state.experience, true))}`
    },
    {
      kicker: "q5k", title: "q5t", help: "q5h",
      body: () => `${section(t("sectionAccount"), `<div class="field-grid">${selectField("broker", t("broker"), Object.entries(DATA.brokers).map(([key, item]) => [key, item[state.locale]]), state.broker)}${selectField("bondAccess", t("bondAccess"), [["basic", t("accessBasic")], ["tested", t("accessTested")], ["qualified", t("accessQualified")]], state.bondAccess, true)}</div>`)}${section(t("sectionAssets"), assetTypeCards())}`
    }
  ];

  function collectCurrentStep() {
    const form = $("#questionForm");
    const values = new FormData(form);
    const q = state.step;
    if (q === 0) { state.goal = values.get("goal") || ""; state.horizon = horizonKeys[Number(values.get("horizonStep"))] || state.horizon; state.flexible = false; state.currency = "rub"; }
    if (q === 1) { state.amount = parseInputNumber(values.get("amount")); state.monthly = parseInputNumber(values.get("monthly")); state.urgent = Number(values.get("urgent")); }
    if (q === 2) state.maxLoss = Number(values.get("maxLoss"));
    if (q === 3) { state.payouts = values.get("payouts") || state.payouts; state.experience = values.get("experience") || state.experience; }
    if (q === 4) { state.broker = values.get("broker") || "other"; state.bondAccess = values.get("bondAccess") || "basic"; state.assetTypes = values.getAll("assetTypes").join(","); state.maxIssuer = 15; state.ofzCore = true; state.gold = true; }
    saveBetaState("wizard");
  }

  function validateStep() {
    if (state.step === 0 && !state.goal) return t("required");
    if (state.step === 1 && (!Number.isFinite(state.amount) || state.amount < 10000 || state.amount > 1000000000)) return t("invalidAmount");
    if (state.step === 1 && (state.urgent < 0 || state.urgent > 100)) return t("invalidShare");
    if (state.step === 4 && !state.assetTypes) return t("invalidAssets");
    return "";
  }

  function goalLabel() { return state.goal ? t(`goal${state.goal[0].toUpperCase()}${state.goal.slice(1)}`) : "—"; }
  function horizonLabel() { return t(state.horizon === "120" ? "horizonLong" : `horizon${state.horizon}`); }

  function computeProfile() {
    const horizon = Number(state.horizon);
    let capacity = horizon <= 6 ? 0.15 : horizon <= 12 ? 0.85 : horizon <= 36 ? 2.15 : horizon <= 60 ? 3 : 4;
    if (state.flexible) capacity += 0.5;
    capacity -= Math.min(1.6, Math.max(0, state.urgent) * 0.016);
    capacity += Math.max(-0.7, Math.min(1, (state.maxLoss - 10) / 20));
    const annualContributionRatio = state.amount > 0 ? state.monthly * 12 / state.amount : 0;
    if (horizon >= 36) capacity += Math.min(0.35, annualContributionRatio * 0.35);
    if (state.payouts === "withdraw") capacity -= 0.35;
    capacity = Math.max(0, Math.min(4, capacity));

    const lossScore = Math.max(0, Math.min(4, state.maxLoss / 10));
    const willingness = lossScore;
    const score = Math.min(capacity, willingness);
    const key = score < 1 ? "conservative" : score < 2 ? "cautious" : score < 3 ? "balanced" : "growth";
    let liquidityFloor = Math.max(state.urgent, state.goal === "reserve" && horizon <= 12 ? 45 : 0);
    if (Number(state.horizon) <= 6) liquidityFloor = Math.max(liquidityFloor, 70);
    if (Number(state.horizon) <= 12) liquidityFloor = Math.max(liquidityFloor, 45);
    const profile = { capacity, willingness, score, key, liquidityFloor: Math.min(100, Math.round(liquidityFloor)), annualContributionRatio };
    profile.rating = resolvedRating(profile);
    return profile;
  }

  function renderQuestion() {
    applyTranslations();
    const question = questions[state.step];
    $("#questionKicker").textContent = t(question.kicker);
    $("#questionTitle").textContent = t(question.title);
    $("#questionHelp").textContent = t(question.help);
    $("#questionBody").innerHTML = question.body();
    $("#validationMessage").textContent = "";
    $("#progressLabel").textContent = `${state.step + 1} / ${questions.length}`;
    $("#progressBar").style.width = `${(state.step + 1) / questions.length * 100}%`;
    $("#backButton").disabled = state.step === 0;
    $("#backButton").hidden = state.step === 0;
    $("#nextButton").textContent = t(state.step === questions.length - 1 ? "calculate" : "next");
    bindQuestionDynamics();
    $("#questionTitle").focus({ preventScroll: true });
    requestAnimationFrame(() => {
      const dialog = $("#generatorDialog");
      dialog.scrollTo({ top: 0, behavior: "auto" });
    });
    saveBetaState("wizard");
  }

  function bindQuestionDynamics() {
    const body = $("#questionBody");
    if (state.step === 0) {
      const input = $("input[name=horizonStep]", body);
      input?.addEventListener("input", () => {
        const index = Number(input.value);
        $("#horizonOutput").textContent = t(horizonKeys[index] === "120" ? "horizonLong" : `horizon${horizonKeys[index]}`);
        $$(".horizon-ticks small", body).forEach((tick, tickIndex) => tick.classList.toggle("is-active", tickIndex === index));
      });
    }
    if (state.step === 1) {
      const input = $("input[name=urgent]", body);
      input?.addEventListener("input", () => { $("#urgentOutput").textContent = `${input.value}%`; });
    }
    if (state.step === 2) {
      const input = $("input[name=maxLoss]", body);
      input?.addEventListener("input", () => {
        $("#maxLossOutput").textContent = `${input.value}%`;
        $("#lossContext").textContent = t("lossRub", { value: money(state.amount * Number(input.value) / 100) });
      });
    }
    $$('[data-money]', body).forEach((input) => {
      input.addEventListener("input", () => {
        const selection = input.selectionStart || input.value.length;
        const digitsBefore = input.value.slice(0, selection).replace(/\D/g, "").length;
        input.value = formatInputNumber(input.value);
        let cursor = 0;
        let seen = 0;
        while (cursor < input.value.length && seen < digitsBefore) {
          if (/\d/.test(input.value[cursor])) seen += 1;
          cursor += 1;
        }
        input.setSelectionRange(cursor, cursor);
      });
    });
  }

  function showScreen(name) {
    const dialog = $("#generatorDialog");
    const results = $("#resultsScreen");
    document.body.classList.add("is-results-view");
    results.hidden = false;
    results.classList.add("is-active");
    if (name === "wizard") {
      if (!dialog.open) dialog.showModal();
      document.body.classList.add("is-generator-open");
      return;
    }
    if (dialog.open) dialog.close();
    document.body.classList.remove("is-generator-open");
    if (name === "results") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function constrainAllocation(candidate, floor) {
    const out = { ...candidate };
    out.money = Math.min(100, Math.max(out.money, floor));
    if (!state.gold) out.gold = 0;
    const horizon = Number(state.horizon);
    const equityCap = horizon <= 12 ? 0 : horizon <= 36 ? 25 : horizon <= 60 ? 45 : 65;
    out.equity = Math.min(out.equity, equityCap);
    if (state.goal === "purchase") out.equity = Math.min(out.equity, horizon <= 36 ? 5 : 20);
    if (state.goal === "reserve") out.equity = 0;
    const available = 100 - out.money;
    const riskyTotal = out.bonds + out.equity + out.gold;
    if (riskyTotal <= 0) {
      out.bonds = available;
      out.equity = 0;
      out.gold = 0;
      return out;
    }
    out.equity = available * out.equity / riskyTotal;
    out.gold = available * out.gold / riskyTotal;
    out.bonds = Math.max(0, available - out.equity - out.gold);
    return out;
  }

  function rateAssumptions(horizonMonths = Number(state.horizon)) {
    const model = DATA.rateScenario;
    const years = Math.max(1 / 12, Number(horizonMonths) / 12);
    const yearOneAverage = model.firstYearAverageKeyRate;
    if (years <= 1) {
      const terminal = model.currentKeyRate + (model.firstYearTerminalKeyRate - model.currentKeyRate) * years;
      return { years, averageKeyRate: (model.currentKeyRate + terminal) / 2, terminalKeyRate: terminal };
    }
    const glideYears = Math.max(1, model.longRunReachedYears - 1);
    const postYearOneYears = years - 1;
    const decliningYears = Math.min(postYearOneYears, glideYears);
    const endOfGlide = model.firstYearTerminalKeyRate
      + (model.longRunKeyRate - model.firstYearTerminalKeyRate) * (decliningYears / glideYears);
    const decliningArea = decliningYears * (model.firstYearTerminalKeyRate + endOfGlide) / 2;
    const stableArea = Math.max(0, postYearOneYears - glideYears) * model.longRunKeyRate;
    return {
      years,
      averageKeyRate: (yearOneAverage + decliningArea + stableArea) / years,
      terminalKeyRate: postYearOneYears >= glideYears ? model.longRunKeyRate : endOfGlide
    };
  }

  function expectedReturnFor(instrument, horizonMonths = Number(state.horizon)) {
    const rates = rateAssumptions(horizonMonths);
    if (instrument.kind === "money") {
      return Math.max(0, rates.averageKeyRate - DATA.rateScenario.moneyMarketTrackingSpread);
    }
    if (instrument.rateType === "floater") {
      return Math.max(0, rates.averageKeyRate + Number(instrument.rateSpread || 0));
    }
    if (instrument.rateType === "fixed" || instrument.rateType === "fixedFund") {
      const duration = Number(instrument.duration || 0);
      const passThrough = instrument.rateType === "fixed" ? 0.45 : 0.30;
      const oneTimePriceEffect = Math.max(-15, Math.min(instrument.rateType === "fixed" ? 20 : 12,
        -duration * passThrough * (rates.terminalKeyRate - DATA.rateScenario.currentKeyRate)));
      return Number(instrument.yield || instrument.return || 0) + oneTimePriceEffect / rates.years;
    }
    return Number(instrument.return || 0);
  }

  function scenarioAllocations(profile) {
    const risk = Math.max(0, Math.min(1, profile.score / 4));
    const horizon = Number(state.horizon);
    let money;
    let equity;
    let gold;

    if (state.goal === "reserve") {
      money = horizon <= 12 ? 55 + (1 - risk) * 15
        : horizon <= 36 ? 28 + (1 - risk) * 10
          : horizon <= 60 ? 18 + (1 - risk) * 8
            : 10 + (1 - risk) * 5;
      equity = 0;
      gold = 0;
    } else if (state.goal === "income") {
      money = horizon >= 60 && state.payouts === "reinvest" ? 9 + (1 - risk) * 6 : 18 + (1 - risk) * 10;
      equity = 4 + risk * 18;
      gold = 4 + risk * 5;
    } else {
      money = horizon >= 60 && state.payouts === "reinvest" ? 5 + (1 - risk) * 5 : 8 + (1 - risk) * 9;
      equity = 15 + risk * 50;
      gold = 5 + risk * 8;
    }

    if (state.payouts === "withdraw") {
      money += 6;
      equity -= 4;
    }
    if (state.goal === "growth" && horizon >= 36) equity += Math.min(5, profile.annualContributionRatio * 5);

    const make = (moneyWeight, equityWeight, goldWeight) => {
      const candidate = {
        money: Math.max(0, moneyWeight),
        equity: Math.max(0, equityWeight),
        gold: Math.max(0, goldWeight),
        bonds: Math.max(0, 100 - Math.max(0, moneyWeight) - Math.max(0, equityWeight) - Math.max(0, goldWeight))
      };
      if (!hasAssetType("stocks") && !hasAssetType("funds")) { candidate.money += candidate.equity; candidate.equity = 0; }
      if (!hasAssetType("funds")) { candidate.money += candidate.gold; candidate.gold = 0; }
      if (!hasAssetType("bonds") && !hasAssetType("funds")) { candidate.money += candidate.bonds; candidate.bonds = 0; }
      return constrainAllocation(candidate, profile.liquidityFloor);
    };

    const base = make(money, equity, gold);
    const defensiveShift = 8 + risk * 4;
    const dynamicShift = 7 + risk * 5;
    return [
      make(base.money + defensiveShift, base.equity - defensiveShift * 0.75, base.gold - defensiveShift * 0.15),
      base,
      make(Math.max(profile.liquidityFloor, base.money - dynamicShift), base.equity + dynamicShift * 0.8, base.gold + dynamicShift * 0.15)
    ];
  }

  function hasAssetType(type) {
    return String(state.assetTypes || "").split(",").includes(type);
  }

  function resolvedRating(profile = computeProfile()) {
    const ratings = ["AAA", "AA", "A", "BBB", "BB", "B"];
    const desired = profile.score < 1 ? 0 : profile.score < 2 ? 1 : profile.score < 3 ? 2 : profile.score < 3.6 ? 3 : profile.score < 3.9 ? 4 : 5;
    const experienceCap = { none: 1, basic: 2, mixed: 3, advanced: 5 }[state.experience] ?? 2;
    const accessCap = { basic: 2, tested: 4, qualified: 5 }[state.bondAccess] ?? 2;
    return ratings[Math.min(desired, experienceCap, accessCap)];
  }

  function creditCandidate(profile) {
    const rating = resolvedRating(profile);
    if (rating === "BBB") return "GLORAX21";
    if (rating === "BB") return "ASV05";
    if (rating === "B") return "VERNEM13";
    return "SIBUR07";
  }

  function isBelowSimpleAccess(profile) {
    return ["BBB", "BB", "B"].includes(resolvedRating(profile));
  }

  function foreignBondTarget(allocation) {
    if (!hasAssetType("bonds") || state.amount < 250000 || allocation.bonds <= 0) return 0;
    const horizon = Number(state.horizon);
    let target = 10;
    if (horizon <= 12 && state.currency === "rub") target = 5;
    if (horizon >= 60 || state.goal === "growth") target = 15;
    if (state.currency === "foreign") target = 20;
    return Math.min(target, allocation.bonds, 45);
  }

  function longOfzTarget(rubBondWeight, profile) {
    const horizon = Number(state.horizon);
    if (horizon < 60 || rubBondWeight <= 0 || state.payouts !== "reinvest" || state.urgent > 35) return 0;
    const risk = Math.max(0, Math.min(1, profile.score / 4));
    let share = horizon >= 120 ? 0.45 + risk * 0.35 : 0.18 + risk * 0.22;
    if (state.maxLoss < 10) share = Math.min(share, 0.25);
    return Math.min(rubBondWeight, rubBondWeight * share);
  }

  function chooseHoldings(allocation, requestedFxBondWeight = foreignBondTarget(allocation), profile = computeProfile()) {
    const broker = DATA.brokers[state.broker];
    const result = [];
    const add = (id, weight, roleKey) => {
      if (weight <= 0) return;
      const instrument = DATA.instruments[id];
      const isDirect = instrument && !instrument.manager && instrument.kind !== "money";
      const existingDirect = result.filter((holding) => holding.id === id).reduce((sum, holding) => sum + holding.weight, 0);
      const accepted = isDirect ? Math.min(weight, Math.max(0, state.maxIssuer - existingDirect)) : weight;
      if (accepted <= 0) return;
      const existing = result.find((holding) => holding.id === id && holding.roleKey === roleKey);
      if (existing) existing.weight += accepted;
      else result.push({ id, weight: accepted, roleKey });
    };
    add(broker.funds.money, allocation.money, "roleMoney");

    const fxBondWeight = Math.min(requestedFxBondWeight, allocation.bonds);
    const rubBondWeight = allocation.bonds - fxBondWeight;
    if (rubBondWeight > 0) {
      const fundShare = hasAssetType("funds") ? (hasAssetType("bonds") ? rubBondWeight * 0.35 : rubBondWeight) : 0;
      add(broker.funds.bonds, fundShare, "roleBonds");
      let directTarget = rubBondWeight - fundShare;
      if (hasAssetType("bonds") && directTarget > 0) {
        const longTarget = longOfzTarget(directTarget, profile);
        const directPlan = [
          ["OFZ26248", longTarget * 0.52], ["OFZ26254", longTarget * 0.48],
          ["OFZ26232", (directTarget - longTarget) * 0.32], ["OFZ26236", (directTarget - longTarget) * 0.28],
          ["AEP12", (directTarget - longTarget) * 0.20], [creditCandidate(profile), (directTarget - longTarget) * 0.20]
        ];
        directPlan.forEach(([id, weight]) => add(id, weight, "roleBonds"));
      }
    }
    if (fxBondWeight > 0) {
      const fxIds = ["SIBURFX", "NOVATEKFX", "NORNICKELFX"];
      let remaining = fxBondWeight;
      fxIds.forEach((id, index) => {
        const weight = index === fxIds.length - 1 ? remaining : Math.min(fxBondWeight / fxIds.length, state.maxIssuer);
        add(id, weight, "roleFxBonds");
        remaining -= weight;
      });
    }
    if (allocation.equity > 0) {
      const directEquityTarget = hasAssetType("stocks") ? allocation.equity * (hasAssetType("funds") ? 0.6 : 1) : 0;
      if (directEquityTarget > 0) {
        let allocated = 0;
        ["SBER", "LKOH", "YDEX", "GMKN"].forEach((id) => {
          const weight = Math.min(directEquityTarget / 4, state.maxIssuer);
          allocated += weight;
          add(id, weight, "roleEquity");
        });
      }
      const allocatedEquity = result.filter((x) => x.roleKey === "roleEquity").reduce((sum, x) => sum + x.weight, 0);
      if (hasAssetType("funds")) add(broker.funds.equity, allocation.equity - allocatedEquity, "roleEquity");
    }
    if (allocation.gold > 0 && hasAssetType("funds")) add(broker.funds.gold, allocation.gold, "roleGold");
    const allocatedTotal = result.reduce((sum, holding) => sum + holding.weight, 0);
    add(broker.funds.money, Math.max(0, 100 - allocatedTotal), "roleMoney");
    return result.filter((holding) => DATA.instruments[holding.id]);
  }

  function buildScenarios() {
    const profile = computeProfile();
    const allocations = scenarioAllocations(profile);
    state.scenarios = allocations.map((allocation, index) => {
      const requestedFxBondWeight = foreignBondTarget(allocation);
      const holdings = chooseHoldings(allocation, requestedFxBondWeight, profile);
      const fxBondWeight = holdings.filter((holding) => DATA.instruments[holding.id].isFxBond).reduce((sum, holding) => sum + holding.weight, 0);
      const expected = holdings.reduce((sum, holding) => sum + expectedReturnFor(DATA.instruments[holding.id]) * holding.weight / 100, 0);
      const liquid = holdings.filter((holding) => DATA.instruments[holding.id].liquidity === "high").reduce((sum, holding) => sum + holding.weight, 0);
      const rateShock = holdings.reduce((sum, holding) => sum + ((DATA.instruments[holding.id].duration || (DATA.instruments[holding.id].kind === "bonds" ? 1.8 : 0)) * -2 * holding.weight / 100), 0);
      const creditShock = holdings.reduce((sum, holding) => {
        const instrument = DATA.instruments[holding.id];
        if (instrument.kind !== "bonds" || !instrument.rating) return sum;
        const level = instrument.rating.startsWith("AAA") ? 1 : instrument.rating.startsWith("AA") ? 2 : instrument.rating.startsWith("A") ? 4 : instrument.rating.startsWith("BBB") ? 8 : instrument.rating.startsWith("BB") ? 15 : 25;
        return sum - level * holding.weight / 100;
      }, 0);
      const equityShock = allocation.equity * -0.30;
      const goldShock = allocation.gold * -0.15;
      const fxShock = fxBondWeight * -0.15;
      const combinedShock = rateShock + creditShock + equityShock + goldShock + fxShock;
      return { index, allocation, holdings, fxBondWeight, expected, risk: Math.abs(combinedShock), liquid, stresses: [rateShock, creditShock, equityShock, goldShock, fxShock, combinedShock] };
    });
    return profile;
  }

  function renderResults() {
    hasGeneratedResult = true;
    applyTranslations();
    const profile = buildScenarios();
    state.selectedScenario = 1;
    $("#generatedInsights").hidden = false;
    renderScenario(profile);
    loadClassicConstructor();
    saveBetaState("results");
  }

  function allocationColor(kind) { return { money: "#3d6077", bonds: "#7fa8b5", equity: "#103080", gold: "#ff6a00" }[kind]; }

  function renderScenario(profile) {
    const scenario = state.scenarios[state.selectedScenario];
    const expectedLow = Math.max(-5, scenario.expected - Math.max(1.5, scenario.risk * 0.45));
    const expectedHigh = scenario.expected + Math.max(1.5, scenario.risk * 0.45);
    const riskLabel = scenario.risk < 5 ? "riskLow" : scenario.risk < 12 ? "riskMedium" : "riskHigh";
    const stressKeys = ["stressRate", "stressCredit", "stressEquity", "stressGold", "stressFx", "stressCombined"];
    $("#stressList").innerHTML = scenario.stresses.map((value, index) => `<div class="stress-item"><span>${t(stressKeys[index])}</span><strong>${pct(value, 1)}</strong><small>${t("portfolioEffect")} · ${money(state.amount * value / 100)}</small></div>`).join("");

    const distributionYield = scenario.allocation.bonds * 0.105 / 100 + scenario.allocation.equity * 0.06 / 100 + scenario.allocation.money * 0.10 / 100;
    const monthlyIncome = state.amount * distributionYield / 12;
    const paymentText = t(state.payouts === "reinvest" ? "paymentsReinvest" : "paymentsWithdraw");
    $("#cashflowCard").innerHTML = `<p>${paymentText}</p><dl class="detail-list"><div><dt>${t("indicativeIncome")}</dt><dd>${money(monthlyIncome)} <small>${t("perMonth")}</small></dd></div></dl>`;

    const broker = DATA.brokers[state.broker];
    $("#brokerCard").innerHTML = `<p>${broker.manager ? t("brokerCandidate", { broker: broker[state.locale], manager: managerName(broker.manager) }) : t("brokerNeutral")}</p><ul class="plain-list"><li>${t("tariffCheck")}</li><li>${t("affiliation")}</li></ul>`;

    const maxDirect = Math.max(0, ...scenario.holdings
      .filter((holding) => !DATA.instruments[holding.id].manager && DATA.instruments[holding.id].kind !== "money")
      .map((holding) => holding.weight));
    const checks = [
      [true, "checkLiquidity"],
      [maxDirect <= state.maxIssuer, "checkIssuer"],
      [true, "checkQualified"],
      [!isBelowSimpleAccess(profile) || state.bondAccess !== "basic", "checkBondTest"],
      [false, "checkFees"]
    ];
    checks.push([scenario.fxBondWeight > 0, scenario.fxBondWeight > 0 ? "checkCurrency" : "checkCurrencySmall"]);
    $("#checksCard").innerHTML = `<div class="check-list">${checks.map(([passed, key]) => `<div class="check-item ${passed ? "is-ok" : "is-attention"}"><span aria-hidden="true">${passed ? "✓" : "!"}</span><div><strong>${t(passed ? "ok" : "attention")}</strong><p>${t(key)}</p></div></div>`).join("")}</div><p class="model-note"><strong>${t("modelOnly")}</strong><br>${t("noGuarantee")}</p>`;
  }

  function renderDefaultInsights(payload) {
    if (!payload || hasGeneratedResult) return;
    const weights = payload.weights || {};
    const liquid = Number(weights.money || 0);
    const fxBonds = Number(weights.fxBonds || 0);
    const stressKeys = ["stressRate", "stressCredit", "stressEquity", "stressGold", "stressFx", "stressCombined"];
    $("#stressList").innerHTML = (payload.stresses || []).map((value, index) => `<div class="stress-item"><span>${t(stressKeys[index])}</span><strong>${pct(value, 1)}</strong><small>${t("portfolioEffect")} · ${money(Number(payload.total || 0) * value / 100)}</small></div>`).join("");
    $("#cashflowCard").innerHTML = `<p>${t("defaultPayments")}</p><dl class="detail-list"><div><dt>${t("indicativeIncome")}</dt><dd>${money(payload.monthlyCashflow || 0)} <small>${t("perMonth")}</small></dd></div></dl>`;
    $("#brokerCard").innerHTML = `<p>${t("brokerNeutral")}</p><ul class="plain-list"><li>${t("tariffCheck")}</li><li>${t("affiliation")}</li></ul>`;
    const concentrationOk = Number(payload.maxHoldingWeight || 0) <= 15;
    const checks = [
      [false, "defaultLiquidityCheck"],
      [concentrationOk, concentrationOk ? "defaultIssuerCheck" : "defaultIssuerAttention"],
      [true, "checkQualified"],
      [false, "checkFees"],
      [fxBonds > 0, fxBonds > 0 ? "defaultCurrencyCheck" : "defaultCurrencyMissing"]
    ];
    $("#checksCard").innerHTML = `<div class="check-list">${checks.map(([passed, key]) => `<div class="check-item ${passed ? "is-ok" : "is-attention"}"><span aria-hidden="true">${passed ? "✓" : "!"}</span><div><strong>${t(passed ? "ok" : "attention")}</strong><p>${t(key)}</p></div></div>`).join("")}</div><p class="model-note"><strong>${t("modelOnly")}</strong><br>${t("noGuarantee")}</p>`;
    $("#generatedInsights").hidden = false;
  }

  window.NR_BETA_TEST_API = Object.freeze({
    runCase(input) {
      const snapshot = { ...state, scenarios: state.scenarios.map((scenario) => ({ ...scenario })) };
      Object.assign(state, input, { scenarios: [], selectedScenario: 1 });
      const profile = computeProfile();
      buildScenarios();
      const result = JSON.parse(JSON.stringify({ profile, scenarios: state.scenarios }));
      Object.assign(state, snapshot);
      return result;
    },
    instrumentIds: Object.freeze(Object.keys(DATA.instruments)),
    rateAssumptions,
    expectedReturnFor,
    version: "production-2026.09.15"
  });

  function payloadToken(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  function resizeClassicConstructor() {
    const frame = $("#constructorFrame");
    const doc = frame.contentDocument;
    if (!doc?.documentElement || !doc.body) return;
    const page = doc.querySelector(".page");
    const height = Math.max(page?.getBoundingClientRect().height || doc.body.scrollHeight, 680);
    frame.style.height = `${Math.ceil(height)}px`;
  }

  function observeClassicConstructor() {
    resizeClassicConstructor();
    window.setTimeout(resizeClassicConstructor, 300);
    window.setTimeout(resizeClassicConstructor, 1200);
  }

  function loadClassicConstructor() {
    const scenario = state.scenarios[state.selectedScenario];
    const constructorName = "constructor-ru.html";
    if (!scenario) {
      const emptyUrl = `${constructorName}?v=20260915-prod7`;
      if ($("#constructorFrame").getAttribute("src") !== emptyUrl) $("#constructorFrame").src = emptyUrl;
      return;
    }
    const payload = {
      version: 1,
      amountRub: state.amount,
      horizonMonths: Number(state.horizon),
      holdings: scenario.holdings.map((holding) => ({
        identifier: DATA.instruments[holding.id].ticker || holding.id,
        weight: holding.weight
      }))
    };
    const encoded = btoa(encodeURIComponent(JSON.stringify(payload)));
    const url = `${constructorName}?v=20260915-prod7&g=${payloadToken(encoded)}#nr-beta=${encoded}`;
    if ($("#constructorFrame").getAttribute("src") === url) return;
    $("#constructorFrame").src = url;
  }

  $("#constructorFrame").addEventListener("load", observeClassicConstructor);

  const assetModal = $("#assetModal");
  const assetModalFrame = $("#assetModalFrame");
  const assetModalClose = $("#assetModalClose");
  let assetReturnFocus = null;

  function openAssetModal(url, title) {
    const target = new URL(url, location.href);
    if (target.origin !== location.origin) return;
    target.searchParams.set("drawer", "1");
    assetReturnFocus = document.activeElement;
    assetModalFrame.title = title || t("constructorFrameTitle");
    assetModalFrame.src = target.href;
    assetModal.inert = false;
    assetModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-asset-modal-open");
    assetModalClose.focus();
  }

  function closeAssetModal() {
    document.body.classList.remove("is-asset-modal-open");
    assetModal.setAttribute("aria-hidden", "true");
    assetModal.inert = true;
    assetModalFrame.removeAttribute("src");
    if (assetReturnFocus?.isConnected) assetReturnFocus.focus();
  }

  assetModalClose.addEventListener("click", closeAssetModal);
  $("#assetModalBackdrop").addEventListener("click", closeAssetModal);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("is-asset-modal-open")) closeAssetModal();
  });

  $("#questionForm").addEventListener("submit", (event) => {
    event.preventDefault();
    collectCurrentStep();
    const error = validateStep();
    if (error) { $("#validationMessage").textContent = error; return; }
    if (state.step < questions.length - 1) { state.step += 1; renderQuestion(); }
    else { state.selectedScenario = 1; renderResults(); showScreen("results"); }
  });

  let saveInputTimer = 0;
  $("#questionForm").addEventListener("input", () => {
    window.clearTimeout(saveInputTimer);
    saveInputTimer = window.setTimeout(() => collectCurrentStep(), 120);
  });

  $("#backButton").addEventListener("click", () => { collectCurrentStep(); if (state.step > 0) { state.step -= 1; renderQuestion(); } });
  $("#exitWizardButton").addEventListener("click", () => { collectCurrentStep(); saveBetaState("results"); showScreen("results"); });
  $("#generatorDialog").addEventListener("close", () => document.body.classList.remove("is-generator-open"));
  $("#generatorDialog").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) showScreen("results");
  });
  $("#methodButton")?.addEventListener("click", () => {
    const dialog = $("#methodDialog");
    if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
  });
  $("#closeMethodButton").addEventListener("click", () => $("#methodDialog").close());
  $("#methodDialog").addEventListener("click", (event) => { if (event.target === event.currentTarget) event.currentTarget.close(); });
  window.addEventListener("message", (event) => {
    if (event.origin !== location.origin || event.source !== $("#constructorFrame").contentWindow) return;
    if (event.data?.type === "nr-beta-open-generator") {
      state.step = 0;
      showScreen("wizard");
      renderQuestion();
    }
    if (event.data?.type === "nr-beta-open-asset") {
      openAssetModal(event.data.url, event.data.title);
    }
    if (event.data?.type === "nr-beta-portfolio-analytics") renderDefaultInsights(event.data.payload);
    if (event.data?.type === "nr-beta-constructor-resize") resizeClassicConstructor();
  });
  $$("[data-locale]").forEach((button) => button.addEventListener("click", () => {
    if (!copy[button.dataset.locale]) return;
    if ($("#generatorDialog").open) collectCurrentStep();
    state.locale = button.dataset.locale;
    applyTranslations();
    if ($("#generatorDialog").open) renderQuestion();
    if (state.scenarios.length || restoredBeta?.generated) renderResults();
    else { loadClassicConstructor(); saveBetaState($("#generatorDialog").open ? "wizard" : "results"); }
  }));

  $("#resetSavedDataButton").addEventListener("click", () => {
    localStorage.removeItem(STATE_STORAGE_KEY);
    localStorage.removeItem(CONSTRUCTOR_STORAGE_KEY);
    localStorage.removeItem(CONSTRUCTOR_IMPORT_TOKEN_KEY);
    location.reload();
  });

  applyTranslations();
  showScreen("results");
  if (restoredBeta?.generated) renderResults(); else loadClassicConstructor();
  if (new URLSearchParams(location.search).get("generate") === "1" || restoredBeta?.view === "wizard") {
    if (new URLSearchParams(location.search).get("generate") === "1") state.step = 0;
    showScreen("wizard");
    renderQuestion();
  }
})();
