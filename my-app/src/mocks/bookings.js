// src/mocks/bookings.js
// Хранилище бронирований (имитация базы)
export let bookingsStore = [];

// Счётчик ID для бронирований
let bookingIdCounter = 1000;

// Функция для создания нового бронирования
export const createBooking = (data) => {
    const newBooking = {
        id: bookingIdCounter++,
        flat_id: data.flat_id,
        client_name: data.client_name,
        client_phone: data.client_phone,
        status: "confirmed",
        created_at: data.booking_datetime || new Date().toISOString()
    };
    
    bookingsStore.push(newBooking);
    return newBooking;
};

// Проверка доступности квартиры (имитация)
export const isFlatAvailable = (flatId) => {
    // Имитация: не все квартиры доступны
    const unavailableFlats = [7, 11]; // недоступные ID
    return !unavailableFlats.includes(flatId);
};