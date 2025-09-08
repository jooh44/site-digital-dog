# GEMINI.md - Digital Dog Website

## Project Overview

This project is a professional, single-page marketing website for "Digital Dog," a service that builds websites for veterinarians and pet shops. The site is designed to be visually appealing, interactive, and heavily optimized for lead generation through robust analytics and tracking.

**Core Technologies:**
- **Frontend:** HTML, CSS, JavaScript
- **JavaScript Libraries:** 
  - `anime.js`: For complex and smooth animations.
  - `lucide-icons`: For modern, lightweight icons.
- **Backend:** A single PHP script (`/api/meta-conversions.php`) that acts as a server-side endpoint for the Meta (Facebook) Conversions API.
- **Analytics & Tracking:**
  - Google Tag Manager
  - Meta Pixel (client-side)
  - Meta Conversions API (server-side)

**Key Features:**
- A responsive, modern "tech" aesthetic.
- An interactive portfolio section with a "card shuffle" animation.
- Animated backgrounds using HTML Canvas.
- Deep integration with Meta for tracking `PageView`, `ViewContent`, and `Lead` events.
- A PHP backend to securely forward conversion data to Meta, ensuring reliability and bypassing ad-blockers.

## Building and Running

This is primarily a static website, but it requires a PHP-enabled web server to handle the Meta Conversions API endpoint.

### 1. Configure Meta API
Before running, you must set up your Meta API credentials:
1.  Copy `meta-config.example.js` to a new file named `meta-config.js`.
2.  Open `meta-config.js` and fill in your actual `pixelId`, `accessToken`, and `datasetId` from your Meta Business account.
3.  **IMPORTANT:** `meta-config.js` is listed in `.gitignore` and should never be committed to version control as it contains sensitive tokens.

### 2. Run with a Local Server
You need a local server that can interpret PHP. The simplest way is to use PHP's built-in server.

1.  Make sure you have PHP installed on your system.
2.  Open a terminal in the project's root directory.
3.  Run the following command:
    ```bash
    php -S localhost:8000
    ```
4.  Open your web browser and navigate to `http://localhost:8000`.

The site will be fully functional, including the server-side API calls from the contact form and other tracked events.

## Development Conventions

### Code Structure
- **`index.html`**: The single entry point for the entire website.
- **`assets/css/styles.css`**: Contains all styles for the project. It uses CSS Custom Properties (variables) defined in `:root` for easy theming and consistency.
- **`assets/js/script.js`**: This file contains the main `DigitalDogSite` class which controls all UI interactions, animations (like the portfolio shuffle), and general page logic.
- **`assets/js/meta-conversions-api.js`**: This file contains the `MetaConversionsAPI` class, which is solely responsible for handling all client-side tracking logic and preparing payloads to be sent to the backend.
- **`api/meta-conversions.php`**: The server-side endpoint. It receives event data from the client, hashes user information for privacy, adds the user's IP address, and securely sends the data to the Meta Graph API.

### Making Changes
- **Styling:** To change colors, fonts, or spacing, modify the CSS variables in the `:root` block at the top of `assets/css/styles.css`.
- **UI/Interaction:** For changes to animations or user interactions, look inside the `DigitalDogSite` class in `assets/js/script.js`.
- **Tracking:** 
  - To add a new tracked event, use the `window.metaAPI.track()` method, which is exposed by the `MetaConversionsAPI` class.
  - Example: `window.metaAPI.track('Purchase', { value: 100, currency: 'BRL' });`
  - Automatic event tracking (form submissions, WhatsApp clicks) is configured in the `setupEventListeners` method within `assets/js/meta-conversions-api.js`.
