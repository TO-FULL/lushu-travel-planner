# 路书 · 智能旅行行程规划

纯前端单页应用 + Node.js 后端，输入目的地、天数、预算和偏好，自动生成可编辑的每日行程。

## 项目结构

```text
index.html / styles.css / app.js / data.js   前端（浏览器本地运行）
server/                                      后端 API（Node.js + Express）
```

## 本地运行

1. 启动后端：

   ```bash
   cd server
   npm install
   npm start
   ```

   后端默认运行在 `http://localhost:3001`，数据保存在 `server/data/` 下。

2. 打开前端：直接双击 `index.html` 即可，或运行任意静态服务器。

前端默认请求 `http://localhost:3001`。若后端部署在别处，可在打开页面后设置：

```js
window.LUSHU_BACKEND_URL = 'https://your-backend.example.com';
```

后端不可用时，登录与行程保存会自动降级为浏览器本地模式，不影响使用。

## 后端接口

- `POST /api/auth/register` 注册（返回 JWT）
- `POST /api/auth/login` 登录（返回 JWT）
- `GET /api/auth/me` 当前用户
- `GET /api/plans` 我的行程列表
- `GET /api/plans/:id` 行程详情
- `POST /api/plans` 保存 / 更新行程
- `DELETE /api/plans/:id` 删除行程

请求受保护接口时，请在请求头携带 `Authorization: Bearer <token>`。

## 配置

- `PORT`：后端端口，默认 `3001`
- `JWT_SECRET`：令牌签名密钥，生产环境务必修改

## 部署说明

前端可直接部署到 Vercel 等静态托管。后端是常驻 Node 服务（带本地文件存储），需要部署到支持持久磁盘的平台（如 Railway、Render、Fly.io 或自己的服务器）；Vercel 的 Serverless 环境不保留文件存储，不适合直接承载该后端。
