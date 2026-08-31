# 🚀 Web Applications & Tools Hub

A production-ready, client-side static web application suite built with HTML5, Vanilla JavaScript (ES6+), and Tailwind CSS. Hosted on GitHub Pages, this repository features an automated workflow powered by GitHub Actions that dynamically indexes and updates newly deployed web tools into a modern dashboard on every `git push`.

---

## 🔗 Live Demo
Access the live tools portal:  
🌐 **[app.bishnulamsal.com.np](https://app.bishnulamsal.com.np)**

---

## ✨ Features

- **🔄 Automated Cataloging:** GitHub Actions automatically parses new `.html` tool files inside the `tools/` directory, extracts metadata (such as `<title>`), and updates `tools.json`.
- **⚡ Client-Side Execution:** Zero backend requirement—all tools run purely in the browser for maximum privacy and speed.
- **🌙 Responsive Dark / Light UI:** Built using Tailwind CSS with persistent theme selection saved in local storage.
- **🔍 Real-Time Search Filtering:** Instant fuzzy filtering by tool name, description, and tags directly on the dashboard.
- **🛡️ API Limit Fallback:** Dual data fetch strategy reads from static `tools.json` primary data with automatic fallback to GitHub's REST API.

---

## 📂 Repository Architecture

```text
app/
├── .github/
│   └── workflows/
│       └── update-tools.yml     # Automated Python script to index tools
├── tools/                       # Directory containing static web applications
│   ├── unicode-converter.html
│   ├── url-shortener.html
│   └── post-thumbnail-gen.html
├── index.html                   # Main dynamic dashboard landing page
├── tools.json                   # Auto-generated catalog database
└── README.md                    # Project documentation
