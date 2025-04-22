# GutenGRID – Gutenberg Responsive Interface Designer

**GutenGRID** is a Gutenberg block that gives you full control over layout structure through a CSS Breakout Grid system.

This plugin allows you to visually structure your content using a 12-column grid with variable outer columns (breakout zones). It’s designed to give developers and content creators the flexibility to align content precisely — and break out of the container when needed for full-width impact.

---

## 🚧 Project status

> ⚠️ **This plugin is currently in development and not production-ready.**  
> It **requires** the `bo-grid` CSS classes to be present in the active theme. These classes are not yet bundled or injected by the plugin itself.

---

## 🔧 Based on

This plugin is heavily inspired by:

- [Block Experiments by Automattic](https://github.com/automattic/block-experiments)
- Xmedia’s custom **Breakout Grid** layout system

---

## 💡 How it works

- GutenGRID renders a container block using the Breakout Grid layout strategy.
- The system assumes a 12-column grid in the center with variable-width outer columns on both sides.
- Blocks placed inside GutenGRID can optionally “break out” to the left or right.
- For now, the layout assumes external CSS support (`bo-grid`) provided by your theme.

---

## ✅ Features (planned)

✅ Responsive layout based on CSS Grid
✅ Grid snapping with draggable handles
✅ Optional full-width breakout per block
TODO: Theme-agnostic support via CSS class integration

---

## 📋 TODO

- [ ] Incoorporate `bo-grid` classes into plugin or provide fallback styles  

---

## 🛠 Maintained by

Built and maintained by [Xmedia](https://xmedia.nl), a WordPress development agency.

---

## 📄 License

MIT
