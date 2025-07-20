const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3000;

// 从环境变量中读取配置
const DEEPLX_API_KEY = process.env.DEEPLX_API_KEY;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;

// 配置 CORS
const corsOptions = {
  origin: (origin, callback) => {
    const originList = ALLOWED_ORIGINS.split(',').map((item) => item.trim());
    if (!origin || originList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

// 配置速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100, // 每个 IP 每 15 分钟最多 100 个请求
  standardHeaders: true,
  legacyHeaders: false,
});

// 应用中间件
app.use(cors(corsOptions));
app.use(express.json());
app.use(limiter);

// 输入验证规则
const translateValidationRules = [
  body('text').isString().notEmpty().withMessage('Text must be a non-empty string.'),
  body('source_lang')
    .isString()
    .notEmpty()
    .withMessage('Source language must be a non-empty string.'),
  body('target_lang')
    .isString()
    .notEmpty()
    .withMessage('Target language must be a non-empty string.'),
];

// 翻译路由
app.post('/translate', translateValidationRules, async (req, res) => {
  // 检查输入验证结果
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!DEEPLX_API_KEY) {
    return res.status(500).json({ error: 'API key is not configured on the server.' });
  }

  const { text, source_lang, target_lang } = req.body;

  try {
    const response = await fetch(`https://api.deeplx.org/${DEEPLX_API_KEY}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        source_lang,
        target_lang,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // 将 DeepLX API 的错误信息和状态码转发给客户端
      return res.status(response.status).json({
        error: 'Failed to fetch translation from DeepLX.',
        details: data,
      });
    }

    res.json(data);
  } catch (error) {
    console.error('Proxy server error:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
