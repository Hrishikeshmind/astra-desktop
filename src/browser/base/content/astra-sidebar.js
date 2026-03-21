/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

/**
 * AstraSidebar — Manages the sidebar tab list, workspaces,
 * and pinned sites for Astra Browser.
 */
var AstraSidebar = {
  _collapsed: false,

  get panel() {
    return document.getElementById("astra-sidebar");
  },

  get tabList() {
    return document.getElementById("astra-tab-list");
  },

  init() {
    this._restoreCollapseState();
    this._bindEvents();
    AstraWorkspaces.init();
    AstraPinnedSites.init();
  },

  toggle() {
    this._collapsed = !this._collapsed;
    this.panel.classList.toggle("collapsed", this._collapsed);
    Services.prefs.setBoolPref("astra.sidebar.collapsed", this._collapsed);
  },

  _restoreCollapseState() {
    try {
      this._collapsed = Services.prefs.getBoolPref("astra.sidebar.collapsed", false);
      this.panel.classList.toggle("collapsed", this._collapsed);
    } catch (_) {}
  },

  _bindEvents() {
    const toggleBtn = document.getElementById("astra-sidebar-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => this.toggle());
    }
  },

  /**
   * Renders a tab entry into the sidebar tab list.
   * @param {MozTabbrowserTab} tab
   */
  addTab(tab) {
    const item = document.createXULElement("toolbarbutton");
    item.className = "astra-tab-item";
    item.dataset.tabId = tab._tPos;

    const favicon = document.createElement("img");
    favicon.className = "tab-favicon";
    favicon.src = "chrome://global/skin/icons/defaultFavicon.svg";

    const title = document.createElement("span");
    title.className = "tab-title";
    title.textContent = tab.label || "New Tab";

    item.appendChild(favicon);
    item.appendChild(title);

    item.addEventListener("click", () => {
      gBrowser.selectedTab = tab;
    });

    this.tabList?.appendChild(item);
    return item;
  },

  removeTab(tab) {
    const item = this.tabList?.querySelector(`[data-tab-id="${tab._tPos}"]`);
    item?.remove();
  },

  setActiveTab(tab) {
    this.tabList?.querySelectorAll(".astra-tab-item").forEach(el => {
      el.classList.toggle("active", el.dataset.tabId == tab._tPos);
    });
  },
};

/**
 * AstraWorkspaces — Tab grouping/workspace management.
 */
var AstraWorkspaces = {
  _workspaces: [],
  _activeId: null,

  get container() {
    return document.getElementById("astra-workspaces");
  },

  init() {
    this._load();
    this._render();
  },

  _load() {
    try {
      const raw = Services.prefs.getStringPref("astra.workspaces.data", "[]");
      this._workspaces = JSON.parse(raw);
    } catch (_) {
      this._workspaces = [{ id: "default", name: "Work", icon: "💼" }];
    }
    if (!this._workspaces.length) {
      this._workspaces = [{ id: "default", name: "Work", icon: "💼" }];
    }
    this._activeId = this._workspaces[0].id;
  },

  _save() {
    Services.prefs.setStringPref(
      "astra.workspaces.data",
      JSON.stringify(this._workspaces)
    );
  },

  _render() {
    const container = this.container;
    if (!container) return;
    container.innerHTML = "";
    for (const ws of this._workspaces) {
      container.appendChild(this._buildItem(ws));
    }
  },

  _buildItem(ws) {
    const item = document.createElement("div");
    item.className = "astra-workspace-item";
    if (ws.id === this._activeId) item.classList.add("active");

    const icon = document.createElement("span");
    icon.className = "astra-workspace-icon";
    icon.textContent = ws.icon || "🗂";

    const label = document.createElement("span");
    label.className = "tab-title";
    label.textContent = ws.name;

    item.appendChild(icon);
    item.appendChild(label);
    item.addEventListener("click", () => this.switchTo(ws.id));
    return item;
  },

  switchTo(id) {
    this._activeId = id;
    this._render();
    // TODO: filter visible tabs by workspace assignment
  },

  create(name, icon = "🗂") {
    const ws = { id: `ws_${Date.now()}`, name, icon };
    this._workspaces.push(ws);
    this._save();
    this._render();
    this.switchTo(ws.id);
  },
};

/**
 * AstraPinnedSites — Speed dial / pinned site management.
 */
var AstraPinnedSites = {
  _sites: [],

  get container() {
    return document.getElementById("astra-pinned-sites");
  },

  init() {
    this._load();
    this._render();
  },

  _load() {
    try {
      const raw = Services.prefs.getStringPref("astra.pinnedSites.data", "[]");
      this._sites = JSON.parse(raw);
    } catch (_) {
      this._sites = this._defaultSites();
    }
    if (!this._sites.length) {
      this._sites = this._defaultSites();
    }
  },

  _defaultSites() {
    return [
      { id: "1", url: "https://www.google.co.in", label: "Google", icon: "" },
      { id: "2", url: "https://www.youtube.com", label: "YouTube", icon: "" },
      { id: "3", url: "https://www.flipkart.com", label: "Flipkart", icon: "" },
      { id: "4", url: "https://www.amazon.in", label: "Amazon", icon: "" },
      { id: "5", url: "https://mail.google.com", label: "Gmail", icon: "" },
      { id: "6", url: "https://www.irctc.co.in", label: "IRCTC", icon: "" },
      { id: "7", url: "https://www.zerodha.com", label: "Zerodha", icon: "" },
      { id: "8", url: "https://twitter.com", label: "Twitter/X", icon: "" },
    ];
  },

  _save() {
    Services.prefs.setStringPref(
      "astra.pinnedSites.data",
      JSON.stringify(this._sites)
    );
  },

  _render() {
    const container = this.container;
    if (!container) return;
    container.innerHTML = "";
    for (const site of this._sites) {
      container.appendChild(this._buildItem(site));
    }
  },

  _buildItem(site) {
    const item = document.createElement("div");
    item.className = "astra-pinned-site";

    const icon = document.createElement("img");
    icon.className = "site-icon";
    icon.src = site.icon || `https://www.google.com/s2/favicons?domain=${new URL(site.url).hostname}&sz=64`;
    icon.onerror = () => { icon.src = "chrome://global/skin/icons/defaultFavicon.svg"; };

    const label = document.createElement("span");
    label.className = "site-label";
    label.textContent = site.label;

    item.appendChild(icon);
    item.appendChild(label);
    item.addEventListener("click", () => {
      openTrustedLinkIn(site.url, "current");
    });

    return item;
  },

  add(url, label) {
    const site = { id: `site_${Date.now()}`, url, label, icon: "" };
    this._sites.push(site);
    this._save();
    this._render();
  },

  remove(id) {
    this._sites = this._sites.filter(s => s.id !== id);
    this._save();
    this._render();
  },
};
