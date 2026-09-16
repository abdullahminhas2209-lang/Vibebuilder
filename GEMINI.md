# Project Design Rules (Anti-AI Aesthetic System)

Before building anything on any project (SaaS, e-commerce, restaurant, portfolio, or anything else), these rules strictly override all default styling habits.

## NEVER USE THESE PATTERNS (Common AI-Generated Tells)

1. No pill-shaped badges above headlines (rounded-full background with small text). No dot-separated phrases either ("X · Y" or "X • Y") even without the pill shape — write one plain sentence instead.
2. No purple/indigo/violet gradient as the primary color, whether on dark or light backgrounds. Pick a palette specific to what is being built (e.g., warm earthy tones for coffee, editorial ink & amber for publishing/builders, slate & emerald for finance).
3. No two competing buttons side by side in a hero (filled + outline). Use one primary action. If a second action is needed, make it a plain text link, not a second button.
4. No arrow glyphs ("→") appended to every button label by default.
5. No emphasizing a single word or phrase in a headline via a different color or italics. The whole headline must read as one consistent style unless there is a specific, justified reason not to.
6. No identical icon-in-a-rounded-square card grids for feature/step sections. If content is a genuine numbered sequence, a connected timeline or varied asymmetric layout is preferred. Otherwise vary card treatment or avoid the icon-box format entirely.
7. No generic default icon sets (stock Lucide/Heroicons in circles) as the only visual interest in a section — prefer real screenshots, concrete data, custom marks, or omit decoration rather than filler icons.
8. No identical section-header formula repeated down the page (same pill/badge + same centered heading + same subheading pattern in every section). Vary structure between sections — some centered, some left-aligned, some with no label at all.
9. No checkmark-in-circle bullet lists as the default for every feature or pricing list — plain dashes or varied list styles are fine.
10. No identical card component (same border-radius, same shadow, same padding) reused for every distinct type of content on the page.

## ALWAYS DO THIS INSTEAD

- Choose a color palette and 2-font pairing (one distinctive headline font, one clean body font) that fits the actual subject matter of what is being built, and state your choice before generating code.
- Write specific, concrete copy tied to the actual product — no "Unlock the power of...", "Seamlessly integrate...", "Next-gen...", "Supercharge..." or similar generic SaaS phrasing.
- Break hero symmetry — left-aligned or split layouts are preferred over centered-everything.
- Vary spacing and layout rhythm between sections rather than applying uniform padding/margins throughout.
- If a section needs a supporting visual, prefer something concrete to the product (an actual mockup, a real data example, a relevant photo placeholder) over an abstract gradient shape or generic illustration.

## VERIFICATION PROTOCOL
After generating any section, briefly check it against this list before showing it, and flag anything that was not possible to avoid.
