const header = document.querySelector('.header');

// Slider Control
function showNutrition() {
    const pages = document.querySelector(".pages");
    if (pages) pages.style.transform = "translateX(-100vw)";
    window.scrollTo(0, 0);
    if (header) header.classList.add('compact');
}

function showRoutine() {
    const pages = document.querySelector(".pages");
    if (pages) pages.style.transform = "translateX(-200vw)";
    window.scrollTo(0, 0);
    if (header) header.classList.add('compact');
    updateCurrentDate();
    renderCalendar();
}

function updateCurrentDate() {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', options);
    const display = document.getElementById('displayDate');
    if (display) display.innerText = today;
}

function goHome() {
    const pages = document.querySelector(".pages");
    if (pages) pages.style.transform = "translateX(0)";
    window.scrollTo(0, 0);
    if (header) header.classList.remove('compact');
}

// Nutrition Filtering Logic
function filterFood() {
    const query = document.getElementById('foodSearch').value.toLowerCase();
    const cards = document.querySelectorAll('.food-card');
    
    cards.forEach(card => {
        const name = card.getAttribute('data-name');
        if (name.includes(query)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function setFilter(category) {
    const cards = document.querySelectorAll('.food-card');
    const buttons = document.querySelectorAll('.filter-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }

    cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (category === 'all' || cat.includes(category)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Routine Logic
let tasksTotal = 0;
let tasksCompleted = 0;
let history = JSON.parse(localStorage.getItem('routine_history')) || {};

function updateStats() {
    const totalCount = document.getElementById('totalCount');
    const completedCount = document.getElementById('completedCount');
    if (totalCount) totalCount.innerText = tasksTotal;
    if (completedCount) completedCount.innerText = tasksCompleted;
    
    const empty = document.getElementById('emptyState');
    if (empty) {
        if (tasksTotal > 0) {
            empty.style.display = 'none';
        } else {
            empty.style.display = 'block';
        }
    }
    
    calculateConsistency();
    renderCalendar();
}

function calculateConsistency() {
    const past7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    });
    
    const activeDays = past7Days.filter(date => history[date] > 0).length;
    const score = Math.round((activeDays / 7) * 100);
    const consistencyScore = document.getElementById('consistencyScore');
    if (consistencyScore) consistencyScore.innerText = `${score}%`;
}

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const display = document.getElementById('monthYearDisplay');
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    
    if (display) {
        display.innerText = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    
    if (!grid) return;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    grid.innerHTML = '';
    const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysShort.forEach(d => {
        const el = document.createElement('div');
        el.className = 'day-label';
        el.innerText = d;
        grid.appendChild(el);
    });
    
    for (let i = 0; i < firstDay; i++) {
        grid.appendChild(document.createElement('div'));
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'day-cell';
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        cell.innerText = day;
        
        if (day === now.getDate()) cell.classList.add('today');
        if (history[dateKey] > 0) {
            cell.classList.add('completed-day');
            const count = document.createElement('span');
            count.className = 'completion-count';
            count.innerText = `${history[dateKey]} done`;
            cell.appendChild(count);
        }
        
        grid.appendChild(cell);
    }
}

function updateHistory(change) {
    const today = new Date().toISOString().split('T')[0];
    history[today] = (history[today] || 0) + change;
    if (history[today] < 0) history[today] = 0;
    localStorage.setItem('routine_history', JSON.stringify(history));
}

function addTask() {
    const name = document.getElementById("taskName");
    const category = document.getElementById("taskCategory");
    const start = document.getElementById("startTime");
    const end = document.getElementById("endTime");

    if (!name || !name.value) return;

    tasksTotal++;
    const taskList = document.getElementById("taskList");
    if (!taskList) return;

    const task = document.createElement("div");
    task.classList.add("task-item");
    task.setAttribute('data-category', category.value);

    task.innerHTML = `
        <div class="task-visual">
            <div class="category-dot"></div>
        </div>
        <div class="task-details">
            <div class="task-main">
                <strong>${name.value}</strong>
                <span class="category-tag">${category.options[category.selectedIndex].text}</span>
            </div>
            <p class="task-time">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${start.value || '--:--'} to ${end.value || '--:--'}
            </p>
        </div>
        <div class="task-actions">
            <button class="complete-check" onclick="toggleComplete(this)">✔</button>
            <button class="delete-task" onclick="deleteTask(this)">✕</button>
        </div>
    `;

    taskList.appendChild(task);
    name.value = "";
    updateStats();
}

function toggleComplete(btn) {
    const item = btn.closest('.task-item');
    if (!item || item.classList.contains('exit')) return;
    
    item.classList.add('exit');
    tasksCompleted++;
    updateHistory(1);
    
    setTimeout(() => {
        item.remove();
        updateStats();
    }, 500);
}

function deleteTask(btn) {
    const item = btn.closest('.task-item');
    if (!item) return;
    if (item.classList.contains('completed')) {
        tasksCompleted--;
        updateHistory(-1);
    }
    tasksTotal--;
    item.remove();
    updateStats();
}

// Login/Logout Logic
window.addEventListener('load', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');
    const logoutLink = document.getElementById('logoutLink');
    const loginLink = document.getElementById('loginLink');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const heroBtn = document.getElementById('heroBtn');
    
    if (isLoggedIn === 'true') {
        if (logoutLink) logoutLink.style.display = 'block';
        if (loginLink) loginLink.style.display = 'none';
        if (welcomeMessage) {
            welcomeMessage.style.display = 'flex';
            welcomeMessage.style.alignItems = 'center';
            welcomeMessage.style.gap = '8px';
            if (userNameDisplay) userNameDisplay.innerText = username || 'User';
        }
        if (heroBtn) {
            heroBtn.innerText = 'Explore Routine';
            heroBtn.onclick = showRoutine;
            heroBtn.href = 'javascript:void(0)';
        }
    } else {
        if (logoutLink) logoutLink.style.display = 'none';
        if (loginLink) loginLink.style.display = 'block';
        if (welcomeMessage) welcomeMessage.style.display = 'none';
        if (heroBtn) {
            heroBtn.innerText = 'Get Started Now';
            heroBtn.onclick = null;
            heroBtn.href = '../LOGIN-CODE/Login.html';
        }
    }
});

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = '../LOGIN-CODE/Login.html';
}
