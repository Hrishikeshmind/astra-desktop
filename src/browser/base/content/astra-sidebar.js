/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* ═══════════════════════════════════════════════════════
   ASTRA BROWSER — Sidebar + Top Bar Implementation
   Pixel-perfect: Arc × macOS Sonoma × Indian Sunset

   ARCHITECTURE:
   - buildSidebar()  → injects #astra-sidebar-container
                       BEFORE #browser (left panel)
   - buildTopBar()   → injects #astra-topbar
                       AT TOP of content column
   - buildLogoCard() → injects #astra-logo-card
                       centered in #appcontent
   - Multiple init strategies (belt + suspenders + parachute)
   ═══════════════════════════════════════════════════════ */

/* ── HACK 1: Load sentinel ─────────────────────────── */
window.__astraLoaded = true;
console.log("[ASTRA] astra-sidebar.js LOADED at", new Date().toISOString());

/* ═══════════════════════════════════════════════════════
   AstraSidebar — main controller
   ═══════════════════════════════════════════════════════ */

var AstraSidebar = {

  /* ── Data ──────────────────────────────────────────── */

  navItems: [
    { id: "home",   label: "Home",         shortcut: "",     icon: "home",   active: true  },
    { id: "search", label: "Search",        shortcut: "",     icon: "search", active: false },
    { id: "ai",     label: "AI Assistant",  shortcut: "\u2318K",  icon: "ai",     active: false },
    { id: "tabs",   label: "Tabs",          shortcut: "\u2318\\", icon: "tabs",   active: false },
    { id: "split",  label: "Split View",    shortcut: "",     icon: "split",  active: false }
  ],

  pinnedSites: [
    { id: "chatgpt", label: "ChatGPT",     url: "https://chatgpt.com",   color: "#10A37F", text: "C"  },
    { id: "youtube", label: "YouTube",     url: "https://youtube.com",   color: "#FF0000", text: "\u25B6" },
    { id: "github",  label: "GitHub",      url: "https://github.com",    color: "#24292E", text: "GH" },
    { id: "twitter", label: "X (Twitter)", url: "https://x.com",         color: "#000000", text: "X"  },
    { id: "notion",  label: "Notion",      url: "https://notion.so",     color: "#F4F4F0", text: "N",  textColor: "#000000", border: "1px solid #E0E0E0" },
    { id: "figma",   label: "Figma",       url: "https://figma.com",     color: "#F24E1E", text: "F"  }
  ],

  workspaces: [
    { id: "personal", label: "Personal", color: "#FF9500" },
    { id: "work",     label: "Work",     color: "#007AFF" },
    { id: "learning", label: "Learning", color: "#AF52DE" }
  ],

  /* ── SVG Icon Library ──────────────────────────────── */

  icons: {
    home: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 6.5L8 1.5l6.5 5V14a.5.5 0 01-.5.5H10V10H6v4.5H2a.5.5 0 01-.5-.5V6.5z"/></svg>',
    search: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="6.5" cy="6.5" r="4.5"/><line x1="10" y1="10" x2="14" y2="14"/></svg>',
    ai: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 1.5l1.8 3.6 3.7.5-2.7 2.6.6 3.8L8 10.3l-3.4 1.7.6-3.8L2.5 5.6l3.7-.5z"/></svg>',
    tabs: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.5"/><rect x="9" y="1.5" width="5.5" height="5.5" rx="1.5"/><rect x="1.5" y="9" width="5.5" height="5.5" rx="1.5"/><rect x="9" y="9" width="5.5" height="5.5" rx="1.5"/></svg>',
    split: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="1.5" y="1.5" width="5.5" height="13" rx="1.5"/><rect x="9" y="1.5" width="5.5" height="13" rx="1.5"/></svg>',
    settings: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="8" r="2.5"/><path d="M8 1.5v1.8M8 12.7v1.8M1.5 8h1.8M12.7 8h1.8M3.3 3.3l1.3 1.3M11.4 11.4l1.3 1.3M3.3 12.7l1.3-1.3M11.4 4.6l1.3-1.3"/></svg>',
    shield: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 1.5L2.5 4v4c0 3.3 2.4 5.5 5.5 6.3 3.1-.8 5.5-3 5.5-6.3V4z"/><polyline points="5.5,8 7,9.5 10.5,6"/></svg>',
    moon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M13.5 10A6.5 6.5 0 016 2.5a6.5 6.5 0 100 11 6.5 6.5 0 007.5-3.5z"/></svg>',
    exit: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 2h3v12h-3M6.5 5l-3 3 3 3M3.5 8H11"/></svg>',
    back: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="10,3 5,8 10,13"/></svg>',
    forward: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,3 11,8 6,13"/></svg>',
    reload: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 6A5.5 5.5 0 103 8.5"/><polyline points="1,6 3,8.5 5.5,6"/></svg>',
    search_sm: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="6.5" cy="6.5" r="4.5"/><line x1="10" y1="10" x2="14" y2="14"/></svg>',
    bookmark: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 1.5h10v13l-5-3.5-5 3.5z"/></svg>',
    download: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="8,2 8,11"/><polyline points="4.5,7.5 8,11 11.5,7.5"/><line x1="2.5" y1="14" x2="13.5" y2="14"/></svg>',
    sidebar_toggle: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="1.5" y="1.5" width="13" height="13" rx="2"/><line x1="6" y1="1.5" x2="6" y2="14.5"/></svg>'
  },

  /* ── SVG: Astra Logo ───────────────────────────────── */

  _logoSVG: '<svg viewBox="0 0 100 100">' +
    '<defs>' +
    '<linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">' +
    '<stop offset="0%" stop-color="#FFF3E0"/>' +
    '<stop offset="100%" stop-color="#FF8C42"/>' +
    '</linearGradient>' +
    '<linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%">' +
    '<stop offset="0%" stop-color="#FF8C42"/>' +
    '<stop offset="100%" stop-color="#8B4513"/>' +
    '</linearGradient>' +
    '</defs>' +
    '<path d="M50 15 C55 15 65 20 68 35 C71 50 65 60 75 68 C80 72 82 78 78 82 C74 86 68 82 60 76 C52 70 50 65 50 65 C50 65 48 70 40 76 C32 82 26 86 22 82 C18 78 20 72 25 68 C35 60 29 50 32 35 C35 20 45 15 50 15Z" fill="url(#lg1)" opacity="0.9"/>' +
    '<path d="M50 22 C53 22 60 26 63 37 C66 48 61 57 68 64 C54 58 50 50 50 50 C50 50 46 58 32 64 C39 57 34 48 37 37 C40 26 47 22 50 22Z" fill="url(#lg2)" opacity="0.8"/>' +
    '<circle cx="50" cy="48" r="7" fill="#8B4513" opacity="0.6"/>' +
    '</svg>',

  /* ── Init ──────────────────────────────────────────── */

  init: function() {
    try {
      console.log("[ASTRA] init() START");
      window.__astraInitCalled = true;

      var existing = document.getElementById("astra-sidebar-container");
      if (existing && existing.childNodes.length > 0) {
        console.log("[ASTRA] Already initialized with content — skipping");
        return;
      }

      this.buildSidebar();
      this.buildTopBar();
      this.buildLogoCard();
      this.fixLayout();
      AstraWallpaper.init();
      console.log("[ASTRA] init() COMPLETE — all UI built successfully");
    } catch (e) {
      console.error("[ASTRA] init() CRASHED:", e.message);
      console.error("[ASTRA] Stack:", e.stack);
    }
  },

  /* ── Build Sidebar ─────────────────────────────────── */

  buildSidebar: function() {
    var self = this;
    /* Use the XUL vbox already in the DOM (injected by browser.xhtml patch),
       or create a new div as fallback if the vbox is somehow absent. */
    var sidebar = document.getElementById("astra-sidebar-container");
    if (!sidebar) {
      sidebar = document.createElement("div");
      sidebar.id = "astra-sidebar-container";
      /* Only inject when we created it ourselves */
      var browser = document.getElementById("browser");
      if (browser && browser.parentNode) {
        browser.parentNode.insertBefore(sidebar, browser);
        console.log("[ASTRA] No vbox found — created div and injected before #browser");
      } else {
        document.body.insertBefore(sidebar, document.body.firstChild);
        console.warn("[ASTRA] No vbox and no #browser — injected into body (fallback)");
      }
    } else {
      console.log("[ASTRA] Using existing XUL vbox#astra-sidebar-container");
    }

    /* ── Traffic Lights ────────────────────────── */
    var trafficHTML =
      '<div id="astra-traffic-lights">' +
        '<div class="astra-traffic-dot red"    title="Close"></div>' +
        '<div class="astra-traffic-dot yellow" title="Minimize"></div>' +
        '<div class="astra-traffic-dot green"  title="Maximize"></div>' +
      '</div>';

    /* ── New Tab Button ────────────────────────── */
    var newTabHTML =
      '<div id="astra-new-tab">' +
        '<span class="astra-new-tab-left">' +
          '<span class="astra-new-tab-plus">+</span>' +
          '<span>New Tab</span>' +
        '</span>' +
        '<span class="astra-shortcut">\u2318T</span>' +
      '</div>';

    /* ── Navigation Items ──────────────────────── */
    /* Unicode symbols — no SVG, immune to XUL sanitizer */
    var navSymbols = {
      home:   '\u2302',   /* ⌂ */
      search: '\u25CB',   /* ○ */
      ai:     '\u2736',   /* ✦ */
      tabs:   '\u229E',   /* ⊞ */
      split:  '\u229F'    /* ⊟ */
    };
    var navHTML = '<div id="astra-nav">';
    for (var i = 0; i < this.navItems.length; i++) {
      var item = this.navItems[i];
      navHTML +=
        '<div class="astra-nav-item' + (item.active ? ' active' : '') + '"' +
             ' data-nav-id="' + item.id + '">' +
          '<span class="astra-nav-icon">' + (navSymbols[item.icon] || '') + '</span>' +
          '<span class="astra-nav-label">' + item.label + '</span>' +
          (item.shortcut ? '<span class="astra-nav-shortcut">' + item.shortcut + '</span>' : '') +
        '</div>';
    }
    navHTML += '</div>';

    /* ── Pinned Sites ──────────────────────────── */
    var pinnedHTML =
      '<div>' +
        '<div class="astra-section-label">Pinned</div>' +
        '<div id="astra-pinned">';
    for (var j = 0; j < this.pinnedSites.length; j++) {
      var site = this.pinnedSites[j];
      var iconStyle = 'background:' + site.color + ';';
      if (site.border)     { iconStyle += 'border:' + site.border + ';'; }
      if (site.textColor)  { iconStyle += 'color:' + site.textColor + ';'; }
      pinnedHTML +=
        '<div class="astra-pinned-item" data-site-id="' + site.id + '">' +
          '<span class="astra-favicon" style="' + iconStyle + '">' + site.text + '</span>' +
          '<span class="astra-pinned-label">' + site.label + '</span>' +
        '</div>';
    }
    pinnedHTML += '</div></div>';

    /* ── Workspaces ────────────────────────────── */
    var wsHTML =
      '<div>' +
        '<div class="astra-section-label">' +
          'Workspaces' +
          '<span class="astra-section-add" id="astra-ws-add">+</span>' +
        '</div>' +
        '<div id="astra-workspaces-list">';
    for (var k = 0; k < this.workspaces.length; k++) {
      var ws = this.workspaces[k];
      wsHTML +=
        '<div class="astra-workspace-item" data-ws-id="' + ws.id + '">' +
          '<span class="astra-workspace-icon" style="background:' + ws.color + '"></span>' +
          '<span class="astra-workspace-name">' + ws.label + '</span>' +
          '<span class="astra-workspace-chevron">\u203A</span>' +
        '</div>';
    }
    wsHTML += '</div></div>';

    /* ── Spacer ─────────────────────────────────── */
    var spacerHTML = '<div class="astra-spacer"></div>';

    /* ── Profile ────────────────────────────────── */
    var profileHTML =
      '<div id="astra-profile">' +
        '<div class="astra-avatar">A</div>' +
        '<span class="astra-profile-name">Profile</span>' +
        '<span class="astra-profile-more">\u00B7\u00B7\u00B7</span>' +
      '</div>';

    /* ── Bottom Icons — Unicode symbols, no SVG ─── */
    var bottomHTML =
      '<div id="astra-bottom-bar">' +
        '<div class="astra-bottom-icon" id="astra-btn-settings" title="Settings">\u2699</div>' +  /* ⚙ */
        '<div class="astra-bottom-icon" id="astra-btn-shield"   title="Privacy">\u2295</div>'   +  /* ⊕ */
        '<div class="astra-bottom-icon" id="astra-btn-moon"     title="Dark Mode">\u263D</div>' +  /* ☽ */
        '<div class="astra-bottom-icon" id="astra-btn-exit"     title="Exit">\u2192</div>'      +  /* → */
      '</div>';

    /* ── HTML-namespace wrapper ────────────────────
       XUL vbox runs a strict sanitizer on innerHTML that
       strips <button>, <input>, <svg xmlns=...> and other
       HTML elements. Fix: create the wrapper in the HTML
       namespace first, set innerHTML on THAT (HTML parser,
       no XUL sanitizer), then appendChild to the vbox.    */
    var XHTML = "http://www.w3.org/1999/xhtml";
    var htmlWrapper = document.createElementNS(XHTML, "div");
    htmlWrapper.id = "astra-sidebar-inner";
    htmlWrapper.setAttribute("style",
      "width:100%;height:100%;display:flex;flex-direction:column;" +
      "overflow:hidden;overflow-y:auto;scrollbar-width:none;"
    );

    htmlWrapper.innerHTML =
      trafficHTML +
      newTabHTML  +
      navHTML     +
      pinnedHTML  +
      wsHTML      +
      spacerHTML  +
      profileHTML +
      bottomHTML;

    sidebar.appendChild(htmlWrapper);
    console.log("[ASTRA] HTML wrapper appended to vbox — children:", htmlWrapper.childNodes.length);

    /* ── Bind Events — pass htmlWrapper, not the vbox ── */
    this._bindSidebarEvents(htmlWrapper);
  },

  /* ── Build Top Bar ─────────────────────────────────── */

  buildTopBar: function() {
    if (document.getElementById("astra-topbar")) { return; }

    /* ── NUCLEAR BUILD: zero innerHTML, pure createElementNS ──
       Every element is created individually in the HTML namespace.
       The XUL sanitizer never sees an innerHTML call on this path,
       so buttons, inputs, and text content survive intact.          */
    var XHTML = "http://www.w3.org/1999/xhtml";

    /* Helper: create HTML-namespace element, set attrs, optional text */
    function xel(tag, attrs, text) {
      var e = document.createElementNS(XHTML, tag);
      if (attrs) {
        var keys = Object.keys(attrs);
        for (var ki = 0; ki < keys.length; ki++) {
          e.setAttribute(keys[ki], attrs[ki]);
        }
      }
      if (text !== undefined && text !== null) { e.textContent = text; }
      return e;
    }

    var bar = xel("div", { id: "astra-topbar" });

    /* Back / Forward / Reload — Unicode arrows, no SVG */
    var backBtn   = xel("button", { id: "astra-back",    "class": "astra-nav-btn",    title: "Back"    }, "\u2190"); /* ← */
    var fwdBtn    = xel("button", { id: "astra-forward", "class": "astra-nav-btn",    title: "Forward" }, "\u2192"); /* → */
    var reloadBtn = xel("button", { id: "astra-reload",  "class": "astra-nav-btn",    title: "Reload"  }, "\u21BA"); /* ↺ */

    /* URL bar container */
    var urlbar      = xel("div",  { id: "astra-urlbar" });
    var searchIcon  = xel("span", { "class": "astra-urlbar-icon" }, "\u25CB");  /* ○ */
    var urlInput    = xel("input", {
      id:          "astra-urlbar-input",
      type:        "text",
      placeholder: "Search Google or type a URL"
    });
    var urlHint     = xel("span", { "class": "astra-urlbar-hint" }, "\u2318L"); /* ⌘L */
    urlbar.appendChild(searchIcon);
    urlbar.appendChild(urlInput);
    urlbar.appendChild(urlHint);

    /* Right-side toolbar buttons — Unicode, no SVG */
    var bookmarkBtn = xel("button", { id: "astra-btn-bookmark", "class": "astra-toolbar-btn", title: "Bookmark"  }, "\u2605"); /* ★ */
    var downloadBtn = xel("button", { id: "astra-btn-download", "class": "astra-toolbar-btn", title: "Downloads" }, "\u2B07"); /* ⬇ */
    var sidebarBtn  = xel("button", { id: "astra-btn-sidebar",  "class": "astra-toolbar-btn", title: "Sidebar"   }, "\u229F"); /* ⊟ */

    bar.appendChild(backBtn);
    bar.appendChild(fwdBtn);
    bar.appendChild(reloadBtn);
    bar.appendChild(urlbar);
    bar.appendChild(bookmarkBtn);
    bar.appendChild(downloadBtn);
    bar.appendChild(sidebarBtn);

    console.log("[ASTRA] Top bar built via createElementNS — no innerHTML used");

    /* Inject BEFORE the tab panels, INSIDE the content column */
    var appcontent = document.getElementById("appcontent");
    if (appcontent) {
      appcontent.insertBefore(bar, appcontent.firstChild);
      console.log("[ASTRA] Top bar injected into #appcontent — OK");
    } else {
      /* Fallback: before #browser */
      var browser = document.getElementById("browser");
      if (browser) {
        browser.parentNode.insertBefore(bar, browser);
      } else {
        document.body.insertBefore(bar, document.body.firstChild);
      }
      console.warn("[ASTRA] #appcontent not found — top bar injected (fallback)");
    }

    /* Bind events directly on the already-created element references
       (no getElementById needed — vars are in scope from the build above) */
    urlInput.addEventListener("keydown", function(e) {
      AstraSidebar._urlbarKeydown(e);
    });
    backBtn.addEventListener("click",   function() { try { BrowserBack();    } catch(e) {} });
    fwdBtn.addEventListener("click",    function() { try { BrowserForward(); } catch(e) {} });
    reloadBtn.addEventListener("click", function() { try { BrowserReload();  } catch(e) {} });

    /* Keep URL bar in sync with gBrowser */
    try {
      window.addEventListener("TabSelect", function() {
        AstraSidebar._syncUrlBar();
      });
      window.addEventListener("pageshow", function() {
        AstraSidebar._syncUrlBar();
      });
    } catch (e) {}
  },

  /* ── Build Logo Card ───────────────────────────────── */

  buildLogoCard: function() {
    if (document.getElementById("astra-logo-card")) { return; }

    var XHTML = "http://www.w3.org/1999/xhtml";
    var card = document.createElementNS(XHTML, "div");
    card.id = "astra-logo-card";
    card.innerHTML = this._logoSVG;

    var appcontent = document.getElementById("appcontent");
    if (appcontent) {
      appcontent.style.position = "relative";
      appcontent.appendChild(card);
      console.log("[ASTRA] Logo card injected into #appcontent — OK");
    }
  },

  /* ── Fix Layout ────────────────────────────────────── */

  fixLayout: function() {
    /* #browser must be flex row: [sidebar][content] */
    var browser = document.getElementById("browser");
    if (browser) {
      browser.style.cssText += ";display:flex!important;flex-direction:row!important;";
    }

    var appcontent = document.getElementById("appcontent");
    if (appcontent) {
      appcontent.style.cssText += ";flex:1!important;display:flex!important;flex-direction:column!important;";
    }

    console.log("[ASTRA] Layout fixed: flex row on #browser");
  },

  /* ── Event Binding ─────────────────────────────────── */

  _bindSidebarEvents: function(sidebar) {
    var self = this;

    /* Traffic lights */
    var red    = sidebar.querySelector(".astra-traffic-dot.red");
    var yellow = sidebar.querySelector(".astra-traffic-dot.yellow");
    var green  = sidebar.querySelector(".astra-traffic-dot.green");
    if (red)    { red.addEventListener("click",    function() { try { window.close(); } catch(e) {} }); }
    if (yellow) { yellow.addEventListener("click", function() { try { window.minimize(); } catch(e) {} }); }
    if (green)  { green.addEventListener("click",  function() { try { window.fullScreen = !window.fullScreen; } catch(e) {} }); }

    /* New Tab */
    var newTab = sidebar.querySelector("#astra-new-tab");
    if (newTab) {
      newTab.addEventListener("click", function() {
        try {
          BrowserOpenTab();
        } catch(e) {
          console.error("[ASTRA] BrowserOpenTab error:", e);
        }
      });
    }

    /* Nav items */
    var navItems = sidebar.querySelectorAll(".astra-nav-item");
    for (var i = 0; i < navItems.length; i++) {
      navItems[i].addEventListener("click", (function(el) {
        return function() {
          self.navigate(el.getAttribute("data-nav-id"));
        };
      })(navItems[i]));
    }

    /* Pinned sites */
    var pinned = sidebar.querySelectorAll(".astra-pinned-item");
    for (var j = 0; j < pinned.length; j++) {
      pinned[j].addEventListener("click", (function(el) {
        return function() {
          var siteId = el.getAttribute("data-site-id");
          var found = null;
          for (var k = 0; k < self.pinnedSites.length; k++) {
            if (self.pinnedSites[k].id === siteId) { found = self.pinnedSites[k]; break; }
          }
          if (found) {
            try {
              openTrustedLinkIn(found.url, "current");
            } catch(e) {
              try { gBrowser.loadURI(found.url, { triggerPrincipal: Services.scriptSecurityManager.getSystemPrincipal() }); }
              catch(e2) { console.error("[ASTRA] Navigation error:", e2); }
            }
          }
        };
      })(pinned[j]));
    }

    /* Workspace items */
    var wsItems = sidebar.querySelectorAll(".astra-workspace-item");
    for (var m = 0; m < wsItems.length; m++) {
      wsItems[m].addEventListener("click", (function(el) {
        return function() { self.switchWorkspace(el.getAttribute("data-ws-id")); };
      })(wsItems[m]));
    }

    /* Add workspace */
    var wsAdd = sidebar.querySelector("#astra-ws-add");
    if (wsAdd) { wsAdd.addEventListener("click", function() { self.addWorkspace(); }); }

    /* Bottom icons */
    var btnSettings = document.getElementById("astra-btn-settings");
    if (btnSettings) { btnSettings.addEventListener("click", function() { try { openPreferences(); } catch(e) {} }); }

    var btnMoon = document.getElementById("astra-btn-moon");
    if (btnMoon) { btnMoon.addEventListener("click", function() { self.toggleDarkMode(); }); }

    var btnExit = document.getElementById("astra-btn-exit");
    if (btnExit) { btnExit.addEventListener("click", function() { try { goQuitApplication(); } catch(e) {} }); }
  },

  /* ── URL Bar Sync ──────────────────────────────────── */

  _syncUrlBar: function() {
    try {
      var input = document.getElementById("astra-urlbar-input");
      if (input && gBrowser && gBrowser.currentURI) {
        var uri = gBrowser.currentURI.spec;
        if (uri !== "about:blank" && uri !== "about:newtab") {
          input.value = uri;
        } else {
          input.value = "";
        }
      }
    } catch(e) {}
  },

  _urlbarKeydown: function(e) {
    if (e.key !== "Enter") { return; }
    try {
      var input = document.getElementById("astra-urlbar-input");
      if (!input || !input.value.trim()) { return; }
      var val = input.value.trim();
      /* Basic URL vs search detection */
      var url = val;
      if (!/^https?:\/\//i.test(val) && !/^about:/i.test(val)) {
        if (/^[\w-]+(\.\w+)+/i.test(val)) {
          url = "https://" + val;
        } else {
          url = "https://www.google.com/search?q=" + encodeURIComponent(val);
        }
      }
      openTrustedLinkIn(url, "current");
      input.blur();
    } catch(e) {
      console.error("[ASTRA] URL bar navigation error:", e);
    }
  },

  /* ── Actions ───────────────────────────────────────── */

  navigate: function(id) {
    var items = document.querySelectorAll(".astra-nav-item");
    for (var i = 0; i < items.length; i++) {
      items[i].classList.toggle("active", items[i].getAttribute("data-nav-id") === id);
    }
    console.log("[ASTRA] Navigate:", id);

    if (id === "ai") {
      try { if (typeof AstraAI !== "undefined") { AstraAI.toggle(); } } catch(e) {}
    }
  },

  switchWorkspace: function(id) {
    var items = document.querySelectorAll(".astra-workspace-item");
    for (var i = 0; i < items.length; i++) {
      items[i].classList.toggle("active", items[i].getAttribute("data-ws-id") === id);
    }
    console.log("[ASTRA] Workspace:", id);
  },

  addWorkspace: function() {
    try {
      var result = { value: "" };
      var ok = Services.prompt.prompt(window, "New Workspace", "Workspace name:", result, null, {});
      if (ok && result.value) {
        var colors = ["#FF9500","#007AFF","#AF52DE","#34C759","#FF3B30","#5856D6"];
        var color  = colors[this.workspaces.length % colors.length];
        this.workspaces.push({ id: "ws_" + Date.now(), label: result.value, color: color });
        this._rerenderWorkspaces();
      }
    } catch(e) { console.error("[ASTRA] addWorkspace error:", e); }
  },

  _rerenderWorkspaces: function() {
    var list = document.getElementById("astra-workspaces-list");
    if (!list) { return; }
    list.innerHTML = "";
    for (var k = 0; k < this.workspaces.length; k++) {
      var ws   = this.workspaces[k];
      var item = document.createElement("div");
      item.className = "astra-workspace-item";
      item.setAttribute("data-ws-id", ws.id);
      item.innerHTML =
        '<span class="astra-workspace-icon" style="background:' + ws.color + '"></span>' +
        '<span class="astra-workspace-name">'    + ws.label  + '</span>' +
        '<span class="astra-workspace-chevron">\u203A</span>';
      var self = this;
      item.addEventListener("click", (function(id) {
        return function() { self.switchWorkspace(id); };
      })(ws.id));
      list.appendChild(item);
    }
  },

  toggleDarkMode: function() {
    document.documentElement.classList.toggle("astra-dark");
    console.log("[ASTRA] Dark mode toggled:", document.documentElement.classList.contains("astra-dark"));
  }

};

/* ── HACK 4: Force global scope ──────────────────────── */
window.AstraSidebar = AstraSidebar;

/* ═══════════════════════════════════════════════════════
   AstraWallpaper — Premium wallpaper engine
   Features: time-aware, A/B crossfade, parallax, ambient glow
   ═══════════════════════════════════════════════════════ */

var AstraWallpaper = {

  /* ── Config ──────────────────────────────────────────── */
  FADE_MS:        400,
  ROTATE_MS:      45000,
  _rotateTimer:   null,
  _currentIndex:  0,
  _wallpapers:    [],
  _activeLayer:   "a",

  /* ── Time-aware wallpaper sets ───────────────────────── */
  _timeWallpapers: {
    morning:   ["chrome://browser/skin/astra/wallpaper.jpg"],
    afternoon: ["chrome://browser/skin/astra/wallpaper.jpg"],
    evening:   ["chrome://browser/skin/astra/wallpaper.jpg"],
    night:     ["chrome://browser/skin/astra/wallpaper.jpg"]
  },

  /* ── Time period ─────────────────────────────────────── */
  _getTimePeriod: function() {
    var h = new Date().getHours();
    if (h >= 5  && h < 12) { return "morning";   }
    if (h >= 12 && h < 17) { return "afternoon"; }
    if (h >= 17 && h < 21) { return "evening";   }
    return "night";
  },

  /* ── Time tint ───────────────────────────────────────── */
  _getTimeTint: function() {
    var period = this._getTimePeriod();
    var tints = {
      morning:   "rgba(255,200,100,0.08)",
      afternoon: "rgba(255,255,255,0.04)",
      evening:   "rgba(255,120,60,0.10)",
      night:     "rgba(20,20,60,0.25)"
    };
    return tints[period];
  },

  /* ── Build A/B wallpaper layers for crossfade ────────── */
  _buildWallpaperLayers: function(mainWin) {
    var XHTML = "http://www.w3.org/1999/xhtml";
    var layerStyle =
      "position:fixed !important;" +
      "inset:0 !important;" +
      "z-index:0 !important;" +
      "background-size:cover !important;" +
      "background-position:center !important;" +
      "background-repeat:no-repeat !important;" +
      "background-attachment:fixed !important;" +
      "transition:opacity 0.5s ease !important;" +
      "pointer-events:none !important;" +
      "transform:translateZ(0) !important;" +
      "backface-visibility:hidden !important;" +
      "will-change:opacity !important;";

    if (!document.getElementById("astra-wp-a")) {
      var layerA = document.createElementNS(XHTML, "div");
      layerA.id = "astra-wp-a";
      layerA.setAttribute("style", layerStyle + "opacity:1 !important;");
      mainWin.insertBefore(layerA, mainWin.firstChild);
    }
    if (!document.getElementById("astra-wp-b")) {
      var layerB = document.createElementNS(XHTML, "div");
      layerB.id = "astra-wp-b";
      layerB.setAttribute("style", layerStyle + "opacity:0 !important;");
      mainWin.insertBefore(layerB, mainWin.firstChild);
    }
    this._activeLayer = "a";
    console.log("[ASTRA-WP] A/B crossfade layers built");
  },

  /* ── Apply wallpaper via A/B crossfade — zero flicker ── */
  _applyWallpaper: function(url, mainWin) {
    var self = this;
    var XHTML = "http://www.w3.org/1999/xhtml";
    var img   = document.createElementNS(XHTML, "img");

    img.addEventListener("load", function() {
      var nextLayer = self._activeLayer === "a" ? "b" : "a";
      var activeEl  = document.getElementById("astra-wp-" + self._activeLayer);
      var nextEl    = document.getElementById("astra-wp-" + nextLayer);

      if (!activeEl || !nextEl) {
        /* Fallback if layers not ready */
        if (mainWin) { mainWin.style.backgroundImage = "url('" + url + "')"; }
        return;
      }

      nextEl.style.backgroundImage = "url('" + url + "')";
      nextEl.style.opacity   = "1";
      activeEl.style.opacity = "0";
      self._activeLayer = nextLayer;

      self._extractColor(url);

      /* Update time tint */
      var tintEl = document.getElementById("astra-time-overlay");
      if (tintEl) { tintEl.style.background = self._getTimeTint(); }

      console.log("[ASTRA-WP] Crossfade complete →",
        url.split("/").pop(), "| Active layer:", nextLayer
      );
    });

    img.addEventListener("error", function() {
      console.warn("[ASTRA-WP] Load failed:", url);
      var fallback = "chrome://browser/skin/astra/wallpaper.jpg";
      if (url !== fallback) { self._applyWallpaper(fallback, mainWin); }
    });

    img.src = url;
  },

  /* ── Build overlay layers ────────────────────────────── */
  _buildOverlays: function(mainWin) {
    var XHTML = "http://www.w3.org/1999/xhtml";

    /* Time-aware tint */
    if (!document.getElementById("astra-time-overlay")) {
      var tint = document.createElementNS(XHTML, "div");
      tint.id = "astra-time-overlay";
      tint.setAttribute("style",
        "position:fixed;inset:0;pointer-events:none;z-index:1;" +
        "background:" + this._getTimeTint() + ";" +
        "transition:background 2s ease;"
      );
      mainWin.appendChild(tint);
    }

    /* Dark contrast layer */
    if (!document.getElementById("astra-dark-overlay")) {
      var dark = document.createElementNS(XHTML, "div");
      dark.id = "astra-dark-overlay";
      dark.setAttribute("style",
        "position:fixed;inset:0;pointer-events:none;z-index:2;" +
        "background:rgba(0,0,0,0.18);" +
        "will-change:opacity;"
      );
      mainWin.appendChild(dark);
    }

    /* Ambient glow — accent color from wallpaper, radiates from bottom */
    if (!document.getElementById("astra-ambient-overlay")) {
      var ambient = document.createElementNS(XHTML, "div");
      ambient.id = "astra-ambient-overlay";
      ambient.setAttribute("style",
        "position:fixed !important;" +
        "inset:0 !important;" +
        "pointer-events:none !important;" +
        "z-index:3 !important;" +
        "background:radial-gradient(" +
          "ellipse at 60% 100%," +
          "rgba(255,107,53,0.22) 0%," +
          "rgba(200,80,20,0.08) 40%," +
          "transparent 70%" +
        ") !important;" +
        "opacity:1 !important;" +
        "transition:background 2s ease !important;" +
        "will-change:opacity !important;" +
        "transform:translateZ(0) !important;"
      );
      mainWin.appendChild(ambient);
    }

    console.log("[ASTRA-WP] Overlays built");
    console.log("[ASTRA-WP] Ambient glow overlay built");
  },

  /* ── Extract dominant color via canvas ───────────────── */
  _extractColor: function(url) {
    try {
      var XHTML  = "http://www.w3.org/1999/xhtml";
      var canvas = document.createElementNS(XHTML, "canvas");
      var ctx    = canvas.getContext("2d");
      if (!ctx) { return; }
      canvas.width = 10; canvas.height = 10;
      var img = document.createElementNS(XHTML, "img");
      img.crossOrigin = "anonymous";
      img.addEventListener("load", function() {
        try {
          ctx.drawImage(img, 0, 0, 10, 10);
          var d = ctx.getImageData(0, 0, 10, 10).data;
          var r = 0, g = 0, b = 0, count = 0;
          for (var i = 0; i < d.length; i += 4) {
            r += d[i]; g += d[i+1]; b += d[i+2]; count++;
          }
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          document.documentElement.style.setProperty(
            "--astra-accent-color", "rgb(" + r + "," + g + "," + b + ")"
          );
          console.log("[ASTRA-WP] Accent color extracted: rgb(" + r + "," + g + "," + b + ")");

          /* Update ambient glow to match wallpaper accent */
          var ambientEl = document.getElementById("astra-ambient-overlay");
          if (ambientEl) {
            ambientEl.style.background =
              "radial-gradient(" +
              "ellipse at 60% 100%," +
              "rgba(" + r + "," + g + "," + b + ",0.22) 0%," +
              "rgba(" + r + "," + g + "," + b + ",0.08) 40%," +
              "transparent 70%" +
              ")";
            console.log("[ASTRA-WP] Ambient glow updated → rgb(" + r + "," + g + "," + b + ")");
          }
        } catch(e) {}
      });
      img.src = url;
    } catch(e) {}
  },

  /* ── Start wallpaper rotation ────────────────────────── */
  _startRotation: function(wallpapers, mainWin) {
    var self = this;
    this._wallpapers    = wallpapers;
    this._currentIndex  = 0;
    if (this._rotateTimer) { clearInterval(this._rotateTimer); }
    this._rotateTimer = setInterval(function() {
      self._currentIndex = (self._currentIndex + 1) % self._wallpapers.length;
      self._applyWallpaper(self._wallpapers[self._currentIndex], mainWin);
    }, this.ROTATE_MS);
    console.log("[ASTRA-WP] Rotation started —",
      wallpapers.length, "wallpapers,", this.ROTATE_MS / 1000, "sec interval"
    );
  },

  /* ── MAIN INIT ───────────────────────────────────────── */
  init: function() {
    try {
      var mainWin = document.getElementById("main-window");
      if (!mainWin) {
        console.warn("[ASTRA-WP] #main-window not found");
        return;
      }

      /* FEATURE 2: Build A/B crossfade layers first */
      this._buildWallpaperLayers(mainWin);

      /* Build overlay layers (tint + dark + ambient) */
      this._buildOverlays(mainWin);

      /* FEATURE 1: Parallax depth effect */
      var _wpParallaxActive = true;
      window.addEventListener("mousemove", function(e) {
        if (!_wpParallaxActive) { return; }
        try {
          var x  = (e.clientX / window.innerWidth  - 0.5) * 8;
          var y  = (e.clientY / window.innerHeight - 0.5) * 8;
          var mw = document.getElementById("main-window");
          if (mw) {
            mw.style.backgroundPosition = (50 + x) + "% " + (50 + y) + "%";
          }
        } catch(err) {}
      });
      console.log("[ASTRA-WP] Parallax enabled — depth effect active");

      /* Resolve wallpaper: custom pref → time-aware → bundled */
      var customWp = "";
      try {
        customWp = Services.prefs.getStringPref("astra.wallpaper.path", "");
      } catch(e) {}

      if (customWp) {
        var ext     = customWp.split(".").pop().toLowerCase();
        var allowed = ["jpg", "jpeg", "png", "webp", "avif"];
        var valid   = false;
        for (var i = 0; i < allowed.length; i++) {
          if (ext === allowed[i]) { valid = true; break; }
        }
        if (!valid) {
          console.warn("[ASTRA-WP] Invalid extension:", ext);
          customWp = "";
        }
      }

      var period  = this._getTimePeriod();
      var timeSet = this._timeWallpapers[period];
      var finalWp = customWp || timeSet[0];
      console.log("[ASTRA-WP] Init | Period:", period, "| Wallpaper:", finalWp);

      this._applyWallpaper(finalWp, mainWin);
      this._extractColor(finalWp);

      if (timeSet.length > 1 && !customWp) {
        this._startRotation(timeSet, mainWin);
      }

      /* Re-check time period every 30 min */
      var self = this;
      setInterval(function() {
        var newPeriod = self._getTimePeriod();
        if (newPeriod !== period) {
          period = newPeriod;
          var newSet = self._timeWallpapers[period];
          self._applyWallpaper(newSet[0], mainWin);
          console.log("[ASTRA-WP] Time period changed →", period);
        }
      }, 30 * 60 * 1000);

    } catch(e) {
      console.error("[ASTRA-WP] Init error:", e);
    }
  }
};

window.AstraWallpaper = AstraWallpaper;

/* ── HACK 3: Multiple init strategies ───────────────── */

/* Strategy A — preferred: fires after gBrowser is ready */
window.addEventListener("browser-delayed-startup-finished", function() {
  console.log("[ASTRA] browser-delayed-startup-finished FIRED");
  AstraSidebar.init();
}, { once: true });

/* Strategy B — 3-second safety net */
setTimeout(function() {
  if (!window.__astraInitCalled) {
    console.warn("[ASTRA] FALLBACK INIT after 3s (event never fired)");
    try { AstraSidebar.init(); } catch(e) { console.error("[ASTRA] Fallback init error:", e); }
  }
}, 3000);

console.log("[ASTRA] astra-sidebar.js fully parsed — waiting for startup event...");
