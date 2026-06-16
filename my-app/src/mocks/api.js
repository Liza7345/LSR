import { flatsData } from './flats';
import { bookingsStore, createBooking, isFlatAvailable } from './bookings';

// Имитация задержки сети
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Получение списка квартир
 * GET /api/v1/flats?limit=10&offset=0&sort=price&order=asc
 */
export const getFlats = async (params = {}) => {
    await delay(600);

    const {
        limit = 100,
        offset = 0,
        sort = null,
        order = 'asc',
        rooms = null,
        priceMin = null,
        priceMax = null
    } = params;

    let flats = [...flatsData];

    // Фильтрация по комнатам
    if (rooms && rooms !== 'all') {
        flats = flats.filter(flat => flat.rooms === parseInt(rooms));
    }

    // Фильтрация по цене
    if (priceMin !== null && priceMin !== '') {
        flats = flats.filter(flat => flat.price >= parseInt(priceMin));
    }
    if (priceMax !== null && priceMax !== '') {
        flats = flats.filter(flat => flat.price <= parseInt(priceMax));
    }

    // Сортировка
    if (sort) {
        const validSortFields = ['price', 'area', 'rooms'];
        if (!validSortFields.includes(sort)) {
            return {
                success: false,
                error: {
                    code: 'INVALID_PARAMETER',
                    message: `Неверное значение параметра 'sort'. Допустимые значения: ${validSortFields.join(', ')}.`
                }
            };
        }

        flats.sort((a, b) => {
            let compare = 0;
            if (a[sort] > b[sort]) compare = 1;
            if (a[sort] < b[sort]) compare = -1;
            return order === 'desc' ? -compare : compare;
        });
    }

    // Пагинация
    const totalCount = flats.length;
    const paginatedFlats = flats.slice(offset, offset + limit);

    return {
        success: true,
        data: {
            flats: paginatedFlats,
            pagination: {
                current_page: Math.floor(offset / limit) + 1,
                total_count: totalCount,
                limit: limit,
                offset: offset
            }
        }
    };
};

/**
 * Отправка данных о бронировании
 * POST /api/v1/bookings
 */
export const postBooking = async (bookingData) => {
    await delay(800);

    // Валидация
    const errors = [];

    if (!bookingData.flat_id) {
        errors.push({ field: 'flat_id', message: 'ID квартиры обязателен.' });
    }

    if (!bookingData.client_name || bookingData.client_name.trim().length < 2) {
        errors.push({ field: 'client_name', message: 'Имя должно содержать минимум 2 символа.' });
    }

    if (!bookingData.client_phone || bookingData.client_phone.trim().length < 10) {
        errors.push({ field: 'client_phone', message: 'Номер телефона обязателен.' });
    }

    if (!bookingData.booking_datetime) {
        errors.push({ field: 'booking_datetime', message: 'Время бронирования обязательно.' });
    }

    // Проверка доступности квартиры
    if (bookingData.flat_id && !isFlatAvailable(bookingData.flat_id)) {
        errors.push({ field: 'flat_id', message: 'Указана недоступная квартира.' });
    }

    if (errors.length > 0) {
        return {
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Ошибка валидации входных данных.',
                details: errors
            }
        };
    }

    // Создание бронирования
    const newBooking = createBooking(bookingData);

    return {
        success: true,
        message: 'Бронирование успешно оформлено.',
        data: {
            booking: newBooking
        }
    };
};

/**
 * Получение всех бронирований
 * GET /api/v1/bookings
 */
export const getBookings = async () => {
    await delay(400);
    
    return {
        success: true,
        data: {
            bookings: bookingsStore
        }
    };
};