# Calculator Frontend

Front-end client (web application) of the calculator system with front-end / back-end separation. It handles the user interface, button interaction, expression input, result display and history display / deletion. **The front end performs no expression evaluation at all**; every result comes from the back-end API.

## 1. Tech Stack

| Component | Technology |
| --- | --- |
| Markup | HTML5 |
| Styling | CSS3 (light & dark themes via CSS variables) |
| Scripting | Vanilla JavaScript (ES6, no framework, no build step) |
| Networking | Fetch API |

> Vanilla HTML/CSS/JS keeps the project dependency-free and build-free: any static server (or even opening the HTML file directly) runs it, which makes evaluation easy.

## 2. Project Structure

```
frontend/
├── src/
│   ├── index.html        # Page structure (calculator + history panel + API config)
│   ├── css/
│   │   └── style.css     # Styles and theme variables
│   └── js/
│       ├── config.js     # Backend API base URL configuration
│       ├── api.js        # Backend API wrapper (calculate / history)
│       └── app.js        # UI interaction logic (no calculation logic)
├── README.md
└── codestyle.md
```

## 3. Runtime Environment

- Any modern browser (Chrome / Edge / Firefox / Safari)
- No Node.js, no bundling required

## 4. Installation & Startup

### Option A: open the file directly (fastest)

Open `src/index.html` in a browser.

### Option B: local static server (recommended, avoids browser file:// restrictions)

```bash
cd frontend/src
python3 -m http.server 5500
# or: npx serve .
```

Then visit `http://127.0.0.1:5500`.

## 5. Configuration

The front end needs to know where the back end lives:

1. Start the back-end service (see `backend/README.md`)
2. Open the front end and set "Backend API" at the bottom of the page, then click "Save"
3. When the status at the bottom right turns to "Connected", configuration is done

The API base URL is stored in `localStorage` and survives reloads. The default value is defined by `DEFAULT_API_BASE` in `src/js/config.js` (it points to the deployed cloud back end out of the box; change it to `http://127.0.0.1:8000` for local development).

## 6. Front-End / Back-End Integration

The front end talks to the back end with JSON over the Fetch API:

| Feature | Request | Notes |
| --- | --- | --- |
| Calculate | `POST /api/calculate` | Sends the expression; the back end evaluates, persists and returns the result |
| Read history | `GET /api/history` | Reads all records from the back-end database |
| Delete record | `DELETE /api/history/{id}` | Deletes one record |
| Clear all | `DELETE /api/history` | Clears everything (extended feature) |

CORS is enabled on the back end, so the front end can call it cross-origin directly. If the back end is down, the page shows "Cannot connect to the backend..." and cannot produce any result — exactly what the front-end / back-end separation requirement asks for.

## 7. Feature List

- Basic arithmetic (+ - x /), parentheses, decimals, unary plus/minus
- Compound expressions (evaluated on the back end with correct precedence)
- Error messages (invalid expression, division by zero, ... as returned by the back end)
- Calculation history from the back-end database (survives reloads)
- Delete one history record / clear all history
- Click a history entry to refill the expression
- Keyboard shortcuts (digits, operators, Enter to calculate, Backspace to delete, Esc to clear)
- Light / dark theme toggle

## 8. Screenshots

See `../blog/screenshots/` for 14 real product screenshots used in the assignment blog.
