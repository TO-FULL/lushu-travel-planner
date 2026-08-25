const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { generateWithDeepSeek } = require('../server/ai');

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'lushu-api' }));

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
