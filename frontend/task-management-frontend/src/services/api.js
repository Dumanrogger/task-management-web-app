import axios from 'axios';

// Создаем экземпляр Axios с базовым URL
const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor для добавления JWT-токена к каждому запросу
api.interceptors.request.use(
    (config) => {
        // Проверяем, есть ли JWT-токен в localStorage
        const token = localStorage.getItem('token');

        if (token) {
            // Добавляем заголовок Authorization с Bearer токеном
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor для обработки ответов (опционально, для обработки ошибок авторизации)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Если получили 401 (Unauthorized), значит токен недействителен
        if (error.response && error.response.status === 401) {
            // Очищаем localStorage от недействительных данных
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Перенаправляем на страницу входа
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

// Примеры использования:
const getTasks = async () => {
    const response = await api.get('/api/tasks');
    return response.data;
};

const createTask = async (taskData) => {
    const response = await api.post('/api/tasks', taskData);
    return response.data;
};

const login = async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
};

export default api;