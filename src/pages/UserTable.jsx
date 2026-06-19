import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserTable() {
    const [users, setUsers] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const getUniqIdValue = (prefix, value) => `${prefix}-${value}`;

    const getAuthConfig = () => {
        const token = localStorage.getItem('token');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const processProtectedRequestError = (err, fallbackMessage) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
            handleLogout();
            return true;
        }
        setMessage({ type: 'error', text: fallbackMessage });
        return false;
    };

    const loadUsers = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            handleLogout();
            return;
        }

        try {
            const response = await axios.get('https://serverusers-87tl.onrender.com/api/users', getAuthConfig());
            setUsers(response.data);
        } catch (err) {
            console.error('Ошибка fetchUsers:', err);
            processProtectedRequestError(err, 'Не удалось загрузить пользователей.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        Promise.resolve().then(loadUsers);
    }, []);

    const toggleSelectAllUsers = (e) => {
        if (e.target.checked) {
            setSelected(users.map((u) => u.id));
        } else {
            setSelected([]);
        }
    };

    const toggleSelectUser = (id) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    const blockSelectedUsers = async () => {
        if (selected.length === 0) return;
        try {
            await axios.put(
                'https://serverusers-87tl.onrender.com/api/users/status',
                { ids: selected, status: 'blocked' },
                getAuthConfig()
            );
            setMessage({ type: 'success', text: 'Пользователи заблокированы.' });
            await loadUsers();
            setSelected([]);
        } catch (err) {
            console.error('Block error:', err);
            processProtectedRequestError(err, 'Ошибка блокировки.');
        }
    };

    const unblockSelectedUsers = async () => {
        if (selected.length === 0) return;
        try {
            await axios.put(
                'https://serverusers-87tl.onrender.com/api/users/status',
                { ids: selected, status: 'active' },
                getAuthConfig()
            );
            setMessage({ type: 'success', text: 'Пользователи разблокированы.' });
            await loadUsers();
            setSelected([]);
        } catch (err) {
            console.error('Unblock error:', err);
            processProtectedRequestError(err, 'Ошибка разблокировки.');
        }
    };

    const deleteSelectedUsers = async () => {
        if (selected.length === 0) return;
        try {
            await axios.delete('https://serverusers-87tl.onrender.com/api/users', {
                data: { ids: selected },
                ...getAuthConfig()
            });
            setMessage({ type: 'success', text: 'Пользователи удалены.' });
            await loadUsers();
            setSelected([]);
        } catch (err) {
            console.error('Delete error:', err);
            processProtectedRequestError(err, 'Ошибка удаления.');
        }
    };

    const deleteUnverifiedUsers = async () => {
        try {
            await axios.delete('https://serverusers-87tl.onrender.com/api/users/unverified', getAuthConfig());
            setMessage({ type: 'success', text: 'Неподтверждённые пользователи удалены.' });
            await loadUsers();
            setSelected([]);
        } catch (err) {
            console.error('Delete unverified error:', err);
            processProtectedRequestError(err, 'Ошибка удаления неподтверждённых.');
        }
    };

    const formatDateTime = (dateStr) => (dateStr ? new Date(dateStr).toLocaleString('ru-RU') : '-');

    const getUserStatusClass = (status) => {
        if (status === 'active') return 'text-green-600 font-medium';
        if (status === 'blocked') return 'text-red-600 font-medium';
        return 'text-yellow-600 font-medium';
    };

    if (loading) {
        return <div className="text-center py-6">Загрузка...</div>;
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            {message && (
                <div
                    className={`mb-4 rounded-md border px-4 py-2 text-sm ${
                        message.type === 'success'
                            ? 'border-green-300 bg-green-50 text-green-700'
                            : 'border-red-300 bg-red-50 text-red-700'
                    }`}
                    role="status"
                >
                    {message.text}
                </div>
            )}

            <div className="mb-4 overflow-x-auto">
                <div className="flex w-max flex-nowrap items-center gap-2">
                    <button
                        onClick={blockSelectedUsers}
                        disabled={selected.length === 0}
                        className="px-3 py-2 rounded-md bg-yellow-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Заблокировать выбранных пользователей"
                    >
                        Block
                    </button>

                    <button
                        onClick={unblockSelectedUsers}
                        disabled={selected.length === 0}
                        className="px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Разблокировать выбранных пользователей"
                        aria-label="Unblock selected users"
                    >
                        🔓
                    </button>

                    <button
                        onClick={deleteSelectedUsers}
                        disabled={selected.length === 0}
                        className="px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Удалить выбранных пользователей"
                        aria-label="Delete selected users"
                    >
                        🗑️
                    </button>

                    <button
                        onClick={deleteUnverifiedUsers}
                        className="px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                        title="Удалить всех неподтверждённых пользователей"
                        aria-label="Delete unverified users"
                    >
                        🧹
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left align-middle">
                                <input
                                    id={getUniqIdValue('select-all', 'users')}
                                    type="checkbox"
                                    checked={selected.length === users.length && users.length > 0}
                                    onChange={toggleSelectAllUsers}
                                />
                            </th>
                            <th className="px-4 py-3 text-left align-middle">ID</th>
                            <th className="px-4 py-3 text-left align-middle">Имя</th>
                            <th className="px-4 py-3 text-left align-middle">Email</th>
                            <th className="px-4 py-3 text-left align-middle">Статус</th>
                            <th className="px-4 py-3 text-left align-middle">Создан</th>
                            <th className="px-4 py-3 text-left align-middle">Последний вход</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => {
                            const checkboxId = getUniqIdValue('select-user', u.id);
                            return (
                                <tr key={u.id} className="border-t">
                                    <td className="px-4 py-3 text-left align-middle">
                                        <input
                                            id={checkboxId}
                                            type="checkbox"
                                            checked={selected.includes(u.id)}
                                            onChange={() => toggleSelectUser(u.id)}
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-left align-middle">{u.id}</td>
                                    <td className="px-4 py-3 text-left align-middle">{u.name}</td>
                                    <td className="px-4 py-3 text-left align-middle">{u.email}</td>
                                    <td className={`px-4 py-3 text-left align-middle ${getUserStatusClass(u.status)}`}>{u.status}</td>
                                    <td className="px-4 py-3 text-left align-middle">{formatDateTime(u.created_at)}</td>
                                    <td className="px-4 py-3 text-left align-middle">{formatDateTime(u.last_login)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserTable;
