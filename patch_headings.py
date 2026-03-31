"""
Apply DM Serif Display font to all major headings (h1, h2 in sections)
and reduce font-weight from 900/800 to 400 for the serif font.
"""
import re

with open('public/css/styles.css', 'r') as f:
    css = f.read()

# Find all h2/h3 rules with font-size clamp and font-weight: 900 
# and inject font-family: var(--font-heading) before font-size
# Pattern: some selector h2\s*{\s*\n\s*font-size: clamp
def inject_heading_font(css):
    """For any h2 or h3 block with font-size clamp, add font-family heading and fix weight."""
    # Match: h2 or h3 opening with font-size: clamp pattern
    pattern = re.compile(
        r'((?:h[123][^{]*|\.quote-intro h2|\.section-title)\s*\{[^}]*?)'
        r'(font-size:\s*clamp[^;]+;)',
        re.DOTALL
    )
    def replacer(m):
        block = m.group(0)
        if 'font-family' not in block:
            return block.replace(
                m.group(2),
                'font-family: var(--font-heading);\n    ' + m.group(2)
            )
        return block
    return pattern.sub(replacer, css)

css = inject_heading_font(css)

# Replace font-weight: 900 → 400 ONLY inside heading-level font-family blocks
# We do it with a targeted pass: find sections that have font-family: var(--font-heading) AND font-weight
def fix_heading_weights(css):
    """After heading font is injected, set font-weight 400 in those blocks."""
    # Look for blocks with var(--font-heading) and swap the 900/800 weight
    lines = css.split('\n')
    result = []
    in_heading_block = False
    brace_depth = 0
    for line in lines:
        stripped = line.strip()
        brace_depth += stripped.count('{') - stripped.count('}')
        if 'font-family: var(--font-heading)' in stripped:
            in_heading_block = True
        if in_heading_block and brace_depth <= 0:
            in_heading_block = False
        if in_heading_block and re.match(r'\s*font-weight:\s*(900|800)\s*;', line):
            line = re.sub(r'font-weight:\s*(900|800)', 'font-weight: 400', line)
        result.append(line)
    return '\n'.join(result)

css = fix_heading_weights(css)

# Also fix letter-spacing on headings — tighter is good for serif
# Apply sensible leading on headings
css = css.replace('letter-spacing: -0.04em;\n}', 'letter-spacing: -0.02em;\n}')

with open('public/css/styles.css', 'w') as f:
    f.write(css)

print("Heading font patch applied.")
