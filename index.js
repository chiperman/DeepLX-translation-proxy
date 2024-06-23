const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// 用于存储私有 token 和 API key
const DEEPLX_API_KEY = process.env.DEEPLX_API_KEY;

// 配置 CORS，只允许来自 chiperman.github.io 的请求
const corsOptions = {
  origin: 'https://chiperman.github.io',
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.post('/translate', async (req, res) => {
  const { text, source_lang, target_lang } = req.body;

  if (!DEEPLX_API_KEY) {
    return res.status(500).json({ error: 'API token 未定义' });
  }

  try {
    const response = await fetch(`https://api.deeplx.org/${DEEPLX_API_KEY}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        source_lang: source_lang,
        target_lang: target_lang,
      }),
    });

    if (!response.ok) {
      throw new Error('翻译请求失败');
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '翻译请求失败' });
  }
});

app.listen(PORT, () => {
  console.log(`服务器运行在 ${PORT}`);
});
