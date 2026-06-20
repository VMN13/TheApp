import axios from 'axios';

const DEFAULT_API_BASE_URL = 'https://serverusers-87tl.onrender.com/api';

export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
});

const STATUS_HINTS = {
    400: 'Проверьте корректность введённых данных.',
    401: 'Неверные учётные данные или требуется повторный вход.',
    403: 'Доступ запрещён. Возможно, требуется подтверждение email.',
    404: 'Сервис авторизации недоступен по указанному адресу.',
    429: 'Слишком много попыток. Попробуйте позже.',
    500: 'Ошибка на сервере. Попробуйте позже или обратитесь в поддержку.',
    502: 'Шлюз недоступен. Сервер временно не отвечает.',
    503: 'Сервис временно недоступен. Повторите попытку позже.',
    504: 'Сервер не ответил вовремя. Повторите попытку.',
};

function extractRequestId(response) {
    const headers = response?.headers || {};
    return (
        headers['x-request-id'] ||
        headers['x-correlation-id'] ||
        headers['request-id'] ||
        null
    );
}

function extractBackendMessage(data) {
    if (!data) return '';

    if (typeof data === 'string') return data;

    const candidates = [
        data.error,
        data.message,
        data.details,
        data.detail,
        data.reason,
    ];

    const textCandidate = candidates.find((item) => typeof item === 'string' && item.trim());
    if (textCandidate) return textCandidate;

    return '';
}

export function getApiErrorMessage(error, fallback = 'Ошибка запроса') {
    if (!error.response) {
        return 'Сеть недоступна или сервер не отвечает. Проверьте интернет и попробуйте снова.';
    }

    const status = error.response.status;
    const backendMessage = extractBackendMessage(error.response.data);
    const requestId = extractRequestId(error.response);
    const statusHint = STATUS_HINTS[status] || 'Произошла ошибка при обращении к серверу.';

    const parts = [
        backendMessage || fallback,
        `Статус: ${status}.`,
        statusHint,
    ];

    if (requestId) {
        parts.push(`Request ID: ${requestId}.`);
    }

    return parts.join(' ');
}
