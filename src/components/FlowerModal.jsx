export function FlowerModal({ flower, onClose }) {
  if (!flower) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        <span className="modal-emoji">{flower.emoji}</span>
        <h2 className="modal-name">{flower.nombre}</h2>
        <p className="modal-emotion">{flower.emocion}</p>

        <div className="modal-section">
          <div className="modal-section-label">Sembrada el</div>
          <div className="modal-section-content" style={{ fontStyle: 'normal', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            {new Date(flower.fecha).toLocaleDateString('es-MX', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        <div className="modal-section">
          <div className="modal-section-label">Tu jardinera dijo</div>
          <div className="modal-section-content">{flower.mensaje}</div>
        </div>

        <div className="modal-section">
          <div className="modal-section-label">Significado</div>
          <div className="modal-section-content">{flower.significado}</div>
        </div>

        <div className="modal-section">
          <div className="modal-section-label">Consejo</div>
          <div className="modal-section-content">{flower.consejo}</div>
        </div>
      </div>
    </div>
  );
}
