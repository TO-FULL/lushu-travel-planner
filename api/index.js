const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const { generateWithDeepSeek } = require('../server/ai');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'lushu-dev-secret-change-me';

// Vercel Serverless 无持久磁盘，使用内存存储；本地运行时同样有效（重启后清空）
const users = [];
const plans = [];

const supabase = (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

async function findUser(username) {
  if (supabase) {
    const { data } = await supabase.from('users').select('*').eq('username', username).maybeSingle();
    return data || null;
  }
  return users.find(user => user.username === username) || null;
}

async function insertUser(user) {
  if (supabase) {
    const { error } = await supabase.from('users').insert(user);
    return !error;
  }
  users.push(user);
  return true;
}

async function listPlansForUser(userId) {
  if (supabase) {
    const { data, error } = await supabase
      .from('plans')
      .select('id, created_at, updated_at, data')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    if (error || !data) return [];
    return data.map(row => ({
      id: row.id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      plan: row.data
    }));
  }
  return plans
    .filter(plan => plan.userId === userId)
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
    .map(plan => ({ id: plan.id, createdAt: plan.createdAt, updatedAt: plan.updatedAt, plan }));
}

async function getPlanForUser(userId, id) {
  if (supabase) {
    const { data } = await supabase
      .from('plans')
      .select('data')
      .eq('user_id', userId)
      .eq('id', id)
      .maybeSingle();
    return data ? data.data : null;
  }
  return plans.find(plan => plan.userId === userId && plan.id === id) || null;
}

async function upsertPlanForUser(userId, plan, now) {
  if (supabase) {
    const existing = await getPlanForUser(userId, plan.id);
    if (existing) {
      const { error } = await supabase
        .from('plans')
        .update({ data: plan, updated_at: now })
        .eq('user_id', userId)
        .eq('id', plan.id);
      return !error;
    }
    const { error } = await supabase
      .from('plans')
      .insert({ id: plan.id, user_id: userId, data: plan, created_at: now, updated_at: now });
    return !error;
  }
  const existing = plans.find(item => item.userId === userId && item.id === plan.id);
  if (existing) {
    Object.assign(existing, { ...plan, userId, updatedAt: now });
  } else {
    plans.push({ ...plan, userId, createdAt: now, updatedAt: now });
  }
  return true;
}

async function deletePlanForUser(userId, id) {
  if (supabase) {
    const { error } = await supabase
      .from('plans')
      .delete()
      .eq('user_id', userId)
      .eq('id', id);
    return !error;
  }
  const index = plans.findIndex(item => item.userId === userId && item.id === id);
  if (index >= 0) plans.splice(index, 1);
  return true;
}

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

function resolveUser(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'lushu-api' }));

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
    if (await findUser(username)) {
      return res.status(409).json({ error: '该用户名已被注册' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = {
      id: 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      username,
      hash,
      createdAt: new Date().toISOString()
    };
    const inserted = await insertUser(user);
    if (!inserted) return res.status(500).json({ error: '账号创建失败，请稍后重试' });
    const token = jwt.sign({ id: user.id, username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, username: user.username });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ error: '服务器繁忙，请稍后重试' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '');
    const user = await findUser(username);
    if (!user || !(await bcrypt.compare(password, user.hash))) {
      return res.status(401).json({ error: '用户名或密码不正确' });
    }
    const token = jwt.sign({ id: user.id, username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, username: user.username });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ error: '服务器繁忙，请稍后重试' });
  }
});

app.get('/api/auth/me', auth, (req, res) => {
  res.json({ username: req.user.username });
});

app.get('/api/plans', async (req, res) => {
  const user = resolveUser(req);
  if (!user) return res.json([]);
  const userPlans = await listPlansForUser(user.id);
  res.json(userPlans.map(entry => {
    const plan = entry.plan;
    return {
      id: entry.id,
      title: plan.title || `${plan.destination} 行程`,
      destination: plan.destination,
      days: plan.dayCount || plan.days.length,
      people: plan.people,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt
    };
  }));
});

app.get('/api/plans/:id', auth, async (req, res) => {
  const plan = await getPlanForUser(req.user.id, req.params.id);
  if (!plan) return res.status(404).json({ error: '行程不存在' });
  res.json(plan);
});

app.post('/api/plans', auth, async (req, res) => {
  const plan = req.body.plan;
  if (!plan || !plan.destination || !plan.days) {
    return res.status(400).json({ error: '行程数据不完整' });
  }
  const now = new Date().toISOString();
  const existing = await getPlanForUser(req.user.id, plan.id);
  const ok = await upsertPlanForUser(req.user.id, plan, now);
  if (!ok) return res.status(500).json({ error: '保存失败，请稍后重试' });
  if (existing) {
    return res.json({ id: plan.id, updatedAt: now });
  }
  res.json({ id: plan.id, createdAt: now });
});

app.delete('/api/plans/:id', auth, async (req, res) => {
  await deletePlanForUser(req.user.id, req.params.id);
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

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`路书 API 已启动：http://localhost:${PORT}`);
  });
}
