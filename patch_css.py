import re

with open('public/css/styles.css', 'r') as f:
    css = f.read()

# Replace root variables
old_root = """/* ===================================
   WEBSITED - ULTRA MODERN DESIGN 2025
   Fresh, Bold, Unique
   =================================== */

:root {
    /* Elite Dentistry Color Palette - Professional Teal Theme */
    --primary: #5990AE;
    --primary-dark: #3D6B82;
    --primary-light: #7AACCA;
    --complement: #AE7959;
    --complement-light: #C99575;
    
    --gradient-primary: linear-gradient(135deg, #3D6B82 0%, #5990AE 50%, #7AACCA 100%);
    --gradient-dark: linear-gradient(135deg, #2A4A5C 0%, #3D6B82 100%);
    --gradient-glow: linear-gradient(135deg, #5990AE 0%, #7AACCA 100%);
    --gradient-complement: linear-gradient(135deg, #AE7959 0%, #C99575 100%);
    
    --bg-primary: #0f1419;
    --bg-dark: #1a2530;
    --bg-darker: #0a0e13;
    --bg-section: #1e2d3a;
    
    --text-primary: #FFFFFF;
    --text-secondary: #a0b0c0;
    --text-light: #FFFFFF;
    
    --accent-primary: #5990AE;
    --accent-indigo: #5990AE;
    --accent-pink: #AE7959;
    --accent-purple: #7AACCA;
    --accent-cyan: #5990AE;
    --accent-emerald: #6BA89E;
    
    /* Modern Spacing */
    --space-xs: 0.5rem;
    --space-sm: 1rem;
    --space-md: 1.5rem;
    --space-lg: 2rem;
    --space-xl: 3rem;
    --space-2xl: 4rem;
    --space-3xl: 6rem;
    --space-4xl: 8rem;
    
    /* Typography */
    --font-heading: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
    --font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    
    /* Modern Radius */
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 24px;
    --radius-2xl: 32px;
    --radius-full: 9999px;
    
    /* Shadows */
    --shadow-glow: 0 0 40px rgba(89, 144, 174, 0.3);
    --shadow-glow-complement: 0 0 40px rgba(174, 121, 89, 0.3);
    --shadow-card: 0 10px 40px rgba(0, 0, 0, 0.08);
    --shadow-card-hover: 0 20px 60px rgba(0, 0, 0, 0.12);
}"""

new_root = """@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

/* ===================================
   WEBSITED - ULTRA MODERN DESIGN 2025
   Fresh, Bold, Unique
   =================================== */

:root {
    /* Elite Dentistry Color Palette - Refined Light Luxury Theme */
    --primary: #94A89A; /* Soft Sage Green */
    --primary-dark: #748A7B;
    --primary-light: #B4C6BA;
    --complement: #D4B895; /* Soft Sand/Gold */
    --complement-light: #E8D3B7;
    
    --gradient-primary: linear-gradient(135deg, #94A89A 0%, #748A7B 100%);
    --gradient-dark: linear-gradient(135deg, #748A7B 0%, #546A5B 100%);
    --gradient-glow: linear-gradient(135deg, #94A89A 0%, #B4C6BA 100%);
    --gradient-complement: linear-gradient(135deg, #D4B895 0%, #E8D3B7 100%);
    
    --bg-primary: #F9F8F6; /* Warm off-white */
    --bg-dark: #FFFFFF; /* Pure white for cards/sections */
    --bg-darker: #EFECE6; /* Slightly darker warm gray for contrast */
    --bg-section: #FFFFFF;
    
    --text-primary: #2C2C28; /* Deep warm grey, almost black */
    --text-secondary: #6B6B63; /* Medium warm grey */
    --text-light: #FFFFFF; /* Used for text on primary buttons */
    
    --accent-primary: #94A89A;
    --accent-indigo: #94A89A;
    --accent-pink: #D4B895;
    --accent-purple: #B4C6BA;
    --accent-cyan: #748A7B;
    --accent-emerald: #94A89A;
    
    /* Modern Spacing */
    --space-xs: 0.5rem;
    --space-sm: 1rem;
    --space-md: 1.5rem;
    --space-lg: 2rem;
    --space-xl: 3rem;
    --space-2xl: 4rem;
    --space-3xl: 6rem;
    --space-4xl: 8rem;
    
    /* Typography */
    --font-heading: 'Cormorant Garamond', serif;
    --font-body: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    
    /* Modern Radius */
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 24px;
    --radius-2xl: 32px;
    --radius-full: 9999px;
    
    /* Shadows */
    --shadow-glow: 0 0 40px rgba(148, 168, 154, 0.4);
    --shadow-glow-complement: 0 0 40px rgba(212, 184, 149, 0.4);
    --shadow-card: 0 10px 40px rgba(44, 44, 40, 0.05);
    --shadow-card-hover: 0 20px 60px rgba(44, 44, 40, 0.1);
}"""

css = css.replace(old_root, new_root)

# Hero modifications
css = css.replace("linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.7) 100%)", "linear-gradient(135deg, rgba(249, 248, 246, 0.85) 0%, rgba(255, 255, 255, 0.9) 100%)")
css = css.replace("rgba(89, 144, 174, 0.1)", "rgba(148, 168, 154, 0.1)")
css = css.replace("rgba(89, 144, 174, 0.3)", "rgba(148, 168, 154, 0.3)")
css = css.replace(".hero h1 {\n    font-size: clamp(2.5rem, 6vw, 5rem);\n    font-weight: 900;\n    line-height: 1.1;\n    color: white;", ".hero h1 {\n    font-size: clamp(2.5rem, 6vw, 5rem);\n    font-weight: 900;\n    line-height: 1.1;\n    color: var(--text-primary);")
css = css.replace(".hero-subtitle {\n    font-size: clamp(1.2rem, 2.5vw, 1.8rem);\n    color: rgba(255, 255, 255, 0.9);", ".hero-subtitle {\n    font-size: clamp(1.2rem, 2.5vw, 1.8rem);\n    color: var(--text-primary);")
css = css.replace(".hero-description {\n    font-size: 1.15rem;\n    color: rgba(255, 255, 255, 0.7);", ".hero-description {\n    font-size: 1.15rem;\n    color: var(--text-secondary);")
css = css.replace(".hero-feature {\n    display: flex;\n    align-items: center;\n    gap: var(--space-sm);\n    color: rgba(255, 255, 255, 0.9);", ".hero-feature {\n    display: flex;\n    align-items: center;\n    gap: var(--space-sm);\n    color: var(--text-primary);")

# Replace white contexts with dark text EXCEPT for btn-primary
# So first we'll globally replace all white/rgba texts, and then restore them for footer and contact CTA and btn-primary
css = re.sub(r'color:\s*white;', 'color: var(--text-primary);', css)
css = re.sub(r'color:\s*#fff;', 'color: var(--text-primary);', css)
css = re.sub(r'color:\s*rgba\(255,\s*255,\s*255,\s*0\.7\);', 'color: var(--text-secondary);', css)
css = re.sub(r'color:\s*rgba\(255,\s*255,\s*255,\s*0\.9\);', 'color: var(--text-secondary);', css)
css = re.sub(r'color:\s*rgba\(255,\s*255,\s*255,\s*0\.8\);', 'color: var(--text-secondary);', css)

# Make buttons white text explicitly
css = css.replace(".btn-primary {\n    background: var(--gradient-primary);\n    color: var(--text-primary);", ".btn-primary {\n    background: var(--gradient-primary);\n    color: var(--text-light);")
css = css.replace(".nav-cta .btn-primary {\n    padding: 0.75rem 1.75rem;\n    font-size: 0.95rem;\n    font-weight: 600;\n    background: var(--gradient-primary);\n    color: var(--text-primary);", ".nav-cta .btn-primary {\n    padding: 0.75rem 1.75rem;\n    font-size: 0.95rem;\n    font-weight: 600;\n    background: var(--gradient-primary);\n    color: var(--text-light);")
# Also .btn { color: var(--text-primary) } might be okay if it's white bg, but let's review `.btn ` block just in case later.

# Replace contact CTA background
css = css.replace("background: #000000;", "background: var(--primary-dark);")

# Replace old hex colors global fallback
css = css.replace("#5990AE", "var(--primary)")
css = css.replace("#3D6B82", "var(--primary-dark)")
css = css.replace("#7AACCA", "var(--primary-light)")
css = css.replace("#1a2530", "var(--bg-dark)")
css = css.replace("#0f1419", "var(--bg-primary)")
css = css.replace("#1e2d3a", "var(--bg-section)")
css = css.replace("#0a0e13", "var(--bg-darker)")


with open('public/css/styles.css', 'w') as f:
    f.write(css)

print("Styles patched.")
