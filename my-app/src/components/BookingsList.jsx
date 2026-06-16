import { useState, useEffect } from 'react';
import { getBookings } from '../mocks/api';

function BookingsList() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const response = await getBookings();
                if (response.success) {
                    setBookings(response.data.bookings);
                } else {
                    setError(response.error?.message || 'Ошибка загрузки');
                }
            } catch (err) {
                setError('Ошибка загрузки данных');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) return <div className="loading-container">Загрузка...</div>;
    if (error) return <div className="error-container">❌ {error}</div>;

    if (bookings.length === 0) {
        return (
            <div className="empty-container">
                <p>📋 У вас пока нет бронирований</p>
            </div>
        );
    }

    return (
        <div className="bookings-list">
            <h2>Мои бронирования</h2>
            <div className="bookings-grid">
                {bookings.map(booking => (
                    <div key={booking.id} className="booking-card">
                        <div className="booking-header">
                            <span className="booking-id">№ {booking.id}</span>
                            <span className={`booking-status ${booking.status}`}>
                                {booking.status === 'confirmed' ? '✅ Подтверждено' : booking.status}
                            </span>
                        </div>
                        <div className="booking-details">
                            <p><strong>Клиент:</strong> {booking.client_name}</p>
                            <p><strong>Телефон:</strong> {booking.client_phone}</p>
                            <p><strong>Квартира ID:</strong> {booking.flat_id}</p>
                            <p><strong>Дата:</strong> {new Date(booking.created_at).toLocaleString('ru-RU')}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BookingsList;  // ← ЭТО ОБЯЗАТЕЛЬНО!