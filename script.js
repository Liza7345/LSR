// подготовила массив с данными квартир (как будто база данных)
const apartmentsData = [
    { id: 1, rooms: 1, price: 4800000, area: 38.5, floor: 3, totalFloors: 12, address: "корпус 1, секция А" },
    { id: 2, rooms: 1, price: 5250000, area: 42.2, floor: 7, totalFloors: 12, address: "корпус 1, секция А" },
    { id: 3, rooms: 2, price: 7850000, area: 58.7, floor: 5, totalFloors: 14, address: "корпус 2, секция B" },
    { id: 4, rooms: 2, price: 8420000, area: 63.1, floor: 9, totalFloors: 14, address: "корпус 2, секция B" },
    { id: 5, rooms: 2, price: 9300000, area: 71.4, floor: 12, totalFloors: 14, address: "корпус 2, секция C" },
    { id: 6, rooms: 3, price: 12400000, area: 86.2, floor: 6, totalFloors: 16, address: "корпус 3, секция D" },
    { id: 7, rooms: 3, price: 13800000, area: 94.8, floor: 10, totalFloors: 16, address: "корпус 3, секция D" },
    { id: 8, rooms: 3, price: 15300000, area: 105.5, floor: 14, totalFloors: 16, address: "корпус 3, секция E" },
    { id: 9, rooms: 1, price: 4970000, area: 40.1, floor: 4, totalFloors: 12, address: "корпус 1, секция А" },
    { id: 10, rooms: 2, price: 8870000, area: 67.3, floor: 8, totalFloors: 14, address: "корпус 2, секция C" },
    { id: 11, rooms: 3, price: 16800000, area: 112.0, floor: 15, totalFloors: 16, address: "корпус 3, секция E" },
    { id: 12, rooms: 2, price: 7680000, area: 55.9, floor: 2, totalFloors: 14, address: "корпус 2, секция B" }
];

// получила ссылки на все нужные DOM-элементы
const apartmentsContainer = document.getElementById('apartmentsList');
const roomsSelect = document.getElementById('rooms');
const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPrice');
const minAreaInput = document.getElementById('minArea');
const maxAreaInput = document.getElementById('maxArea');
const resetBtn = document.getElementById('resetFilters');
const apartmentCountSpan = document.getElementById('apartmentCount');
const modal = document.getElementById('bookingModal');
const closeModalSpan = document.querySelector('.close-modal');
const modalApartmentInfo = document.getElementById('modalApartmentInfo');
const bookingForm = document.getElementById('bookingForm');
const toastMsg = document.getElementById('toastMessage');

// запоминаю квартиру, которую выбрали для бронирования
let currentBookingApartment = null;

// фильтрую квартиры по выбранным параметрам
function getFilteredApartments() {
    const roomsVal = roomsSelect.value;
    const minPrice = parseInt(minPriceInput.value) || 0;
    const maxPrice = parseInt(maxPriceInput.value) || 30000000;
    const minArea = parseFloat(minAreaInput.value) || 0;
    const maxArea = parseFloat(maxAreaInput.value) || 200;

    return apartmentsData.filter(apt => {
        if (roomsVal !== 'all' && apt.rooms !== parseInt(roomsVal)) return false;
        if (apt.price < minPrice || apt.price > maxPrice) return false;
        if (apt.area < minArea || apt.area > maxArea) return false;
        return true;
    });
}

// отрисовываю карточки квартир на странице
function renderApartments() {
    const filtered = getFilteredApartments();
    apartmentCountSpan.textContent = filtered.length;

    if (filtered.length === 0) {
        apartmentsContainer.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding: 3rem; background:#fef2f2; border-radius: 2rem;">🏡 К сожалению, квартир по таким параметрам не найдено. Попробуйте изменить фильтры.</div>`;
        return;
    }

    apartmentsContainer.innerHTML = filtered.map(apt => {
        const priceFormatted = new Intl.NumberFormat('ru-RU').format(apt.price);
        return `
            <div class="apartment-card" data-id="${apt.id}">
                <div class="card-content">
                    <div class="apartment-title">
                        <span>${apt.rooms}-комнатная</span>
                        <span class="rooms-badge">${apt.rooms} комн.</span>
                    </div>
                    <div class="apartment-details">
                        <div class="detail-item"><span class="detail-label">Площадь</span><span>${apt.area} м²</span></div>
                        <div class="detail-item"><span class="detail-label">Этаж</span><span>${apt.floor} / ${apt.totalFloors}</span></div>
                        <div class="detail-item"><span class="detail-label">Корпус</span><span>${apt.address}</span></div>
                    </div>
                    <div class="price">${priceFormatted} ₽ <span>за всю квартиру</span></div>
                    <button class="book-btn" data-id="${apt.id}">Забронировать</button>
                </div>
            </div>
        `;
    }).join('');

    // после отрисовки навешиваю обработчики на кнопки бронирования
    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const aptId = parseInt(btn.getAttribute('data-id'));
            const apartment = apartmentsData.find(a => a.id === aptId);
            if (apartment) {
                openBookingModal(apartment);
            }
        });
    });
}

// открываю модальное окно с формой бронирования
function openBookingModal(apartment) {
    currentBookingApartment = apartment;
    const priceFormatted = new Intl.NumberFormat('ru-RU').format(apartment.price);
    modalApartmentInfo.innerHTML = `
        <strong>${apartment.rooms}-комнатная квартира</strong><br>
        📐 Площадь: ${apartment.area} м² &nbsp;| 💰 ${priceFormatted} ₽<br>
        📍 Этаж ${apartment.floor}, ${apartment.address}
    `;
    // очищаю форму перед показом
    document.getElementById('userName').value = '';
    document.getElementById('userPhone').value = '';
    document.getElementById('userEmail').value = '';
    document.getElementById('comment').value = '';
    modal.style.display = 'flex';
}

// закрываю модальное окно
function closeModal() {
    modal.style.display = 'none';
    currentBookingApartment = null;
}

// обрабатываю отправку формы бронирования
function handleBookingSubmit(e) {
    e.preventDefault();
    if (!currentBookingApartment) {
        showToast('Ошибка: выберите квартиру', true);
        return;
    }

    const userName = document.getElementById('userName').value.trim();
    const userPhone = document.getElementById('userPhone').value.trim();
    const userEmail = document.getElementById('userEmail').value.trim();
    const comment = document.getElementById('comment').value.trim();

    if (!userName || !userPhone) {
        showToast('Пожалуйста, укажите имя и телефон для бронирования', true);
        return;
    }

    // здесь имитирую отправку данных на сервер
    const bookingData = {
        apartmentId: currentBookingApartment.id,
        rooms: currentBookingApartment.rooms,
        area: currentBookingApartment.area,
        price: currentBookingApartment.price,
        client: { name: userName, phone: userPhone, email: userEmail || 'не указан', comment: comment || '—' },
        date: new Date().toISOString()
    };
    console.log('✅ БРОНИРОВАНИЕ (demo):', bookingData);
    
    showToast(`✔️ ${userName}, вы успешно забронировали ${currentBookingApartment.rooms}-комнатную квартиру! Свяжемся в ближайшее время.`, false);
    
    closeModal();
}

// показываю всплывающее уведомление
function showToast(message, isError = false) {
    toastMsg.textContent = message;
    toastMsg.style.backgroundColor = isError ? '#b91c1c' : '#1e293b';
    toastMsg.classList.add('show');
    setTimeout(() => {
        toastMsg.classList.remove('show');
        toastMsg.style.backgroundColor = '#1e293b';
    }, 3000);
}

// сбрасываю все фильтры в исходное состояние
function resetFilters() {
    roomsSelect.value = 'all';
    minPriceInput.value = '0';
    maxPriceInput.value = '30000000';
    minAreaInput.value = '0';
    maxAreaInput.value = '150';
    renderApartments();
}

// подписываюсь на изменения фильтров
function bindFilterEvents() {
    roomsSelect.addEventListener('change', renderApartments);
    minPriceInput.addEventListener('input', renderApartments);
    maxPriceInput.addEventListener('input', renderApartments);
    minAreaInput.addEventListener('input', renderApartments);
    maxAreaInput.addEventListener('input', renderApartments);
    resetBtn.addEventListener('click', resetFilters);
}

// настраиваю работу модального окна
function bindModalEvents() {
    closeModalSpan.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    bookingForm.addEventListener('submit', handleBookingSubmit);
}

// запускаю всё при загрузке страницы
function init() {
    bindFilterEvents();
    bindModalEvents();
    renderApartments();
}

init();
