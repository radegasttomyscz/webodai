export async function handler(event) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }
  try {
    const { formData } = JSON.parse(event.body);
    const f = formData;
    const services = f.services.filter(s => s.trim()).join(", ");

    const prompt = `Vytvoř ONE-PAGE HTML web pro firmu. Vrať POUZE HTML začínající <!DOCTYPE html>.

Firma: ${f.companyName} | IČO: ${f.ico} | Obor: ${f.industry}
Popis: ${f.description}
Služby: ${services}
Tel: ${f.phone} | Email: ${f.email} | Adresa: ${f.address} ${f.city}
Barva: ${f.palette.primary} | Styl: ${f.style}

Sekce: 1)Hero s názvem a sloganem 2)O nás 3)Služby jako karty 4)Galerie 6 placeholderů 5)Kontakt s formulářem a GDPR checkboxem 6)Footer s IČO
Kontaktní formulář: <form action="mailto:${f.email}" method="post" enctype="text/plain">
GDPR text: Správce: ${f.companyName}, IČO: ${f.ico}. Údaje zpracovávány za účelem odpovědi na poptávku. Kontakt: ${f.email}
Vše v jednom souboru. Responzivní. Google Fonts. CSS proměnné.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 3500,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await response.json();
    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
