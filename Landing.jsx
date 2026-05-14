import { useState } from "react";

const C = {
  bg: "#080810", card: "#0f0f1a", card2: "#13131f",
  border: "#1e1e30", accent: "#f97316", text: "#e2e8f0",
  muted: "#64748b", input: "#0a0a16", success: "#16a34a",
};
const wrap = { maxWidth: 1100, margin: "0 auto" };

export default function Landing({ onStart }) {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "-apple-system,'Segoe UI',sans-serif" }}>
      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(8,8,16,0.85)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>
            webodai<span style={{ color: C.accent }}>.</span>
          </div>
          <button onClick={onStart} style={{ background: C.accent, border: "none", color: "white", padding: "10px 20px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "inherit" }}>
            Vytvořit web →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: "100px 24px 80px", textAlign: "center" }}>
        <div style={wrap}>
          <div style={{ display: "inline-block", padding: "6px 14px", background: C.accent + "20", color: C.accent, borderRadius: 100, fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", marginBottom: 24 }}>
            🚀 PRO ČESKÉ MALÉ FIRMY
          </div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", margin: "0 0 24px", maxWidth: 900, marginInline: "auto" }}>
            Profesionální web za <span style={{ background: `linear-gradient(135deg, ${C.accent}, #ec4899)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>2 000 Kč</span>.<br />
            Vygeneruje ho AI za 5 minut.
          </h1>
          <p style={{ fontSize: 19, color: C.muted, lineHeight: 1.6, maxWidth: 680, margin: "0 auto 36px" }}>
            Pro řemeslníky, kadeřnice, advokáty a malé firmy. Bez programátora.<br />Bez měsíčních poplatků. Stáhnete HTML, nahrajete na hosting.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
            <button onClick={onStart} style={{ background: C.accent, border: "none", color: "white", padding: "16px 32px", borderRadius: 12, cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: "inherit" }}>
              Vytvořit svůj web →
            </button>
            <a href="#jak-to-funguje" style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.text, padding: "16px 32px", borderRadius: 12, fontSize: 16, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
              Jak to funguje
            </a>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", color: C.muted, fontSize: 13 }}>
            <span>✓ Bez registrace</span>
            <span>✓ Jednorázová platba</span>
            <span>✓ HTML soubor je váš</span>
          </div>
        </div>
      </section>

      {/* PROČ */}
      <section style={{ padding: "80px 24px", background: C.card }}>
        <div style={wrap}>
          <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: "center", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Proč si vybrat webodai</h2>
          <p style={{ textAlign: "center", color: C.muted, fontSize: 17, margin: "0 0 56px" }}>Klasický web od agentury vás stojí majetek. My to přepsali.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              { icon: "💸", title: "Levně", text: "2 000 Kč místo 30–80 tisíc u agentury. Bez měsíčních poplatků navždy." },
              { icon: "⚡", title: "Rychle", text: "Vyplníte formulář za 5 minut a máte web. Žádné týdny komunikace s designérem ani ladění detailů — AI vygeneruje moderní web, za který se nemusíte stydět." },
              { icon: "🎯", title: "Jednoduše", text: "Stáhnete HTML soubor, nahrajete na hosting. Bez složitých systémů." },
            ].map((b, i) => (
              <div key={i} style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{b.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>{b.title}</h3>
                <p style={{ color: C.muted, lineHeight: 1.6, margin: 0, fontSize: 15 }}>{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JAK TO FUNGUJE */}
      <section id="jak-to-funguje" style={{ padding: "80px 24px" }}>
        <div style={wrap}>
          <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: "center", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Jak to funguje</h2>
          <p style={{ textAlign: "center", color: C.muted, fontSize: 17, margin: "0 0 56px" }}>Tři jednoduché kroky.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {[
              { n: 1, title: "Vyplníte formulář", text: "Co děláte, kontakt, fotky, barva. Trvá 5 minut.", icon: "📝" },
              { n: 2, title: "Zaplatíte 2 000 Kč", text: "Zabezpečená platba přes SimpleShop. Kartou nebo převodem.", icon: "💳" },
              { n: 3, title: "Stáhnete HTML", text: "AI vygeneruje kompletní web. Stáhnete soubor a nahrajete na hosting.", icon: "🚀" },
            ].map(s => (
              <div key={s.n} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "32px 28px 28px", position: "relative" }}>
                <div style={{ position: "absolute", top: -16, left: 24, width: 36, height: 36, borderRadius: "50%", background: C.accent, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>{s.n}</div>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{s.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>{s.title}</h3>
                <p style={{ color: C.muted, lineHeight: 1.6, margin: 0, fontSize: 15 }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CO DOSTANETE */}
      <section style={{ padding: "80px 24px", background: C.card }}>
        <div style={wrap}>
          <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: "center", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Co je v ceně</h2>
          <p style={{ textAlign: "center", color: C.muted, fontSize: 17, margin: "0 0 56px" }}>Kompletní web. Žádné dodatečné poplatky.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            {[
              ["🎨", "Design dle oboru", "AI rozpozná čím se zabýváte a přizpůsobí styl."],
              ["📱", "Mobilní + desktop", "Web vypadá perfektně na telefonu i počítači."],
              ["🖼", "Galerie 6 fotek", "Vlastní fotky vaší práce s lightboxem."],
              ["🗺", "Mapa s adresou", "Google mapa automaticky podle adresy."],
              ["📨", "Kontaktní formulář", "Zákazníci vás snadno osloví, anti-spam."],
              ["🔒", "GDPR připraveno", "Šablona zásad ochrany osobních údajů."],
              ["📲", "Sociální sítě", "Facebook, Instagram, LinkedIn ve footeru."],
              ["🔄", "3× regenerace", "Nelíbí se? Vygenerujeme znovu zdarma."],
            ].map(([icon, title, text], i) => (
              <div key={i} style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 6px" }}>{title}</h3>
                <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.5, margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KOMU SE HODÍ */}
      <section style={{ padding: "80px 24px" }}>
        <div style={wrap}>
          <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: "center", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Komu se hodí</h2>
          <p style={{ textAlign: "center", color: C.muted, fontSize: 17, margin: "0 0 56px" }}>Naše řešení nesedí každému — radši to řekneme rovnou.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            <div style={{ background: C.success + "12", border: `1px solid ${C.success}40`, borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>✅</div>
              <h3 style={{ color: C.success, fontWeight: 700, margin: "0 0 12px", fontSize: 18 }}>Hodí se pro:</h3>
              <ul style={{ color: C.text, lineHeight: 1.8, margin: 0, paddingLeft: 18, fontSize: 15 }}>
                <li>Řemeslníky a živnostníky</li>
                <li>Kadeřnice, kosmetičky, masérky</li>
                <li>Advokátní kanceláře, účetní</li>
                <li>Restaurace, kavárny</li>
                <li>Malé firmy s 1–10 službami</li>
              </ul>
            </div>
            <div style={{ background: "#7f1d1d12", border: "1px solid #7f1d1d40", borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>🚫</div>
              <h3 style={{ color: "#dc2626", fontWeight: 700, margin: "0 0 12px", fontSize: 18 }}>Nehodí se pro:</h3>
              <ul style={{ color: C.text, lineHeight: 1.8, margin: 0, paddingLeft: 18, fontSize: 15 }}>
                <li>E-shopy s mnoha produkty</li>
                <li>Velké firmy s rozsáhlou strukturou</li>
                <li>Aktivní blogy s pravidelnými články</li>
                <li>Weby s rezervačním systémem</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CENA */}
      <section style={{ padding: "80px 24px", background: C.card }}>
        <div style={{ ...wrap, maxWidth: 600 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: "center", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Cena</h2>
          <p style={{ textAlign: "center", color: C.muted, fontSize: 17, margin: "0 0 40px" }}>Jednorázová platba. Žádné předplatné.</p>
          <div style={{ background: C.card2, border: `2px solid ${C.accent}`, borderRadius: 20, padding: 36 }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1, marginBottom: 4 }}>2 000 Kč</div>
              <div style={{ color: C.muted, fontSize: 14 }}>jednorázově · bez DPH</div>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "Kompletní HTML web (one-page)",
                "Design přizpůsobený oboru",
                "Mobilní + desktop verze",
                "Galerie fotek, mapa, formulář",
                "GDPR šablona, sociální sítě",
                "3× regenerace zdarma",
                "HTML soubor je váš navždy",
              ].map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15 }}>
                  <span style={{ color: C.success, fontWeight: 700 }}>✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button onClick={onStart} style={{ width: "100%", background: C.accent, border: "none", color: "white", padding: "16px", borderRadius: 12, cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: "inherit" }}>
              Vytvořit svůj web →
            </button>
          </div>
          <div style={{ marginTop: 16, padding: 16, background: C.card2, borderRadius: 12, border: `1px solid ${C.border}`, fontSize: 14, color: C.muted, textAlign: "center" }}>
            🔧 <strong style={{ color: C.text }}>+ 500 Kč za nahrání na hosting</strong> — pokud nechcete řešit FTP, postaráme se za vás.
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ ...wrap, maxWidth: 800 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: "center", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Časté otázky</h2>
          <p style={{ textAlign: "center", color: C.muted, fontSize: 17, margin: "0 0 40px" }}>Odpovědi na vše co vás zajímá.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { q: "Co když nemám hosting?", a: "Doporučíme vám levný český hosting (např. Active24 za ~250 Kč/rok). Nebo si připlaťte 500 Kč a my web nahrajeme za vás." },
              { q: "Mohu si web později upravit?", a: "Ano. Web je obyčejný HTML soubor, který můžete editovat v jakémkoli textovém editoru, nebo si nechat upravit od kteréhokoli vývojáře." },
              { q: "Co když mi výsledek nesedne?", a: "Máte 3× regeneraci zdarma. Stačí změnit barvu, popis nebo doplnit fotky a vygenerujete znovu. Pokud ani potřetí nesedí, ozvěte se." },
              { q: "Je to GDPR compliant?", a: "Web obsahuje základní šablonu zásad ochrany osobních údajů. Pro plnou shodu doporučujeme konzultaci s právníkem — provozovatel webu nese odpovědnost." },
              { q: "Mohu mít více webů?", a: "Ano. Každá objednávka = jeden web. Pokud máte více firem nebo služeb, kupte si web pro každou." },
              { q: "Kdo je za projektem?", a: "Jsem Tomáš, freelance vývojář z Uherského Brodu. Postavil jsem webodai, abych zpřístupnil profesionální web menším firmám." },
            ].map((item, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", padding: "18px 20px", background: "none", border: "none", color: C.text, textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 16, fontWeight: 600, fontFamily: "inherit" }}>
                  <span>{item.q}</span>
                  <span style={{ color: C.accent, fontSize: 22, transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 20px 18px", color: C.muted, lineHeight: 1.6, fontSize: 15 }}>{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "60px 24px 80px" }}>
        <div style={{ ...wrap, maxWidth: 800 }}>
          <div style={{ background: `linear-gradient(135deg, ${C.accent}, #ec4899)`, borderRadius: 24, padding: "60px 40px", textAlign: "center" }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, margin: "0 0 14px", color: "white", letterSpacing: "-0.02em" }}>Připraven na vlastní web?</h2>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 18, margin: "0 0 28px" }}>5 minut formuláře. 2 000 Kč. Hotovo.</p>
            <button onClick={onStart} style={{ background: "white", border: "none", color: C.accent, padding: "16px 36px", borderRadius: 12, cursor: "pointer", fontSize: 16, fontWeight: 800, fontFamily: "inherit" }}>
              Vytvořit svůj web →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "32px 24px", textAlign: "center", color: C.muted, fontSize: 13 }}>
        <div style={{ marginBottom: 8 }}>© {new Date().getFullYear()} webodai. · Tomáš Plášek · IČO 14090759</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          <a href="mailto:tomyscz1@gmail.com" style={{ color: C.muted }}>tomyscz1@gmail.com</a>
          <span>·</span>
          <a href="#" style={{ color: C.muted, opacity: 0.6 }}>Obchodní podmínky (připravujeme)</a>
          <span>·</span>
          <a href="#" style={{ color: C.muted, opacity: 0.6 }}>Ochrana osobních údajů (připravujeme)</a>
        </div>
      </footer>
    </div>
  );
}
