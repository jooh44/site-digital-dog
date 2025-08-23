# Digital Dog - Claude Code Configuration

## Project Overview
Digital Dog website development with focus on modern design, performance, and accessibility.

## Visual Development Guidelines

### Design Principles
Reference the complete design checklist and style guide in `design-principles.md` for all visual/UI/UX related changes.

### Quick Visual Check Process
After implementing front-end changes, immediately perform:

1. **Component Identification**
   - Identify all modified UI components
   - List affected pages and views

2. **Navigation Testing**
   - Navigate to all affected pages
   - Test all interactive elements

3. **Design Compliance Verification**
   - Compare against design-principles.md
   - Check color, typography, spacing consistency
   - Verify responsive behavior

4. **Feature Implementation Validation**
   - Confirm all requested features work correctly
   - Test edge cases and error states

5. **Acceptance Criteria Check**
   - Verify all requirements are met
   - Document any deviations or limitations

6. **Visual Documentation**
   - Capture screenshots of key changes
   - Note before/after comparisons if applicable

7. **Console Error Check**
   - Verify no JavaScript errors in console
   - Check for accessibility warnings

### Comprehensive Design Review
For significant UI/UX features or pre-PR validation, use the `@agent-design-review` subagent that will:

- Conduct systematic 7-phase review process
- Use Playwright for automated cross-device testing
- Provide detailed accessibility and responsiveness analysis
- Generate comprehensive reports with visual evidence
- Ensure compliance with design principles and standards

## Development Standards

### Code Quality
- Use semantic HTML structure
- Follow CSS architecture best practices
- Implement responsive design patterns
- Ensure accessibility compliance (WCAG AA+)

### Testing Requirements
- Cross-browser compatibility
- Mobile-first responsive design
- Performance optimization
- Error handling and loading states

### Performance Guidelines
- Optimize images and assets
- Minimize JavaScript bundle size
- Implement efficient CSS
- Use progressive enhancement

## Playwright Integration
Leverage Playwright MCP for:
- Automated visual testing
- Cross-browser compatibility checks
- Responsive design validation
- Accessibility testing automation
- Performance monitoring

## Workflow Integration
- Use design review agent for comprehensive UI/UX evaluation
- Implement quick visual checks for all front-end changes
- Maintain design system consistency
- Document visual changes and decisions