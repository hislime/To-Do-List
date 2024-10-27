document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Display tasks from localStorage
    renderTasks();

    // Add Task
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') addTask();
    });

    // Filter tasks
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            renderTasks(filter);
        });
    });

    // Add task function
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Please enter a task');
            return;
        }
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskInput.value = '';
        renderTasks();
    }

    // Render tasks to the DOM
    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';

        const filteredTasks = tasks.filter(task => {
            if (filter === 'completed') return task.completed;
            if (filter === 'pending') return !task.completed;
            return true; // for 'all'
        });

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';
            li.innerHTML = `
                ${task.text}
                <div>
                    <button class="remove-btn" onclick="removeTask(${task.id})">X</button>
                    <button onclick="toggleComplete(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }

    // Toggle task complete/pending
    window.toggleComplete = function (id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                task.completed = !task.completed;
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    // Remove task
    window.removeTask = function (id) {
        tasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };
});
