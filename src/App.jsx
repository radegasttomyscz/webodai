import { useState, useEffect, useRef } from "react";

const MAX_GENERATIONS = 3;
const PALETTES = [
  { id: "orange",   name: "Oranžová", primary: "#c2410c", accent: "#f97316", bg: "#fff7ed" },
  { id: "blue",     name: "Modrá",    primary: "#1e3a8a", accent: "#3b82f6", bg: "#eff6ff" },
  { id: "green",    name: "Zelená",   primary: "#15803d", accent: "#16a34a", bg: "#f0fdf4" },
  { id: "dark",     name: "Tmavá",    primary: "#0f172a", accent: "#475569", bg: "#f8fafc" },
  { id: "burgundy", name: "Vínová",   primary: "#7f1d1d", accent: "#b91c1c", bg: "#fef2f2" },
  { id: "white",    name: "Bílá",     primary: "#18181b", accent: "#52525b", bg: "#ffffff" },
];
const STEPS = ["Firma", "Služby", "Fotky", "Kontakt", "Recenze", "Barvy", "Shrnutí"];
const C = {
  bg: "#080810", card: "#0f0f1a", card2: "#13131f",
  border: "#1e1e30", accent: "#f97316", text: "#e2e8f0",
  muted: "#64748b", input: "#0a0a16", success: "#16a34a",
};
const inp = { width: "100%", padding: "12px 16px", background: C.input, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
const lbl = { display: "block", fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase" };
const btnA = { background: C.accent, border: "none", color: "white", padding: "13px 26px", borderRadius: 10, cursor: "pointer", fontSize: 15, fontWeight: 700, fontFamily: "inherit" };
const btnB = { background: C.card2, border: `1px solid ${C.border}`, color: C.text, padding: "13px 22px", borderRadius: 10, cursor: "pointer", fontSize: 15, fontFamily: "inherit" };

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

function StepFirma({ f, upd }) {
  return (
    <div>
      <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: C.text }}>O vaší firmě</h2>
      <p style={{ color: C.muted, fontSize: 14, margin: "0 0 24px" }}>Základní informace pro váš web</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div><label style={lbl}>Název firmy *</label><input style={inp} placeholder="např. Tesařství Novák s.r.o." value={f.companyName} onChange={e => upd("companyName", e.target.value)} /></div>
        <div>
          <label style={lbl}>IČO *</label>
          <input style={inp} placeholder="12345678" value={f.ico} onChange={e => upd("ico", e.target.value)} maxLength={8} />
          <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>Povinný údaj — zobrazí se ve footeru a v GDPR sekci webu</div>
        </div>
        <div>
          <label style={lbl}>Obor podnikání *</label>
          <input style={inp} placeholder="např. Truhlářství, Instalatérství, Kadeřnictví, Advokátní kancelář..." value={f.industry} onChange={e => upd("industry", e.target.value)} />
          <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>Důležité — podle oboru se přizpůsobí obsah i vzhled vašeho webu</div>
        </div>
        <div><label style={lbl}>Popis firmy *</label><textarea style={{ ...inp, height: 100, resize: "vertical" }} placeholder="Pár vět o vaší firmě — co děláte, kde působíte, čím se odlišujete..." value={f.description} onChange={e => upd("description", e.target.value)} /></div>
        <div><label style={lbl}>Rok založení (volitelné)</label><input style={inp} placeholder="např. 2005" value={f.founded} onChange={e => upd("founded", e.target.value)} /></div>
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
      <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: C.text }}>Kontaktní údaje</h2>
      <p style={{ color: C.muted, fontSize: 14, margin: "0 0 24px" }}>Jak vás zákazníci najdou</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {[
          { l: "Telefon *", key: "phone", ph: "+420 123 456 789" },
          { l: "Email *", key: "email", ph: "info@vase-firma.cz", type: "email" },
          { l: "Ulice a číslo", key: "address", ph: "Hlavní 123" },
          { l: "Město", key: "city", ph: "Praha" },
        ].map(({ l, key, ph, type }) => (
          <div key={key}><label style={lbl}>{l}</label><input style={inp} type={type || "text"} placeholder={ph} value={f[key]} onChange={e => upd(key, e.target.value)} /></div>
        ))}

        <div style={{ paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
          <label style={{ ...lbl, marginTop: 14 }}>Sociální sítě (volitelné)</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { l: "📘 Facebook",  key: "facebook",  ph: "https://facebook.com/vase-firma" },
              { l: "📷 Instagram", key: "instagram", ph: "https://instagram.com/vase_firma" },
              { l: "💼 LinkedIn",  key: "linkedin",  ph: "https://linkedin.com/company/vase-firma" },
            ].map(({ l, key, ph }) => (
              <div key={key}>
                <input style={inp} placeholder={`${l} — ${ph}`} value={f[key]} onChange={e => upd(key, e.target.value)} />
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>Vložte celou URL adresu. Ikony se zobrazí ve footeru webu.</div>
        </div>

        <div style={{ paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
          <div style={{ padding: "10px 14px", background: C.input, borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, color: C.muted, lineHeight: 1.5, marginTop: 10 }}>
            🗺️ <strong style={{ color: C.text }}>Mapa s adresou</strong> se vygeneruje automaticky z vyplněné adresy a města.
          </div>
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
  const services = f.services.filter(s => s.trim());
  const reviews  = f.reviews.filter(r => r.text.trim());
  const galleryCount = f.gallery.filter(Boolean).length;
  const socialList = [f.facebook && "FB", f.instagram && "IG", f.linkedin && "IN"].filter(Boolean).join(", ");
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
        <Row label="Firma"   val={f.companyName} />
        <Row label="IČO"     val={f.ico} />
        <Row label="Obor"    val={f.industry} />
        <Row label="Tel."    val={f.phone} />
        <Row label="Email"   val={f.email} />
        <Row label="Adresa"  val={[f.address, f.city].filter(Boolean).join(", ")} />
        <Row label="Sítě"    val={socialList || "—"} />
        <Row label="Služby"  val={services.join(", ")} />
        <Row label="Hero"    val={f.heroImage ? "✓ Nahráno" : "—"} />
        <Row label="Galerie" val={galleryCount > 0 ? `${galleryCount}× foto` : "—"} />
        <Row label="Logo"    val={f.logo ? "✓ Nahráno" : "—"} />
        <Row label="Recenze" val={reviews.length ? `${reviews.length}×` : "žádné"} />
        <Row label="Barva"   val={f.palette.name} />
        <Row label="GDPR"    val={f.gdprMode === "auto" ? "Automaticky" : "Vlastní text"} />
      </div>
      <div style={{ background: "#091a0f", border: `1px solid ${C.success}40`, borderRadius: 12, padding: 18, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ color: C.text, fontWeight: 700, fontSize: 16 }}>Jednorázová webová stránka</div>
            <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Kompletní one-page web · HTML soubor · {MAX_GENERATIONS}× regenerace</div>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.success }}>2 000 Kč</div>
        </div>
        <div style={{ fontSize: 12, color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>Cena bez DPH · Po zaplacení obdržíte odkaz ke stažení webu emailem</div>
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
  useEffect(() => { const id = setInterval(() => setT(n => n + 1), 600); return () => clearInterval(id); }, []);
  const steps = ["Analyzuji obor podnikání","Vybírám vhodný design","Generuji obsah sekcí","Vytvářím vizuální styl","Vkládám vaše fotografie"];
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>
      <div style={{ textAlign: "center", maxWidth: 420, padding: 32 }}>
        <div style={{ fontSize: 52, marginBottom: 20 }}>⚙️</div>
        <h2 style={{ color: C.text, fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>{"Generuji váš web" + "...".slice(0, (t % 3) + 1)}</h2>
        <p style={{ color: C.muted, margin: "0 0 32px" }}>AI pracuje na webu pro <strong style={{ color: C.text }}>{name}</strong></p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: C.card, borderRadius: 10, border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 14, color: C.accent }}>✦</span>
              <span style={{ color: C.muted, fontSize: 14 }}>{s}</span>
            </div>
          ))}
        </div>
        <p style={{ color: C.muted, fontSize: 13, marginTop: 24 }}>Trvá 30–60 sekund — prosím buďte trpělivý</p>
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
              Stáhněte HTML soubor a přejmenujte ho na <code style={{ color: C.accent, background: C.input, padding: "1px 6px", borderRadius: 4 }}>index.html</code> — pak ho nahrajte do složky <code style={{ color: C.accent, background: C.input, padding: "1px 6px", borderRadius: 4 }}>www</code> na hostingu.<br />
              <strong style={{ color: C.text }}>Potřebujete pomoct s nahráním?</strong> Ozvěte se — za 500 Kč vše nastavím za vás.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    facebook: "", instagram: "", linkedin: "",
    reviews: [],
    palette: PALETTES[0],
    gdprMode: "auto", gdprCustom: "",
    heroImage: null,
    gallery: [null, null, null, null, null, null],
    logo: null,
  });

  const upd = (k, v) => setF(p => ({ ...p, [k]: v }));

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
    try {
      const services = f.services.filter(s => s.trim());
      const reviews = f.reviews.filter(r => r.text.trim());
      const galleryUploaded = f.gallery.filter(Boolean);
      const galleryCount = galleryUploaded.length;
      const hasHero = !!f.heroImage;
      const hasLogo = !!f.logo;
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

═══ FIRMA ═══
Název: ${f.companyName}
IČO: ${f.ico}
Obor: ${f.industry}
Popis od majitele: ${f.description}
${f.founded ? `Působí od: ${f.founded}` : ""}
Služby: ${services.join(" · ")}
Telefon: ${f.phone}
Email: ${f.email}
Adresa: ${f.address}, ${f.city}
${reviews.length ? `Recenze:\n${reviews.map(r => `- ${r.stars}★ "${r.text}" — ${r.name}`).join("\n")}` : ""}
Primární barva: ${f.palette.primary}
Akcentová barva: ${f.palette.accent}
Krémové/světlé pozadí: ${f.palette.bg}

═══ NAHRANÉ MATERIÁLY ═══
${hasLogo ? `LOGO: Klient nahrál vlastní logo → V navigaci a footeru použij <img src="{{LOGO}}" alt="${f.companyName}" style="height:42px;width:auto;object-fit:contain"> místo textového loga.` : "LOGO: NEnahráno → V navigaci a footeru použij stylový textový název firmy v hlavním fontu, weight 800."}
${hasHero ? `HERO FOTKA: Klient nahrál hero fotku → V hero sekci v pravém sloupci místo CSS dekorativního prvku použij <img src="{{HERO_IMAGE}}" alt="${f.companyName}" style="width:100%;height:600px;object-fit:cover;border-radius:24px;box-shadow:0 20px 60px rgba(0,0,0,0.15)">` : "HERO FOTKA: NEnahrána → V hero sekci v pravém sloupci použij CSS dekorativní prvek dle DESIGN DNA oboru (gradient s geometrickými tvary)."}
GALERIE: Klient nahrál ${galleryCount} fotek z 6.
${galleryCount > 0 ? `→ Pro nahrané použij <img src="{{GALLERY_N}}" alt="Práce N" style="width:100%;height:100%;object-fit:cover"> kde N je 1 až ${galleryCount}` : ""}
${galleryCount === 0 ? "→ Pro celou galerii použij 6 šedých CSS placeholderů s textem 📷 Vaše práce" : ""}
${galleryCount > 0 && galleryCount < 6 ? `→ Zbývajících ${6 - galleryCount} dlaždic vyplň šedými CSS placeholdery s textem 📷 Vaše práce` : ""}

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
- Text: tmavá #1a1a1a, sekundární: #6b6b6b
- Footer: tmavé pozadí #0f0f0f s bílým textem

═══ KROK 3: STRUKTURA ═══

NAVIGACE (sticky)
- Na začátku průhledná, při scrollu solid white s subtle shadow
- ${hasLogo ? "Logo vlevo (img tag s {{LOGO}})" : "Logo vlevo = název firmy v hlavním fontu, weight 800"}
- Menu: Domů · O nás · Služby · Jak to probíhá · Galerie${reviews.length ? " · Recenze" : ""} · Kontakt
- Vpravo malé CTA "Poptávka" (#kontakt)
- Mobile: hamburger animovaný do plnoobrazovkového menu

HERO (id="home", min-height: 92vh)
- Layout 2 sloupce na desktopu (60% text vlevo, 40% vizuál vpravo)
- Levý sloupec:
  • Kicker text nahoře (uppercase, ${f.palette.primary}, 13px, letter-spacing 0.1em) — vymysli pro obor
  • H1 = SILNÝ HEADLINE (NE jen název firmy!) — benefit věta specifická pro obor "${f.industry}"
  • Podtitulek 18-20px, 2 řádky max
  • 2 buttony: primární "Nezávazná poptávka" (#kontakt), sekundární outline "Naše služby" (#sluzby)
  • Pod buttony 3 trust elementy s ikonkou ✓ (zkušenosti, počet realizací, garance...)
- Pravý sloupec:
  ${hasHero ? "• Použij <img src='{{HERO_IMAGE}}' alt='${f.companyName}' style='width:100%;height:600px;object-fit:cover;border-radius:24px;box-shadow:0 20px 60px rgba(0,0,0,0.15)'>" : "• CSS pattern dle DESIGN DNA oboru: gradient + geometrické tvary, border-radius 24px, výška 500-600px"}

PROČ MY (id="o-nas")
- Bílé pozadí, padding 100px 0
- H2 "Proč si vybrat ${f.companyName.split(" ")[0]}" + krátký podnadpis
- 3 sloupce s benefity v kartách:
  • Velká emoji ikona z DESIGN DNA v kruhu (60x60px, ${f.palette.primary} s 15% průhlednosti)
  • Nadpis benefitu (22px, weight 700)
  • 2-3 věty popisu
- Vymysli 3 SPECIFICKÉ benefity pro "${f.industry}" — ne obecné "kvalita, rychlost, cena"

SLUŽBY (id="sluzby")
- Pozadí ${f.palette.bg}, padding 100px 0
- H2 "Co pro vás děláme" + podnadpis
- Grid karet (3 sloupce desktop, 2 tablet, 1 mobil)
- Karta: bílé pozadí, padding 32px, border-radius 16px
  • Velká emoji ikona z DESIGN DNA vlevo nahoře
  • Nadpis služby (20px weight 700)
  • 2-3 věty konkrétního popisu
  • Šipka → vpravo dole
- Hover: translateY(-6px), prohloubený stín
- Služby: ${services.join(", ")}

JAK TO PROBÍHÁ (id="proces")
- Bílé pozadí, padding 100px 0
- H2 "Jak u nás probíhá spolupráce" + podnadpis
- 4 horizontální kroky (mobil vertikálně), spojené tenkou linkou
- Krok: velké číslo v kruhu (1,2,3,4) v ${f.palette.primary}, nadpis kroku, krátký popis
- Vymysli 4 logické kroky specifické pro obor

GALERIE (id="galerie")
- Pozadí ${f.palette.bg}, padding 100px 0
- H2 "Naše práce" + podnadpis
- Mřížka 3x2 (6 dlaždic), aspect-ratio 4:3, gap 16px, border-radius 12px overflow:hidden
${galleryCount > 0 ? `- Prvních ${galleryCount} dlaždic použij <img src="{{GALLERY_N}}" alt="Práce N" style="width:100%;height:100%;object-fit:cover">` : ""}
${galleryCount < 6 ? `- ${galleryCount === 0 ? "Všech 6" : `Zbývajících ${6 - galleryCount}`} dlaždic: linear-gradient ze 2 šedých odstínů + emoji 📷 + text "Vaše práce"` : ""}
- Hover: scale(1.03) + překryvný overlay v ${f.palette.primary} s 20% průhlednosti

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
  • Kicker "Pojďme to probrat" (uppercase, opacity 0.7)
  • H2 "Kontaktujte nás" v bílé
  • Podtitulek 2 řádky
  • 4 řádky info s ikonami:
    📞 ${f.phone}
    ✉️ ${f.email}
    📍 ${f.address}, ${f.city}
    🕐 Po-Pá: 8:00-17:00
  • Pod info přidej Google Maps iframe:
    <iframe src="${mapsUrl}" width="100%" height="280" style="border:0;border-radius:16px;margin-top:24px;filter:grayscale(0.2)" allowfullscreen loading="lazy"></iframe>
- Pravý sloupec — formulář v BÍLÉ kartě:
  • padding 40px, border-radius 20px
  • Pole: Vaše jméno, Email, Telefon (volitelné), Předmět, Vaše zpráva (textarea 4 řádky)
  • Inputs: padding 14px, border 1px solid #e5e5e5, border-radius 10px, font-size 16px
  • Pod polem zpráva GDPR checkbox: <label style="display:flex;align-items:flex-start;gap:10px;font-size:13px;color:#666;margin-top:8px"><input type="checkbox" name="gdpr" required style="margin-top:3px"><span>Souhlasím se <a href="#gdpr" style="color:${f.palette.primary}">zpracováním osobních údajů</a>.</span></label>
  • Submit button v ${f.palette.primary}, full-width, padding 16px, font-size 17px, weight 700
  • Form: <form action="mailto:${f.email}" method="post" enctype="text/plain">

GDPR (id="gdpr")
- Bílé pozadí, padding 80px 0
- Max-width 800px, centered
- H2 "Zásady ochrany osobních údajů" (28px)
- Text 16px line-height 1.7: ${gdpr}

FOOTER
- Tmavé pozadí #0f0f0f, text bílý, padding 60px 0 30px
- 3 sloupce: 
  • Sloupec 1: ${hasLogo ? "<img src='{{LOGO}}' style='height:48px;filter:brightness(0) invert(1)'>" : "logo (název firmy weight 800)"}, pod ním krátký claim, ${hasSocial ? `pod tím řada sociálních ikon:\n${socials.map(s => `      <a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.name}" style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.08);color:#fff;margin-right:10px;text-decoration:none;transition:all 0.3s">${s.svg}</a>`).join("\n")}\n      Hover efekt: background mění na ${f.palette.primary}` : "bez sociálních sítí"}
  • Sloupec 2: "Kontakt" + 4 řádky
  • Sloupec 3: "Navigace" + odkazy na sekce
- Spodní řádek: border-top, padding-top 30px, flex space-between
  • Vlevo: © ${new Date().getFullYear()} ${f.companyName} | IČO: ${f.ico}
  • Vpravo: <a href="#gdpr">Ochrana osobních údajů</a>

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

      const res = await fetch("https://webodaii.tomyscz1.workers.dev", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
model: "claude-haiku-4-5-20251001",
max_tokens: 14000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { alert("Chyba: " + text.slice(0, 200)); setLoading(false); return; }
      if (!data.content) { alert("API chyba: " + JSON.stringify(data).slice(0, 300)); setLoading(false); return; }
      let raw = data.content.map(b => b.text || "").join("");
      raw = raw.replace(/^```html?\s*/i, "").replace(/\s*```\s*$/i, "").trim();

      // Nahradit placeholdery skutečnými obrázky (base64)
      if (f.heroImage) raw = raw.replace(/\{\{HERO_IMAGE\}\}/g, f.heroImage);
      if (f.logo) raw = raw.replace(/\{\{LOGO\}\}/g, f.logo);
      galleryUploaded.forEach((img, i) => {
        raw = raw.replace(new RegExp(`\\{\\{GALLERY_${i+1}\\}\\}`, "g"), img);
      });

      setHtml(raw);
      setGenCount(c => c + 1);
      setPreview(true);
    } catch (e) {
      alert("Chyba: " + e.message);
    }
    setLoading(false);
  };

  if (loading)         return <LoadingScreen name={f.companyName} />;
  if (preview && html) return <PreviewScreen html={html} name={f.companyName} genCount={genCount} onRegen={generate} onBack={() => setPreview(false)} />;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "-apple-system,'Segoe UI',sans-serif", paddingBottom: 60 }}>
      <div style={{ padding: "22px 24px 18px", textAlign: "center", borderBottom: `1px solid ${C.border}`, marginBottom: 24 }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-1px", marginBottom: 4 }}>webodai<span style={{ color: C.accent }}>.</span></div>
        <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>Profesionální web za pár minut · Jednorázová platba 2 000 Kč</p>
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0, marginBottom: 22, padding: "0 12px", flexWrap: "wrap" }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <div onClick={() => i < step && setStep(i)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", borderRadius: 20, background: i === step ? C.accent + "20" : "transparent", cursor: i < step ? "pointer" : "default" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, background: i < step ? C.accent : i === step ? C.accent : C.border, color: "white" }}>
                {i < step ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 12, fontWeight: i === step ? 600 : 400, color: i === step ? C.text : C.muted, whiteSpace: "nowrap" }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ width: 8, height: 1, background: i < step ? C.accent : C.border, flexShrink: 0 }} />}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px 20px" }}>
          {step === 0 && <StepFirma   f={f} upd={upd} />}
          {step === 1 && <StepSluzby  f={f} upd={upd} />}
          {step === 2 && <StepFotky   f={f} upd={upd} />}
          {step === 3 && <StepKontakt f={f} upd={upd} />}
          {step === 4 && <StepRecenze f={f} upd={upd} />}
          {step === 5 && <StepBarvy   f={f} upd={upd} />}
          {step === 6 && <StepShrnutí f={f} onPay={handlePay} />}
          {step < 6 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26, gap: 12 }}>
              {step > 0 ? <button style={btnB} onClick={() => setStep(s => s - 1)}>← Zpět</button> : <div />}
              <button style={btnA} onClick={() => setStep(s => s + 1)}>{step === 5 ? "Zkontrolovat shrnutí →" : "Pokračovat →"}</button>
            </div>
          )}
        </div>
        <div style={{ textAlign: "center", marginTop: 14, color: C.muted, fontSize: 12 }}>🔒 Vaše údaje slouží pouze ke generování webu · Žádná registrace</div>
      </div>
    </div>
  );
}
