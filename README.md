# enneagram-app

Profigram 九型人格评测与 AI 自我分析洞察报告（Vite 6 + React 19 + PWA）。

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开终端显示的地址（一般为 http://localhost:5173）。

## 流程说明

1. 输入姓名 → **开始测试**
2. 91 题，每题 1～5 分
3. **各型分数** + 三大中心初算
4. 若某中心 **两型并列最高** → **中心确认**（二选一文案）
5. 若 **三型并列最高** → 自动取中间号（体 9 / 心 3 / 脑 6），无需答题
6. 提交后自动生成洞察报告 PDF 并存入 Google 云端硬盘

## 规则实现

见 `src/lib/scoring.ts`。

## 保存到 Google 表格

配置 `WebAppSubmit.gs` 部署为 Google Apps Script 网页应用，复制 `.env.example` 为 `.env` 并填写 URL 与密钥，然后重启 `npm run dev`。

## PWA / 添加到主屏幕

见 `docs/PWA_SETUP.md`。

## 生产构建

```bash
npm run build
npm run preview
```

## License

MIT — see [LICENSE](LICENSE).
