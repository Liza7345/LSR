function Header({ onPageChange, currentPage }) {
    return (
        <header className="header">
            <div className="container header-container">
                <div className="logo" onClick={() => onPageChange('home')}>
                    ЛСР
                </div>
                <nav className="nav-links">
                    <button 
                        className={currentPage === 'home' ? 'active' : ''}
                        onClick={() => onPageChange('home')}
                    >
                        Квартиры
                    </button>
                    <button 
                        className={currentPage === 'bookings' ? 'active' : ''}
                        onClick={() => onPageChange('bookings')}
                    >
                        Мои бронирования
                    </button>
                </nav>
                <div className="header-sub">ЖК «Лучший»</div>
            </div>
        </header>
    );
}

export default Header;