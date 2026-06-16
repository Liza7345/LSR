import { useState } from 'react';
import { postBooking } from '../mocks/api';

function BookingModal({ flat, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        flat_id: flat.id,
        client_name: '',
        client_phone: '',
        client_email: '',
        booking_datetime: new Date().toISOString(),
        additional_notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSubmitError(null);
        setErrors({});

        try {
            const response = await postBooking(formData);

            if (response.success) {
                onSuccess(response.data.booking);
                onClose();
            } else {
                if (response.error.details) {
                    const fieldErrors = {};
                    response.error.details.forEach(detail => {
                        fieldErrors[detail.field] = detail.message;
                    });
                    setErrors(fieldErrors);
                } else {
                    setSubmitError(response.error.message);
                }
            }
        } catch (err) {
            setSubmitError('Ошибка при бронировании. Попробуйте позже.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!flat) return null;

    const formatPrice = (price) => price.toLocaleString('ru-RU');

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>
                <h2 className="modal-title">📝 Бронирование квартиры</h2>
                
                <div className="modal-apartment-info">
                    <strong>{flat.name}</strong>
                    <br />
                    📐 {flat.area} м² | 💰 {formatPrice(flat.price)} ₽
                    <br />
                    📍 Этаж {flat.floor} / {flat.total_floors}
                </div>

                {submitError && (
                    <div className="error-message">{submitError}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Ваше имя *</label>
                        <input
                            type="text"
                            name="client_name"
                            placeholder="Иван Иванов"
                            value={formData.client_name}
                            onChange={handleChange}
                            className={errors.client_name ? 'error' : ''}
                            required
                        />
                        {errors.client_name && (
                            <span className="error-text">{errors.client_name}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Телефон *</label>
                        <input
                            type="tel"
                            name="client_phone"
                            placeholder="+7 (900) 123-45-67"
                            value={formData.client_phone}
                            onChange={handleChange}
                            className={errors.client_phone ? 'error' : ''}
                            required
                        />
                        {errors.client_phone && (
                            <span className="error-text">{errors.client_phone}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="client_email"
                            placeholder="ivan@example.com"
                            value={formData.client_email}
                            onChange={handleChange}
                            className={errors.client_email ? 'error' : ''}
                        />
                        {errors.client_email && (
                            <span className="error-text">{errors.client_email}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Комментарий</label>
                        <textarea
                            name="additional_notes"
                            rows="2"
                            placeholder="Удобное время для связи..."
                            value={formData.additional_notes}
                            onChange={handleChange}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Отправка...' : 'Забронировать сейчас'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default BookingModal;