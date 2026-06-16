import { useState, useEffect } from 'react';
import { getFlats } from '../mocks/api';
import ApartmentCard from './ApartmentCard';

function ApartmentList({ filters, onBook, refreshTrigger }) {
    const [flats, setFlats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        const fetchFlats = async () => {
            try {
                setLoading(true);
                setError(null);

                const params = {
                    limit: 100,
                    offset: 0,
                    rooms: filters.rooms,
                    priceMin: filters.priceMin,
                    priceMax: filters.priceMax
                };

                const response = await getFlats(params);

                if (response.success) {
                    setFlats(response.data.flats);
                    setPagination(response.data.pagination);
                } else {
                    setError(response.error.message);
                }
            } catch (err) {
                setError('Ошибка загрузки данных');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFlats();
    }, [filters, refreshTrigger]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loader">Загрузка...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>❌ {error}</p>
            </div>
        );
    }

    if (flats.length === 0) {
        return (
            <div className="empty-container">
                <p>🏡 Квартир по таким параметрам не найдено</p>
            </div>
        );
    }

    return (
        <>
            <div className="results-header">
                Найдено: <span className="count">{pagination?.total_count || flats.length}</span> квартир
            </div>
            <div className="apartments-grid">
                {flats.map(flat => (
                    <ApartmentCard 
                        key={flat.id} 
                        flat={flat} 
                        onBook={onBook}
                    />
                ))}
            </div>
        </>
    );
}

export default ApartmentList;