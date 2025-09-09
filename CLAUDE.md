# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## GitHub Repository
https://github.com/jooh44/site-digital-dog 
**IMPORTANT: Only commit when explicitly requested by the user**

## Project Overview
Digital Dog is a professional website for veterinary services with integrated Meta Conversions API for advanced tracking and lead generation. The project is a static website with server-side PHP API for Meta tracking.

## Development Commands

### Local Development
```bash
# Open directly in browser (no build system)
# For local testing with PHP API:
php -S localhost:8000

# Alternative: Open index.html directly in browser for frontend-only testing
# Note: Meta Conversions API requires PHP server for backend functionality
```

### Testing Meta Conversions API
```bash
# Check PHP endpoint
curl -X POST http://localhost:8000/api/meta-conversions.php \
  -H "Content-Type: application/json" \
  -d '{"event_name":"PageView","pixel_id":"766494342759761"}'
```

### Validation Commands
- **HTML/CSS/JS validation**: Use browser dev tools console
- **Meta Events debugging**: Check Meta Events Manager > Test Events
- **PHP backend testing**: Check server logs and Meta Events Manager

## Architecture Overview

### Frontend Architecture
- **Single-page static site**: One main `index.html` file
- **Vanilla JavaScript**: No frameworks, modular approach with two main scripts:
  - `assets/js/script.js`: Main site functionality, animations, UI interactions
  - `assets/js/meta-conversions-api.js`: Meta Conversions API integration
- **CSS Architecture**: Single `assets/css/styles.css` with responsive design
- **External libraries**: Anime.js for animations, Lucide for icons

### Backend Architecture
- **PHP API endpoint**: `api/meta-conversions.php` for Meta Conversions API
- **Configuration**: `meta-config.js` contains Meta API credentials (not in Git)
- **Static assets**: Images organized in `assets/images/`

### Meta Conversions API Integration
- **Client-side tracking**: Automatic PageView, ViewContent, Lead events
- **Server-side API**: PHP endpoint sends events to Meta Conversions API
- **Event sources**: WhatsApp buttons, contact forms, portfolio CTAs
- **Data collection**: FBP, FBC, IP, User Agent, form data (hashed)

## Key Files and Structure

```
├── index.html                    # Main website page
├── assets/
│   ├── css/styles.css           # Main stylesheet (61KB+)
│   ├── js/
│   │   ├── script.js            # Main JavaScript (37KB+)
│   │   └── meta-conversions-api.js # Meta API integration (11KB+)
│   └── images/                  # All website images
├── api/
│   └── meta-conversions.php     # Server-side Meta API endpoint
├── docs/                        # Technical documentation
│   ├── design-principles.md     # UI/UX guidelines
│   ├── CARD-DECK-EFFECT-GUIDE.md # Portfolio animation guide
│   └── *.md                     # Various technical guides
├── meta-config.js              # Meta API credentials (not in repo)
├── meta-config.example.js      # Template for Meta configuration
├── META-CONVERSIONS-SETUP.md   # Meta API setup instructions
├── manifest.json               # PWA configuration
├── robots.txt                  # SEO configuration
├── sitemap.xml                 # SEO sitemap
└── builder.config.json         # Builder.io configuration
```

## Meta Conversions API Configuration

### Required Setup
1. Copy `meta-config.example.js` to `meta-config.js`
2. Configure Meta credentials in `meta-config.js`:
   - `pixelId`: Already set to '766494342759761'
   - `accessToken`: Meta Access Token for Conversions API
   - `datasetId`: Meta Dataset ID
   - `testEventCode`: For debugging (optional)

### Event Tracking
- **Automatic events**: PageView (page load), ViewContent (scroll), Lead (actions)
- **Tracked actions**: WhatsApp clicks, form submissions, portfolio interactions
- **Data privacy**: Personal data is hashed with SHA-256 before sending

## Visual Development Guidelines

### Design System Reference
- **Primary reference**: `docs/design-principles.md` for all UI/UX decisions
- **Responsive breakpoints**: 320px, 768px, 1024px, 1200px (mobile-first)
- **Typography**: Inter, Space Grotesk, Poppins fonts from Google Fonts
- **Color scheme**: Professional veterinary theme with gradient accents

### Quick Visual Check Process
After frontend changes:
1. Test all modified UI components across devices
2. Verify responsive behavior at all breakpoints
3. Check console for JavaScript errors
4. Test interactive elements (forms, buttons, animations)
5. Validate against design-principles.md guidelines

### Comprehensive Design Review
For significant UI/UX changes, use the design-review-agent subagent which provides:
- Automated Playwright testing across devices
- Accessibility and responsiveness analysis
- Compliance verification against design principles
- Visual evidence and detailed reports

## Development Standards

### Code Patterns
- **HTML**: Semantic structure with proper meta tags and schema markup
- **CSS**: BEM-like methodology, mobile-first responsive design
- **JavaScript**: ES6+ features, modular functions, event delegation
- **PHP**: Secure API practices with proper error handling

### Key Dependencies
- **Anime.js**: Animation library (CDN)
- **Lucide**: Icon library (CDN)  
- **Google Fonts**: Inter, Space Grotesk, Poppins
- **PWA**: Progressive Web App with manifest.json
- **No build system**: Direct file editing and browser refresh

### Performance Guidelines
- **Images**: Optimized formats, proper alt tags, lazy loading
- **CSS**: Critical CSS inlined, efficient selectors
- **JavaScript**: Minified external libraries, efficient animations
- **Meta tracking**: Optimized event payload size

### Security Practices
- **API credentials**: Never commit `meta-config.js` to Git
- **Data privacy**: Hash personal data before transmission
- **CORS**: Properly configured for API endpoints
- **Input validation**: Sanitize all user inputs in PHP backend

## Testing and Deployment

### Testing Requirements
- **Cross-browser**: Chrome, Firefox, Safari, Edge
- **Mobile devices**: iOS Safari, Android Chrome
- **Meta Events**: Use Meta Events Manager Test Events feature
- **PHP backend**: Test API endpoint responses and error handling

### Deployment Checklist
1. Upload all files to web server
2. Ensure PHP is enabled for `/api/` directory
3. Configure HTTPS (required for Meta Conversions API)
4. Set up `meta-config.js` with production credentials
5. Test Meta events in Events Manager
6. Validate all contact forms and WhatsApp integrations

## Troubleshooting

### Common Issues
- **Meta events not tracking**: Check `meta-config.js` credentials and console logs
- **PHP API errors**: Verify server PHP version and permissions
- **Mobile responsiveness**: Test at actual device breakpoints
- **Form submissions**: Validate both client and server-side handling

### Debug Resources
- Browser console for JavaScript errors
- Meta Events Manager for tracking validation
- Server logs for PHP backend issues
- Network tab for API request/response analysis

## File Editing Notes
- **CSS changes**: Single large file (61KB+), use search to find specific sections
- **JavaScript**: Main functionality in `script.js` (37KB+), Meta API in separate file (11KB+)
- **PHP API**: Backend is self-contained in `api/meta-conversions.php`
- **Configuration**: Always use `meta-config.example.js` as template
- **Sensitive files**: `meta-config.js` is gitignored and contains API credentials

## Claude Code Agent Integration
- **UI/UX workflow**: Use `.claude/agents/ui-ux-workflow-expert.md` for design decisions
- **Design review**: Use design-review-agent for comprehensive visual testing
- **Design principles**: Reference `docs/design-principles.md` for all visual changes
- **Portfolio animations**: Reference `docs/CARD-DECK-EFFECT-GUIDE.md` for card shuffle effects

## Important Development Reminders
- **No build system**: This is a static site with direct file editing
- **No package.json**: Dependencies loaded via CDN, no npm commands available
- **Meta credentials**: Never commit `meta-config.js` - it's gitignored for security
- **Testing approach**: Browser-based testing only, no automated test framework
- **Deployment**: Simple file upload to web server with PHP support