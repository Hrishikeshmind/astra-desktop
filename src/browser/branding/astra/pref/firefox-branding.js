/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// =============================================================================
// Astra Browser — branding preferences
// Loaded at startup via the branding JS_PREFERENCE_FILES mechanism.
// =============================================================================

// --- Welcome & override pages ------------------------------------------------
pref("startup.homepage_welcome_url",            "https://astrabrowser.in/welcome");
pref("startup.homepage_welcome_url.additional", "");
pref("startup.homepage_override_url",           "https://astrabrowser.in/whatsnew/%VERSION%/%BUILD_ID%/");

// --- Update URLs -------------------------------------------------------------
// Users can browse here if automatic updates fail
pref("app.update.url.manual",   "https://astrabrowser.in/download");
// "More information about this update" link in the update wizard
pref("app.update.url.details",  "https://astrabrowser.in/releases");

// --- Update timing -----------------------------------------------------------
// Check interval: 24 hours
pref("app.update.interval",         86400);
// How long to wait before showing the update prompt UI (24 hours)
pref("app.update.promptWaitTime",   86400);
// Days before treating a binary as "old" and forcing an update check
pref("app.update.checkInstallTime.days", 2);
// Delay before showing the hamburger-menu badge (0 = immediately after restart)
pref("app.update.badgeWaitTime",    0);

// --- Privacy & telemetry -----------------------------------------------------
// Disable Mozilla data reporting
pref("datareporting.policy.dataSubmissionEnabled",     false);
pref("datareporting.healthreport.uploadEnabled",       false);
pref("toolkit.telemetry.unified",                      false);
pref("toolkit.telemetry.enabled",                      false);
pref("toolkit.telemetry.server",                       "data:,");
pref("toolkit.telemetry.archive.enabled",              false);
pref("toolkit.telemetry.newProfilePing.enabled",       false);
pref("toolkit.telemetry.shutdownPingSender.enabled",   false);
pref("toolkit.telemetry.updatePing.enabled",           false);
pref("toolkit.telemetry.bhrPing.enabled",              false);
pref("toolkit.telemetry.firstShutdownPing.enabled",    false);
pref("toolkit.telemetry.hybridContent.enabled",        false);

// Disable crash reporting submission
pref("browser.crashReports.unsubmittedCheck.autoSubmit2", false);
pref("browser.crashReports.unsubmittedCheck.enabled",     false);

// Disable Normandy / Shield studies
pref("app.normandy.enabled",               false);
pref("app.normandy.api_url",               "");
pref("app.shield.optoutstudies.enabled",   false);

// Disable sponsored content and suggestions
pref("browser.newtabpage.activity-stream.showSponsoredTopSites", false);
pref("browser.newtabpage.activity-stream.feeds.topsites",        true);
pref("browser.urlbar.suggest.quicksuggest.sponsored",            false);
pref("browser.urlbar.suggest.quicksuggest.nonsponsored",         false);

// --- Distribution identity ---------------------------------------------------
pref("distribution.id",      "in.astrabrowser");
pref("distribution.version", "1.0");
pref("distribution.about",   "Astra Browser — Built for India");

// --- Developer tools ---------------------------------------------------------
// Allow pasting in devtools console without warning
pref("devtools.selfxss.count", 5);
