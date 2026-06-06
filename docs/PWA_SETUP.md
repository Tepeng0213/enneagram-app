# PWA 配置与测试指南

> 本项目为 **Vite + React**（非 Next.js）。PWA 通过 [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) 实现，能力与 Next.js + `@ducanh2912/next-pwa` 等价：生产环境生成 Service Worker、离线缓存静态资源、支持「添加到主屏幕」。

## 1. 依赖（已安装）

```bash
cd web
npm install -D vite-plugin-pwa
```

- **开发环境**（`npm run dev`）：Service Worker **禁用**，不影响热更新。
- **生产环境**（`npm run build`）：自动注册 SW，缓存 JS / CSS / 字体 / 图片等静态资源。

## 2. 关键文件

| 文件 | 作用 |
|------|------|
| `public/manifest.json` | Web App 清单（名称、图标、standalone 等） |
| `public/icon-192.png` | Android / Chrome 192×192 |
| `public/icon-512.png` | 安装横幅 / 512×512 |
| `public/apple-touch-icon.png` | iOS / iPadOS 主屏幕图标 180×180 |
| `public/favicon.ico` | 浏览器标签页图标 |
| `index.html` | Apple 专属 meta + manifest 链接 |
| `vite.config.ts` | VitePWA 插件与 Workbox 缓存策略 |

## 3. `public/` 图标清单

请保留以下文件（可替换为品牌设计稿，**保持文件名不变**）：

| 文件名 | 尺寸 | 用途 |
|--------|------|------|
| `icon-192.png` | 192×192 | Manifest、Android |
| `icon-512.png` | 512×512 | Manifest、安装提示 |
| `apple-touch-icon.png` | 180×180 | iPad / iPhone「添加到主屏幕」 |
| `favicon.ico` | 32×32（或含多尺寸） | 浏览器标签 |

建议：`icon-512.png` 控制在 500KB 以内（当前占位图偏大时可自行压缩）。

## 4. 本地生产环境预览

```bash
cd web
npm run build
npm run preview
```

终端会显示类似：

```
➜  Local:   http://localhost:4173/
➜  Network: http://192.168.x.x:4173/
```

在 **同一 Wi‑Fi** 下的 iPad Safari 打开 **Network 地址**（不要用 localhost）。

### iPad 添加到主屏幕

1. 用 Safari 打开 `http://192.168.x.x:4173/`
2. 点击底部分享按钮 **↑**
3. 选择 **「添加到主屏幕」**
4. 名称应为 **「AI自我分析」**，图标为蓝色书本样式
5. 从主屏幕打开 → 应 **全屏、无地址栏**（`display: standalone`）

### 验证 PWA 是否生效

- Chrome 桌面：DevTools → Application → Manifest / Service Workers
- iPad：主屏幕图标独立打开，顶部仅系统状态栏，无 Safari 地址栏
- 二次打开：静态资源来自缓存，加载明显更快

## 5. 注意事项

- **HTTPS**：正式环境需 HTTPS（或 localhost / 局域网 IP 调试）。上线后请用 HTTPS 域名部署 `dist/`。
- **Google 表格 API**：答卷提交走网络，SW 配置为 `NetworkOnly`，不会缓存 API 响应。
- **Hash 路由**：本项目使用 `#/report?row=N`，`start_url: "/"` 即可，无需额外配置。
- 修改 `public/manifest.json` 后需重新 `npm run build`。

## 6. 若将来迁移到 Next.js

可改用 App Router + `@ducanh2912/next-pwa`，manifest 可迁移为 `app/manifest.ts`，Apple meta 写在 `app/layout.tsx` 的 `metadata` 中。当前 Vite 方案无需 Next.js 即可满足 iPad 独立 App 体验。
