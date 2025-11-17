# 15. Coding Standards

## TypeScript Guidelines
- Use strict mode (`"strict": true`)
- Prefer interfaces over types para objects
- Use enums para valores fixos
- Evitar `any` - usar `unknown` se necessário

## React Guidelines
- Use Server Components por padrão (App Router)
- Client Components apenas quando necessário (`'use client'`)
- Prefer composition over prop drilling
- Extract reusable logic to custom hooks

## File Naming
- Components: PascalCase (Button.tsx)
- Utilities: camelCase (analytics.ts)
- Pages: lowercase (page.tsx)
- Constants: UPPER_SNAKE_CASE

## Git Commit Messages
```
feat: Add Calendly embed component
fix: Resolve form validation issue
docs: Update architecture document
refactor: Simplify analytics tracking
test: Add Button component tests
chore: Update dependencies
```

---

