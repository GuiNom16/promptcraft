<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-layout style="background-color: #0d0d0d; min-height: 100vh">
      <!-- Header -->
      <n-layout-header
        bordered
        style="
          background-color: #000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          height: 72px;
          border-bottom: 1px solid #1f1f1f;
        "
      >
        <!-- Left: Logo + Name -->
        <div style="display: flex; align-items: center; gap: 1rem">
          <img
            src="./assets/logo.svg"
            alt="PromptCraft Logo"
            style="height: 56px"
          />
          <span
            style="
              color: #a0ce6d;
              font-size: 2rem;
              font-weight: 700;
              font-family: 'Orbitron', sans-serif;
            "
          >
            PromptCraft
          </span>
        </div>

        <!-- Right: Info button with icon -->
        <n-popover trigger="click" placement="bottom-end">
          <template #trigger>
            <n-button
              quaternary
              style="
                color: #9cff24;
                font-size: 1.5rem;
                line-height: 1;
                padding: 0 0.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
              "
              circle
              size="medium"
            >
              ℹ️
            </n-button>
          </template>
          <div style="max-width: 240px; font-size: 14px">
            <strong>What is PromptCraft?</strong>
            <br />
            A simple, powerful tool for crafting structured, reusable AI
            prompts. Build sections, test them with variables, and export in
            seconds.
          </div>
        </n-popover>
      </n-layout-header>

      <!-- Main Content -->
      <n-layout-content style="padding: 2rem 1rem; background-color: #0d0d0d">
        <div class="w-full max-w-4xl mx-auto">
          <n-message-provider>
            <router-view />
          </n-message-provider>
        </div>
      </n-layout-content>

      <!-- Footer -->
      <n-layout-footer
        style="
          text-align: center;
          padding: 1rem;
          font-size: 0.9rem;
          color: #666;
          border-top: 1px solid #1f1f1f;
          background-color: #0d0d0d;
        "
      >
        © 2025 Jeremie Nombro — PromptCraft
      </n-layout-footer>
    </n-layout>
  </n-config-provider>
</template>

<script setup lang="ts">
const themeOverrides = {
  common: {
    primaryColor: "#A0CE6D",
    primaryColorHover: "#baff52",
    primaryColorPressed: "#86cc1f",
    primaryColorSuppl: "#9cff24",
    baseColor: "#0d0d0d",
    bodyColor: "#0d0d0d",
    cardColor: "#1a1a1a",
    inputColor: "#1a1a1a",
    textColorBase: "#ffffff",
    textColor1: "#ffffff",
    textColor2: "#cccccc",
    textColor3: "#888888",
    scrollbarColor: "#333333",
  },
  Input: {
    textColor: "#ffffff",
    color: "#1a1a1a",
    placeholderColor: "#888888",
    caretColor: "#9cff24",
  },
  InputGroup: {
    textColor: "#ffffff",
  },
  Textarea: {
    textColor: "#ffffff",
    color: "#1a1a1a",
    placeholderColor: "#888888",
    caretColor: "#9cff24",
  },
  Button: {
    textColor: "#ffffff",
    textColorHover: "#baff52",
    textColorPressed: "#86cc1f",
  },
};
</script>

<style>
body {
  background-color: #0d0d0d;
  margin: 0;
  padding: 0;
  font-family: "Inter", sans-serif;
  color: white;
}

* {
  box-sizing: border-box;
}

.n-button {
  color: white !important;
}
</style>
