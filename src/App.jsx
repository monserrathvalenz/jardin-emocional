import { useState, useEffect, useRef } from 'react';
import { initChat, sendMessage, resetChat } from './services/gemini';
import { FlowerModal } from './components/FlowerModal';
import { BotanicalOrnament, Sprout, Leaf } from './components/Ornaments';

const STORAGE_KEY = 'jardin_emocional_v1';
const API_KEY_STORAGE = 'jardin_gemini_api_key';

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE) || '');
  const [model, setModel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [flowers, setFlowers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedFlower, setSelectedFlower] = useState(null);

  const messagesEndRef = useRef(null);

  // Persistir flores
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flowers));
  }, [flowers]);

  // Inicializar modelo cuando hay API key
  useEffect(() => {
    if (apiKey && apiKey.length > 10) {
      try {
        const m = initChat(apiKey);
        setModel(m);
        localStorage.setItem(API_KEY_STORAGE, apiKey);
        setError('');
      } catch (e) {
        setError('Error al inicializar Gemini: ' + e.message);
      }
    }
  }, [apiKey]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    if (!model) {
      setError('Necesitas ingresar tu API key de Gemini primero.');
      return;
    }

    const userMsg = input.trim();
    setInput('');
    setError('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await sendMessage(model, userMsg);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.mensaje,
          flor: response.flor,
        },
      ]);

      // Agregar flor al jardín
      const newFlower = {
        id: Date.now() + Math.random(),
        ...response.flor,
        mensaje: response.mensaje,
        fecha: new Date().toISOString(),
      };
      setFlowers((prev) => [newFlower, ...prev]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    if (window.confirm('¿Seguro que quieres podar todo tu jardín? Esta acción no se puede deshacer.')) {
      setFlowers([]);
      setMessages([]);
      resetChat();
    }
  };

  // Stats
  const stats = {
    total: flowers.length,
    emocionMasComun: getMostCommonEmotion(flowers),
    dias: getDaysCultivating(flowers),
  };

  const today = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="app">
      {/* ========== PANEL CHAT ========== */}
      <section className="chat-panel">
        <header className="header">
          <div className="header-ornament">
            <Leaf />
            <span>Diario Botánico · vol. I</span>
          </div>
          <h1>
            Jardín <em>Emocional</em>
          </h1>
          <p>Cuéntame cómo te sientes y plantaré una flor por ti.</p>
        </header>

        {!model && (
          <div className="api-key-section">
            <label>Clave de Gemini</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIza..."
              autoComplete="off"
            />
            <p className="hint">
              Tu clave se guarda solo en tu navegador. Consíguela gratis en{' '}
              <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer">
                aistudio.google.com
              </a>
            </p>
          </div>
        )}

        <div className="messages">
          {messages.length === 0 && model && (
            <div className="message assistant">
              <div className="message-label">La Jardinera</div>
              <div className="message-content">
                Bienvenida al jardín. Aquí no juzgo lo que sientes, solo lo cultivo. Cuéntame qué hay en tu corazón hoy y dejaré que una flor crezca por ello. 🌿
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              <div className="message-label">
                {msg.role === 'user' ? 'Tú escribiste' : 'La Jardinera responde'}
              </div>
              <div className="message-content">
                {msg.content}
                {msg.flor && (
                  <div className="flower-card">
                    <span className="emoji">{msg.flor.emoji}</span>
                    <strong>{msg.flor.nombre}</strong> — sembrada en tu jardín
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message assistant">
              <div className="message-label">La Jardinera</div>
              <div className="message-content">
                <em>cultivando una respuesta</em>{' '}
                <span className="loading-dots">
                  <span></span><span></span><span></span>
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {error && <div className="error">{error}</div>}

        <div className="input-area">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Hoy me siento..."
            disabled={!model || loading}
            rows={2}
          />
          <div className="input-actions">
            <span className="hint-text">Enter para enviar · Shift+Enter para nueva línea</span>
            <button
              className="send-btn"
              onClick={handleSend}
              disabled={!model || loading || !input.trim()}
            >
              {loading ? 'Sembrando...' : 'Sembrar →'}
            </button>
          </div>
        </div>
      </section>

      {/* ========== PANEL JARDÍN ========== */}
      <section className="garden-panel">
        <BotanicalOrnament className="corner-ornament top-right" style={{ color: 'var(--moss)' }} />
        <BotanicalOrnament className="corner-ornament bottom-left" style={{ color: 'var(--moss)' }} />

        <header className="garden-header">
          <div className="header-ornament" style={{ color: 'var(--moss)' }}>
            <Sprout />
            <span>Tu jardín privado</span>
          </div>
          <h2 className="garden-title">Florario personal</h2>
          <div className="garden-date">{today}</div>
        </header>

        <div className="stats">
          <div className="stat">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Flores</div>
          </div>
          <div className="stat">
            <div className="stat-value">{stats.dias}</div>
            <div className="stat-label">Días</div>
          </div>
          <div className="stat" title={stats.emocionMasComun}>
            <div className="stat-value" style={{ fontSize: '1.1rem', lineHeight: '1.4' }}>
              {stats.emocionMasComun || '—'}
            </div>
            <div className="stat-label">Más sentido</div>
          </div>
        </div>

        <div className="garden-grid">
          {flowers.length === 0 ? (
            <div className="empty-garden">
              <BotanicalOrnament style={{ color: 'var(--moss)' }} />
              <p>Tu jardín espera tu primera siembra.</p>
              <p>· · ·</p>
            </div>
          ) : (
            flowers.map((f) => (
              <div
                key={f.id}
                className="flower-tile"
                onClick={() => setSelectedFlower(f)}
              >
                <span className="flower-tile-emoji">{f.emoji}</span>
                <div className="flower-tile-name">{f.nombre}</div>
                <div className="flower-tile-emotion">{f.emocion}</div>
                <div className="flower-tile-date">
                  {new Date(f.fecha).toLocaleDateString('es-MX', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {flowers.length > 0 && (
          <button className="reset-btn" onClick={handleReset}>
            ✦ Podar jardín completo
          </button>
        )}
      </section>

      <FlowerModal flower={selectedFlower} onClose={() => setSelectedFlower(null)} />
    </div>
  );
}

// ============ Helpers ============
function getMostCommonEmotion(flowers) {
  if (flowers.length === 0) return null;
  const counts = {};
  flowers.forEach((f) => {
    if (f.emocion) counts[f.emocion] = (counts[f.emocion] || 0) + 1;
  });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || null;
}

function getDaysCultivating(flowers) {
  if (flowers.length === 0) return 0;
  const dates = new Set(
    flowers.map((f) => new Date(f.fecha).toDateString())
  );
  return dates.size;
}
