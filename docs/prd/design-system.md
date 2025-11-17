# 4. Design System (Site Atual)

## Cores CSS Variables
```css
--primary-blue: #00bcd4;
--dark-blue: #0a0e1a;
--darker-blue: #03050a;
--light-blue: #4dd0e1;
--glow-blue: rgba(0, 188, 212, 0.5);
--gradient-orange: #ff6b35;
--gradient-pink: #ff1744;
--gradient-primary: linear-gradient(135deg, #ff6b35 0%, #ff1744 100%);
--gradient-blue: linear-gradient(135deg, #00bcd4 0%, #4dd0e1 100%);
```

## Tipografia
- **Heading:** 'Space Grotesk', 'Poppins', sans-serif
- **Body:** 'Inter', sans-serif
- **Hero Title:** clamp(1.4rem, 3.2vw, 3.2rem) - weight 800
- **Section Title:** clamp(1.85rem, 3.6vw, 3rem) - weight 700

## Espaçamento
- --space-md: 1rem
- --space-lg: 1.5rem
- --space-xl: 2rem
- --space-2xl: 3rem
- --space-3xl: 4rem

## Componentes
**CTA Primário:**
- Background: gradient-primary (laranja→rosa)
- Padding: space-lg × space-xl
- Border-radius: radius-xl
- Hover: scale(0.97)

**CTA Secundário:**
- Border: 2px solid primary-blue
- Hover: bg primary-blue, glow

**Service Card:**
- Background: linear-gradient azul sutil
- Border-left: 3px solid primary-blue
- Hover: translateY(-5px) + shadow

**Section Header:**
- Pre-title: Badge outline azul (animation pulse)
- Title: primary-blue, weight 700
- Subtitle: light-blue, 1.25rem

---

