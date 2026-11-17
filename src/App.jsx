import { useEffect, useState } from "react";

const translations = {
  "pt-BR": {
    projection: "Projeção",
    title: "Calculadora de Captação",
    description:
      "Defina quantos jovens participam e quantas contas cada um traz. O total e os valores estimados (US$ 20 / 30 / 50 por conta) são calculados na hora.",
    participants: "Jovens participantes",
    participantUnit: "participantes",
    participantPreset: "jovens",
    accounts: "Novas contas por jovem",
    accountUnit: "contas por participante",
    totalAccounts: "Total de contas",
    accountWord: "contas",
    youthOne: "jovem",
    youthMany: "jovens",
    tableAccounts: "Total contas",
    at: "A",
    totalProjection: "Projeção total",
    average: "média US$30/conta",
    formula: "Fórmula: Participantes × Contas por jovem × Valor por conta.",
    estimate: "Valores estimados em USDT/USD.",
    decrease: "Diminuir",
    increase: "Aumentar",
    language: "Idioma",
  },
  ja: {
    projection: "予測",
    title: "アカウント獲得シミュレーター",
    description:
      "参加する若者の人数と、1人あたりが獲得する新規アカウント数を設定してください。合計数と1アカウントあたり20 / 30 / 50米ドルの場合の推定金額を即座に計算します。",
    participants: "参加する若者の人数",
    participantUnit: "参加者",
    participantPreset: "人",
    accounts: "1人あたりの新規アカウント数",
    accountUnit: "参加者1人あたりのアカウント数",
    totalAccounts: "アカウント合計",
    accountWord: "アカウント",
    youthOne: "人",
    youthMany: "人",
    tableAccounts: "合計アカウント",
    at: "単価",
    totalProjection: "合計予測",
    average: "1アカウント平均30米ドル",
    formula: "計算式：参加者数 × 1人あたりのアカウント数 × 1アカウントの金額。",
    estimate: "推定金額の単位：USDT/USD。",
    decrease: "減らす",
    increase: "増やす",
    language: "言語",
  },
  en: {
    projection: "Projection",
    title: "Account Acquisition Calculator",
    description:
      "Set the number of young participants and how many accounts each brings in. Totals and estimated values (US$20 / 30 / 50 per account) update instantly.",
    participants: "Young participants",
    participantUnit: "participants",
    participantPreset: "participants",
    accounts: "New accounts per participant",
    accountUnit: "accounts per participant",
    totalAccounts: "Total accounts",
    accountWord: "accounts",
    youthOne: "participant",
    youthMany: "participants",
    tableAccounts: "Total accounts",
    at: "At",
    totalProjection: "Total projection",
    average: "average US$30/account",
    formula:
      "Formula: Participants × Accounts per participant × Value per account.",
    estimate: "Estimated values in USDT/USD.",
    decrease: "Decrease",
    increase: "Increase",
    language: "Language",
  },
  es: {
    projection: "Proyección",
    title: "Calculadora de Captación",
    description:
      "Define cuántos jóvenes participan y cuántas cuentas aporta cada uno. El total y los valores estimados (US$20 / 30 / 50 por cuenta) se calculan al instante.",
    participants: "Jóvenes participantes",
    participantUnit: "participantes",
    participantPreset: "jóvenes",
    accounts: "Nuevas cuentas por joven",
    accountUnit: "cuentas por participante",
    totalAccounts: "Total de cuentas",
    accountWord: "cuentas",
    youthOne: "joven",
    youthMany: "jóvenes",
    tableAccounts: "Total de cuentas",
    at: "A",
    totalProjection: "Proyección total",
    average: "promedio US$30/cuenta",
    formula: "Fórmula: Participantes × Cuentas por joven × Valor por cuenta.",
    estimate: "Valores estimados en USDT/USD.",
    decrease: "Disminuir",
    increase: "Aumentar",
    language: "Idioma",
  },
};
const languages = [
  { code: "pt-BR", name: "Português" },
  { code: "ja", name: "日本語" },
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
];
const localeFor = (code) =>
  code === "ja"
    ? "ja-JP"
    : code === "en"
      ? "en-US"
      : code === "es"
        ? "es-ES"
        : "pt-BR";

function Stepper({
  id,
  label,
  value,
  setValue,
  minimum,
  step,
  unit,
  presets,
  suffix = "",
  t,
}) {
  const change = (delta) =>
    setValue((current) =>
      Math.max(minimum, (Number(current) || 0) + delta * step),
    );
  return (
    <section className="card">
      <label htmlFor={id}>{label}</label>
      <div className="stepper">
        <button
          className="btn"
          type="button"
          aria-label={`${t.decrease}: ${label}`}
          onClick={() => change(-1)}
        >
          −
        </button>
        <div className="val">
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={minimum}
            value={value}
            onChange={(e) =>
              setValue(
                e.target.value === ""
                  ? ""
                  : Math.max(minimum, Math.trunc(Number(e.target.value) || 0)),
              )
            }
          />
          <small>{unit}</small>
        </div>
        <button
          className="btn"
          type="button"
          aria-label={`${t.increase}: ${label}`}
          onClick={() => change(1)}
        >
          +
        </button>
      </div>
      <div className="presets">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            className={`chip ${Number(value) === preset ? "active" : ""}`}
            onClick={() => setValue(preset)}
          >
            {preset}
            {suffix ? ` ${suffix}` : ""}
          </button>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem("expansion-calculator");
      return translations[saved] ? saved : "pt-BR";
    } catch {
      return "pt-BR";
    }
  });
  const [participants, setParticipants] = useState(50);
  const [accounts, setAccounts] = useState(300);
  const t = translations[language];
  const num = (n) => Math.round(n).toLocaleString(localeFor(language));
  const usd = (n) => `US$${num(n)}`;
  const p = Math.max(0, Number(participants) || 0);
  const total = p * Math.max(0, Number(accounts) || 0);
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = `${t.title}`;
    try {
      localStorage.setItem("expansion-calculator", language);
    } catch {}
  }, [language, t.title]);
  return (
    <main className="wrap">
      <header>
        <div className="header-actions">
          <div className="tag">{t.projection}</div>
          <label className="sr-only" htmlFor="language">
            {t.language}
          </label>
          <select
            id="language"
            className="language-select"
            aria-label={t.language}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languages.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </header>
      <h1>{t.title}</h1>
      <p className="sub">{t.description}</p>
      <Stepper
        id="participants"
        label={t.participants}
        value={participants}
        setValue={setParticipants}
        minimum={1}
        step={5}
        unit={t.participantUnit}
        presets={[30, 50, 100]}
        suffix={t.participantPreset}
        t={t}
      />
      <Stepper
        id="accounts"
        label={t.accounts}
        value={accounts}
        setValue={setAccounts}
        minimum={0}
        step={50}
        unit={t.accountUnit}
        presets={[100, 300, 500]}
        t={t}
      />
      <section className="card hero" aria-live="polite">
        <div className="k">{t.totalAccounts}</div>
        <div className="v acct" id="totalAccts">
          {num(total)} {t.accountWord}
        </div>
        <div className="divider" />
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>{t.tableAccounts}</th>
                <th>{t.at} US$20</th>
                <th>{t.at} US$30</th>
                <th>{t.at} US$50</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hot">
                <td>
                  {num(p)} {p === 1 ? t.youthOne : t.youthMany}
                </td>
                <td>{num(total)}</td>
                <td>{usd(total * 20)}</td>
                <td>{usd(total * 30)}</td>
                <td>{usd(total * 50)}</td>
              </tr>
              <tr className="total">
                <td>{t.totalProjection}</td>
                <td colSpan="4">
                  {usd(total * 30)} · {t.average}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <p className="note">
        {t.formula}
        <br />
        {t.estimate}
      </p>
    </main>
  );
}
