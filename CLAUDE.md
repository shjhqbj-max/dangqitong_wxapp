# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**档期通 (dqitong)** — a WeChat Mini Program for wedding industry professionals (photographers, makeup artists, hosts, planners) to manage schedules and bookings. Currently in UI prototype stage with mock data only.

## Tech Stack

- **TypeScript + SCSS** compiled by WeChat DevTools (`useCompilerPlugins: ["typescript", "sass"]`)
- **Skyline renderer** with `glass-easel` component framework
- **No npm scripts, no CLI build pipeline** — all build/run happens in WeChat DevTools
- Dev dependency: `miniprogram-api-typings` for WeChat API type definitions

## Architecture

Standard WeChat Mini Program MPA pattern. Each page/component has 4 files: `.ts` (logic), `.wxml` (template), `.scss` (styles), `.json` (config).

- `miniprogram/` — source root (set via `miniprogramRoot` in `project.config.json`)
- `miniprogram/app.ts` / `app.json` / `app.scss` — app entry, config, global styles
- `miniprogram/pages/` — page directories
- `miniprogram/components/` — reusable components
- `miniprogram/utils/` — utility modules
- `typings/` — WeChat Mini Program TypeScript type definitions (do not modify)

`navigationStyle` is set to `"custom"` in `app.json` — all pages use the custom `navigation-bar` component instead of the native nav bar.

## Conventions

- **CSS**: BEM naming (`block__element--modifier`)
- **Variables**: camelCase
- **Files**: lowercase with hyphens
- **CSS variables**: use for all colors and dimensions (see 配色规范.md for the full palette)

## Color System (配色规范.md)

Primary brand color is rose gold. Use CSS variables; do not hardcode hex values in components.

| Token | Value | Usage |
|-------|-------|-------|
| Brand | `#C4756B` | Primary buttons, highlights |
| Brand Light | `#E8ADA6` | Hover, borders |
| Brand Dark | `#A85A51` | Gradients, active states |
| Accent | `#D4A853` | Champagne gold highlights |
| Success | `#6B9E7A` | Confirmed/settled status |
| Warning | `#D4A853` | Pending status |
| Error | `#C75B5B` | Sunday, unsettled |
| Info | `#7A8FB0` | Saturday, hints |
| Page bg | `#FAF7F2` | Warm ivory page background |

## Key Specs

- `开发主旨.md` — product spec: features, user flows, data architecture
- `配色规范.md` — full color design system with gradients, shadows, label colors

## Planned Feature Modules

1. **档期管理** (Schedule) — calendar view, booking status (已定/预定/休息)
2. **抢单大厅** (Order Lobby) — available orders to bid on
3. **团队管理** (Team) — shared team schedules
4. **个人中心** (Profile) — stats, settings
