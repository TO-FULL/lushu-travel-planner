const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { generateWithDeepSeek } = require('./ai');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'lushu-dev-secret-change-me';
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PLANS_FILE = path.join(DATA_DIR, 'plans.json');

function ensureData() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  for (const file of [USERS_FILE, PLANS_FILE]) {
    if (!fs.existsSync(file)) fs.writeFileSync(file, '[]');
  }
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    return [];
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

ensureData();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ error: '未登录' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: '登录已过期，请重新登录' });
  }
}

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'lushu-server' }));

app.post('/api/auth/register', async (req, res) => {
  try {
    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '');
    if (username.length < 2 || username.length > 20) {
      return res.status(400).json({ error: '用户名需为 2-20 个字符' });
    }
    if (password.length < 4) {
      return res.status(400).json({ error: '密码至少需要 4 位' });
    }
    const users = readJson(USERS_FILE);
    if (users.some(user => user.username === username)) {
      return res.status(409).json({ error: '该用户名已被注册' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = {
      id: 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      username,
      hash,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    writeJson(USERS_FILE, users);
    const token = jwt.sign({ id: user.id, username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: '服务器繁忙，请稍后重试' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '');
    const users = readJson(USERS_FILE);
    const user = users.find(item => item.username === username);
    if (!user || !(await bcrypt.compare(password, user.hash))) {
      return res.status(401).json({ error: '用户名或密码不正确' });
    }
    const token = jwt.sign({ id: user.id, username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: '服务器繁忙，请稍后重试' });
  }
});

app.get('/api/auth/me', auth, (req, res) => {
  res.json({ username: req.user.username });
});

app.get('/api/plans', auth, (req, res) => {
  const plans = readJson(PLANS_FILE).filter(plan => plan.userId === req.user.id);
  res.json(plans.map(plan => ({
    id: plan.id,
    title: plan.title || `${plan.destination} 行程`,
    destination: plan.destination,
    days: plan.dayCount || plan.days.length,
    people: plan.people,
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt
  })));
});

app.get('/api/plans/:id', auth, (req, res) => {
  const plans = readJson(PLANS_FILE);
  const plan = plans.find(item => item.userId === req.user.id && item.id === req.params.id);
  if (!plan) return res.status(404).json({ error: '行程不存在' });
  res.json(plan);
});

app.post('/api/plans', auth, (req, res) => {
  const plan = req.body.plan;
  if (!plan || !plan.destination || !plan.days) {
    return res.status(400).json({ error: '行程数据不完整' });
  }
  const plans = readJson(PLANS_FILE);
  const now = new Date().toISOString();
  const existing = plans.find(item => item.userId === req.user.id && item.id === plan.id);
  if (existing) {
    Object.assign(existing, { ...plan, userId: req.user.id, updatedAt: now });
    writeJson(PLANS_FILE, plans);
    return res.json({ id: existing.id, updatedAt: now });
  }
  const entry = { ...plan, userId: req.user.id, createdAt: now, updatedAt: now };
  plans.push(entry);
  writeJson(PLANS_FILE, plans);
  res.json({ id: entry.id, createdAt: now });
});

app.delete('/api/plans/:id', auth, (req, res) => {
  const plans = readJson(PLANS_FILE);
  const next = plans.filter(plan => !(plan.userId === req.user.id && plan.id === req.params.id));
  writeJson(PLANS_FILE, next);
  res.json({ ok: true });
});

app.post('/api/generate', async (req, res) => {
  try {
    const form = req.body.form;
    if (!form || !form.destination || !form.days) {
      return res.status(400).json({ error: '出行信息不完整' });
    }
    const plan = await generateWithDeepSeek(form);
    res.json({ plan });
  } catch (err) {
    const status = err.status || 502;
    res.status(status).json({ error: err.message || 'AI 生成失败' });
  }
});

app.listen(PORT, () => {
  console.log(`路书后端已启动：http://localhost:${PORT}`);
});
