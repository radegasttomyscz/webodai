import { useState, useEffect, useRef } from "react";
import Landing from "./Landing";

const MAX_GENERATIONS = 3;
const WORKER_URL = import.meta.env.VITE_WORKER_URL || "https://webodaii.tomyscz1.workers.dev";
const GENERATION_TIMEOUT_MS = 120000;
const PALETTES = [
  { id: "orange",   name: "Oranžová", primary: "#c2410c", accent: "#f97316", bg: "#fff7ed" },
  { id: "blue",     name: "Modrá",    primary: "#1e3a8a", accent: "#3b82f6", bg: "#eff6ff" },
  { id: "green",    name: "Zelená",   primary: "#15803d", accent: "#16a34a", bg: "#f0fdf4" },
  { id: "dark",     name: "Tmavá",    primary: "#0f172a", accent: "#475569", bg: "#f8fafc" },
  { id: "burgundy", name: "Vínová",   primary: "#7f1d1d", accent: "#b91c1c", bg: "#fef2f2" },
  { id: "white",    name: "Bílá",     primary: "#18181b", accent: "#52525b", bg: "#ffffff" },
];
const STEPS = ["Firma", "Nabídka", "Postup", "Fotky", "Kontakt", "Recenze", "Barvy", "Shrnutí"];
const C = {
  bg: "#080810", card: "#0f1020", card2: "#151829",
  border: "#31384f", accent: "#f97316", text: "#f8fafc",
  muted: "#c4cfdd", input: "#090b16", success: "#22c55e",
};
const inp = { width: "100%", padding: "14px 15px", background: C.input, border: `1.5px solid ${C.border}`, borderRadius: 12, color: C.text, fontSize: 16, outline: "none", boxSizing: "border-box", fontFamily: "inherit", lineHeight: 1.4, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)" };
const lbl = { display: "block", fontSize: 14, fontWeight: 850, color: C.text, marginBottom: 8, letterSpacing: 0 };
const helpText = { fontSize: 13.5, color: C.muted, marginTop: 7, lineHeight: 1.5 };
const btnA = { background: C.accent, border: "none", color: "white", padding: "14px 28px", borderRadius: 12, cursor: "pointer", fontSize: 16, fontWeight: 850, fontFamily: "inherit", boxShadow: "0 12px 30px rgba(249,115,22,0.28)" };
const btnB = { background: C.card2, border: `1.5px solid ${C.border}`, color: C.text, padding: "14px 22px", borderRadius: 12, cursor: "pointer", fontSize: 16, fontWeight: 750, fontFamily: "inherit" };

// Komprese obrázků - zmenší a převede na base64
async function compressImage(file, maxWidth = 1600, quality = 0.85, format = "jpeg") {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const mime = format === "png" ? "image/png" : "image/jpeg";
        resolve(canvas.toDataURL(mime, quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function FieldBadge({ required }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      borderRadius: 999,
      padding: "4px 9px",
      fontSize: 12,
      fontWeight: 850,
      letterSpacing: 0,
      textTransform: "none",
      color: required ? "#bbf7d0" : "#fed7aa",
      background: required ? C.success + "1f" : C.accent + "1f",
      border: `1px solid ${required ? C.success + "66" : C.accent + "66"}`,
    }}>
      {required ? "Povinné" : "Volitelné"}
    </span>
  );
}

function FormField({ label, children, help, full, required = false }) {
  return (
    <div className={full ? "form-field form-field-full" : "form-field"}>
      <label style={lbl}>
        <span>{label}{required && <span style={{ color: C.accent }}> *</span>}</span>
      </label>
      {children}
      {help && <div style={helpText}>{help}</div>}
    </div>
  );
}

function FormSection({ title, desc, required = false, children }) {
  return (
    <section style={{ background: required ? C.card2 : C.card, border: `1.5px solid ${required ? C.accent + "88" : C.border}`, borderRadius: 18, padding: 22, boxShadow: required ? "0 22px 70px rgba(0,0,0,0.28)" : "0 16px 50px rgba(0,0,0,0.18)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, marginBottom: 18 }}>
        <div>
          <h3 style={{ margin: "0 0 5px", color: C.text, fontSize: 20, fontWeight: 900 }}>{title}</h3>
          <p style={{ margin: 0, color: C.muted, fontSize: 15, lineHeight: 1.55 }}>{desc}</p>
        </div>
        <FieldBadge required={required} />
      </div>
      {children}
    </section>
  );
}

function StepFirma({ f, upd }) {
  const trustFilled = f.trustPoints.filter(s => s.trim()).length;
  const benefitsFilled = f.benefits.filter(b => b.title.trim()).length;
  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#fed7aa", background: C.accent + "1f", border: `1px solid ${C.accent}66`, borderRadius: 999, padding: "6px 11px", fontSize: 13, fontWeight: 850, marginBottom: 12 }}>
          Krok 1 z {STEPS.length}
        </div>
        <h2 style={{ margin: "0 0 8px", fontSize: 32, lineHeight: 1.12, fontWeight: 950, color: C.text }}>Nejdřív jen základ firmy</h2>
        <p style={{ color: C.muted, fontSize: 17, lineHeight: 1.65, margin: 0, maxWidth: 720 }}>
          Stačí čtyři povinné údaje. Doplňky níže jsou schované, ať formulář zbytečně nestraší.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <FormSection title="Povinný základ" desc="Tyhle údaje potřebujeme pro texty, patičku webu a GDPR. Bez nich nejde pokračovat." required>
          <div className="form-grid">
            <FormField label="Název firmy" required>
              <input style={inp} placeholder="např. Tesařství Novák s.r.o." value={f.companyName} onChange={e => upd("companyName", e.target.value)} />
            </FormField>
            <FormField label="IČO" help="Zobrazí se ve footeru a v GDPR sekci webu." required>
              <input style={inp} placeholder="12345678" value={f.ico} onChange={e => upd("ico", e.target.value)} maxLength={8} />
            </FormField>
            <FormField label="Obor podnikání" help="Podle oboru se přizpůsobí obsah i vzhled webu." required>
              <input style={inp} placeholder="např. Truhlářství, Instalatérství, Kadeřnictví..." value={f.industry} onChange={e => upd("industry", e.target.value)} />
            </FormField>
            <FormField label="Popis firmy" full required>
              <textarea style={{ ...inp, height: 100, resize: "vertical" }} placeholder="Pár vět o vaší firmě — co děláte, kde působíte, čím se odlišujete..." value={f.description} onChange={e => upd("description", e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <details className="optional-details">
          <summary>
            <div>
              <strong>Volitelné doplňky pro lepší web</strong>
              <span>Slogan, rok založení, důvěryhodnost a benefity. Když je necháte prázdné, nic špatného se nestane.</span>
            </div>
            <div className="optional-summary-meta">
              {trustFilled + benefitsFilled > 0 || f.heroHeadline || f.founded ? "Něco vyplněno" : "Přeskočit"}
            </div>
          </summary>

          <div className="optional-body">
            <div className="mini-section">
              <div className="mini-section-head">
                <h3>Úvod webu</h3>
                <FieldBadge required={false} />
              </div>
              <p>Vlastní slogan vyplňte jen tehdy, když ho chcete použít přesně. Když zůstane prázdný, jako hlavní nadpis použijeme název firmy.</p>
              <div className="form-grid">
                <FormField label="Hlavní slogan webu" help="Použije se přesně jako hlavní nadpis. Nevymýšlíme za vás nový slogan, pokud pole necháte prázdné.">
                  <input style={inp} placeholder='např. "Voda v domě bez starostí, 24/7"' value={f.heroHeadline} onChange={e => upd("heroHeadline", e.target.value)} />
                </FormField>
                <FormField label="Rok založení" help="Vyplňte jen tehdy, když ho chcete opravdu ukázat na webu.">
                  <input style={inp} placeholder="např. 2005" value={f.founded} onChange={e => upd("founded", e.target.value)} />
                </FormField>
              </div>
            </div>

            <div className="mini-section">
              <div className="mini-section-head">
                <h3>Důvěryhodnost</h3>
                <span className="mini-count">{trustFilled}/3</span>
              </div>
              <p>Krátká ověřitelná tvrzení pod hlavním nadpisem. Vyplňujte jen pravdu, AI si je nebude domýšlet.</p>
              <div className="compact-stack">
                {[0, 1, 2].map(i => (
                  <input
                    key={i}
                    style={inp}
                    placeholder={i === 0 ? "např. 15 let na trhu" : i === 1 ? "např. Přes 200 spokojených klientů" : "např. Garance kvality"}
                    value={f.trustPoints[i] || ""}
                    onChange={e => {
                      const arr = [...f.trustPoints];
                      arr[i] = e.target.value;
                      upd("trustPoints", arr);
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="mini-section">
              <div className="mini-section-head">
                <h3>Benefity firmy</h3>
                <span className="mini-count">{benefitsFilled}/3</span>
              </div>
              <p>Volitelná sekce „Proč si vybrat nás“. Vyplňte jen skutečné výhody, obecné fráze raději nechte pryč.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} className="benefit-card">
                    <div style={{ color: C.muted, fontSize: 13, fontWeight: 850, marginBottom: 8 }}>Benefit {i + 1}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <input
                        style={inp}
                        placeholder={i === 0 ? "Název (např. Kvalitní řemeslná práce)" : i === 1 ? "Název (např. Rychlé dodání)" : "Název (např. Férové ceny)"}
                        value={f.benefits[i]?.title || ""}
                        onChange={e => {
                          const arr = [...f.benefits];
                          arr[i] = { ...arr[i], title: e.target.value };
                          upd("benefits", arr);
                        }}
                      />
                      <textarea
                        style={{ ...inp, height: 70, resize: "vertical" }}
                        placeholder="Krátký popis benefitu (volitelný)"
                        value={f.benefits[i]?.desc || ""}
                        onChange={e => {
                          const arr = [...f.benefits];
                          arr[i] = { ...arr[i], desc: e.target.value };
                          upd("benefits", arr);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}

function StepSluzby({ f, upd }) {
  const add = () => upd("services", [...f.services, { name: "", desc: "" }]);
  const del = i => upd("services", f.services.filter((_, j) => j !== i));
  const setField = (i, k, v) => { const s = [...f.services]; s[i] = { ...s[i], [k]: v }; upd("services", s); };
  return (
    <div>
      <h2 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 800, color: C.text }}>Vaše nabídka</h2>
      <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.55, margin: "0 0 20px" }}>
        Nemusí jít jen o služby. U řemeslníka to budou služby, u posilovny tréninky, lekce nebo členství, u restaurace třeba menu.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <FormSection title="1. Název sekce" desc="Tím určíte, jak se tahle část bude jmenovat na hotovém webu. Můžete to nechat prázdné.">
          <FormField label="Název části na webu" help="Když nevyplníte, AI zvolí název podle oboru podnikání.">
            <input
              style={inp}
              placeholder='např. Služby, Nabídka, Tréninky a členství, Lekce, Menu'
              value={f.offerSectionTitle}
              onChange={e => upd("offerSectionTitle", e.target.value)}
            />
          </FormField>
        </FormSection>

        <FormSection title="2. Položky nabídky" desc="Vyplňte alespoň jednu položku. Další položky jsou volitelné, prázdné karty se v hotovém webu nepoužijí." required>
          <div style={{ background: C.input, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: C.text }}>Co s popisy, které nevyplníte?</div>
              <FieldBadge required={false} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { id: false, label: "Nechat jen názvy", desc: "Karta na webu obsahuje jen název položky, bez popisu." },
                { id: true, label: "AI doplní popisy automaticky", desc: "AI napíše 1–2 věty pro každou položku podle oboru." },
              ].map(o => (
                <div key={String(o.id)} onClick={() => upd("aiFillServiceDesc", o.id)} style={{ border: `2px solid ${f.aiFillServiceDesc === o.id ? C.accent : C.border}`, borderRadius: 10, padding: "12px 14px", cursor: "pointer", background: f.aiFillServiceDesc === o.id ? C.accent + "18" : C.card2, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 800, color: C.text, fontSize: 15 }}>{o.label}</div>
                    <div style={{ fontSize: 14, color: C.muted, marginTop: 3, lineHeight: 1.45 }}>{o.desc}</div>
                  </div>
                  {f.aiFillServiceDesc === o.id && <span style={{ color: C.accent, fontWeight: 700, fontSize: 16 }}>✓</span>}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {f.services.map((s, i) => (
              <div key={i} style={{ background: C.input, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ color: C.muted, fontSize: 13, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase" }}>Položka nabídky {i + 1}</span>
                  {f.services.length > 1 && <button onClick={() => del(i)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 18, padding: 0 }}>×</button>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <FormField label="Název položky" required={i === 0} help={i === 0 ? "Vyplňte alespoň jednu položku nabídky." : "Tuhle položku můžete nechat prázdnou."}>
                    <input style={inp} placeholder="Název (např. Osobní trénink, Měsíční členství, Výroba nábytku)" value={s.name} onChange={e => setField(i, "name", e.target.value)} />
                  </FormField>
                  <FormField label="Popis položky" help="Můžete napsat vlastní popis, nebo nechat doplnit AI podle volby výše.">
                    <textarea style={{ ...inp, height: 72, resize: "vertical" }} placeholder="Popis (volitelný)" value={s.desc} onChange={e => setField(i, "desc", e.target.value)} />
                  </FormField>
                </div>
              </div>
            ))}
            <button onClick={add} style={{ border: `1.5px dashed ${C.border}`, background: C.card2, color: C.text, borderRadius: 10, padding: 14, cursor: "pointer", fontSize: 15, fontWeight: 800 }}>+ Přidat položku nabídky</button>
          </div>
        </FormSection>
      </div>
    </div>
  );
}

function StepPostup({ f, upd }) {
  const setField = (i, k, v) => {
    const arr = [...f.processSteps];
    arr[i] = { ...arr[i], [k]: v };
    upd("processSteps", arr);
  };
  return (
    <div>
      <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: C.text }}>Jak u vás probíhá spolupráce</h2>
      <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.55, margin: "0 0 16px" }}>4 vlastní kroky — od první poptávky po předání.</p>
      <div style={{ padding: "12px 14px", background: C.input, borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 14, color: C.muted, lineHeight: 1.55, marginBottom: 18 }}>
        ℹ️ Sekce "Jak to probíhá" se na webu zobrazí <strong style={{ color: C.text }}>pouze pokud vyplníte název u všech 4 kroků</strong>. Jinak se sekce na webu vůbec nezobrazí (nic se nevymýšlí).
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {f.processSteps.map((s, i) => (
          <div key={i} style={{ background: C.input, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.accent, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{i + 1}</div>
              <span style={{ color: C.muted, fontSize: 13, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase" }}>Krok {i + 1}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input style={inp} placeholder={i === 0 ? "Název (např. Nezávazná poptávka)" : i === 1 ? "Název (např. Konzultace)" : i === 2 ? "Název (např. Realizace)" : "Název (např. Předání a záruka)"} value={s.title} onChange={e => setField(i, "title", e.target.value)} />
              <textarea style={{ ...inp, height: 60, resize: "vertical", fontSize: 14 }} placeholder="Krátký popis kroku (volitelný — 1-2 věty)" value={s.desc} onChange={e => setField(i, "desc", e.target.value)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function StepFotky({ f, upd }) {
  const [busy, setBusy] = useState(null);
  const heroRef = useRef(null);
  const logoRef = useRef(null);
  const galleryRefs = useRef([]);

  const onHero = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBusy("hero");
    try { upd("heroImage", await compressImage(file, 1600, 0.85)); }
    catch { alert("Chyba při zpracování obrázku."); }
    setBusy(null);
    e.target.value = "";
  };

  const onLogo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBusy("logo");
    try { upd("logo", await compressImage(file, 400, 1.0, "png")); }
    catch { alert("Chyba při zpracování loga."); }
    setBusy(null);
    e.target.value = "";
  };

  const onGallery = async (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    setBusy(`gallery-${idx}`);
    try {
      const data = await compressImage(file, 1200, 0.82);
      const arr = [...f.gallery];
      arr[idx] = data;
      upd("gallery", arr);
    } catch { alert("Chyba při zpracování obrázku."); }
    setBusy(null);
    e.target.value = "";
  };

  const removeGallery = (idx) => {
    const arr = [...f.gallery];
    arr[idx] = null;
    upd("gallery", arr);
  };

  const Slot = ({ src, onClick, onRemove, busy: isBusy, label, icon, big }) => (
    <div onClick={!isBusy && !src ? onClick : undefined} style={{
      position: "relative",
      border: `2px dashed ${src ? "transparent" : C.border}`,
      borderRadius: 12,
      background: src ? "transparent" : C.input,
      aspectRatio: big ? "16/9" : "4/3",
      cursor: !src && !isBusy ? "pointer" : "default",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "border-color 0.2s",
    }}>
      {src ? (
        <>
          <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <button onClick={(e) => { e.stopPropagation(); onRemove(); }} style={{
            position: "absolute", top: 6, right: 6, width: 28, height: 28,
            borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.7)",
            color: "white", cursor: "pointer", fontSize: 16, display: "flex",
            alignItems: "center", justifyContent: "center", padding: 0,
          }}>×</button>
        </>
      ) : isBusy ? (
        <div style={{ color: C.muted, fontSize: 13 }}>Zpracovávám...</div>
      ) : (
        <div style={{ textAlign: "center", color: C.muted, fontSize: 13, padding: 8 }}>
          <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
          <div>{label}</div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: C.text }}>Fotografie</h2>
      <p style={{ color: C.muted, fontSize: 14, margin: "0 0 24px" }}>Vlastní fotky výrazně zvýší kvalitu webu — vše je volitelné</p>

      <div style={{ marginBottom: 26 }}>
        <label style={lbl}>Hero fotka (úvodní)</label>
        <input ref={heroRef} type="file" accept="image/*" onChange={onHero} style={{ display: "none" }} />
        <Slot
          src={f.heroImage}
          onClick={() => heroRef.current?.click()}
          onRemove={() => upd("heroImage", null)}
          busy={busy === "hero"}
          label="Klikněte pro nahrání hero fotky"
          icon="🖼"
          big
        />
        <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>Doporučujeme šířku alespoň 1200px. Bez fotky AI vytvoří grafický placeholder.</div>
      </div>

      <div style={{ marginBottom: 26 }}>
        <label style={lbl}>Galerie (až 6 fotek)</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[0,1,2,3,4,5].map(i => (
            <div key={i}>
              <input
                ref={el => galleryRefs.current[i] = el}
                type="file"
                accept="image/*"
                onChange={e => onGallery(e, i)}
                style={{ display: "none" }}
              />
              <Slot
                src={f.gallery[i]}
                onClick={() => galleryRefs.current[i]?.click()}
                onRemove={() => removeGallery(i)}
                busy={busy === `gallery-${i}`}
                label="Přidat"
                icon="📷"
              />
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>Prázdné dlaždice se nezobrazí — galerie se přizpůsobí počtu fotek.</div>
      </div>

      <div>
        <label style={lbl}>Logo (volitelné)</label>
        <input ref={logoRef} type="file" accept="image/*" onChange={onLogo} style={{ display: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div onClick={!busy && !f.logo ? () => logoRef.current?.click() : undefined} style={{
            width: 100, height: 100, flexShrink: 0,
            border: `2px dashed ${f.logo ? "transparent" : C.border}`,
            borderRadius: 12, background: f.logo ? C.input : C.input,
            cursor: !f.logo && busy !== "logo" ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", position: "relative",
          }}>
            {f.logo ? (
              <>
                <img src={f.logo} alt="" style={{ maxWidth: "85%", maxHeight: "85%", objectFit: "contain" }} />
                <button onClick={() => upd("logo", null)} style={{
                  position: "absolute", top: 4, right: 4, width: 22, height: 22,
                  borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.7)",
                  color: "white", cursor: "pointer", fontSize: 14, padding: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>×</button>
              </>
            ) : busy === "logo" ? (
              <div style={{ color: C.muted, fontSize: 11 }}>...</div>
            ) : (
              <div style={{ textAlign: "center", color: C.muted, fontSize: 22 }}>🎨</div>
            )}
          </div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
            {f.logo ? "Logo nahráno. Bude použito v navigaci a footeru." : "Bez loga použijeme stylový textový název firmy."}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepKontakt({ f, upd }) {
  return (
    <div>
      <h2 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 800, color: C.text }}>Kontaktní údaje</h2>
      <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.55, margin: "0 0 20px" }}>Povinné údaje se zobrazí na webu a použijí se pro mapu. Volitelné necháme pryč, pokud je nevyplníte.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <FormSection title="1. Základní kontakt" desc="Tyto údaje jsou nutné, aby vás zákazníci našli a mohli vás kontaktovat." required>
          <div className="form-grid">
            {[
              { l: "Telefon", key: "phone", ph: "+420 123 456 789" },
              { l: "Email", key: "email", ph: "info@vase-firma.cz", type: "email" },
              { l: "Ulice a číslo", key: "address", ph: "Hlavní 123" },
              { l: "Město", key: "city", ph: "Praha" },
            ].map(({ l, key, ph, type }) => (
              <FormField key={key} label={l} required>
                <input style={inp} type={type || "text"} placeholder={ph} value={f[key]} onChange={e => upd(key, e.target.value)} />
              </FormField>
            ))}
          </div>
        </FormSection>

        <FormSection title="2. Doplňující kontakt" desc="Zobrazí se jen tehdy, když ho vyplníte. AI si pracovní dobu ani kontaktní osobu nebude vymýšlet.">
          <div className="form-grid">
            <FormField label="Kontaktní osoba" help="Jméno majitele nebo zodpovědné osoby.">
              <input style={inp} placeholder="např. Jan Novák" value={f.contactPerson} onChange={e => upd("contactPerson", e.target.value)} />
            </FormField>
            <FormField label="Pracovní doba" help="Pokud nevyplníte, na webu se nezobrazí.">
              <input style={inp} placeholder="např. Po-Pá: 8:00-17:00, So: 9:00-12:00" value={f.openingHours} onChange={e => upd("openingHours", e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="3. Sociální sítě" desc="Volitelné odkazy do footeru hotového webu. Vkládejte celé URL adresy.">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { l: "Facebook",  key: "facebook",  ph: "https://facebook.com/vase-firma" },
              { l: "Instagram", key: "instagram", ph: "https://instagram.com/vase_firma" },
              { l: "LinkedIn",  key: "linkedin",  ph: "https://linkedin.com/company/vase-firma" },
            ].map(({ l, key, ph }) => (
              <FormField key={key} label={l}>
                <input style={inp} placeholder={ph} value={f[key]} onChange={e => upd(key, e.target.value)} />
              </FormField>
            ))}
          </div>
        </FormSection>

        <div style={{ padding: "12px 14px", background: C.input, borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 14, color: C.muted, lineHeight: 1.55 }}>
          🗺️ <strong style={{ color: C.text }}>Mapa s adresou</strong> se vygeneruje automaticky z vyplněné adresy a města.
        </div>
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
      <p style={{ color: C.muted, fontSize: 14, margin: "0 0 24px" }}>Volitelné — pochvaly spokojených zákazníků</p>
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
        {!f.reviews.length && <p style={{ color: C.muted, fontSize: 13, textAlign: "center", margin: 0 }}>Recenze jsou volitelné</p>}
      </div>
    </div>
  );
}

function StepBarvy({ f, upd }) {
  return (
    <div>
      <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: C.text }}>Barvy & GDPR</h2>
      <p style={{ color: C.muted, fontSize: 14, margin: "0 0 24px" }}>Vyberte barvu a nastavte ochranu osobních údajů</p>

      <div style={{ marginBottom: 26 }}>
        <label style={lbl}>Barva webu</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
          {PALETTES.map(p => (
            <div key={p.id} onClick={() => upd("palette", p)} style={{ border: `2px solid ${f.palette.id === p.id ? C.accent : C.border}`, borderRadius: 12, padding: "12px 4px", cursor: "pointer", textAlign: "center", background: f.palette.id === p.id ? C.accent + "18" : C.input }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: p.primary, margin: "0 auto 6px", border: `3px solid ${p.accent}` }} />
              <div style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{p.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label style={lbl}>Zásady ochrany osobních údajů</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
          {[
            { id: "auto", icon: "🤖", title: "Vygenerovat automaticky", sub: "AI vytvoří základní text dle vašich údajů" },
            { id: "custom", icon: "✍️", title: "Vložit vlastní text", sub: "Máte hotový text od právníka" },
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
        {f.gdprMode === "auto" && <div style={{ padding: "10px 14px", background: C.input, borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, color: C.muted, lineHeight: 1.5 }}>ℹ️ Vygenerovaný text je základní šablona pro ochranu osobních údajů, ale může být pro vaše účely dostačující. <strong style={{ color: C.text }}>Provozovatel webu (vy) nese plnou odpovědnost za soulad s GDPR.</strong></div>}
        {f.gdprMode === "custom" && <textarea style={{ ...inp, height: 120, resize: "vertical", fontSize: 13, marginTop: 4 }} placeholder="Vložte sem váš text zásad..." value={f.gdprCustom} onChange={e => upd("gdprCustom", e.target.value)} />}
      </div>
    </div>
  );
}

function StepShrnutí({ f, onPay }) {
  const services = f.services.filter(s => s.name.trim());
  const reviews  = f.reviews.filter(r => r.text.trim());
  const galleryCount = f.gallery.filter(Boolean).length;
  const socialList = [f.facebook && "FB", f.instagram && "IG", f.linkedin && "IN"].filter(Boolean).join(", ");
  const processCount = f.processSteps.filter(s => s.title.trim()).length;
  const offerTitle = f.offerSectionTitle.trim() || "AI zvolí podle oboru";
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
        <Row label="Firma"     val={f.companyName} />
        <Row label="IČO"       val={f.ico} />
        <Row label="Obor"      val={f.industry} />
        <Row label="Slogan"    val={f.heroHeadline || "Použije se název firmy"} />
        <Row label="Kontakt"   val={f.contactPerson || "—"} />
        <Row label="Tel."      val={f.phone} />
        <Row label="Email"     val={f.email} />
        <Row label="Adresa"    val={[f.address, f.city].filter(Boolean).join(", ")} />
        <Row label="Hodiny"    val={f.openingHours || "—"} />
        <Row label="Sítě"      val={socialList || "—"} />
        <Row label="Nabídka"   val={services.map(s => s.name).join(", ")} />
        <Row label="Název sekce" val={offerTitle} />
        <Row label="Postup"    val={processCount === 4 ? "✓ 4 vlastní kroky" : "Sekci vynechat"} />
        <Row label="Hero foto" val={f.heroImage ? "✓ Nahráno" : "—"} />
        <Row label="Galerie"   val={galleryCount > 0 ? `${galleryCount}× foto` : "—"} />
        <Row label="Logo"      val={f.logo ? "✓ Nahráno" : "—"} />
        <Row label="Recenze"   val={reviews.length ? `${reviews.length}×` : "žádné"} />
        <Row label="Barva"     val={f.palette.name} />
        <Row label="GDPR"      val={f.gdprMode === "auto" ? "Automaticky" : "Vlastní text"} />
      </div>
      <div style={{ background: "rgba(34,197,94,0.10)", border: `1.5px solid ${C.success}66`, borderRadius: 16, padding: 18, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ color: C.text, fontWeight: 700, fontSize: 16 }}>Jednorázová webová stránka</div>
            <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Kompletní one-page web · HTML soubor · {MAX_GENERATIONS}× regenerace</div>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.success }}>2 000 Kč</div>
        </div>
        <div style={{ fontSize: 13, color: C.muted, borderTop: `1px solid ${C.success}44`, paddingTop: 10 }}>Cena bez DPH · Po zaplacení obdržíte odkaz ke stažení webu emailem</div>
      </div>
      <button onClick={onPay} style={{ ...btnA, width: "100%", padding: "16px", fontSize: 16, background: "linear-gradient(135deg, #16a34a, #15803d)", textAlign: "center" }}>
        💳 Zaplatit 2 000 Kč a vygenerovat web →
      </button>
      <div style={{ textAlign: "center", color: C.muted, fontSize: 12, marginTop: 10 }}>Zabezpečená platba přes SimpleShop</div>
    </div>
  );
}

function LoadingScreen({ name }) {
  const [t, setT] = useState(0);
  useEffect(() => { const id = setInterval(() => setT(n => n + 1), 1000); return () => clearInterval(id); }, []);
  const steps = [
    "Procházím zadané údaje",
    "Skládám strukturu webu",
    "Píšu české texty bez vymyšlených faktů",
    "Navrhuji vzhled podle oboru",
    "Kontroluji kontrast a mobilní zobrazení",
    "Připravuji finální HTML soubor",
  ];
  const active = Math.min(Math.floor(t / 18), steps.length - 1);
  const tips = [
    "Nezavírejte prosím toto okno. Jakmile bude web hotový, otevře se náhled.",
    "Delší generování je v pořádku, hlavně pokud jsou nahrané fotky nebo delší zadání.",
    "Když se výsledek nebude líbit, můžete upravit zadání a zkusit další variantu.",
  ];
  const elapsed = `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
  return (
    <div style={{ minHeight: "100vh", background: `radial-gradient(circle at 50% 0%, ${C.accent}18, transparent 34%), ${C.bg}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", padding: 24 }}>
      <div style={{ maxWidth: 760, width: "100%", background: `linear-gradient(180deg, ${C.card2}, ${C.card})`, border: `1.5px solid ${C.border}`, borderRadius: 24, padding: 32, boxShadow: "0 32px 100px rgba(0,0,0,0.38)" }}>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ width: 112, height: 112, borderRadius: 28, background: `linear-gradient(135deg, ${C.accent}, #fb923c)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 20px 50px ${C.accent}33`, flexShrink: 0 }}>
            <div style={{ fontSize: 48, transform: `rotate(${(t % 12) * 30}deg)`, transition: "transform 0.8s ease" }}>⚙️</div>
          </div>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#fed7aa", background: C.accent + "1f", border: `1px solid ${C.accent}66`, borderRadius: 999, padding: "6px 10px", fontSize: 13, fontWeight: 900, marginBottom: 14 }}>
              Generování běží · {elapsed}
            </div>
            <h2 style={{ color: C.text, fontSize: 32, lineHeight: 1.12, fontWeight: 900, margin: "0 0 10px" }}>
              Stavím web pro {name || "vaši firmu"}
              {".".repeat((t % 3) + 1)}
            </h2>
            <p style={{ color: C.muted, margin: "0 0 20px", fontSize: 16, lineHeight: 1.6 }}>
              Generování může trvat i několik minut. Děláme kompletní HTML stránku včetně textů, stylů, responzivity a případných fotek.
            </p>
            <div style={{ height: 12, background: C.input, border: `1px solid ${C.border}`, borderRadius: 999, overflow: "hidden", marginBottom: 10 }}>
              <div style={{ width: `${18 + ((t * 7) % 72)}%`, height: "100%", borderRadius: 999, background: `linear-gradient(90deg, ${C.accent}, #fb923c, ${C.accent})`, transition: "width 0.8s ease" }} />
            </div>
            <div style={{ color: C.muted, fontSize: 13 }}>
              Tohle je živý odhad průběhu, ne přesný časovač.
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginTop: 28 }}>
          {steps.map((s, i) => {
            const done = i < active;
            const current = i === active;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", background: current ? C.accent + "16" : C.input, borderRadius: 12, border: `1.5px solid ${current ? C.accent : C.border}` }}>
                <span style={{ width: 26, height: 26, borderRadius: "50%", background: done ? C.success : current ? C.accent : C.card2, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, flexShrink: 0 }}>
                  {done ? "✓" : i + 1}
                </span>
                <span style={{ color: current ? C.text : C.muted, fontSize: 14, lineHeight: 1.35, fontWeight: current ? 800 : 600 }}>{s}</span>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 22, padding: 16, borderRadius: 14, border: `1px solid ${C.border}`, background: C.input, color: C.muted, fontSize: 15, lineHeight: 1.55 }}>
          <strong style={{ color: C.text }}>Tip:</strong> {tips[Math.floor(t / 12) % tips.length]}
        </div>
      </div>
    </div>
  );
}

function enforceConservativeHeroText(html, f) {
  if (!html || typeof DOMParser === "undefined") return html;
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const hero = doc.querySelector("#home") || doc.querySelector("header") || doc.querySelector("section");
    if (!hero) return html;

    const companyName = (f.companyName || "").trim();
    const customHeadline = (f.heroHeadline || "").trim();
    const industry = (f.industry || companyName || "").trim();
    const h1 = hero.querySelector("h1");
    if (h1 && (customHeadline || companyName)) h1.textContent = customHeadline || companyName;

    const genericClaim = /(na míru|bez kompromisů|profesion[aá]ln[íi]\s+(řešení|služby|péče)|kvalita|spolehliv[áa]|modern[íi]|prémiov[áa]|tradice|vášeň)/i;
    const badgeLike = Array.from(hero.querySelectorAll("span, p, div")).filter(el => {
      const cls = String(el.className || "");
      const text = (el.textContent || "").trim();
      return text && text.length <= 80 && /kicker|eyebrow|badge|tag|pill|label/i.test(cls);
    });
    badgeLike.forEach(el => {
      const text = (el.textContent || "").trim();
      if (genericClaim.test(text) && industry) el.textContent = industry;
    });

    return `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
  } catch {
    return html;
  }
}

function injectReliableLightbox(html) {
  if (!html || html.includes('id="webodai-lightbox"')) return html;

  const payload = `
<style id="webodai-lightbox-style">
  #webodai-lightbox{display:none;position:fixed;inset:0;z-index:2147483000;background:rgba(0,0,0,.94);align-items:center;justify-content:center;padding:24px;box-sizing:border-box}
  #webodai-lightbox.is-open{display:flex}
  #webodai-lightbox img{max-width:min(1200px,94vw);max-height:90vh;object-fit:contain;border-radius:10px;box-shadow:0 24px 80px rgba(0,0,0,.55);background:#111}
  #webodai-lightbox button{position:absolute;top:18px;right:18px;width:46px;height:46px;border:1px solid rgba(255,255,255,.22);border-radius:999px;background:rgba(255,255,255,.14);color:#fff;font-size:30px;line-height:1;cursor:pointer}
</style>
<div id="webodai-lightbox" role="dialog" aria-modal="true" aria-label="Zvětšená fotka">
  <button type="button" aria-label="Zavřít galerii">&times;</button>
  <img alt="">
</div>
<script>
(function(){
  var overlay = document.getElementById('webodai-lightbox');
  if(!overlay) return;
  var image = overlay.querySelector('img');
  var close = overlay.querySelector('button');
  function open(src, alt){
    if(!src) return;
    image.src = src;
    image.alt = alt || '';
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function hide(){
    overlay.classList.remove('is-open');
    image.removeAttribute('src');
    document.body.style.overflow = '';
  }
  function isGalleryImage(img){
    if(!img || !img.src) return false;
    if(img.closest('#galerie,[id*="galer"],.gallery,.galerie')) return true;
    var block = img.closest('section,main,article,div');
    var text = block ? (block.textContent || '').toLowerCase() : '';
    var id = block ? (block.id || '').toLowerCase() : '';
    return id.indexOf('galer') !== -1 || text.indexOf('galerie') !== -1 || text.indexOf('naše práce') !== -1 || text.indexOf('nase prace') !== -1;
  }
  document.querySelectorAll('img').forEach(function(img){
    if(isGalleryImage(img)) img.style.cursor = 'zoom-in';
  });
  document.addEventListener('click', function(event){
    var target = event.target && event.target.closest ? event.target.closest('img') : null;
    if(!isGalleryImage(target)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    open(target.currentSrc || target.src, target.alt);
  }, true);
  overlay.addEventListener('click', function(event){
    if(event.target === overlay || event.target === image || event.target === close) hide();
  });
  document.addEventListener('keydown', function(event){
    if(event.key === 'Escape' && overlay.classList.contains('is-open')) hide();
  });
})();
</script>`;

  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${payload}\n</body>`);
  return `${html}\n${payload}`;
}

function PreviewScreen({ html, name, genCount, onRegen, onBack }) {
  const remaining = MAX_GENERATIONS - genCount;
  const displayName = (name || "web").trim() || "web";
  const domainName = displayName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 28) || "web";
  const fileName = displayName.replace(/\s+/g, "_") + ".html";
  const nextSteps = [
    "Stáhnout HTML soubor.",
    "Přejmenovat ho na index.html.",
    "Nahrát index.html do složky www na hostingu.",
    "Zkontrolovat web na mobilu a poslat klientovi ke schválení.",
  ];
  const download = () => {
    const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: fileName,
    });
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div style={{ background: `radial-gradient(circle at 50% 0%, ${C.accent}18, transparent 34%), ${C.bg}`, minHeight: "100vh", fontFamily: "inherit" }}>
      <div style={{ padding: "14px 20px", background: "rgba(8,8,16,0.92)", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ ...btnB, padding: "9px 14px", fontSize: 14 }}>← Upravit zadání</button>
          <span style={{ color: C.muted, fontSize: 14 }}>Náhled pro <strong style={{ color: C.text }}>{displayName}</strong></span>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {remaining > 0 && <button onClick={onRegen} style={{ ...btnB, padding: "10px 15px", fontSize: 14 }}>Vygenerovat jinou variantu ({remaining}×)</button>}
          <button onClick={download} style={{ ...btnA, padding: "11px 18px", fontSize: 14 }}>Stáhnout HTML</button>
        </div>
      </div>
      <div style={{ padding: "26px 20px 34px", maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "stretch", marginBottom: 18 }}>
          <section style={{ flex: "1 1 620px", minWidth: 0, background: `linear-gradient(135deg, ${C.card2}, ${C.card})`, border: `1.5px solid ${C.border}`, borderRadius: 18, padding: 24, boxShadow: "0 26px 80px rgba(0,0,0,0.32)" }}>
            <div style={{ display: "inline-flex", color: "#bbf7d0", background: C.success + "1f", border: `1px solid ${C.success}66`, borderRadius: 999, padding: "6px 10px", fontSize: 13, fontWeight: 900, marginBottom: 14 }}>
              Hotovo
            </div>
            <h1 style={{ color: C.text, fontSize: 34, lineHeight: 1.12, margin: "0 0 10px", fontWeight: 950 }}>
              Web je připravený ke kontrole
            </h1>
            <p style={{ color: C.muted, fontSize: 17, lineHeight: 1.65, margin: "0 0 18px", maxWidth: 760 }}>
              Prohlédněte si náhled níže. Když sedí obsah, stáhněte soubor <strong style={{ color: C.text }}>{fileName}</strong> a před nahráním ho přejmenujte na <strong style={{ color: C.text }}>index.html</strong>.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={download} style={{ ...btnA, padding: "15px 22px", fontSize: 16 }}>Stáhnout hotový web</button>
              <button onClick={onBack} style={{ ...btnB, padding: "15px 20px", fontSize: 16 }}>Upravit formulář</button>
            </div>
          </section>

          <aside style={{ flex: "1 1 320px", minWidth: 280, background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 18, padding: 20 }}>
            <div style={{ color: C.text, fontWeight: 900, fontSize: 18, marginBottom: 14 }}>Co teď udělat</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {nextSteps.map((step, i) => (
                <div key={step} style={{ display: "flex", gap: 10, alignItems: "flex-start", color: C.muted, fontSize: 15, lineHeight: 1.45 }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: i === 0 ? C.accent : C.input, color: i === 0 ? "white" : C.text, border: `1px solid ${i === 0 ? C.accent : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, flexShrink: 0 }}>{i + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: 14, background: C.input, border: `1px solid ${C.border}`, borderRadius: 12, color: C.muted, fontSize: 14, lineHeight: 1.55 }}>
              Potřebujete pomoct s nahráním? Ozvěte se - za 500 Kč web nahraju a nastavím.
            </div>
          </aside>
        </div>

        <div style={{ background: "#151827", borderRadius: 18, overflow: "hidden", boxShadow: "0 28px 90px rgba(0,0,0,0.48)", border: `1.5px solid ${C.border}` }}>
          <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#ff5f56","#ffbd2e","#27c93f"].map((c,i) => <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
            </div>
            <div style={{ flex: 1, background: C.input, borderRadius: 8, padding: "7px 12px", fontSize: 14, color: C.muted, minWidth: 180 }}>
              https://{domainName}.cz
            </div>
            <div style={{ color: "#e5e7eb", fontSize: 13, display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.success, display: "inline-block" }} />
              Náhled
            </div>
          </div>
          <iframe
            srcDoc={html}
            sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            style={{ width: "100%", height: "74vh", border: "none", display: "block", background: "white" }}
            title="Náhled"
          />
        </div>
        <div style={{ marginTop: 14, color: C.muted, fontSize: 13, lineHeight: 1.55, textAlign: "center" }}>
          Náhled je sandboxovaný kvůli bezpečnosti. Stažený HTML soubor obsahuje stejné úpravy včetně funkční galerie.
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [started,  setStarted]  = useState(false);
  const [step,     setStep]     = useState(0);
  const [loading,  setLoading]  = useState(false);
  const [html,     setHtml]     = useState(null);
  const [preview,  setPreview]  = useState(false);
  const [genCount, setGenCount] = useState(0);
  const [f, setF] = useState({
    companyName: "", ico: "", industry: "", description: "", founded: "",
    heroHeadline: "",
    services: [{ name: "", desc: "" }, { name: "", desc: "" }, { name: "", desc: "" }],
    offerSectionTitle: "",
    aiFillServiceDesc: false,
    trustPoints: ["", "", ""],
    benefits: [{ title: "", desc: "" }, { title: "", desc: "" }, { title: "", desc: "" }],
    processSteps: [{ title: "", desc: "" }, { title: "", desc: "" }, { title: "", desc: "" }, { title: "", desc: "" }],
    phone: "", email: "", address: "", city: "",
    contactPerson: "", openingHours: "",
    facebook: "", instagram: "", linkedin: "",
    reviews: [],
    palette: PALETTES[0],
    gdprMode: "auto", gdprCustom: "",
    heroImage: null,
    gallery: [null, null, null, null, null, null],
    logo: null,
  });

  const upd = (k, v) => setF(p => ({ ...p, [k]: v }));

  const validateStep = (s) => {
    const missing = [];
    if (s === 0) {
      if (!f.companyName.trim()) missing.push("Název firmy");
      if (!f.ico.trim())         missing.push("IČO");
      if (!f.industry.trim())    missing.push("Obor podnikání");
      if (!f.description.trim()) missing.push("Popis firmy");
    } else if (s === 1) {
      if (!f.services.some(srv => srv.name.trim())) missing.push("Alespoň jedna položka nabídky");
    } else if (s === 4) {
      if (!f.phone.trim())   missing.push("Telefon");
      if (!f.email.trim())   missing.push("Email");
      if (!f.address.trim()) missing.push("Ulice a číslo");
      if (!f.city.trim())    missing.push("Město");
    }
    return missing;
  };

  const handleNext = () => {
    const missing = validateStep(step);
    if (missing.length > 0) {
      alert(`Pro pokračování prosím vyplňte:\n\n• ${missing.join("\n• ")}`);
      return;
    }
    setStep(s => s + 1);
  };

  const handlePay = () => {
    const ok = window.confirm("DEMO — V produkci zde proběhne přesměrování na SimpleShop.\n\nSimulovat zaplacení a pokračovat?");
    if (ok) generate();
  };

  const generate = async () => {
    if (genCount >= MAX_GENERATIONS) {
      alert(`Limit ${MAX_GENERATIONS} generování byl vyčerpán.`);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GENERATION_TIMEOUT_MS);
    try {
      const services = f.services.filter(s => s.name.trim());
      const offerSectionTitle = f.offerSectionTitle.trim();
      const offerLabel = offerSectionTitle || "AI ZVOLÍ PODLE OBORU";
      const reviews = f.reviews.filter(r => r.text.trim());
      const trustList = f.trustPoints.filter(s => s.trim());
      const benefitsList = f.benefits.filter(b => b.title.trim());
      const hasBenefits = benefitsList.length > 0;
      const processFilled = f.processSteps.filter(s => s.title.trim());
      const hasProcess = processFilled.length === 4;
      const galleryUploaded = f.gallery.filter(Boolean);
      const galleryCount = galleryUploaded.length;
      const hasHero = !!f.heroImage;
      const hasLogo = !!f.logo;
      const aiFillSvc = f.aiFillServiceDesc;
      const socials = [
        f.facebook  && { name: "Facebook",  url: f.facebook,  svg: '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>' },
        f.instagram && { name: "Instagram", url: f.instagram, svg: '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>' },
        f.linkedin  && { name: "LinkedIn",  url: f.linkedin,  svg: '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>' },
      ].filter(Boolean);
      const hasSocial = socials.length > 0;
      const mapsAddress = encodeURIComponent(`${f.address}, ${f.city}`);
      const mapsUrl = `https://maps.google.com/maps?q=${mapsAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      const gdpr = f.gdprMode === "custom" && f.gdprCustom.trim()
        ? f.gdprCustom.trim()
        : `Správce osobních údajů: ${f.companyName}, IČO: ${f.ico}, ${f.address} ${f.city}. Osobní údaje (jméno, email, telefon) jsou zpracovávány výhradně za účelem odpovědi na Vaši poptávku, na základě oprávněného zájmu správce dle čl. 6 odst. 1 písm. f) GDPR. Údaje nejsou předávány třetím stranám. Kontakt: ${f.email}.`;

      const prompt = `Jsi prémiový český webdesignér se specializací na profesionální one-page weby pro malé české firmy. Tvůj cíl: vytvořit web, který vypadá jako práce dražší agentury (cena 30-80 tisíc Kč). Web musí budit důvěru a působit profesionálně.

VRAŤ POUZE čistý HTML kód začínající <!DOCTYPE html>. Bez markdown, bez komentářů mimo HTML.

═══ KRITICKÁ PRAVIDLA — POROZUMĚJ DŘÍVE NEŽ GENERUJEŠ ═══
1. NIKDY si nevymýšlej faktické údaje které nejsou v zadání: počty zákazníků, roky existence (pokud není v "Působí od"), pracovní dobu, ceny, certifikace, ocenění, jména zaměstnanců, lokality navíc.
2. Pokud je nějaká informace označena "NEZADÁNO" nebo "NEZOBRAZUJ" — opravdu ji vynech, neimprovizuj náhradu.
3. Pokud je text označen "POUŽIJ PŘESNĚ" — vlož ho přesně tak jak je, neparafrázuj.
4. NEVYMÝŠLEJ nové slogany, claimy ani pseudo-positioning typu "Stavebnictví na míru", "Kvalita bez kompromisů", "Profesionální řešení pro..." pokud to klient výslovně nezadal. Kicker badge, H1 a hlavní claim musí být konzervativní a vycházet z názvu firmy, oboru a popisu majitele.
5. Marketingové texty (popisy nabídky, krátké podnadpisy) které nejsou zadané MŮŽEŠ doplnit — ale jen jako obecné vysvětlení, bez konkrétních čísel, dat, certifikací, garancí, superlativů a bez nových positioning frází.
6. Pokud klient nezadal kontaktní osobu, recenze, pracovní dobu, postup, benefity — tyto sekce/řádky NEZOBRAZUJ.
7. ČESKÁ GRAMATIKA: Píšeš PEČLIVĚ správnou českou gramatikou. Pozor zejména na háčky a čárky (ě/š/č/ř/ž/ý/á/í/é/ú/ů). PŘÍKLAD CHYBY: "Ozveěte se" je špatně, správně je "Ozvěte se". Před odesláním ZKONTROLUJ každé slovo s diakritikou.
8. KONTRAST: Pokud má sekce barevné pozadí (např. zelené/modré v kontakt sekci), text v ní MUSÍ být bílý nebo s velmi vysokou opacitou (min. rgba(255,255,255,0.9)). NIKDY šedý text na barevném pozadí!
9. ČITELNOST PRO STARŠÍ UŽIVATELE: body text min. 16px, důležité texty 18px+, line-height min. 1.55. Dodrž kontrast alespoň WCAG AA. Na světlém pozadí používej tmavý text #111827 a sekundární text max. #4b5563. Na tmavém nebo barevném pozadí používej bílý text nebo rgba(255,255,255,0.92+). Placeholdery, popisky a malé poznámky nesmí být příliš světlé/šedé.

═══ FIRMA ═══
Název: ${f.companyName}
IČO: ${f.ico}
Obor: ${f.industry}
Popis od majitele: ${f.description}
${f.founded ? `Působí od: ${f.founded}` : ""}
${f.contactPerson ? `Kontaktní osoba: ${f.contactPerson}` : ""}
${f.heroHeadline ? `HLAVNÍ SLOGAN (POUŽIJ PŘESNĚ TENTO TEXT JAKO H1 V HERO): "${f.heroHeadline}"` : `HLAVNÍ SLOGAN: NEZADÁN — jako H1 použij primárně název firmy "${f.companyName}". Nevymýšlej vlastní slogan ani claim.`}

NABÍDKA (může znamenat služby, lekce, členství, produkty, menu, balíčky — přizpůsob oboru):
Preferovaný název sekce: ${offerLabel}
POUŽIJ PŘESNĚ TYTO NÁZVY POLOŽEK, NIC NEVYMÝŠLEJ NAVÍC:
${services.map((s, i) => `${i+1}. ${s.name}${s.desc.trim() ? `\n   Popis (POUŽIJ PŘESNĚ): "${s.desc}"` : `\n   Popis: NEZADÁN — vymysli 1-2 věty popisu specifické pro tuto položku nabídky v oboru "${f.industry}"`}`).join("\n")}

Kontakt — POUŽIJ POUZE TYTO ÚDAJE, NIC NEVYMÝŠLEJ:
Telefon: ${f.phone}
Email: ${f.email}
Adresa: ${f.address}, ${f.city}
${f.openingHours ? `Pracovní doba: ${f.openingHours}` : "Pracovní doba: NEZADÁNA — NEZOBRAZUJ na webu, nic nevymýšlej!"}
${reviews.length ? `Recenze:\n${reviews.map(r => `- ${r.stars}★ "${r.text}" — ${r.name}`).join("\n")}` : "Recenze: nezadány — sekci recenzí NEZOBRAZUJ"}

POSTUP (Jak to probíhá):
${hasProcess ? `POUŽIJ PŘESNĚ TYTO 4 KROKY (NEVYMÝŠLEJ JINÉ NÁZVY):\n${processFilled.map((s, i) => `${i+1}. ${s.title}${s.desc.trim() ? ` — popis: "${s.desc}"` : ` (popis vymysli 1-2 věty)`}`).join("\n")}` : "POSTUP NEZADÁN — sekci 'Jak to probíhá' NEZOBRAZUJ na webu (přeskoč ji úplně, NEVYMÝŠLEJ vlastní kroky)"}

Primární barva: ${f.palette.primary}
Akcentová barva: ${f.palette.accent}
Krémové/světlé pozadí: ${f.palette.bg}

═══ NAHRANÉ MATERIÁLY ═══
${hasLogo ? `LOGO: Klient nahrál vlastní logo → V navigaci a footeru použij <img src="{{LOGO}}" alt="${f.companyName}" style="height:42px;width:auto;object-fit:contain"> místo textového loga.` : "LOGO: NEnahráno → V navigaci a footeru použij stylový textový název firmy v hlavním fontu, weight 800."}
${hasHero ? `HERO FOTKA: Klient nahrál hero fotku → V hero sekci v pravém sloupci místo CSS dekorativního prvku použij <img src="{{HERO_IMAGE}}" alt="${f.companyName}" style="width:100%;height:600px;object-fit:cover;border-radius:24px;box-shadow:0 20px 60px rgba(0,0,0,0.15)">` : "HERO FOTKA: NEnahrána → V hero sekci v pravém sloupci použij CSS dekorativní prvek dle DESIGN DNA oboru (gradient s geometrickými tvary)."}
GALERIE: Klient nahrál ${galleryCount} fotek z 6.
${galleryCount > 0 ? `→ Zobraz POUZE ${galleryCount} dlaždic se skutečnými fotkami (NIKDY nepřidávej prázdné šedé placeholdery!). Použij <img src="{{GALLERY_N}}" alt="Práce N" style="width:100%;height:100%;object-fit:cover"> kde N je 1 až ${galleryCount}` : ""}
${galleryCount === 0 ? "→ Klient nenahrál žádné fotky → pro galerii použij 6 šedých CSS placeholderů s textem 📷 Vaše práce" : ""}

═══ KROK 1: ANALYZUJ OBOR — TOTO JE NEJDŮLEŽITĚJŠÍ ═══

Přečti pole "Obor: ${f.industry}" a urči vhodnou DESIGN DNA. Mapování:

ŘEMESLO (truhlář, tesař, zedník, malíř, klempíř, podlahář, kameník, obkladač):
→ Hero pattern: jemné dřevěné textury z CSS gradientů, organické tvary
→ Fonty: nadpisy "Plus Jakarta Sans" weight 800, tělo "Inter"
→ Atmosféra: poctivost, tradice, vlastní ruka, "uděláme to správně"
→ Microcopy: "Práce od srdce", konkrétní hmatatelné výsledky
→ Ikonografie: 🪵 🔨 🛠 🏠 ⚒ 🪚

INSTALATÉR / ELEKTRIKÁŘ / TOPENÁŘ / SERVIS:
→ Hero pattern: technický geometrický pattern, modré odstíny, čistota
→ Fonty: nadpisy "Inter" weight 700, tělo "Inter"
→ Atmosféra: spolehlivost, rychlost, 24/7
→ Microcopy: "Vyřešíme to rychle", "Volejte kdykoli"
→ Ikonografie: 🔧 ⚡ 💧 🚿 🔩 ⚙

KRÁSA (kadeřnictví, kosmetika, manikúra, masáže):
→ Hero pattern: jemný gradient, soft shapes, asymetrické vlnky
→ Fonty: nadpisy "Playfair Display", tělo "Inter"
→ Atmosféra: péče, elegance
→ Microcopy: "Cítíte se jako nová", "Náš salon"
→ Ikonografie: ✨ 💆 💅 💇 🌸 🤍

PRÁVO / FINANCE / ÚČETNICTVÍ / KONZULTING:
→ Hero pattern: minimalistický, mnoho bílého prostoru
→ Fonty: nadpisy "Plus Jakarta Sans" weight 700, tělo "Inter"
→ Atmosféra: precizní, profesionální
→ Microcopy: "Jistota v každém kroku", "Vaše čísla pod kontrolou"
→ Ikonografie: ⚖ 📊 📈 💼 📑 ✅

ZDRAVOTNICTVÍ (lékař, fyzio, zubař, terapeut):
→ Hero pattern: čistý, klidný, modern
→ Fonty: nadpisy "Inter" weight 700, tělo "Inter"
→ Atmosféra: klid, jistota
→ Microcopy: "Pečujeme o vás komplexně"
→ Ikonografie: 🩺 💊 🦷 ❤ 🫀 🌿

GASTRONOMIE (restaurace, kavárna, pekárna):
→ Hero pattern: teplý gradient s organickými tvary
→ Fonty: nadpisy "Playfair Display", tělo "Inter"
→ Atmosféra: pohostinnost, chuť
→ Microcopy: "Vaříme s láskou"
→ Ikonografie: ☕ 🍰 🥐 🍴 🍷 🍞

FITNESS / TRENÉR / SPORT:
→ Hero pattern: dynamický, kontrastní, šikmé linky
→ Fonty: nadpisy "Plus Jakarta Sans" weight 800 italic, tělo "Inter"
→ Atmosféra: energie, výzva
→ Microcopy: "Začněte hned", "Posuňte se dál"
→ Ikonografie: 💪 🏋 🔥 ⚡ 🏃 🥇

STAVEBNICTVÍ / DEVELOPER:
→ Hero pattern: silný, geometrický, blueprint linky
→ Fonty: nadpisy "Plus Jakarta Sans" weight 800, tělo "Inter"
→ Atmosféra: solidnost, viditelný výsledek
→ Microcopy: "Postavíme vám...", "Konkrétní termíny"
→ Ikonografie: 🏗 🏠 📐 🚧 🔨 🏢

IT / DIGITAL / MARKETING:
→ Hero pattern: moderní geometrie, barevné gradienty, abstraktní tvary
→ Fonty: nadpisy "Plus Jakarta Sans" weight 700, tělo "Inter"
→ Atmosféra: inovace, expertíza
→ Microcopy: "Posuneme vás dál", "Měřitelné výsledky"
→ Ikonografie: 💻 📱 🚀 ⚙ 📊 🎯

NEZNÁMÝ OBOR: kombinace IT+Konzulting (čistý, profesionální, moderní)

═══ KROK 2: VIZUÁLNÍ JAZYK ═══

LAYOUT
- Hodně bílého prostoru, padding 80-120px vertical
- Velká typografie: H1 56-72px, H2 36-44px, H3 22-28px desktop
- Letter-spacing -0.02em pro velké nadpisy, line-height 1.1-1.2
- Tělo 16-18px, line-height 1.65
- Border-radius 16px karty, 10px buttony
- Box-shadow: 0 4px 24px rgba(0,0,0,0.06)
- Smooth transitions 0.3s ease

BAREVNÉ POUŽITÍ
- Většina sekcí: ${f.palette.bg}
- Některé sekce: čistá bílá pro kontrast
- Akcent ${f.palette.primary}: pouze CTA, hover, ikony — NIKDY pozadí celých sekcí
- Text: tmavá #111827, sekundární: #4b5563
- Footer: tmavé pozadí #0f0f0f s bílým textem

═══ KROK 3: STRUKTURA ═══

NAVIGACE (sticky)
- KRITICKÉ: VŽDY solid white background #ffffff s box-shadow: 0 2px 12px rgba(0,0,0,0.06) — NIKDY průhledná, ŽÁDNÉ změny barev při scrollu!
- Text v navigaci VŽDY tmavý: logo color #0f0f0f, menu items color #444. NEMĚŇ barvy nikdy.
- Padding 16px 0, sticky top:0, z-index:100
- ${hasLogo ? "Logo vlevo (img tag s {{LOGO}})" : "Logo vlevo = název firmy v hlavním fontu, weight 800"}
- Menu: Domů${hasBenefits ? " · O nás" : ""} · ${offerSectionTitle || "Nabídka"}${hasProcess ? " · Jak to probíhá" : ""}${galleryCount > 0 ? " · Galerie" : ""}${reviews.length ? " · Recenze" : ""} · Kontakt
- Vpravo malé CTA "Poptávka" (#kontakt)
- Mobile: hamburger animovaný do plnoobrazovkového menu

HERO (id="home", min-height: 92vh)
- Layout 2 sloupce na desktopu (60% text vlevo, 40% vizuál vpravo)
- Levý sloupec:
  • MALÝ kicker badge NAHOŘE nad H1 (KRITICKÉ: max font-size 13px, padding 6px 14px, uppercase, color: ${f.palette.primary}, background: ${f.palette.primary}15, border-radius 100px, letter-spacing 0.1em, display: inline-block, marginBottom: 24px) — použij jen faktický obor/kategorii ze zadání: "${f.industry}". NEVYMÝŠLEJ claimy typu "na míru", "profesionální řešení", "kvalita bez kompromisů". NESMÍ být velký nadpis, je to JEN MALÝ ŠTÍTEK!
  • H1 = ${f.heroHeadline ? `POUŽIJ PŘESNĚ TENTO TEXT: "${f.heroHeadline}"` : `POUŽIJ NÁZEV FIRMY: "${f.companyName}". Pokud slogan není zadaný, NEVYMÝŠLEJ vlastní headline ani benefit větu.`}
  • Podtitulek 18-20px, 2 řádky max
  • 2 buttony: primární "Nezávazná poptávka" (#kontakt), sekundární outline "${offerSectionTitle || "Naše nabídka"}" (#sluzby)
  • Pod buttony ${trustList.length > 0 ? `${trustList.length} trust elementy s ikonkou ✓ — POUŽIJ PŘESNĚ TYTO TEXTY, NIC NEVYMÝŠLEJ:\n${trustList.map(t => `    ✓ ${t}`).join("\n")}` : "NEZOBRAZUJ žádné trust elementy ani ✓ tvrzení — klient žádné neuvedl"}
- Pravý sloupec:
  ${hasHero ? `• Použij <img src="{{HERO_IMAGE}}" alt="${f.companyName}" style="width:100%;height:600px;object-fit:cover;border-radius:24px;box-shadow:0 20px 60px rgba(0,0,0,0.15)">` : "• CSS pattern dle DESIGN DNA oboru: gradient + geometrické tvary, border-radius 24px, výška 500-600px"}

${hasBenefits ? `PROČ MY (id="o-nas")
- Bílé pozadí, padding 100px 0
- H2 "Proč si vybrat ${f.companyName}" + krátký podnadpis (POUŽIJ CELÝ NÁZEV FIRMY, ne jen první slovo)
- ${benefitsList.length} ${benefitsList.length === 1 ? "karta" : benefitsList.length < 5 ? "sloupce" : "sloupců"} s benefity:
  • Velká emoji ikona z DESIGN DNA v kruhu (60x60px, ${f.palette.primary} s 15% průhlednosti)
  • Nadpis benefitu (22px, weight 700)
  • 2-3 věty popisu
- POUŽIJ PŘESNĚ TYTO BENEFITY (klient je zadal — NEVYMÝŠLEJ JINÉ ANI NEPŘIDÁVEJ DALŠÍ!):
${benefitsList.map((b, i) => `  Karta ${i+1}: Nadpis = "${b.title}", Popis = ${b.desc.trim() ? `"${b.desc}"` : `(vymysli obecný popis 2-3 věty k tomuto benefitu, bez konkrétních čísel a faktů)`}`).join("\n")}` : `PROČ MY — KLIENT NEZADAL ŽÁDNÉ BENEFITY → SEKCI "Proč si vybrat" ÚPLNĚ VYNECHEJ! NEVYMÝŠLEJ vlastní benefity jako "Moderní technika", "Přesné termíny", "Osobní přístup" apod. — sekce prostě nebude na webu, vynech ji i v navigaci.`}

NABÍDKA (id="sluzby")
- Pozadí ${f.palette.bg}, padding 100px 0
- H2: ${offerSectionTitle ? `POUŽIJ PŘESNĚ "${offerSectionTitle}"` : `zvol přirozený název podle oboru "${f.industry}" — např. řemeslník: "Co pro vás děláme", fitness/posilovna: "Tréninky a členství", restaurace: "Co nabízíme", salon: "Péče a služby"`}
- Podnadpis přizpůsob oboru. U fitness nepiš jako řemeslník; mluv o tréninku, lekcích, členství, vybavení nebo programech podle zadaných položek.
- Grid karet (3 sloupce desktop, 2 tablet, 1 mobil)
- Karta: bílé pozadí, padding 32px, border-radius 16px
  • Velká emoji ikona z DESIGN DNA vlevo nahoře
  • Nadpis položky nabídky (20px weight 700)
  • Popis položky nabídky
  • Šipka → vpravo dole
- Hover: translateY(-6px), prohloubený stín
- Položky nabídky (POUŽIJ POUZE TYTO, NIC NAVÍC):
${services.map((s, i) => `  Karta ${i+1}: Název = "${s.name}", Popis = ${s.desc.trim() ? `"${s.desc}"` : aiFillSvc ? `(vymysli 1-2 věty popisu specifické pro tuto položku v oboru "${f.industry}", bez konkrétních čísel/faktů)` : `(POPIS NEZADÁN A KLIENT NECHCE AI VYPLNĚNÍ — zobraz JEN název položky v kartě, BEZ jakéhokoli popisu pod ním)`}`).join("\n")}

${hasProcess ? `JAK TO PROBÍHÁ (id="proces")
- Bílé pozadí, padding 100px 0
- H2 "Jak u nás probíhá spolupráce" + krátký podnadpis
- 4 horizontální kroky (mobil vertikálně), spojené tenkou linkou
- Krok: velké číslo v kruhu (1,2,3,4) v ${f.palette.primary}, nadpis kroku, krátký popis
- POUŽIJ PŘESNĚ TYTO 4 KROKY (klient je zadal):
${processFilled.map((s, i) => `  Krok ${i+1}: Název = "${s.title}", Popis = ${s.desc.trim() ? `"${s.desc}"` : `(vymysli 1-2 věty popisu tohoto kroku)`}`).join("\n")}` : "JAK TO PROBÍHÁ — KLIENT NEZADAL → SEKCI ÚPLNĚ VYNECHEJ, NEZOBRAZUJ ji ani v navigaci!"}

GALERIE (id="galerie")
- Pozadí ${f.palette.bg}, padding 100px 0
- H2 "Naše práce" + podnadpis
- Mřížka grid s ${galleryCount === 0 ? 6 : galleryCount} dlaždicemi: grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)), gap 16px, border-radius 12px overflow:hidden, aspect-ratio 4:3
${galleryCount === 0 ? `- Klient nenahrál žádné fotky → zobraz 6 šedých placeholderů: linear-gradient ze 2 šedých odstínů + emoji 📷 + text "Vaše práce" (BEZ lightboxu)` : `- Zobraz POUZE ${galleryCount} dlaždic se skutečnými fotkami:\n${Array.from({length: galleryCount}, (_, i) => `  Dlaždice ${i+1}: <img src="{{GALLERY_${i+1}}}" alt="Práce ${i+1}" style="width:100%;height:100%;object-fit:cover;cursor:zoom-in">`).join("\n")}\n  NEPŘIDÁVEJ ŽÁDNÉ DALŠÍ PRÁZDNÉ ŠEDÉ DLAŽDICE!`}
- Hover na obrázek: scale(1.03) + překryvný overlay v ${f.palette.primary} s 20% průhlednosti

LIGHTBOX:
${galleryCount > 0 ? `- NEVKLÁDEJ vlastní lightbox, vlastní openLightbox funkce ani inline onclick skripty. Aplikace po generování automaticky vloží spolehlivý lightbox pro všechny fotky v sekci Galerie.` : "- Bez nahraných fotek lightbox není potřeba."}

${reviews.length ? `RECENZE (id="recenze")
- Bílé pozadí, padding 100px 0
- H2 "Co o nás říkají zákazníci" + podnadpis
- Grid 2-3 karet
- Karta: padding 32px, border 1px solid #eee, border-radius 16px
  • Hvězdičky nahoře (★ v ${f.palette.primary})
  • Citát v uvozovkách, font-size 18px, italic
  • Jméno zákazníka tučně dole
` : ""}
KONTAKT (id="kontakt")
- Pozadí ${f.palette.primary} (text bílý), padding 100px 0
- 2 sloupce desktop
- Levý sloupec:
  • Kicker "Pojďme to probrat" (uppercase, color: rgba(255,255,255,0.7))
  • H2 "Kontaktujte nás" v BÍLÉ (color: #ffffff)
  • Podtitulek 2 řádky — KRITICKÉ: color: rgba(255,255,255,0.92), font-size: 16px (NESMÍ být šedý nebo tmavý, pozadí je barevné!)
  • Řádky info s ikonami (POUŽIJ POUZE ŘÁDKY KTERÉ KLIENT ZADAL, ostatní VYNECH, color: #ffffff):
    ${f.contactPerson ? `👤 ${f.contactPerson}` : "(kontaktní osoba: NEZADÁNA — vynech řádek)"}
    📞 ${f.phone}
    ✉️ ${f.email}
    📍 ${f.address}, ${f.city}
    ${f.openingHours ? `🕐 ${f.openingHours}` : "(pracovní doba: NEZADÁNA — VYNECH řádek, NIC NEVYMÝŠLEJ jako 'Po-Pá 8-17')"}
  • Pod info přidej Google Maps iframe:
    <iframe src="${mapsUrl}" width="100%" height="280" style="border:0;border-radius:16px;margin-top:24px;filter:grayscale(0.2)" allowfullscreen loading="lazy"></iframe>
- Pravý sloupec — formulář v BÍLÉ kartě:
  • padding 40px, border-radius 20px
  • Pole: Vaše jméno, Email, Telefon (volitelné), Předmět, Vaše zpráva (textarea 4 řádky)
  • Inputs: padding 14px, border 1px solid #e5e5e5, border-radius 10px, font-size 16px
  • HONEYPOT (anti-spam): přidej skryté pole <input type="text" name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;opacity:0;pointer-events:none" aria-hidden="true">
  • Pod polem zpráva GDPR checkbox: <label style="display:flex;align-items:flex-start;gap:10px;font-size:13px;color:#666;margin-top:8px"><input type="checkbox" name="gdpr" required style="margin-top:3px"><span>Souhlasím se <a href="#" onclick="document.getElementById('gdpr-modal').style.display='flex';return false" style="color:${f.palette.primary}">zpracováním osobních údajů</a>.</span></label>
  • Submit button v ${f.palette.primary}, full-width, padding 16px, font-size 17px, weight 700
  • Form: <form action="mailto:${f.email}" method="post" enctype="text/plain" onsubmit="return !this.website.value">
  • Onsubmit blokuje odeslání pokud je honeypot vyplněn (boti)

GDPR — JAKO MODAL POPUP (NE SAMOSTATNÁ SEKCE!)
- NEVKLÁDEJ GDPR jako sekci na stránce
- Místo toho přidej HTML modal který se otevře po kliknutí na odkaz "Ochrana osobních údajů" ve footeru
- Modal HTML struktura (vlož na konec <body>):
  <div id="gdpr-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:1000;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)" onclick="if(event.target===this)this.style.display='none'">
    <div style="background:white;max-width:720px;width:100%;max-height:85vh;border-radius:20px;padding:48px;overflow-y:auto;position:relative;box-shadow:0 30px 80px rgba(0,0,0,0.3)">
      <button onclick="document.getElementById('gdpr-modal').style.display='none'" style="position:absolute;top:20px;right:20px;width:36px;height:36px;border-radius:50%;border:none;background:#f5f5f5;cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center" aria-label="Zavřít">×</button>
      <h2 style="margin:0 0 24px;font-size:28px;color:#1a1a1a">Zásady ochrany osobních údajů</h2>
      <div style="font-size:15px;line-height:1.7;color:#444">${gdpr}</div>
    </div>
  </div>
- Ve footeru odkaz: <a href="#" onclick="document.getElementById('gdpr-modal').style.display='flex';return false" style="...">Ochrana osobních údajů</a>
- Stejný odkaz použij i v GDPR checkboxu kontaktního formuláře (místo href="#gdpr" → onclick handler který otevře modal)
- ESC klávesa zavře modal: přidej do <script> document.addEventListener('keydown',e=>{if(e.key==='Escape')document.getElementById('gdpr-modal').style.display='none'})

FOOTER
- Tmavé pozadí #0f0f0f, text bílý, padding 60px 0 30px
- 3 sloupce: 
  • Sloupec 1: ${hasLogo ? "<img src='{{LOGO}}' style='height:48px;filter:brightness(0) invert(1)'>" : "logo (název firmy weight 800)"}, pod ním krátký claim, ${hasSocial ? `pod tím řada sociálních ikon:\n${socials.map(s => `      <a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.name}" style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.08);color:#fff;margin-right:10px;text-decoration:none;transition:all 0.3s">${s.svg}</a>`).join("\n")}\n      Hover efekt: background mění na ${f.palette.primary}` : "bez sociálních sítí"}
  • Sloupec 2: "Kontakt" + 4 řádky
  • Sloupec 3: "Navigace" + odkazy na sekce
- Spodní řádek: border-top, padding-top 30px, flex space-between
  • Vlevo: © ${new Date().getFullYear()} ${f.companyName} | IČO: ${f.ico}
  • Vpravo: <a href="#" onclick="document.getElementById('gdpr-modal').style.display='flex';return false">Ochrana osobních údajů</a>

═══ TECHNICKÉ ═══
- Mobile-first responzivní (640, 768, 1024px)
- CSS proměnné v :root
- scroll-behavior: smooth
- Intersection Observer pro fade-in (opacity 0→1, translateY 30px→0, duration 0.6s)
- Vše v jednom HTML souboru
- Sémantické HTML5

═══ TÓN COPY ═══
- Profesionální ale srdečný, ne korporátní
- Krátké věty, žádné fráze typu "kvalita, profesionalita, spolehlivost"
- Konkrétní hmatatelné výhody, ne obecné claims
- Píšeš v jazyce vhodném pro obor

VRAŤ POUZE HTML KÓD. Začni <!DOCTYPE html>.`;

      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 16000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        alert("Worker nevrátil platnou JSON odpověď: " + text.slice(0, 200));
        return;
      }
      if (!res.ok) {
        const message = data?.error?.message || data?.error || JSON.stringify(data).slice(0, 300);
        alert(`API chyba (${res.status}): ${message}`);
        return;
      }
      if (!Array.isArray(data.content)) {
        alert("API vrátilo nečekaný formát odpovědi: " + JSON.stringify(data).slice(0, 300));
        return;
      }
      let raw = data.content.map(b => b.text || "").join("");
      raw = raw.replace(/^```html?\s*/i, "").replace(/\s*```\s*$/i, "").trim();

      // Kontrola — pokud generování nedokončilo, neúčtujeme pokus
      if (!raw.includes("</html>") || raw.length < 3000) {
        alert("Generování se nedokončilo (web je nekompletní). Zkuste to prosím znovu — tento pokus se vám nezapočítá.");
        return;
      }

      // Nahradit placeholdery skutečnými obrázky (base64)
      if (f.heroImage) raw = raw.replace(/\{\{HERO_IMAGE\}\}/g, f.heroImage);
      if (f.logo) raw = raw.replace(/\{\{LOGO\}\}/g, f.logo);
      galleryUploaded.forEach((img, i) => {
        raw = raw.replace(new RegExp(`\\{\\{GALLERY_${i+1}\\}\\}`, "g"), img);
      });
      raw = enforceConservativeHeroText(raw, f);
      if (galleryUploaded.length > 0) raw = injectReliableLightbox(raw);

      setHtml(raw);
      setGenCount(c => c + 1);
      setPreview(true);
    } catch (e) {
      alert(e.name === "AbortError"
        ? "Generování trvalo příliš dlouho a bylo ukončeno. Zkuste to prosím znovu."
        : "Chyba: " + e.message);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  if (!started)        return <Landing onStart={() => setStarted(true)} />;
  if (loading)         return <LoadingScreen name={f.companyName} />;
  if (preview && html) return <PreviewScreen html={html} name={f.companyName} genCount={genCount} onRegen={generate} onBack={() => setPreview(false)} />;

  const globalStyles = `
    input::placeholder, textarea::placeholder { color: #8fa0b7 !important; opacity: 1; }
    input:focus, textarea:focus { border-color: ${C.accent} !important; box-shadow: 0 0 0 4px ${C.accent}22; }
    input, textarea, button { -webkit-font-smoothing: antialiased; }
    .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
    .form-field-full { grid-column: 1 / -1; }
    .compact-stack { display: flex; flex-direction: column; gap: 8px; }
    .form-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 28px; gap: 12px; }
    .order-layout { display: grid; grid-template-columns: 280px minmax(0, 860px); gap: 26px; align-items: start; justify-content: center; }
    .order-sidebar { position: sticky; top: 92px; background: linear-gradient(180deg, ${C.card2}, ${C.card}); border: 1.5px solid ${C.border}; border-radius: 18px; padding: 18px; box-shadow: 0 24px 80px rgba(0,0,0,0.28); }
    .step-row { display: flex; align-items: center; gap: 11px; width: 100%; padding: 10px 9px; border-radius: 12px; border: 0; background: transparent; color: ${C.muted}; text-align: left; font: inherit; }
    .step-row.is-current { background: ${C.accent}1f; color: ${C.text}; }
    .step-row.is-done { color: ${C.text}; cursor: pointer; }
    .step-dot { width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 900; flex-shrink: 0; background: ${C.input}; color: ${C.muted}; border: 1px solid ${C.border}; }
    .step-row.is-current .step-dot, .step-row.is-done .step-dot { background: ${C.accent}; color: white; }
    .optional-details { background: ${C.card}; border: 1.5px solid ${C.border}; border-radius: 18px; overflow: hidden; box-shadow: 0 16px 50px rgba(0,0,0,0.18); }
    .optional-details summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between; gap: 18px; align-items: center; padding: 20px 22px; }
    .optional-details summary::-webkit-details-marker { display: none; }
    .optional-details summary strong { display: block; color: ${C.text}; font-size: 18px; margin-bottom: 4px; }
    .optional-details summary span { display: block; color: ${C.muted}; font-size: 14.5px; line-height: 1.5; }
    .optional-summary-meta { flex-shrink: 0; border: 1px solid ${C.accent}66; background: ${C.accent}1f; color: #fed7aa; border-radius: 999px; padding: 6px 10px; font-size: 12px; font-weight: 850; }
    .optional-body { padding: 0 22px 22px; display: flex; flex-direction: column; gap: 16px; border-top: 1px solid ${C.border}; }
    .mini-section { background: ${C.card2}; border: 1px solid ${C.border}; border-radius: 15px; padding: 18px; }
    .mini-section-head { display: flex; justify-content: space-between; gap: 12px; align-items: center; margin-bottom: 6px; }
    .mini-section h3 { margin: 0; color: ${C.text}; font-size: 18px; font-weight: 900; }
    .mini-section p { margin: 0 0 14px; color: ${C.muted}; font-size: 14.5px; line-height: 1.55; }
    .mini-count { border: 1px solid ${C.border}; background: ${C.input}; color: ${C.muted}; border-radius: 999px; padding: 4px 9px; font-size: 12px; font-weight: 850; }
    .benefit-card { background: ${C.input}; border: 1px solid ${C.border}; border-radius: 13px; padding: 13px; }
    @media (max-width: 720px) {
      .form-grid { grid-template-columns: 1fr; }
      .form-field-full { grid-column: auto; }
      .form-actions { position: sticky; bottom: 0; margin: 24px -18px -18px; padding: 14px 18px; background: rgba(15,16,32,0.96); border-top: 1px solid ${C.border}; backdrop-filter: blur(12px); }
    }
    @media (max-width: 980px) {
      .order-layout { grid-template-columns: 1fr; max-width: 860px; margin: 0 auto; }
      .order-sidebar { position: static; }
    }
  `;

  return (
    <div style={{ background: `radial-gradient(circle at 50% -120px, ${C.accent}1f, transparent 360px), ${C.bg}`, minHeight: "100vh", color: C.text, fontFamily: "-apple-system,'Segoe UI',sans-serif", paddingBottom: 60 }}>
      <style>{globalStyles}</style>
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(8,8,16,0.88)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", gap: 16 }}>
          <div onClick={() => setStarted(false)} style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", cursor: "pointer" }}>
            webodai<span style={{ color: C.accent }}>.cz</span>
          </div>
          <div style={{ color: C.muted, fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.success, display: "inline-block" }} />
            Objednávka webu krok za krokem
          </div>
          <button onClick={() => setStarted(false)} style={{ ...btnB, padding: "9px 15px", fontSize: 14 }}>← Zpět na úvod</button>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 24px 0" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ color: "#fed7aa", background: C.accent + "1f", border: `1px solid ${C.accent}66`, borderRadius: 999, padding: "6px 11px", display: "inline-flex", fontSize: 13, fontWeight: 850, marginBottom: 12 }}>
            Bez registrace · výstup je HTML soubor
          </div>
          <h1 style={{ margin: "0 0 8px", fontSize: 38, lineHeight: 1.08, letterSpacing: "-0.03em", color: C.text }}>
            Objednávka webu
          </h1>
          <p style={{ color: C.muted, fontSize: 17, lineHeight: 1.6, margin: 0, maxWidth: 760 }}>
            Vyplňte jen to, co opravdu víte. Povinné údaje držíme krátké, zbytek můžete přeskočit.
          </p>
        </div>

        <div className="order-layout">
          <aside className="order-sidebar">
            <div style={{ color: C.text, fontWeight: 900, fontSize: 18, marginBottom: 4 }}>Postup objednávky</div>
            <div style={{ color: C.muted, fontSize: 14, lineHeight: 1.45, marginBottom: 12 }}>Krok {step + 1} z {STEPS.length}</div>
            <div style={{ height: 8, background: C.input, border: `1px solid ${C.border}`, borderRadius: 999, overflow: "hidden", marginBottom: 14 }}>
              <div style={{ width: `${((step + 1) / STEPS.length) * 100}%`, height: "100%", background: C.accent, borderRadius: 999 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {STEPS.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => i < step && setStep(i)}
                  className={`step-row ${i === step ? "is-current" : ""} ${i < step ? "is-done" : ""}`}
                  disabled={i > step}
                >
                  <span className="step-dot">{i < step ? "✓" : i + 1}</span>
                  <span style={{ fontWeight: i === step ? 900 : 750 }}>{s}</span>
                </button>
              ))}
            </div>
          </aside>

          <main>
            <div style={{ background: `linear-gradient(180deg, ${C.card2}, ${C.card})`, border: `1.5px solid ${C.border}`, borderRadius: 24, padding: "32px", boxShadow: "0 30px 100px rgba(0,0,0,0.32)" }}>
              {step === 0 && <StepFirma   f={f} upd={upd} />}
              {step === 1 && <StepSluzby  f={f} upd={upd} />}
              {step === 2 && <StepPostup  f={f} upd={upd} />}
              {step === 3 && <StepFotky   f={f} upd={upd} />}
              {step === 4 && <StepKontakt f={f} upd={upd} />}
              {step === 5 && <StepRecenze f={f} upd={upd} />}
              {step === 6 && <StepBarvy   f={f} upd={upd} />}
              {step === 7 && <StepShrnutí f={f} onPay={handlePay} />}
              {step < 7 && (
                <div className="form-actions">
                  {step > 0 ? <button style={btnB} onClick={() => setStep(s => s - 1)}>← Zpět</button> : <div />}
                  <button style={btnA} onClick={handleNext}>{step === 6 ? "Zkontrolovat shrnutí →" : "Pokračovat →"}</button>
                </div>
              )}
            </div>
            <div style={{ textAlign: "center", marginTop: 14, color: C.muted, fontSize: 13 }}>Vaše údaje slouží pouze ke generování webu. Žádná registrace.</div>
          </main>
        </div>
      </div>
    </div>
  );
}
