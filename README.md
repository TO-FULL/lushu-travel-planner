# 路书 · 智能旅行行程规划

纯前端单页应用 + Node.js 后端，输入目的地、天数、预算和偏好，自动生成可编辑的每日行程。

> 当前线上版本：v1.3 · 已接入 Supabase 持久化与 DeepSeek 大模型生成

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

## 接入 DeepSeek 大模型

配置 `server/.env`（参考 `server/.env.example`）：

```env
DEEPSEEK_API_KEY=sk-你的密钥
```

在 [platform.deepseek.com](https://platform.deepseek.com) 注册并创建 API Key 后填入即可。启用后，生成行程会优先由 DeepSeek 根据目的地、预算、偏好、人群和节奏生成真实合理的行程；未配置 Key 或 AI 服务不可用时，自动回退到内置的本地规划算法，功能不受影响。

## 后端接口

## 后端接口

- `POST /api/auth/register` 注册（返回 JWT）
- `POST /api/auth/login` 登录（返回 JWT）
- `GET /api/auth/me` 当前用户
- `GET /api/plans` 我的行程列表
- `GET /api/plans/:id` 行程详情
- `POST /api/plans` 保存 / 更新行程
- `DELETE /api/plans/:id` 删除行程
- `POST /api/generate` 调用 DeepSeek 生成行程（需要配置 `DEEPSEEK_API_KEY`）

请求受保护接口时，请在请求头携带 `Authorization: Bearer <token>`。

## 配置

- `PORT`：后端端口，默认 `3001`
- `JWT_SECRET`：令牌签名密钥，生产环境务必修改
- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`：配置后账号与行程数据持久化到 Supabase，不配置则使用内存存储

## 部署说明

前端可直接部署到 Vercel 等静态托管。后端是常驻 Node 服务（带本地文件存储），需要部署到支持持久磁盘的平台（如 Railway、Render、Fly.io 或自己的服务器）；Vercel 的 Serverless 环境不保留文件存储，不适合直接承载该后端。

### Supabase 持久化（推荐线上方案）

1. 在 [supabase.com](https://supabase.com) 创建项目。
2. 打开 SQL Editor，执行 `supabase/schema.sql` 建表。
3. 在 Vercel 项目环境变量中添加：
   - `SUPABASE_URL`：项目的 URL
   - `SUPABASE_SERVICE_ROLE_KEY`：项目 Settings → API → service_role 密钥
4. 重新部署。配置后注册账号、保存的行程都会持久化到 Supabase；未配置时自动回退内存存储。
