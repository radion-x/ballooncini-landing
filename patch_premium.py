"""
Elite Dentistry — Premium CSS patch
Replaces all off-brand color values with proper brand palette
"""
import re

with open('public/css/styles.css', 'r') as f:
    css = f.read()

# ─── 1. Header border ───
css = css.replace(
    'border-bottom: 1px solid rgba(148, 168, 154, 0.2);',
    'border-bottom: 1px solid rgba(80, 140, 160, 0.12);'
)

# ─── 2. Header nav link hover background ───
css = css.replace(
    'background: rgba(148, 168, 154, 0.1);\n    color: var(--accent-indigo);',
    'background: var(--brand-teal-pale);\n    color: var(--brand-teal);'
)

# ─── 3. Hero overlay — use a clean white overlay on the photo so text is legible ───
css = css.replace(
    'background: linear-gradient(135deg, rgba(249, 248, 246, 0.85) 0%, rgba(255, 255, 255, 0.9) 100%);',
    'background: linear-gradient(160deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.78) 50%, rgba(240,248,252,0.65) 100%);'
)

# ─── 4. Hero after gradient ───
css = css.replace(
    'background: radial-gradient(circle at top right, rgba(148, 168, 154, 0.2) 0%, transparent 50%),\n                radial-gradient(circle at bottom left, rgba(212, 184, 149, 0.15) 0%, transparent 50%);',
    'background: radial-gradient(ellipse at 80% 50%, rgba(80, 140, 160, 0.08) 0%, transparent 60%),\n                radial-gradient(ellipse at 20% 80%, rgba(160, 100, 80, 0.06) 0%, transparent 50%);'
)

# ─── 5. Hero badge ───
css = css.replace(
    'background: rgba(148, 168, 154, 0.1);\n    border: 1px solid rgba(148, 168, 154, 0.3);',
    'background: var(--brand-teal-pale);\n    border: 1px solid rgba(80, 140, 160, 0.25);'
)

# ─── 6. Dropdown menu border ───
css = css.replace(
    'border: 1px solid rgba(196, 239, 23, 0.1);\n    border-radius: var(--radius-md);\n    padding: 0.5rem 0;\n    margin-top: 0;\n    list-style: none;\n    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);',
    'border: 1px solid rgba(80, 140, 160, 0.12);\n    border-radius: var(--radius-md);\n    padding: 0.5rem 0;\n    margin-top: 0;\n    list-style: none;\n    box-shadow: 0 8px 32px rgba(13, 27, 36, 0.12);'
)

# ─── 7. Dropdown hover ───
css = css.replace(
    "background: rgba(196, 239, 23, 0.1);\n    color: var(--accent-primary);\n    padding-left: 2rem;",
    "background: var(--brand-teal-pale);\n    color: var(--brand-teal);\n    padding-left: 2rem;"
)

# ─── 8. btn-primary nav ───
css = css.replace(
    'box-shadow: 0 4px 14px rgba(148, 168, 154, 0.4);',
    'box-shadow: 0 4px 14px rgba(80, 140, 160, 0.35);'
)

# ─── 9. Glow shadow references ───
css = css.replace(
    '0 0 32px rgba(80, 140, 160, 0.25)',
    '0 0 32px rgba(80, 140, 160, 0.30)'
)

# ─── 10. btn-primary shadow ───
css = css.replace(
    'box-shadow: var(--shadow-glow);',
    'box-shadow: 0 4px 20px rgba(80, 140, 160, 0.35);'
)

# ─── 11. btn-secondary border ───
css = css.replace(
    "border: 2px solid #e5e7eb;",
    "border: 2px solid rgba(80, 140, 160, 0.25);"
)
css = css.replace(
    "border-color: var(--text-primary);",
    "border-color: var(--brand-teal);\n    color: var(--brand-teal);"
)

# ─── 12. Heading font uses ───
css = css.replace("font-family: var(--font-heading)", "_heading_font_placeholder_")
# body font
css = css.replace("font-family: var(--font-body)", "_body_font_placeholder_")
css = css.replace("_heading_font_placeholder_", "font-family: var(--font-heading)")
css = css.replace("_body_font_placeholder_", "font-family: var(--font-body)")

# ─── 13. Section h2/h3 headings color to text-primary ───
# Trust values - use the teal
css = css.replace(
    'background: var(--gradient-glow);\n    -webkit-background-clip: text;\n    -webkit-text-fill-color: transparent;\n    background-clip: text;',
    'color: var(--brand-teal);\n    background: none;\n    -webkit-text-fill-color: var(--brand-teal);'
)

# ─── 14. Contact CTA section ───
css = css.replace(
    'background: var(--primary-dark);',
    'background: linear-gradient(160deg, #0D1B24 0%, #1A3040 100%);'
)

# ─── 15. Gradient backgrounds on dark sections ───
css = css.replace('var(--bg-darker)', 'var(--bg-dark)')

# ─── 16. Remaining old sage rgba ───
css = css.replace('rgba(148, 168, 154,', 'rgba(80, 140, 160,')
css = css.replace('rgba(212, 184, 149,', 'rgba(160, 100, 80,')

# ─── 17. Assessment purple ───
css = css.replace('#0f0f23', '#0D1B24')
css = css.replace('background: #C4EF17', 'background: var(--brand-teal)')
css = css.replace('color: #0f0f23', 'color: var(--text-light)')

# ─── 18. Old hardcoded dark hex cleanup ───
for old, new in [
    ('#1a1a2e', 'var(--bg-dark)'),
    ('#1a1a', 'var(--bg-dark)'),
]:
    css = css.replace(old, new)

# ─── 19. Quote/form section ───
css = css.replace(
    'background: var(--bg-section);',
    'background: var(--bg-off);'
)

# ─── 20. Suburbs footer border ───
css = css.replace(
    'border: 2px solid rgba(80, 140, 160, 0.1)',
    'border: 1px solid rgba(80, 140, 160, 0.15)'
)

# ─── 21. Font weight on hero h1 — make it lighter for the DM Serif Display ───
css = css.replace(
    '.hero h1 {\n    font-size: clamp(2.5rem, 6vw, 5rem);\n    font-weight: 900;',
    '.hero h1 {\n    font-family: var(--font-heading);\n    font-size: clamp(2.8rem, 6vw, 5.2rem);\n    font-weight: 400;'
)

# ─── 22. Hero subtitle ───
css = css.replace(
    '.hero-subtitle {\n    font-size: clamp(1.2rem, 2.5vw, 1.8rem);\n    color: var(--text-primary);\n    font-weight: 600;',
    '.hero-subtitle {\n    font-size: clamp(1.1rem, 2.2vw, 1.5rem);\n    color: var(--text-secondary);\n    font-weight: 400;'
)

with open('public/css/styles.css', 'w') as f:
    f.write(css)

print("Premium CSS patch applied successfully.")
