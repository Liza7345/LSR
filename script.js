const data = [
    { id: 1, rooms: 1, price: 4800000, area: 38.5, floor: 3, totalFloors: 12, address: "корпус 1" },
    { id: 2, rooms: 1, price: 5250000, area: 42.2, floor: 7, totalFloors: 12, address: "корпус 1" },
    { id: 3, rooms: 2, price: 7850000, area: 58.7, floor: 5, totalFloors: 14, address: "корпус 2" },
    { id: 4, rooms: 2, price: 8420000, area: 63.1, floor: 9, totalFloors: 14, address: "корпус 2" },
    { id: 5, rooms: 2, price: 9300000, area: 71.4, floor: 12, totalFloors: 14, address: "корпус 2" },
    { id: 6, rooms: 3, price: 12400000, area: 86.2, floor: 6, totalFloors: 16, address: "корпус 3" },
    { id: 7, rooms: 3, price: 13800000, area: 94.8, floor: 10, totalFloors: 16, address: "корпус 3" },
    { id: 8, rooms: 3, price: 15300000, area: 105.5, floor: 14, totalFloors: 16, address: "корпус 3" },
    { id: 9, rooms: 1, price: 4970000, area: 40.1, floor: 4, totalFloors: 12, address: "корпус 1" },
    { id: 10, rooms: 2, price: 8870000, area: 67.3, floor: 8, totalFloors: 14, address: "корпус 2" },
    { id: 11, rooms: 3, price: 16800000, area: 112, floor: 15, totalFloors: 16, address: "корпус 3" },
    { id: 12, rooms: 2, price: 7680000, area: 55.9, floor: 2, totalFloors: 14, address: "корпус 2" }
];

let currentApt = null;

const listEl = document.getElementById('list');
const countEl = document.getElementById('count');
const modal = document.getElementById('modal');
const modalInfo = document.getElementById('modalInfo');
const form = document.getElementById('form');
const toast = document.getElementById('toast');

function filterApartments() {
    const rooms = document.getElementById('rooms').value;
    const minPrice = +document.getElementById('minPrice').value || 0;
    const maxPrice = +document.getElementById('maxPrice').value || 3e7;
    const minArea = +document.getElementById('minArea').value || 0;
    const maxArea = +document.getElementById('maxArea').value || 200;

    return data.filter(apt => {
        if (rooms !== 'all' && apt.rooms !== +rooms) return false;
        if (apt.price < minPrice || apt.price > maxPrice) return false;
        if (apt.area < minArea || apt.area > maxArea) return false;
        return true;
    });
}

function render() {
    const filtered = filterApartments();
    countEl.textContent = filtered.length;

    if (!filtered.length) {
        listEl.innerHTML = '<p style="grid-column:1/-1; text-align:center">Квартир не найдено</p>';
        return;
    }

    listEl.innerHTML = filtered.map(apt => `
        <div class="card">
            <h3>${apt.rooms}-комнатная</h3>
            <p>📐 ${apt.area} м² | Этаж ${apt.floor}/${apt.totalFloors}</p>
            <p>📍 ${apt.address}</p>
            <div class="price">${apt.price.toLocaleString()} ₽</div>
            <button onclick="openModal(${apt.id})">Забронировать</button>
        </div>
    `).join('');
}

window.openModal = (id) => {
    currentApt = data.find(a => a.id === id);
    modalInfo.innerHTML = `
        <strong>${currentApt.rooms}-комнатная</strong><br>
        Площадь: ${currentApt.area} м² | Цена: ${currentApt.price.toLocaleString()} ₽<br>
        Этаж ${currentApt.floor}, ${currentApt.address}
    `;
    form.reset();
    modal.style.display = 'flex';
};

function closeModal() {
    modal.style.display = 'none';
    currentApt = null;
}

function showToast(msg, isError = false) {
    toast.textContent = msg;
    toast.style.background = isError ? '#b91c1c' : '#1e293b';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

form.onsubmit = (e) => {
    e.preventDefault();
    if (!currentApt) return showToast('Ошибка', true);

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!name || !phone) return showToast('Заполните имя и телефон', true);

    console.log('Бронирование:', { currentApt, name, phone });
    showToast(`${name}, вы забронировали ${currentApt.rooms}-комнатную квартиру!`);
    closeModal();
};

document.querySelector('.close').onclick = closeModal;
window.onclick = (e) => { if (e.target === modal) closeModal(); };

document.getElementById('rooms').onchange = render;
document.getElementById('minPrice').oninput = render;
document.getElementById('maxPrice').oninput = render;
document.getElementById('minArea').oninput = render;
document.getElementById('maxArea').oninput = render;
document.getElementById('reset').onclick = () => {
    document.getElementById('rooms').value = 'all';
    document.getElementById('minPrice').value = '0';
    document.getElementById('maxPrice').value = '30000000';
    document.getElementById('minArea').value = '0';
    document.getElementById('maxArea').value = '150';
    render();
};

render();