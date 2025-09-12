//создание задачи
const createTask = (id, text) => ({ //ф-я возвращает объект задачи с параметрами id, text, completed
    id: id,
    text: text,
    completed: false
});

//добавление задачи
const addTask = (tasks, taskText) => {
    const newId = tasks.length; //новый id = длина списка задач
    const newTask = createTask(newId, taskText); //создание новой задачи с новым id
    return [...tasks, newTask];
};

//меняем параметр completed (выполнена/ не выполнена)  //только меняет данные (что делать?)
const switchTask = (tasks, taskId) => {
    return tasks.map(task =>
        task.id === taskId  //taskId - номер, который передали в функцию , по которому щелкнули
            ? { ...task, completed: !task.completed } //создание объекта с измененным свойством
            : task //задача без изменений
    );
};

//удаление задачи
const deleteTask = (tasks, taskId) => {
    return tasks.filter(task => task.id !== taskId);
};


//фильтр (Все/ Активные/ Завершенные)
const filterTasks = (tasks, filterStatus) => {
    switch(filterStatus) {
        case 'active':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        default:
            return tasks;
    }
};

// Создание элемента списка в интерфейсе
const renderTask = (task, onSwitch, onDelete) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.onchange = () => onSwitch(task.id);

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Удалить';
    deleteBtn.onclick = () => onDelete(task.id);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    return li;
};

//создание списка дел
const renderTaskList = (tasks, onSwitch, onDelete) => {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        const emptyState = document.createElement('li');
        emptyState.className = 'empty-state';
        emptyState.textContent = 'Задачи не найдены.';
        taskList.appendChild(emptyState);
        return;
    }

    tasks.forEach(task => {
        taskList.appendChild(renderTask(task, onSwitch, onDelete));
    });
};


let tasks = []; //задачи
let statusFilter = 'all';

const updateUI = () => {
    const filteredTasks = filterTasks(tasks, statusFilter); //отфильтрованный список согласно statusFilter
    renderTaskList(filteredTasks, processSwitchTask, processDeleteTask);
};

const processAddTask = () => {
    const input = document.getElementById('task-input');
    const text = input.value.trim();

    if (text) {
        tasks = addTask(tasks, text);
        input.value = '';
        updateUI();
    }
};

const processSwitchTask = (taskId) => { //как делать?
    tasks = switchTask(tasks, taskId);
    updateUI();
};

const processDeleteTask = (taskId) => {
    tasks = deleteTask(tasks, taskId);
    updateUI();
};

const processFilterChange = (filterStatus) => {
    statusFilter = filterStatus;
    updateUI();

    // обновление активной кнопки фильтра
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filterStatus}"]`).classList.add('active');
};

// Настройка обработчиков событий
document.getElementById('add-btn').addEventListener('click', processAddTask);

document.getElementById('task-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        processAddTask();
    }
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        processFilterChange(e.target.dataset.filter);
    });
});

updateUI();
