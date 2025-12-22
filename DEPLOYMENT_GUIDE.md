# ERP 官方網站部署指南

> 此指南說明如何部署 ERP 官方網站（React + Vite）

## 📋 目錄
1. [概覽](#概覽)
2. [構建生產版本](#構建生產版本)
3. [部署選項](#部署選項)
4. [環境配置](#環境配置)

---

## 🏗️ 概覽

官方網站是一個靜態 React 應用，用於：
- 展示產品信息
- 用戶註冊/訂閱
- 帳戶激活

網站需要連接到 ERP 後端 API 來處理訂閱和激活。

---

## 🔨 構建生產版本

### 1. 配置 API URL

創建 `.env.production` 文件：
```env
# 連接到後端 API 服務器
VITE_API_URL=http://your-server-ip:3000
# 或使用域名
VITE_API_URL=https://api.your-domain.com
```

### 2. 構建

```bash
npm run build
```

生成的文件在 `dist/` 目錄。

---

## 🚀 部署選項

### 選項一：Nginx（推薦）

**1. 安裝 Nginx**
```bash
sudo apt-get install nginx
```

**2. 上傳文件**
```bash
sudo mkdir -p /var/www/erp-website
sudo cp -r dist/* /var/www/erp-website/
```

**3. 配置 Nginx**
```nginx
# /etc/nginx/sites-available/erp-website
server {
    listen 80;
    server_name www.your-domain.com;
    
    root /var/www/erp-website;
    index index.html;
    
    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 緩存靜態資源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**4. 啟用配置**
```bash
sudo ln -s /etc/nginx/sites-available/erp-website /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**5. 配置 SSL（推薦）**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d www.your-domain.com
```

### 選項二：Vercel（最簡單）

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

在 Vercel 控制台設置環境變數：
- `VITE_API_URL` = `https://api.your-domain.com`

### 選項三：Netlify

1. 連接 GitHub 倉庫
2. 設置構建命令：`npm run build`
3. 設置發布目錄：`dist`
4. 添加環境變數 `VITE_API_URL`

### 選項四：GitHub Pages

```bash
# 安裝 gh-pages
npm install -D gh-pages

# 在 package.json 添加
"scripts": {
    "deploy": "npm run build && gh-pages -d dist"
}

# 部署
npm run deploy
```

---

## ⚙️ 環境配置

### 開發環境 (`.env`)
```env
VITE_API_URL=http://localhost:3000
```

### 生產環境 (`.env.production`)
```env
VITE_API_URL=https://api.your-domain.com
```

### 使用環境變數

在代碼中使用：
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

---

## 🔍 驗證部署

1. 訪問網站首頁
2. 測試訂閱流程
3. 檢查瀏覽器控制台無錯誤
4. 確認 API 請求正確發送到後端

### 常見問題

**Q: API 請求失敗？**
- 確認 `VITE_API_URL` 配置正確
- 確認後端 CORS 設置允許網站域名
- 檢查網絡請求詳情

**Q: 頁面刷新 404？**
- 確認 Nginx 配置了 `try_files $uri $uri/ /index.html;`

---

## 📝 部署檢查清單

- [ ] 配置 `.env.production` 中的 API URL
- [ ] 構建生產版本
- [ ] 上傳到服務器或平台
- [ ] 配置域名和 SSL
- [ ] 測試網站功能
- [ ] 確認 API 連接正常
