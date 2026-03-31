"""Final premium polish pass."""
import re

with open('public/css/styles.css', 'r') as f:
    css = f.read()

# 1. Replace section h2 gradient text (gradient text on light backgrounds looks cheap)
#    Change to solid text-primary; keep gradient only in dark sections
css = css.replace(
    '    background: var(--gradient-primary);\n    -webkit-background-clip: text;\n    -webkit-text-fill-color: transparent;\n    background-clip: text;\n}',
    '    color: var(--text-primary);\n}'
)
# Also catch pattern without background-clip fallback
css = css.replace(
    '    background: var(--gradient-glow);\n    -webkit-background-clip: text;\n    -webkit-text-fill-color: transparent;\n    background-clip: text;\n}',
    '    color: var(--text-primary);\n}'
)

# 2. Fix letter spacing on h2 headings (remove aggressive negative spacing — DM Serif works better)
css = re.sub(r'(font-family: var\(--font-heading\);[^}]*?)letter-spacing: -0\.03em;', 
             r'\g<1>letter-spacing: -0.01em;', css)
css = re.sub(r'(font-family: var\(--font-heading\);[^}]*?)letter-spacing: -0\.04em;', 
             r'\g<1>letter-spacing: -0.02em;', css)

# 3. Section label — make it the brand teal color consistently
css = re.sub(r'\.section-label\s*\{([^}]*?)color:[^;]+;',
             lambda m: '.section-label {' + re.sub(r'color:[^;]+;', 'color: var(--brand-teal);', m.group(1)),
             css)

# 4. Process/step-card hover — brand teal accent
css = css.replace(
    'border: 1px solid rgba(255, 255, 255, 0.05);',
    'border: 1px solid rgba(80, 140, 160, 0.1);'
)

# 5. FAQ section - light version, no dark
css = css.replace(
    '.faq-section {\n    padding: var(--space-4xl) 0;\n    background: var(--bg-off);',
    '.faq-section {\n    padding: var(--space-4xl) 0;\n    background: var(--bg-primary);'
)

# 6. Pricing section - use off-white to contrast with sections
css = css.replace(
    '.pricing-section {',
    '.pricing-section {\n    background: var(--bg-off);'
)

# 7. Quote form section intro — adjust so intro is warm
# 8. Service icon background - use brand teal pale
css = css.replace(
    'background: linear-gradient(135deg, rgba(80, 140, 160, 0.1) 0%, rgba(122, 176, 195, 0.1) 100%)',
    'background: var(--brand-teal-pale)'
)

# 9. Step card styling
css = css.replace(
    'rgba(122, 172, 202, 0.1)',
    'var(--brand-teal-pale)'
)

# 10. Quote form fields — make them clean
css = css.replace(
    'border-color: #0f0f23;',
    'border-color: var(--brand-teal);'
)
css = css.replace(
    'box-shadow: 0 0 0 3px rgba(15, 15, 35, 0.1);',
    'box-shadow: 0 0 0 3px rgba(80, 140, 160, 0.15);'
)

# 11. The assessment dark section - make it properly dark
css = css.replace(
    'background: var(--bg-primary); /* Dark background */',
    'background: var(--bg-dark); /* Dark background */'
)

# 12. Assessment container glass
css = css.replace(
    'background: rgba(255, 255, 255, 0.5);',
    'background: rgba(255, 255, 255, 0.06);'
)

# 13. suggestion-btn ─ on dark sidebar chat (the #0f0f23 chat)
css = css.replace(
    'background: #0D1B24;\n    color: var(--text-light);\n    border-color: #0D1B24;',
    'background: var(--brand-teal);\n    color: var(--text-light);\n    border-color: var(--brand-teal);'
)

# 14. chat form send button (C4EF17 was the yellow - already replaced)
# Make sure it uses teal
css = css.replace('#C4EF17', 'var(--brand-teal)')

# 15. Trust stats — use a teal accent
css = css.replace(
    '.trust-value {\n    font-size: 2rem;\n    font-weight: 900;\n    color: var(--brand-teal);\n    background: none;\n    -webkit-text-fill-color: var(--brand-teal);',
    '.trust-value {\n    font-size: 2.2rem;\n    font-weight: 600;\n    color: var(--brand-teal);\n    background: none;\n    -webkit-text-fill-color: var(--brand-teal);'
)

# 16. Page-hero (compact hero for inner pages) — use white with teal border accent
css = css.replace(
    '.page-hero {\n    position: relative;\n    min-height: 250px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    overflow: hidden;\n    margin-top: 100px;\n    background: var(--bg-dark);',
    '.page-hero {\n    position: relative;\n    min-height: 250px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    overflow: hidden;\n    margin-top: 100px;\n    background: var(--bg-off);'
)

# 17. Testimonial card styling
css = css.replace(
    '.testimonial-card {\n    background: var(--bg-card);\n    border-radius: var(--radius-xl);\n    padding: var(--space-xl);\n    box-shadow: var(--shadow-card);',
    '.testimonial-card {\n    background: var(--bg-card);\n    border-radius: var(--radius-xl);\n    padding: var(--space-xl);\n    box-shadow: var(--shadow-card);\n    border: 1px solid rgba(80, 140, 160, 0.1);'
)

# 18. CTA section - make it striking using dark/teal
css = css.replace(
    '.cta-section {\n    padding: var(--space-4xl) 0;\n    background: var(--bg-off);\n',
    '.cta-section {\n    padding: var(--space-4xl) 0;\n    background: var(--bg-dark);\n    position: relative;\n    overflow: hidden;\n'
)

with open('public/css/styles.css', 'w') as f:
    f.write(css)

print("Final polish applied.")
