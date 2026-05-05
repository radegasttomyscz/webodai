export async function handler(event) {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: cors, body: "" };
  try {
    const { formData: f } = JSON.parse(event.body);
    const services = f.services.filter(s => s.trim()).join(", ");
    const gdpr = `Správce: ${f.companyName}, IČO: ${f.ico}, ${f.address} ${f.city}. Email: ${f.email}. Údaje zpracovávány za účelem odpovědi na poptávku dle čl. 6/1/f GDPR.`;

    const prompt = `Vytvoř kompletní ONE-PAGE HTML web. Vrať POUZE HTML začínající <!DOCTYPE html>, bez markdown.

Firma: ${f.companyName} | IČO: ${f.ico} | Obor: ${f.industry} | Popis: ${f.description}
Služby: ${services}
Kontakt: ${f.phone} | ${f.email} | ${f.address} ${f.city}
Primární barva: ${f.palette.primary} | Akcent: ${f.palette.accent} | Styl: ${f.style}

Použij Google Font. CSS proměnné v :root. Mobile-first. Vše v jednom souboru.

SEKCE (všechny povinné):
1. nav - sticky, logo vlevo = název firmy, odkazy: #o-nas #sluzby #galerie #kontakt
2. #home - hero, min-height:100vh, gradient pozadí, H1=název firmy, slogan, 2 tlačítka
3. #o-nas - popis firmy, 3 výhody s emoji
4. #sluzby - grid karet se službami: ${services}
5. #galerie - 6 šedých placeholderů s textem "Přidejte foto"
6. #kontakt - formulář (action="mailto:${f.email}" method="post" enctype="text/plain") s poli Jméno/Email/Zpráva + checkbox GDPR + tlačítko, vedle kontaktní info
7. #gdpr - sekce "Zásady ochrany OÚ": ${gdpr}
8. footer - © ${new Date().getFullYear()} ${f.companyName} | IČO: ${f.ico}

VRAŤ POUZE HTML. Začni <!DOCTYPE html>.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message }),
    };
  }
}
