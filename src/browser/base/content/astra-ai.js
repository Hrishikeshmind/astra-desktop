/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

/**
 * AstraAI — Browser-integrated AI assistant for Astra Browser.
 *
 * Connects to a configured AI provider (Ollama local or cloud API)
 * and provides in-browser chat assistance, page summarization,
 * and translation support (with focus on Indian languages).
 */
var AstraAI = {
  _open: false,
  _messages: [],
  _provider: null,

  get panel() {
    return document.getElementById("astra-ai-panel");
  },

  get messagesEl() {
    return document.getElementById("astra-ai-messages");
  },

  get inputEl() {
    return document.getElementById("astra-ai-input");
  },

  init() {
    this._loadProvider();
    this._bindEvents();
  },

  _loadProvider() {
    try {
      const providerPref = Services.prefs.getStringPref("astra.ai.provider", "ollama");
      const endpoint = Services.prefs.getStringPref(
        "astra.ai.endpoint",
        "http://localhost:11434"
      );
      const model = Services.prefs.getStringPref("astra.ai.model", "llama3");
      this._provider = { type: providerPref, endpoint, model };
    } catch (_) {
      this._provider = { type: "ollama", endpoint: "http://localhost:11434", model: "llama3" };
    }
  },

  toggle() {
    this._open = !this._open;
    this.panel?.classList.toggle("open", this._open);
    if (this._open) {
      this.inputEl?.focus();
    }
  },

  open() {
    this._open = true;
    this.panel?.classList.add("open");
    this.inputEl?.focus();
  },

  close() {
    this._open = false;
    this.panel?.classList.remove("open");
  },

  _bindEvents() {
    const sendBtn = document.getElementById("astra-ai-send-btn");
    if (sendBtn) {
      sendBtn.addEventListener("click", () => this._handleSend());
    }

    const input = this.inputEl;
    if (input) {
      input.addEventListener("keydown", e => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this._handleSend();
        }
      });
    }

    const closeBtn = document.getElementById("astra-ai-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }

    // Keyboard shortcut: Ctrl+Shift+A to toggle AI panel
    window.addEventListener("keydown", e => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        this.toggle();
      }
    });
  },

  async _handleSend() {
    const input = this.inputEl;
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = "";

    this._addMessage("user", text);
    this._messages.push({ role: "user", content: text });

    const thinkingEl = this._addMessage("assistant", "…");

    try {
      const reply = await this._callProvider(this._messages);
      thinkingEl.textContent = reply;
      this._messages.push({ role: "assistant", content: reply });
    } catch (err) {
      thinkingEl.textContent = `Error: ${err.message}`;
      thinkingEl.style.color = "#ff6b6b";
    }
  },

  _addMessage(role, content) {
    const el = document.createElement("div");
    el.className = `astra-ai-message ${role}`;
    el.textContent = content;
    this.messagesEl?.appendChild(el);
    this.messagesEl?.scrollTo({ top: this.messagesEl.scrollHeight, behavior: "smooth" });
    return el;
  },

  /**
   * Calls the configured AI provider.
   * Supports Ollama (local) and OpenAI-compatible endpoints.
   */
  async _callProvider(messages) {
    const { type, endpoint, model } = this._provider;

    if (type === "ollama") {
      return this._callOllama(endpoint, model, messages);
    }

    // Fallback: OpenAI-compatible
    return this._callOpenAICompat(endpoint, model, messages);
  },

  async _callOllama(endpoint, model, messages) {
    const url = `${endpoint}/api/chat`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages, stream: false }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data?.message?.content ?? "(No response)";
  },

  async _callOpenAICompat(endpoint, model, messages) {
    const apiKey = Services.prefs.getStringPref("astra.ai.apiKey", "");
    const url = `${endpoint}/v1/chat/completions`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({ model, messages }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content ?? "(No response)";
  },

  /**
   * Summarize the current page content.
   */
  async summarizePage() {
    this.open();
    const url = gBrowser.selectedBrowser?.currentURI?.spec;
    const title = gBrowser.selectedBrowser?.contentTitle;

    const prompt = `Summarize this web page in 3-4 concise bullet points.\nPage: ${title}\nURL: ${url}`;
    this.inputEl && (this.inputEl.value = prompt);
    await this._handleSend();
  },

  /**
   * Translate selected text on the page.
   * @param {string} text - Text to translate
   * @param {string} targetLang - Target language (default: Hindi)
   */
  async translateText(text, targetLang = "Hindi") {
    this.open();
    const prompt = `Translate the following text to ${targetLang}:\n\n${text}`;
    this._addMessage("user", prompt);
    this._messages.push({ role: "user", content: prompt });

    const thinkingEl = this._addMessage("assistant", "Translating…");
    try {
      const reply = await this._callProvider(this._messages);
      thinkingEl.textContent = reply;
      this._messages.push({ role: "assistant", content: reply });
    } catch (err) {
      thinkingEl.textContent = `Translation error: ${err.message}`;
    }
  },
};
