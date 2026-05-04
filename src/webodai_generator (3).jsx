import { useState, useEffect } from "react";

// ─── KONFIGURACE ─────────────────────────────────────────────────────────────
const SIMPLESHOP_URL = "https://www.simpleshop.cz/vas-produkt/"; // <- ZDE doplň svůj SimpleShop odkaz
const MAX_GENERATIONS = 3;

const PALETTES = [
  { id: "blue",   name: "Modrá",    primary: "#1e3a8a", accent: "#3b82f6", bg: "#eff6ff", label: "Důvěra" },
  { id: "green",  name: "Zelená",   primary: "#14532d", accent: "#16a34a", bg: "#f0fdf4", label: "Příroda" },
  { id: "orange", name: "Oranžová", primary: "#9a3412", accent: "#f97316", bg: "#fff7ed", label: "Energie" },
  { id: "slate",  name: "Tmavá",    primary: "#0f172a", accent: "#7c3aed", bg: "#f1f5f9", label: "Prémiová" },
  { id: "red",    name: "Červená",  primary: "#7f1d1d", accent: "#dc2626", bg: "#fef2f2", label: "Síla" },
];
const STYLES = [
  { id: "modern", emoji: "✦", label: "Moderní",   desc: "Čistý a minimalistický" },
  { id: "warm",   emoji: "🪵", label: "Řemeslný", desc: "Teplý a osobní" },
  { id: "bold",   emoji: "⚡", label: "Odvážný",  desc: "Výrazný a silný" },
];
const STEPS = ["Firma", "Služby", "Kontakt", "Recenze", "Vzhled", "Shrnutí"];

const C = {
  bg: "#080810", card: "#0f0f1a", card2: "#13131f",
  border: "#1e1e30", accent: "#f97316", text: "#e2e8f0",
  muted: "#64748b", input: "#0a0a16", success: "#16a34a",
};

// ─── PROMPT ───────────────────────────────────────────────────────────────────
function buildPrompt(f) {
  const services   = f.services.filter(s => s.trim());
  const reviews    = f.reviews.filter(r => r.text.trim());
  const hasReviews = reviews.length > 0;
  const p          = f.palette;
  const styleDesc  = {
    modern: "moderní, čistý a minimalistický — hodně bílého prostoru, tenké linky, elegance",
    warm:   "řemeslný a teplý — přátelský, důvěryhodný, osobní, jako od souseda odborníka",
    bold:   "odvážný a silný — velká typografie, výrazné kontrasty, rázný dojem",
  };
  const gdprText = f.gdprMode === "custom" && f.gdprCustom.trim()
    ? f.gdprCustom.trim()
    : `Správce osobních údajů: ${f.companyName}, IČO: ${f.ico}, ${f.address}${f.city ? ", " + f.city : ""}. Osobní údaje (jméno, email, telefon) jsou zpracovávány výhradně za účelem odpovědi na Vaši poptávku, na základě oprávněného zájmu správce dle čl. 6 odst. 1 písm. f) GDPR. Údaje nejsou předávány třetím stranám. Máte právo na přístup, opravu, výmaz a námitku. Kontakt: ${f.email}.`;
  const secNum = n => hasReviews ? n : n - 1;

  return `Jsi expert webdesignér. Vytvoř kompletní, profesionální, KRÁSNOU ONE-PAGE HTML webovou stránku.
Vrať POUZE čistý HTML kód začínající <!DOCTYPE html>. Bez markdown, bez textu mimo HTML.

=== FIRMA ===
Název: ${f.companyName}
IČO: ${f.ico}
Obor: ${f.industry}
Popis: ${f.description}
${f.founded ? `Rok založení: ${f.founded}` : ""}

=== SLUŽBY ===
${services.map(s => `• ${s}`).join("\n")}

=== KONTAKT ===
Telefon: ${f.phone}
Email: ${f.email}
Adresa: ${f.address}${f.city ? ", " + f.city : ""}

${hasReviews ? `=== RECENZE ===\n${reviews.map(r => `• ${r.stars}★ "${r.text}" — ${r.name}`).join("\n")}` : ""}

=== DESIGN ===
Styl: ${styleDesc[f.style]}
Primární barva: ${p.primary} | Akcentová: ${p.accent} | Pozadí: ${p.bg}

=== STRUKTURA WEBU (POVINNÁ) ===

1. NAVIGACE — sticky, průhledná → solid při scrollu
   Menu: Domů | O nás | Služby | Galerie${hasReviews ? " | Recenze" : ""} | Kontakt
   Hamburger menu na mobilech (JS toggle)

2. HERO — min-height:100vh, výrazný CSS gradient/pattern pozadí
   H1 = název firmy, kreativní slogan pro "${f.industry}"
   2 buttony: "Kontaktujte nás" (#kontakt) | "Naše služby" (#sluzby)

3. O NÁS — id="o-nas", popis firmy + 3 výhody s emoji v kartách

4. NAŠE SLUŽBY — id="sluzby", grid karet: emoji + název + 2 věty popis
   Služby: ${services.join(", ")}

5. GALERIE — id="galerie", 6 CSS placeholderů "📷 Přidejte foto", hover efekt

${hasReviews ? `6. RECENZE — id="recenze", karty s hvězdičkami ★ a jménem zákazníka\n` : ""}
${secNum(7)}. KONTAKT — id="kontakt", 2 sloupce: formulář + info
   <form action="mailto:${f.email}" method="post" enctype="text/plain">
   Pole: Jméno, Email, Telefon (nepovinný), Zpráva
   POD POLEM ZPRÁVA PŘIDAT PŘESNĚ TOTO:
   <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;font-size:13px;margin-top:12px">
     <input type="checkbox" name="gdpr" required style="margin-top:3px;flex-shrink:0">
     <span>Souhlasím se <a href="#gdpr">zpracováním osobních údajů</a> za účelem odpovědi na mou poptávku.</span>
   </label>
   Tlačítko: "Odeslat zprávu"
   Info: 📞 ${f.phone} | ✉️ ${f.email} | 📍 ${f.address}${f.city ? ", " + f.city : ""} | IČO: ${f.ico}

${secNum(8)}. GDPR — id="gdpr", šedá sekce, H2 "Zásady ochrany osobních údajů"
   Text: ${gdprText}

${secNum(9)}. FOOTER
   © ${new Date().getFullYear()} ${f.companyName} | IČO: ${f.ico} | <a href="#gdpr">Ochrana osobních údajů</a>

=== TECHNICKÉ POŽADAVKY ===
- Google Fonts: 2 vhodné fonty pro styl "${f.style}"
- Vše v jednom souboru, CSS v <style>, JS v <script>
- Mobile-first, media queries, scroll-behavior:smooth
- Intersection Observer: fade-in animace sekcí
- CSS :root proměnné pro barvy
- Hover efekty na buttony a karty, box-shadow pro hloubku

VRAŤ POUZE HTML KÓD. Začni <!DOCTYPE html>.`;
}

// ─── SDÍLENÉ STYLY ───────────────────────────────────────────────────────────
const inp = {
  width: "100%", padding: "12px 16px", background: C.input,
  border: `1px solid ${C.border}`, borderRadius: 10, color: C.text,
  fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "inherit",
};
const lbl = {
  display: "block", fontSize: 12, fontWeight: 600, color: C.muted,
  marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase",
};
const btnA = {
  background: C.accent, border: "none", color: "white",
  padding: "13px 26px", borderRadius: 10, cursor: "pointer",
  fontSize: 15, fontWeight: 700, fontFamily: "inherit",
};
const btnB = {
  background: C.card2, border: `1px solid ${C.border}`, color: C.text,
  padding: "13px 22px", borderRadius: 10, cursor: "pointer",
  fontSize: 15, fontFamily: "inherit",
};

// ─── KROKY ────────────────────────────────────────────────────────────────────
function StepFirma({ f, upd }) {
  return (
    <div>
      <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: C.text }}>O vaší firmě</h2>
      <p style={{ color: C.muted, fontSize: 14, margin: "0 0 24px" }}>Základní informace pro váš web</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <label style={lbl}>Název firmy *</label>
          <input style={inp} placeholder="např. Tesařství Novák s.r.o." value={f.companyName} onChange={e => upd("companyName", e.target.value)} />
        </div>
        <div>
          <label style={lbl}>IČO *</label>
          <input style={inp} placeholder="12345678" value={f.ico} onChange={e => upd("ico", e.target.value)} maxLength={8} />
          <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>Povinný údaj — zobrazí se ve footeru a v GDPR sekci webu</div>
        </div>
        <div>
          <label style={lbl}>Obor podnikání *</label>
          <input style={inp} placeholder="např. Truhlářství, Instalatérství, Kadeřnictví..." value={f.industry} onChange={e => upd("industry", e.target.value)} />
        </div>
        <div>
          <label style={lbl}>Popis firmy *</label>
          <textarea style={{ ...inp, height: 100, resize: "vertical" }}
            placeholder="Pár vět o vaší firmě — čím se zabýváte, kde působíte, co vás odlišuje..."
            value={f.description} onChange={e => upd("description", e.target.value)} />
        </div>
        <div>
          <label style={lbl}>Rok založení (volitelné)</label>
          <input style={inp} placeholder="např. 2005" value={f.founded} onChange={e => upd("founded", e.target.value)} />
        </div>
      </div>
    </div>
  );
}

function StepSluzby({ f, upd }) {
  const add = () => upd("services", [...f.services, ""]);
  const del = i => upd("services", f.services.filter((_, j) => j !== i));
  const set = (i, v) => { const s = [...f.services]; s[i] = v; upd("services", s); };
  return (
    <div>
      <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: C.text }}>Vaše služby</h2>
      <p style={{ color: C.muted, fontSize: 14, margin: "0 0 24px" }}>Co nabízíte zákazníkům?</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {f.services.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 8 }}>
            <input style={{ ...inp, flex: 1 }} placeholder="např. Výroba nábytku na míru" value={s} onChange={e => set(i, e.target.value)} />
            {f.services.length > 1 && <button onClick={() => del(i)} style={{ background: "none", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 10, width: 44, cursor: "pointer", fontSize: 20, flexShrink: 0 }}>×</button>}
          </div>
        ))}
        <button onClick={add} style={{ border: `1px dashed ${C.border}`, background: "none", color: C.muted, borderRadius: 10, padding: 12, cursor: "pointer", fontSize: 14 }}>+ Přidat službu</button>
      </div>
    </div>
  );
}

function StepKontakt({ f, upd }) {
  const fields = [
    { lbl: "Telefon *",     key: "phone",   ph: "+420 123 456 789" },
    { lbl: "Email *",       key: "email",   ph: "info@vase-firma.cz", type: "email" },
    { lbl: "Ulice a číslo", key: "address", ph: "Hlavní 123" },
    { lbl: "Město",         key: "city",    ph: "Praha" },
  ];
  return (
    <div>
      <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: C.text }}>Kontaktní údaje</h2>
      <p style={{ color: C.muted, fontSize: 14, margin: "0 0 24px" }}>Jak vás zákazníci najdou</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {fields.map(({ lbl: l, key, ph, type }) => (
          <div key={key}>
            <label style={lbl}>{l}</label>
            <input style={inp} type={type || "text"} placeholder={ph} value={f[key]} onChange={e => upd(key, e.target.value)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StepRecenze({ f, upd }) {
  const add = () => upd("reviews", [...f.reviews, { name: "", text: "", stars: 5 }]);
  const del = i => upd("reviews", f.reviews.filter((_, j) => j !== i));
  const set = (i, k, v) => { const r = [...f.reviews]; r[i] = { ...r[i], [k]: v }; upd("reviews", r); };
  return (
    <div>
      <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: C.text }}>Recenze zákazníků</h2>
      <p style={{ color: C.muted, fontSize: 14, margin: "0 0 24px" }}>Volitelné — přidejte pochvaly spokojených zákazníků</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {f.reviews.map((r, i) => (
          <div key={i} style={{ background: C.input, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ color: C.muted, fontSize: 13, fontWeight: 600 }}>Recenze {i + 1}</span>
              <button onClick={() => del(i)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20 }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input style={inp} placeholder="Jméno zákazníka" value={r.name} onChange={e => set(i, "name", e.target.value)} />
              <textarea style={{ ...inp, height: 80, resize: "vertical" }} placeholder="Text recenze..." value={r.text} onChange={e => set(i, "text", e.target.value)} />
              <div style={{ display: "flex", gap: 6 }}>
                {[1,2,3,4,5].map(n => <button key={n} onClick={() => set(i, "stars", n)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 26, color: n <= r.stars ? "#f59e0b" : C.border, padding: 0 }}>★</button>)}
              </div>
            </div>
          </div>
        ))}
        <button onClick={add} style={{ border: `1px dashed ${C.border}`, background: "none", color: C.muted, borderRadius: 10, padding: 12, cursor: "pointer", fontSize: 14 }}>+ Přidat recenzi</button>
        {!f.reviews.length && <p style={{ color: C.muted, fontSize: 13, textAlign: "center", margin: 0 }}>Recenze jsou volitelné — web funguje i bez nich</p>}
      </div>
    </div>
  );
}

function StepGiven({ f, upd }) {
  return (
    <div>
      <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: C.text }}>Vzhled & GDPR</h2>
      <p style={{ color: C.muted, fontSize: 14, margin: "0 0 24px" }}>Barvy, styl a ochrana osobních údajů</p>

      <div style={{ marginBottom: 26 }}>
        <label style={lbl}>Barevná paleta</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
          {PALETTES.map(p => (
            <div key={p.id} onClick={() => upd("palette", p)} style={{ border: `2px solid ${f.palette.id === p.id ? C.accent : C.border}`, borderRadius: 12, padding: "10px 6px", cursor: "pointer", textAlign: "center", background: f.palette.id === p.id ? C.accent + "18" : C.input }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: p.primary, margin: "0 auto 6px", border: `3px solid ${p.accent}` }} />
              <div style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{p.name}</div>
              <div style={{ fontSize: 10, color: C.muted }}>{p.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 26 }}>
        <label style={lbl}>Styl webu</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {STYLES.map(s => (
            <div key={s.id} onClick={() => upd("style", s.id)} style={{ border: `2px solid ${f.style === s.id ? C.accent : C.border}`, borderRadius: 12, padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, background: f.style === s.id ? C.accent + "18" : C.input }}>
              <span style={{ fontSize: 22 }}>{s.emoji}</span>
              <div>
                <div style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{s.desc}</div>
              </div>
              {f.style === s.id && <span style={{ marginLeft: "auto", color: C.accent, fontWeight: 700 }}>✓</span>}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label style={lbl}>Zásady ochrany osobních údajů</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
          {[
            { id: "auto",   icon: "🤖", title: "Vygenerovat automaticky", sub: "AI vytvoří základní text dle vašich firemních údajů" },
            { id: "custom", icon: "✍️", title: "Vložit vlastní text",     sub: "Máte hotový text od právníka nebo jiný zdroj" },
          ].map(o => (
            <div key={o.id} onClick={() => upd("gdprMode", o.id)} style={{ border: `2px solid ${f.gdprMode === o.id ? C.accent : C.border}`, borderRadius: 10, padding: "12px 14px", cursor: "pointer", background: f.gdprMode === o.id ? C.accent + "18" : C.input, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 20 }}>{o.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{o.title}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{o.sub}</div>
                </div>
              </div>
              {f.gdprMode === o.id && <span style={{ color: C.accent, fontWeight: 700, fontSize: 16 }}>✓</span>}
            </div>
          ))}
        </div>
        {f.gdprMode === "auto" && (
          <div style={{ padding: "10px 14px", background: C.input, borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
            ℹ️ Vygenerovaný text je základní šablona. <strong style={{ color: C.text }}>Provozovatel webu (vy) nese plnou odpovědnost za soulad s GDPR.</strong> Provozovatel webodai.cz za obsah klientských webů neodpovídá.
          </div>
        )}
        {f.gdprMode === "custom" && (
          <textarea style={{ ...inp, height: 120, resize: "vertical", fontSize: 13, marginTop: 4 }}
            placeholder="Vložte sem váš text zásad ochrany osobních údajů..."
            value={f.gdprCustom} onChange={e => upd("gdprCustom", e.target.value)} />
        )}
      </div>
    </div>
  );
}

function StepShrnutí({ f, onPay }) {
  const services = f.services.filter(s => s.trim());
  const reviews  = f.reviews.filter(r => r.text.trim());
  const Row = ({ label, val }) => val ? (
    <div style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
      <span style={{ color: C.muted, fontSize: 13, minWidth: 100 }}>{label}</span>
      <span style={{ color: C.text, fontSize: 13 }}>{val}</span>
    </div>
  ) : null;
  return (
    <div>
      <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: C.text }}>Shrnutí objednávky</h2>
      <p style={{ color: C.muted, fontSize: 14, margin: "0 0 22px" }}>Zkontrolujte údaje před platbou</p>
      <div style={{ background: C.input, borderRadius: 12, padding: 16, border: `1px solid ${C.border}`, marginBottom: 18 }}>
        <Row label="Firma"    val={f.companyName} />
        <Row label="IČO"      val={f.ico} />
        <Row label="Obor"     val={f.industry} />
        <Row label="Tel."     val={f.phone} />
        <Row label="Email"    val={f.email} />
        <Row label="Adresa"   val={[f.address, f.city].filter(Boolean).join(", ")} />
        <Row label="Služby"   val={services.join(", ")} />
        <Row label="Recenze"  val={reviews.length ? `${reviews.length}×` : "žádné"} />
        <Row label="Styl"     val={STYLES.find(s => s.id === f.style)?.label} />
        <Row label="Barvy"    val={f.palette.name} />
        <Row label="GDPR"     val={f.gdprMode === "auto" ? "Automaticky" : "Vlastní text"} />
      </div>

      <div style={{ background: "#091a0f", border: `1px solid ${C.success}40`, borderRadius: 12, padding: 18, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ color: C.text, fontWeight: 700, fontSize: 16 }}>Jednorázová webová stránka</div>
            <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Kompletní one-page web · HTML soubor · {MAX_GENERATIONS}× regenerace</div>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.success }}>2 000 Kč</div>
        </div>
        <div style={{ fontSize: 12, color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
          Cena bez DPH · Po zaplacení obdržíte odkaz ke stažení webu emailem
        </div>
      </div>

      <button onClick={onPay} style={{ ...btnA, width: "100%", padding: "16px", fontSize: 16, background: "linear-gradient(135deg, #16a34a, #15803d)", textAlign: "center" }}>
        💳 Zaplatit 2 000 Kč a vygenerovat web →
      </button>
      <div style={{ textAlign: "center", color: C.muted, fontSize: 12, marginTop: 10 }}>
        Zabezpečená platba přes SimpleShop
      </div>
    </div>
  );
}

// ─── LOADING & PREVIEW ────────────────────────────────────────────────────────
function LoadingScreen({ name }) {
  const [t, setT] = useState(0);
  useEffect(() => { const id = setInterval(() => setT(n => n + 1), 600); return () => clearInterval(id); }, []);
  const steps = ["Analyzuji informace o firmě","Navrhuji strukturu webu","Generuji obsah sekcí","Vytvářím design a styly","Skládám finální web"];
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>
      <div style={{ textAlign: "center", maxWidth: 420, padding: 32 }}>
        <div style={{ fontSize: 52, marginBottom: 20 }}>⚙️</div>
        <h2 style={{ color: C.text, fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>Generuji váš web{"...".slice(0, (t % 3) + 1)}</h2>
        <p style={{ color: C.muted, margin: "0 0 32px" }}>AI pracuje na webu pro <strong style={{ color: C.text }}>{name}</strong></p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: C.card, borderRadius: 10, border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 14, color: C.accent }}>✦</span>
              <span style={{ color: C.muted, fontSize: 14 }}>{s}</span>
            </div>
          ))}
        </div>
        <p style={{ color: C.muted, fontSize: 13, marginTop: 24 }}>Obvykle trvá 20–40 sekund</p>
      </div>
    </div>
  );
}

function PreviewScreen({ html, name, genCount, onRegen, onBack }) {
  const remaining = MAX_GENERATIONS - genCount;
  const download = () => {
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" })),
      download: (name || "web").replace(/\s+/g, "_") + ".html",
    });
    a.click();
  };
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "inherit" }}>
      <div style={{ padding: "12px 20px", background: C.card, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ ...btnB, padding: "7px 14px", fontSize: 13 }}>← Zpět</button>
          <span style={{ color: C.muted, fontSize: 13 }}>Náhled: <strong style={{ color: C.text }}>{name}</strong></span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {remaining > 0 && <button onClick={onRegen} style={{ ...btnB, padding: "8px 14px", fontSize: 13 }}>🔄 Znovu ({remaining}×)</button>}
          <button onClick={download} style={{ ...btnA, padding: "9px 18px", fontSize: 14 }}>⬇ Stáhnout HTML</button>
        </div>
      </div>
      <div style={{ padding: 16, maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ background: "#1a1a2e", borderRadius: 12, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
          <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#ff5f56","#ffbd2e","#27c93f"].map((c,i) => <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
            </div>
            <div style={{ flex: 1, background: C.input, borderRadius: 6, padding: "5px 12px", fontSize: 13, color: C.muted }}>
              🔒 {name.toLowerCase().replace(/\s+/g,"")}.cz
            </div>
          </div>
          <iframe srcDoc={html} style={{ width: "100%", height: "72vh", border: "none", display: "block" }} title="Náhled" />
        </div>
        <div style={{ marginTop: 14, padding: 18, background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, display: "flex", gap: 14, alignItems: "flex-start" }}>
          <span style={{ fontSize: 26, flexShrink: 0 }}>✅</span>
          <div>
            <div style={{ color: C.text, fontWeight: 600, marginBottom: 6 }}>Váš web je připravený!</div>
            <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>
              Stáhněte HTML soubor a přejmenujte ho na <code style={{ color: C.accent, background: C.input, padding: "1px 6px", borderRadius: 4 }}>index.html</code> — pak ho nahrajte do složky <code style={{ color: C.accent, background: C.input, padding: "1px 6px", borderRadius: 4 }}>www</code> na hostingu Active24.<br />
              <strong style={{ color: C.text }}>Potřebujete pomoct s nahráním?</strong> Ozvěte se — za 500 Kč vše nastavím za vás.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HLAVNÍ APPKA ─────────────────────────────────────────────────────────────
export default function App() {
  const [step,     setStep]     = useState(0);
  const [loading,  setLoading]  = useState(false);
  const [html,     setHtml]     = useState(null);
  const [preview,  setPreview]  = useState(false);
  const [genCount, setGenCount] = useState(0);

  const [f, setF] = useState({
    companyName: "", ico: "", industry: "", description: "", founded: "",
    services: ["", "", ""],
    phone: "", email: "", address: "", city: "",
    reviews: [],
    palette: PALETTES[0], style: "modern",
    gdprMode: "auto", gdprCustom: "",
  });

  const upd = (k, v) => setF(p => ({ ...p, [k]: v }));

  const handlePay = () => {
    // PRODUKCE: window.location.href = SIMPLESHOP_URL + "?ref=" + encodeURIComponent(btoa(JSON.stringify(f)));
    // DEMO: simulujeme zaplacení
    const ok = window.confirm("DEMO — V produkci zde proběhne přesměrování na SimpleShop.\n\nSimulovat zaplacení a pokračovat?");
    if (ok) generate();
  };

  const generate = async () => {
    if (genCount >= MAX_GENERATIONS) {
      alert(`Limit ${MAX_GENERATIONS} generování byl vyčerpán. Pro nový web proveďte novou platbu.`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 4000,
          messages: [{ role: "user", content: buildPrompt(f) }],
        }),
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch(ex) { alert("Odpoved neni JSON: " + text.slice(0,300)); setLoading(false); return; }
      if (!data.content) { alert("API chyba: " + JSON.stringify(data).slice(0,400)); setLoading(false); return; }
      let raw = data.content.map(b => b.text || "").join("");
      raw = raw.replace(/^```html?\s*/i,"").replace(/\s*```\s*$/i,"").trim();
      setHtml(raw);
      setGenCount(c => c + 1);
      setPreview(true);
    } catch (e) {
      alert("Chyba: " + e.message);
    }
    setLoading(false);
  };

  if (loading)          return <LoadingScreen name={f.companyName} />;
  if (preview && html)  return <PreviewScreen html={html} name={f.companyName} genCount={genCount} onRegen={generate} onBack={() => setPreview(false)} />;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "-apple-system,'Segoe UI',sans-serif", paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ padding: "22px 24px 18px", textAlign: "center", borderBottom: `1px solid ${C.border}`, marginBottom: 24 }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-1px", marginBottom: 4 }}>webodai<span style={{ color: C.accent }}>.</span></div>
        <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>Profesionální web za pár minut · Jednorázová platba 2 000 Kč</p>
      </div>

      {/* Progress */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0, marginBottom: 22, padding: "0 12px", flexWrap: "wrap" }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <div onClick={() => i < step && setStep(i)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", borderRadius: 20, background: i === step ? C.accent + "20" : "transparent", cursor: i < step ? "pointer" : "default" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, background: i < step ? C.accent : i === step ? C.accent : C.border, color: "white" }}>
                {i < step ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 12, fontWeight: i === step ? 600 : 400, color: i === step ? C.text : C.muted, whiteSpace: "nowrap" }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ width: 10, height: 1, background: i < step ? C.accent : C.border, flexShrink: 0 }} />}
          </div>
        ))}
      </div>

      {/* Karta */}
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px 20px" }}>
          {step === 0 && <StepFirma    f={f} upd={upd} />}
          {step === 1 && <StepSluzby   f={f} upd={upd} />}
          {step === 2 && <StepKontakt  f={f} upd={upd} />}
          {step === 3 && <StepRecenze  f={f} upd={upd} />}
          {step === 4 && <StepGiven    f={f} upd={upd} />}
          {step === 5 && <StepShrnutí  f={f} onPay={handlePay} />}

          {step < 5 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26, gap: 12 }}>
              {step > 0 ? <button style={btnB} onClick={() => setStep(s => s - 1)}>← Zpět</button> : <div />}
              <button style={btnA} onClick={() => setStep(s => s + 1)}>
                {step === 4 ? "Zkontrolovat shrnutí →" : "Pokračovat →"}
              </button>
            </div>
          )}
        </div>
        <div style={{ textAlign: "center", marginTop: 14, color: C.muted, fontSize: 12 }}>
          🔒 Vaše údaje slouží pouze ke generování webu · Žádná registrace
        </div>
      </div>
    </div>
  );
}
