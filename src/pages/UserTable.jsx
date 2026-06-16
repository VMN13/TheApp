import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserTable({ user }) {
    const [users, setUsers] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    // Функция для получения актуального токена при каждом вызове
    const getConfig = () => {
        const token = localStorage.getItem('token');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const fetchUsers = async () => {
        // Проверяем токен перед запросом
        const token = localStorage.getItem('token');
        if (!token) {
            handleLogout();
            return;
        }

        try {
const response = await axios.get('/api/users', getConfig());
            setUsers(response.data);
        } catch (err) {
            console.error("Ошибка fetchUsers:", err);
            // Не вызываем handleLogout здесь, чтобы избежать цикла
            if (err.response?.status === 401 || err.response?.status === 403) {
                handleLogout();
                return;
            }
        } finally {
            setLoading(false);
        }
    };

    // note: Получаем список пользователей при загрузке
    useEffect(() => {
        let isMounted = true;

        const loadUsers = async () => {
            if (!isMounted) return;

            // Проверяем токен
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                await fetchUsers();
            } catch (error) {
                console.error("Ошибка загрузки пользователей:", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadUsers();

        return () => {
            isMounted = false;
        };
    }, []);

    // note: Выбрать всех / снять выбор
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelected(users.map(u => u.id));
        } else {
            setSelected([]);
        }
    };

    // note: Выбрать одного пользователя
    const handleSelectUser = (id) => {
        setSelected(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

// important: Блокировка пользователей
    const handleBlock = async () => {
        if (selected.length === 0) return;
        
        try {
await axios.put('/api/users/status', 
                { ids: selected, status: 'blocked' }, getConfig());
            setMessage({ type: 'success', text: 'Пользователи заблокированы' });
            fetchUsers();
            setSelected([]);
        } catch (err) {
            console.error("Block error:", err);
            setMessage({ type: 'error', text: 'Ошибка блокировки' });
        }
    };

    // important: Разблокировка пользователей
    const handleUnblock = async () => {
        if (selected.length === 0) return;
        
        try {
await axios.put('/api/users/status',
                { ids: selected, status: 'active' }, getConfig());
            setMessage({ type: 'success', text: 'Пользователи разблокированы' });
            fetchUsers();
            setSelected([]);
        } catch (err) {
            console.error("Unblock error:", err);
            setMessage({ type: 'error', text: 'Ошибка разблокировки' });
        }
    };

    // important: Удаление пользователей
    const handleDelete = async () => {
        if (selected.length === 0) return;
        
        try {
await axios.delete('/api/users',
                { data: { ids: selected }, ...getConfig() });
            setMessage({ type: 'success', text: 'Пользователи удалены' });
            fetchUsers();
            setSelected([]);
        } catch (err) {
            console.error("Delete error:", err);
            setMessage({ type: 'error', text: 'Ошибка удаления' });
        }
    };

    // important: Удаление неподтвержденных
    const handleDeleteUnverified = async () => {
        try {
await axios.delete('/api/users/unverified', getConfig());
            setMessage({ type: 'success', text: 'Неподтвержденные удалены' });
            fetchUsers();
            setSelected([]);
        } catch (err) {
            console.error("Delete unverified error:", err);
            setMessage({ type: 'error', text: 'Ошибка удаления' });
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleString('ru-RU');
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'blocked': return 'bg-red-100 text-red-800';
            case 'unverified': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const hasUnverified = users.some(u => u.status === 'unverified');

    if (loading) return <div className="p-4">Загрузка...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Header */}
            <div className="bg-white shadow mb-4">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Пользователи</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Привет, {user.name}</span>
                        <button onClick={handleLogout} className="text-blue-600 hover:underline">Выйти</button>
                    </div>
                </div>
            </div>

            {/* Message */}
            {message && (
                <div className={`max-w-7xl mx-auto px-4 mb-4 p-3 rounded border ${
                    message.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'
                }`}>
                    {message.text}
                </div>
            )}

            {/* Toolbar */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-gray-100 p-3 rounded flex gap-2">
                    <button onClick={handleBlock} disabled={selected.length === 0}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        Block
                    </button>
                    <button onClick={handleUnblock} disabled={selected.length === 0}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        Unblock
                    </button>
                    <button onClick={handleDelete} disabled={selected.length === 0}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        Delete
                    </button>
                    <button onClick={handleDeleteUnverified} disabled={!hasUnverified}
                        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed">
                        Delete Unverified
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white shadow rounded mt-4 overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left w-10">
                                    <input type="checkbox" 
                                        checked={selected.length === users.length && users.length > 0}
                                        onChange={handleSelectAll} className="w-4 h-4" />
                                </th>
                                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Name</th>
                                <th className="px-4 py-3 text-left text-gray-700 font-semibold">E-mail</th>
                                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Last Login</th>
                                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3 text-center">
                                        <input type="checkbox" 
                                            checked={selected.includes(u.id)}
                                            onChange={() => handleSelectUser(u.id)}
                                            className="w-4 h-4" />
                                    </td>
                                    <td className="px-4 py-3">{u.name}</td>
                                    <td className="px-4 py-3">{u.email}</td>
                                    <td className="px-4 py-3">{formatDate(u.last_login)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-sm ${getStatusClass(u.status)}`}>
                                            {u.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default UserTable;