import './App.css';
import { useState } from 'react';
import Header from './components/Header';
import ApartmentList from './components/ApartmentList';
import BookingModal from './components/BookingModal';
import BookingsList from './components/BookingsList';
import Toast from './components/Toast';

function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [filters, setFilters] = useState({
        rooms: 'all',
        priceMin: '',
        priceMax: ''
    });
    const [selectedFlat, setSelectedFlat] = useState(null);
    const [toast, setToast] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Обработчик изменения фильтров
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    // Сброс фильтров
    const handleResetFilters = () => {
        setFilters({
            rooms: 'all',
            priceMin: '',
            priceMax: ''
        });
    };

    // Открытие модалки бронирования
    const handleBook = (flat) => {
        if (!flat.is_available) {
            setToast({ 
                message: '❌ Эта квартира недоступна для бронирования', 
                type: 'error' 
            });
            return;
        }
        setSelectedFlat(flat);
    };

    // Успешное бронирование
    const handleBookingSuccess = (booking) => {
        setToast({ 
            message: `✅ Бронирование оформлено! №${booking.id}`, 
            type: 'success' 
        });
        setRefreshTrigger(prev => prev + 1); // обновляем список квартир
    };

    // Закрытие модалки
    const handleCloseModal = () => {
        setSelectedFlat(null);
    };

    // Закрытие Toast
    const handleCloseToast = () => {
        setToast(null);
    };

    // Переключение страниц
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="app">
            <Header onPageChange={handlePageChange} currentPage={currentPage} />

            <main className="container">
                {currentPage === 'home' ? (
                    <>
                        {/* Hero-секция */}
                        <div className="hero">
                            <h1>Квартиры в ЖК «Лучший»</h1>
                            <p>Современный минимализм, продуманные планировки и комфорт городской жизни</p>
                        </div>

                        {/* Фильтры */}
                        <div className="filters-card">
                            <div className="filters-title">🎯 Подберите квартиру</div>
                            <div className="filters-grid">
                                <div className="filter-group">
                                    <label htmlFor="rooms">Количество комнат</label>
                                    <select 
                                        id="rooms" 
                                        name="rooms" 
                                        value={filters.rooms}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="all">Любые</option>
                                        <option value="1">1 комната</option>
                                        <option value="2">2 комнаты</option>
                                        <option value="3">3 комнаты</option>
                                    </select>
                                </div>
                                <div className="filter-group">
                                    <label htmlFor="priceMin">Цена от (₽)</label>
                                    <input
                                        type="number"
                                        id="priceMin"
                                        name="priceMin"
                                        placeholder="0"
                                        value={filters.priceMin}
                                        onChange={handleFilterChange}
                                        min="0"
                                    />
                                </div>
                                <div className="filter-group">
                                    <label htmlFor="priceMax">Цена до (₽)</label>
                                    <input
                                        type="number"
                                        id="priceMax"
                                        name="priceMax"
                                        placeholder="30 000 000"
                                        value={filters.priceMax}
                                        onChange={handleFilterChange}
                                        min="0"
                                    />
                                </div>
                                <button className="reset-btn" onClick={handleResetFilters}>
                                    Сбросить
                                </button>
                            </div>
                        </div>

                        {/* Список квартир */}
                        <ApartmentList 
                            filters={filters} 
                            onBook={handleBook}
                            refreshTrigger={refreshTrigger}
                        />
                    </>
                ) : (
                    // Страница бронирований
                    <BookingsList />
                )}
            </main>

            {/* Модальное окно бронирования */}
            {selectedFlat && (
                <BookingModal
                    flat={selectedFlat}
                    onClose={handleCloseModal}
                    onSuccess={handleBookingSuccess}
                />
            )}

            {/* Toast уведомления */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={handleCloseToast}
                />
            )}
        </div>
    );
}

export default App;