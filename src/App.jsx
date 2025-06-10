import React, { useState } from "react";

function App() {
  const [productName, setProductName] = useState("");
  const [features, setFeatures] = useState("");
  const [language, setLanguage] = useState("es");
  const [platform, setPlatform] = useState("general");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateDescription = async () => {
    setLoading(true);
    const prompt = `Crea una descripción de producto optimizada para SEO en ${
      language === "es" ? "español" : "inglés"
    }. El producto es: ${productName}. Características: ${features}. Plataforma: ${platform}. Devuelve título SEO, descripción larga, descripción corta, bullet points y palabras clave.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });
    const data = await response.json();
    const text = data.choices[0].message.content;
    setResult(text);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">SEO Descripta</h1>
      <div className="space-y-4">
        <div>
          <label>Nombre del producto</label>
          <input
            className="w-full border rounded p-2"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <div>
          <label>Características</label>
          <textarea
            className="w-full border rounded p-2"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
          />
        </div>
        <div>
          <label>Idioma</label>
          <select
            className="w-full border rounded p-2"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="es">Español</option>
            <option value="en">Inglés</option>
          </select>
        </div>
        <div>
          <label>Plataforma destino</label>
          <select
            className="w-full border rounded p-2"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="general">General</option>
            <option value="shopify">Shopify</option>
            <option value="amazon">Amazon</option>
            <option value="woocommerce">WooCommerce</option>
          </select>
        </div>
        <button
          className="bg-black text-white px-4 py-2 rounded"
          onClick={generateDescription}
          disabled={loading}
        >
          {loading ? "Generando..." : "Generar descripción"}
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-100 whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
}

export default App;
