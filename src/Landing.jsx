import { useState } from "react";

const C = {
  bg: "#080810", card: "#0f0f1a", card2: "#13131f",
  border: "#2a2a3e", accent: "#f97316", text: "#f1f5f9",
  muted: "#94a3b8", input: "#0a0a16", success: "#16a34a",
};
const wrap = { maxWidth: 1100, margin: "0 auto" };

const Logo = ({ size = 22 }) => (
  <span style={{ fontSize: size, fontWeight: 800, letterSpacing: "-0.5px", color: C.text }}>
    webodai<span style={{ color: C.accent }}>.cz</span>
  </span>
);

export default function Landing({ onStart }) {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "-apple-system,'Segoe UI',sans-serif" }}>
      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(8,8,16,0.85)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" }}>
          <Logo size={22} />
          <button onClick={onStart} style={{ background: C.accent, border: "none", color: "white", padding: "10px 20px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "inherit" }}>
            Vytvořit web →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: "100px 24px 80px", textAlign: "center" }}>
        <div style={wrap}>
          <div style={{ display: "inline-block", padding: "6px 14px", background: C.accent + "20", color: C.accent, borderRadius: 100, fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", marginBottom: 24 }}>
            🛠 PRO ŽIVNOSTNÍKY A MALÉ FIRMY
          </div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", margin: "0 0 24px", maxWidth: 900, marginInline: "auto" }}>
            Profesionální web za <span style={{ background: `linear-gradient(135deg, ${C.accent}, #ec4899)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>2 000 Kč</span>.<br />
            Bez programátora. Bez starostí.
          </h1>
          <p style={{ fontSize: 19, color: C.muted, lineHeight: 1.6, maxWidth: 720, margin: "0 auto 36px" }}>
            Vyplníte krátký formulář — jako když objednáváte něco online.<br />
            AI vám vytvoří hotový web, který si stáhnete a buď nahrajete sami podle <strong style={{ color: C.text }}>našeho videonávodu</strong>, nebo <strong style={{ color: C.text }}>to za 500 Kč uděláme za vás</strong>.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
            <button onClick={onStart} style={{ background: C.accent, border: "none", color: "white", padding: "16px 32px", borderRadius: 12, cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: "inherit" }}>
              Začít →
            </button>
            <a href="#jak-to-funguje" style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.text, padding: "16px 32px", borderRadius: 12, fontSize: 16, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
              Nejdřív se podívat
            </a>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", color: C.muted, fontSize: 13 }}>
            <span>✓ Zaplatíte jednou</span>
            <span>✓ Web vlastníte navždy</span>
            <span>✓ Pomoc když si nebudete vědět rady</span>
          </div>
        </div>
      </section>

      {/* PROČ */}
      <section style={{ padding: "80px 24px", background: C.card }}>
        <div style={wrap}>
          <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: "center", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Proč webodai.cz</h2>
          <p style={{ textAlign: "center", color: C.muted, fontSize: 17, margin: "0 0 56px" }}>Klasický web od agentury stojí majetek a trvá týdny. My to změnili.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              { icon: "💸", title: "Levně", text: "2 000 Kč jednorázově místo 30–60 tisíc u agentury. Žádné měsíční poplatky, žádné drobné platby navíc." },
              { icon: "⚡", title: "Rychle", text: "Vyplníte formulář za 5 minut a máte hotový web. Žádné týdny komunikace s designérem ani ladění detailů — AI udělá web, za který se nemusíte stydět." },
              { icon: "🤝", title: "S pomocí", text: "Cílíme na lidi, kteří netuší co je HTML. Vše vám pošleme s videonávodem. Když si nebudete vědět rady, za 500 Kč to celé vyřídíme za vás." },
            ].map((b, i) => (
              <div key={i} style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{b.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px", color: C.text }}>{b.title}</h3>
                <p style={{ color: C.muted, lineHeight: 1.6, margin: 0, fontSize: 15 }}>{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JAK TO FUNGUJE */}
      <section id="jak-to-funguje" style={{ padding: "80px 24px" }}>
        <div style={wrap}>
          <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: "center", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Jak to celé probíhá</h2>
          <p style={{ textAlign: "center", color: C.muted, fontSize: 17, margin: "0 0 56px" }}>Bez schůzek, bez vysvětlování, bez týdnů čekání.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {[
              { n: 1, title: "Vyplníte formulář", text: "Co děláte, kontakt, fotky, barva. Trvá 5 minut. Žádné technické věci.", icon: "📝" },
              { n: 2, title: "Zaplatíte 2 000 Kč", text: "Kartou nebo bankovním převodem přes zabezpečenou platební bránu.", icon: "💳" },
              { n: 3, title: "Vyzkoušíte 3 varianty", text: "Vygenerujeme 3 návrhy podle vašich údajů. Vyberete si ten nejlepší.", icon: "🎨" },
              { n: 4, title: "Stáhnete a spustíte", text: "Pošleme HTML soubor + videonávod. Nebo za 500 Kč to nahrajeme za vás.", icon: "🚀" },
            ].map(s => (
              <div key={s.n} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "32px 24px 24px", position: "relative" }}>
                <div style={{ position: "absolute", top: -16, left: 24, width: 36, height: 36, borderRadius: "50%", background: C.accent, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>{s.n}</div>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{s.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px", color: C.text }}>{s.title}</h3>
                <p style={{ color: C.muted, lineHeight: 1.6, margin: 0, fontSize: 14 }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CO DOSTANETE — explicit */}
      <section style={{ padding: "80px 24px", background: C.card }}>
        <div style={{ ...wrap, maxWidth: 900 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: "center", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Co konkrétně dostanete</h2>
          <p style={{ textAlign: "center", color: C.muted, fontSize: 17, margin: "0 0 40px" }}>Žádné překvapení. Tady je celý balíček.</p>
          <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 20, padding: 32 }}>
            {[
              { ic: "📄", t: "Hotový web v jednom souboru", d: "Profesionální one-page web (jedna dlouhá stránka). Dostanete ho jako HTML soubor — to je něco jako .docx, ale pro web. Nahraje se na hosting a stránka je živá." },
              { ic: "🎨", t: "3× generování zdarma", d: "Pokud se vám první návrh nelíbí, změníte barvu, popis nebo cokoli jiného a vygenerujeme znovu. Až 3 pokusy v ceně. Všechny si můžete stáhnout a vybrat si finální." },
              { ic: "🎥", t: "Videonávod, jak web spustit", d: "Krok za krokem ukážeme jak nahrát soubor na váš hosting (Wedos, Active24, Forpsi…). Zvládne to každý, kdo umí poslat fotku do mailu." },
              { ic: "🤝", t: "Volitelně: nahrajeme to za vás (500 Kč)", d: "Pokud do toho nechcete vrtat, postaráme se. Pošlete přihlašovací údaje k hostingu a do hodiny máte web spuštěný." },
              { ic: "🔓", t: "Web je váš navždy", d: "Žádné měsíční předplatné. Soubor patří vám. Můžete si ho dát komu chcete, nebo nechat upravit jakýmkoli vývojářem v budoucnu." },
              { ic: "✏️", t: "Drobné úpravy si zvládnete sami", d: "Změnit telefon, otevírací dobu nebo přidat větu? Otevřete soubor v poznámkovém bloku a přepíšete text. Pro větší změny doporučujeme pomoc někoho zkušenějšího — nebo nás (rádi pomůžeme za rozumnou cenu)." },
            ].map((it, i) => (
              <div key={i} style={{ display: "flex", gap: 16, padding: "14px 0", borderTop: i === 0 ? "none" : `1px solid ${C.border}` }}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>{it.ic}</div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 4 }}>{it.t}</div>
                  <div style={{ fontSize: 15, color: C.muted, lineHeight: 1.55 }}>{it.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CO JE V CENĚ - features */}
      <section style={{ padding: "80px 24px" }}>
        <div style={wrap}>
          <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: "center", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Co web obsahuje</h2>
          <p style={{ textAlign: "center", color: C.muted, fontSize: 17, margin: "0 0 56px" }}>Vše co dnes profesionální web musí mít.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            {[
              ["🎨", "Design dle vašeho oboru", "AI rozpozná, co děláte, a tomu přizpůsobí styl."],
              ["📱", "Skvělý na mobilu", "Web vypadá perfektně na telefonu i na počítači."],
              ["🖼", "Vaše fotografie", "Až 6 fotek vaší práce. Po kliknutí se zvětší."],
              ["🗺", "Mapa s adresou", "Návštěvníci snadno najdou kde vás najdou."],
              ["📨", "Kontaktní formulář", "Zákazníci vám napíší přímo z webu."],
              ["📲", "Sociální sítě", "Odkaz na Facebook, Instagram, LinkedIn."],
              ["⭐", "Recenze zákazníků", "Pochvaly se zobrazí ve vlastní sekci."],
              ["🔒", "Šablona GDPR", "Připraveno k použití (zodpovědnost je na vás)."],
            ].map(([icon, title, text], i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 6px", color: C.text }}>{title}</h3>
                <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.5, margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KOMU SE HODÍ */}
      <section style={{ padding: "80px 24px", background: C.card }}>
        <div style={wrap}>
          <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: "center", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Komu se hodí</h2>
          <p style={{ textAlign: "center", color: C.muted, fontSize: 17, margin: "0 0 56px" }}>Naše řešení nesedí každému — radši to řekneme rovnou.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            <div style={{ background: C.success + "12", border: `1px solid ${C.success}40`, borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>✅</div>
              <h3 style={{ color: C.success, fontWeight: 700, margin: "0 0 12px", fontSize: 18 }}>Hodí se pokud jste:</h3>
              <ul style={{ color: C.text, lineHeight: 1.8, margin: 0, paddingLeft: 18, fontSize: 15 }}>
                <li>Řemeslník (truhlář, instalatér, malíř, zedník…)</li>
                <li>Kadeřnice, kosmetička, masérka</li>
                <li>Účetní, advokát, daňový poradce</li>
                <li>Majitel restaurace, kavárny, pekařství</li>
                <li>Cvičitel, fyzioterapeut, kouč</li>
                <li>Malá firma s 1–10 službami</li>
              </ul>
              <p style={{ color: C.muted, fontSize: 13, marginTop: 16, marginBottom: 0, fontStyle: "italic" }}>Zkrátka pokud potřebujete <strong style={{ color: C.text }}>jednoduchou web vizitku</strong>, která ukáže co děláte, jak vás kontaktovat a vzbudí důvěru.</p>
            </div>
            <div style={{ background: "#7f1d1d12", border: "1px solid #7f1d1d40", borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>🚫</div>
              <h3 style={{ color: "#dc2626", fontWeight: 700, margin: "0 0 12px", fontSize: 18 }}>Nehodí se pokud:</h3>
              <ul style={{ color: C.text, lineHeight: 1.8, margin: 0, paddingLeft: 18, fontSize: 15 }}>
                <li>Plánujete prodávat zboží online (e-shop)</li>
                <li>Potřebujete rezervační systém</li>
                <li>Chcete pravidelně přidávat články (blog)</li>
                <li>Máte rozsáhlou firmu s desítkami stránek</li>
                <li>Hledáte plnohodnotné CMS jako WordPress</li>
              </ul>
              <p style={{ color: C.muted, fontSize: 13, marginTop: 16, marginBottom: 0, fontStyle: "italic" }}>V těchto případech vám rádi doporučíme jiné řešení — napište nám.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CENA */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ ...wrap, maxWidth: 600 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: "center", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Cena</h2>
          <p style={{ textAlign: "center", color: C.muted, fontSize: 17, margin: "0 0 40px" }}>Jedna platba. Žádné překvapení.</p>
          <div style={{ background: C.card2, border: `2px solid ${C.accent}`, borderRadius: 20, padding: 36 }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1, marginBottom: 4, color: C.text }}>2 000 Kč</div>
              <div style={{ color: C.muted, fontSize: 14 }}>jednorázově</div>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "Hotový web v jednom HTML souboru",
                "Až 3 různé verze ke stažení",
                "Videonávod jak ho spustit na hostingu",
                "Design přizpůsobený vašemu oboru",
                "Funguje na počítači i mobilu",
                "Galerie, mapa, formulář, sociální sítě",
                "Šablona GDPR",
                "Soubor patří vám navždy",
              ].map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15, color: C.text }}>
                  <span style={{ color: C.success, fontWeight: 700 }}>✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button onClick={onStart} style={{ width: "100%", background: C.accent, border: "none", color: "white", padding: "16px", borderRadius: 12, cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: "inherit" }}>
              Začít →
            </button>
          </div>
          <div style={{ marginTop: 16, padding: 16, background: C.card2, borderRadius: 12, border: `1px solid ${C.border}`, fontSize: 14, color: C.muted, textAlign: "center" }}>
            🔧 <strong style={{ color: C.text }}>+ 500 Kč za nahrání na hosting</strong> — pokud se do toho nechcete pouštět sami, postaráme se.
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "80px 24px", background: C.card }}>
        <div style={{ ...wrap, maxWidth: 800 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: "center", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Časté otázky</h2>
          <p style={{ textAlign: "center", color: C.muted, fontSize: 17, margin: "0 0 40px" }}>To co se nás opravdu lidé ptají.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              {
                q: "Co je to HTML soubor a jak ho použiju?",
                a: "HTML soubor je váš web zabalený do jednoho dokumentu (něco jako Word dokument, ale pro internet). Stáhnete si ho do počítače a pak ho nahrajete na hosting (= prostor, kde žije váš web). Krok za krokem to ukazujeme v našem videonávodu — zvládne to každý, kdo si někdy posílal přílohy mailem. Pokud do toho nechcete jít sami, za 500 Kč to uděláme za vás."
              },
              {
                q: "Co když nemám hosting? Kde si ho pořídit?",
                a: "Hosting můžete koupit u kteréhokoli českého poskytovatele (Wedos, Active24, Forpsi). Cena ~150–300 Kč ročně. Doménu .cz koupíte za zhruba 250 Kč/rok. Při objednávce vám rádi doporučíme nejlepší volbu — nebo to celé vyřídíme za vás."
              },
              {
                q: "Co když si web nelíbí?",
                a: "Generování zdarma opakujeme až 3×. Mezi pokusy můžete měnit barvy, fotky, texty, cokoli. Všechny tři verze si stáhnete a vyberete si tu nejlepší. Pokud ani potřetí nesedne, napište — vrátíme peníze nebo upravíme ručně."
              },
              {
                q: "Mohu si později něco změnit (nový telefon, otevírací doba)?",
                a: "Drobné úpravy (text, telefon, pár vět) si zvládnete sami v poznámkovém bloku. Ukážeme jak na to. Pro větší změny (nové sekce, jiné fotky, nový design) doporučujeme oslovit někoho zkušenějšího v HTML — nebo nás, rádi pomůžeme za rozumný poplatek."
              },
              {
                q: "Kdo zodpovídá za obsah webu (texty, fotky, GDPR)?",
                a: "Vy. Web je váš — všechno, co se na něm objeví, jste si zadali a máte k tomu právo. To se týká i šablony GDPR: vygenerujeme základní text, ale za soulad se zákonem zodpovídá provozovatel webu (vy). Pokud máte specifické požadavky, doporučujeme konzultaci s právníkem."
              },
              {
                q: "Proč jen 2 000 Kč? Není to podezřele levné?",
                a: "Klasická agentura platí designéry, programátory, projektové manažery a kanceláře. My máme jednoho člověka a AI. Žádné týdny vývoje, žádné měsíční fixní náklady. Cena reflektuje skutečné náklady, ne 'kolik si můžeme dovolit účtovat'."
              },
              {
                q: "Co když je web pomalý nebo nefunguje?",
                a: "Není čeho se bát — vygenerovaný web je jediný HTML soubor velký pár set kilobajtů, takže se načte okamžitě i na pomalém připojení. Pokud byste se setkali s problémem, napište a vyřešíme."
              },
              {
                q: "Kdo je za projektem?",
                a: "Tomáš, freelance vývojář z Bánova u Uherského Brodu. Webodai.cz jsem postavil, abych zpřístupnil profesionální web menším firmám za rozumné peníze. Když napíšete, odpovídá konkrétní člověk — žádný call centr."
              },
            ].map((item, i) => (
              <div key={i} style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", padding: "18px 20px", background: "none", border: "none", color: C.text, textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 16, fontWeight: 600, fontFamily: "inherit" }}>
                  <span>{item.q}</span>
                  <span style={{ color: C.accent, fontSize: 22, transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform 0.2s", display: "inline-block", flexShrink: 0, marginLeft: 12 }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 20px 18px", color: C.muted, lineHeight: 1.65, fontSize: 15 }}>{item.a}</div>
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
            <h2 style={{ fontSize: 36, fontWeight: 800, margin: "0 0 14px", color: "white", letterSpacing: "-0.02em" }}>Připraveni začít?</h2>
            <p style={{ color: "rgba(255,255,255,0.92)", fontSize: 18, margin: "0 0 28px" }}>5 minut formuláře. 2 000 Kč jednou. Hotovo.</p>
            <button onClick={onStart} style={{ background: "white", border: "none", color: C.accent, padding: "16px 36px", borderRadius: 12, cursor: "pointer", fontSize: 16, fontWeight: 800, fontFamily: "inherit" }}>
              Vytvořit svůj web →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "32px 24px", textAlign: "center", color: C.muted, fontSize: 13 }}>
        <div style={{ marginBottom: 10 }}>
          <Logo size={16} />
        </div>
        <div style={{ marginBottom: 8 }}>© {new Date().getFullYear()} webodai.cz · Tomáš Čaňa · IČO 14090759</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          <a href="mailto:info@tomys.cz" style={{ color: C.muted }}>info@tomys.cz</a>
          <span>·</span>
          <a href="tel:+420735025755" style={{ color: C.muted }}>+420 735 025 755</a>
          <span>·</span>
          <a href="#" style={{ color: C.muted, opacity: 0.6 }}>Obchodní podmínky (připravujeme)</a>
          <span>·</span>
          <a href="#" style={{ color: C.muted, opacity: 0.6 }}>Ochrana osobních údajů (připravujeme)</a>
        </div>
      </footer>
    </div>
  );
}
