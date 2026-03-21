// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

// =============================================================================
// Astra Browser — Default Preferences
// =============================================================================

// --- Branding ---
pref("app.update.url.details", "https://astrabrowser.in/releases");
pref("startup.homepage_welcome_url", "https://astrabrowser.in/welcome");
pref("startup.homepage_override_url", "https://astrabrowser.in/welcome");

// --- New Tab ---
pref("browser.newtabpage.enabled", true);
pref("browser.startup.page", 1);
pref("browser.startup.homepage", "astra://newtab");

// --- Astra Sidebar ---
pref("astra.sidebar.enabled", true);
pref("astra.sidebar.collapsed", false);

// --- Astra Workspaces ---
pref("astra.workspaces.enabled", true);
pref("astra.workspaces.data", "[]");

// --- Astra Pinned Sites ---
pref("astra.pinnedSites.data", "[]");

// --- Astra AI Assistant ---
pref("astra.ai.enabled", true);
pref("astra.ai.provider", "ollama");
pref("astra.ai.endpoint", "http://localhost:11434");
pref("astra.ai.model", "llama3");
pref("astra.ai.apiKey", "");

// --- Privacy defaults (stronger than Firefox defaults) ---
pref("privacy.trackingprotection.enabled", true);
pref("privacy.trackingprotection.socialtracking.enabled", true);
pref("privacy.fingerprintingProtection", true);
pref("network.cookie.cookieBehavior", 1);         // Block third-party cookies
pref("dom.security.https_only_mode", true);
pref("browser.send_pings", false);
pref("browser.urlbar.speculativeConnect.enabled", false);
pref("network.prefetch-next", false);
pref("network.dns.disablePrefetch", true);

// --- Performance ---
pref("gfx.webrender.all", true);
pref("layers.acceleration.force-enabled", true);

// --- Locale defaults for India ---
pref("intl.accept_languages", "en-IN, en, hi");
pref("intl.locale.requested", "en-IN");

// --- UI ---
pref("browser.tabs.drawInTitlebar", true);
pref("browser.compactmode.show", true);
pref("browser.uidensity", 0);
pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);
