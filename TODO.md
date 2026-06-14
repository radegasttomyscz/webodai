# webodai.cz - To do list pro prodejní produkt

## Aktuální stav po testu 14. 6. 2026

- [x] Zpřísnit prompt, aby AI nevymýšlela hero slogany a claimy typu "Stavebnictví na míru".
- [x] Přidat pojistku po generování: pokud zákazník nezadá slogan, H1 se drží názvu firmy.
- [x] Přidat spolehlivý lightbox do finálního HTML mimo AI generování.
- [x] Zvýraznit obrazovku po dokončení generování a přidat jasné další kroky.
- [x] Předělat objednávkový header, světlý shell formuláře a první krok formuláře.
- [ ] Připravit 5-7 testovacích zadání podle oborů a porovnat kvalitu výstupů.
- [ ] Doplnit automatickou kontrolu, že vygenerovaný web neobsahuje nepovolené marketingové fráze mimo zadání.
- [ ] Rozhodnout, které obory chceme v první prodejní vlně podporovat a které raději zatím nedávat do reklamy.
- [ ] Připravit ruční kontrolní checklist před předáním prvním reálným klientům.

## 1. Nutné před prvním placeným prodejem

- [ ] Napojit SimpleShop platbu místo demo potvrzení.
- [ ] Po platbě vytvořit jedinečnou objednávku s ID.
- [ ] Serverově hlídat limit 3 generování na jednu objednávku.
- [ ] Uložit data objednávky mimo prohlížeč, aby se neztratila po refreshi.
- [ ] Poslat hotový HTML soubor zákazníkovi emailem.
- [ ] Poslat interní kopii objednávky na náš email.
- [ ] Připravit obchodní podmínky.
- [ ] Připravit zásady ochrany osobních údajů pro webodai.cz.
- [ ] Doplnit reálné odkazy na obchodní podmínky a ochranu osobních údajů do landing page.
- [ ] Přidat souhlas s obchodními podmínkami před platbou.
- [ ] Ověřit, že Cloudflare Worker nepustí generování z nepovolené domény.
- [ ] Ověřit, že Anthropic API klíč není nikde ve frontendu ani v GitHubu.
- [ ] Otestovat celý tok: landing page -> formulář -> platba -> generování -> náhled -> stažení -> email.

## 2. Stabilita generování

- [ ] Otestovat výstupy pro hlavní typy klientů: řemeslník, salon, posilovna, restaurace, účetní/poradce, zdravotní/fyzio, stavební firma.
- [ ] Upravit prompt podle slabých výstupů z testů.
- [ ] Přidat lepší kontrolu nekompletního HTML.
- [ ] Přidat kontrolu, jestli generovaný web obsahuje povinné kontakty.
- [ ] Přidat kontrolu, jestli generovaný web neobsahuje vymyšlená fakta.
- [ ] Zvážit automatickou druhou opravu promptem, pokud je HTML nekompletní nebo má slabý kontrast.
- [ ] Udržet výsledný HTML soubor rozumně malý, hlavně při nahraných fotkách.

## 3. Objednávkový formulář

- [ ] Projít všechny kroky formuláře a zjednodušit podobně jako první krok.
- [ ] Zlepšit kontrast ve všech krocích.
- [ ] Přidat lepší vysvětlení pro méně technické zákazníky.
- [ ] Umožnit přeskočit volitelné kroky jedním jasným tlačítkem.
- [ ] Upravit krok Fotky, aby zákazník přesně věděl, co nahrát.
- [ ] Upravit krok Kontakt, aby bylo jasné, co se objeví na webu.
- [ ] Upravit krok Shrnutí, aby vypadal jako skutečná objednávka před platbou.
- [ ] Přidat ukládání průběhu formuláře, aby zákazník nepřišel o vyplněná data.

## 4. Právní a důvěryhodnost

- [ ] Ujasnit fakturaci: cena bez DPH / s DPH, plátce nebo neplátce DPH.
- [ ] Připravit text, kdo za webodai.cz stojí.
- [ ] Připravit stránku nebo sekci s kontaktem na podporu.
- [ ] Připravit jasné podmínky vrácení peněz.
- [ ] Ujasnit odpovědnost za obsah, fotky a GDPR na webu zákazníka.
- [ ] Přidat ukázky vygenerovaných webů.
- [ ] Přidat reálné FAQ podle testovacích dotazů.

## 5. Nasazení a provoz

- [ ] Nastavit finální Cloudflare Worker.
- [ ] Nastavit `ANTHROPIC_API_KEY` jako secret ve Cloudflare.
- [ ] Nastavit `ALLOWED_ORIGINS` jen na produkční domény a lokální test.
- [ ] Ověřit GitHub Pages deploy na `webodai.cz`.
- [ ] Ověřit HTTPS a přesměrování z `www`.
- [ ] Přidat jednoduché logování chyb generování.
- [ ] Přidat upozornění na chyby objednávek/generování.
- [ ] Přidat zálohu vygenerovaných HTML souborů.
- [ ] Přidat základní analytiku návštěvnosti a konverzí.

## 6. Testování před spuštěním

- [ ] Test na desktopu, tabletu a mobilu.
- [ ] Test ve Chrome, Edge, Safari/Firefox podle možností.
- [ ] Test s pomalým internetem.
- [ ] Test s dlouhými názvy firem a služeb.
- [ ] Test s diakritikou.
- [ ] Test s fotkami různých velikostí.
- [ ] Test bez fotek.
- [ ] Test opakovaného generování 3x.
- [ ] Test chybné platby.
- [ ] Test přerušení generování.
- [ ] Test staženého HTML na běžném hostingu.

## 7. Po spuštění

- [ ] Sbírat první zpětnou vazbu od zákazníků.
- [ ] Ukládat slabé výstupy a postupně ladit prompt.
- [ ] Přidat ruční zásah do objednávky pro případy, kdy AI výstup není dobrý.
- [ ] Přidat možnost doobjednat nahrání na hosting za 500 Kč.
- [ ] Připravit videonávod pro nahrání HTML na hosting.
- [ ] Připravit jednoduchý emailový onboarding po objednávce.
- [ ] Vyhodnotit, které obory fungují nejlépe a které raději nedávat do reklamy.

## Doporučené pořadí práce

1. Opravit a dotestovat formulář.
2. Otestovat generované weby na 5-7 oborech.
3. Napojit SimpleShop.
4. Vyřešit serverové objednávky, limit generování a email.
5. Doplnit právní dokumenty.
6. Udělat ostrý test nákupu za reálnou malou částku.
7. Spustit první malý prodejní test.
