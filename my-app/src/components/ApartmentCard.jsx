// src/components/ApartmentCard.jsx
function ApartmentCard({ flat, onBook }) {
    const formatPrice = (price) => {
        return price.toLocaleString('ru-RU');
    };

    return (
        <div className="apartment-card">
            <div className="card-content">
                <div className="apartment-title">
                    <span>{flat.name}</span>
                    <span className={`availability-badge ${flat.is_available ? 'available' : 'unavailable'}`}>
                        {flat.is_available ? '✓ Доступна' : '✗ Недоступна'}
                    </span>
                </div>
                <div className="apartment-details">
                    <div className="detail-item">
                        <span className="detail-label">Комнат</span>
                        <span>{flat.rooms}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Площадь</span>
                        <span>{flat.area} м²</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Этаж</span>
                        <span>{flat.floor} / {flat.total_floors}</span>
                    </div>
                </div>
                <div className="price">
                    {formatPrice(flat.price)} ₽
                </div>
                <button 
                    className="book-btn"
                    onClick={() => onBook(flat)}
                    disabled={!flat.is_available}
                >
                    {flat.is_available ? 'Забронировать' : 'Недоступна'}
                </button>
            </div>
        </div>
    );
}

export default ApartmentCard;