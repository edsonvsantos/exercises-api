import express from "express";
import fetch from "node-fetch";
import OAuth from "oauth-1.0a";
import crypto from "crypto";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.static(".")); // serve HTML/CSS/JS local

const PORT = 3000;

// ⚠️ Coloque suas credenciais aqui:
const CONSUMER_KEY = "";
const CONSUMER_SECRET = ""; // ← troque pelo seu valor

// Configura OAuth
const oauth = OAuth({
  consumer: { key: CONSUMER_KEY, secret: CONSUMER_SECRET },
  signature_method: "HMAC-SHA1",
  hash_function(base_string, key) {
    return crypto.createHmac("sha1", key).update(base_string).digest("base64");
  },
});

// Endpoint de busca
app.get("/api/search", async (req, res) => {
  const search_expression = req.query.food || "banana";

  const request_data = {
    url: "https://platform.fatsecret.com/rest/server.api",
    method: "GET",
    data: {
      method: "foods.search",
      format: "json",
      search_expression,
    },
  };

  // Assinatura OAuth
  const authParams = oauth.authorize(request_data);
  const allParams = { ...request_data.data, ...authParams };
  const query = new URLSearchParams(allParams).toString();

  const fullUrl = `${request_data.url}?${query}`;

  try {
    const response = await fetch(fullUrl);
    const text = await response.text();

    // Alguns retornos vêm como texto, então tentamos converter
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Retorno não-JSON:", text);
      return res.status(500).json({ error: "Erro no formato de resposta" });
    }

    res.json(data);
  } catch (error) {
    console.error("Erro ao chamar FatSecret:", error);
    res.status(500).json({ error: "Falha na conexão com FatSecret" });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`)
);
