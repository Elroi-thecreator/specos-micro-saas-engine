# Kiro Steering: Internationalization (i18n) & Localized Prompting

All Kiro agents generating UI or agent logic MUST adhere to:

1. **Zero Hardcoded Text**:
   * All user-facing strings MUST be localized using `next-intl` keys (`t('key')`).
   * Never insert raw English strings into JSX or user alerts.

2. **Supported Locales**:
   * English (`en`) - Default fallback.
   * Spanish (`es`)
   * French (`fr`)
   * German (`de`)
   * Japanese (`ja`)
   * Hindi (`hi`)
   * Arabic (`ar`) - Requires `dir="rtl"` layout handling.

3. **Autonomous Agent Localization**:
   * When invoking LLM completion pipelines, always extract the active tenant/user locale and append the localized directive to the system prompt.
   * The output summaries, risk analyses, and generated responses MUST match the user's active locale.
