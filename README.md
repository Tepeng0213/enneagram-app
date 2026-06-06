# Profigram 九型测试（自建网页）

## 本地运行

```bash
cd web
npm install
npm run dev
```

浏览器打开终端显示的地址（一般为 http://localhost:5173）。

## 流程说明

1. 输入姓名 → **开始测试**
2. 81 题，每题 1～5 分
3. **各型分数** + 三大中心初算
4. 若某中心 **两型并列最高** → **中心确认**（二选一文案）
5. 若 **三型并列最高** → 自动取中间号（体 9 / 心 3 / 脑 6），无需答题
6. **测试完成** 页显示主型与三大中心最终结果

## 规则实现

见 `src/lib/scoring.ts`。

## 保存到 Google 表格

见上级目录说明：**`../profigram_export/SHEET_WEB_SETUP.md`**

简要步骤：试算表 Apps Script 部署 `WebAppSubmit.gs` → 配置 `web/.env` → 重启 `npm run dev`。

## 下一步

- 部署 Firebase Hosting / Cloud Run
- 报告页与 PDF
