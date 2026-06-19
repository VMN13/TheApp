import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const verified = useMemo(() => searchParams.get('verified') === 'true', [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Заполните все поля');
            return;
        }

        try {
            const response = await axios.post('https://serverusers-87tl.onrender.com/api/login', formData);
            const { token, name, status } = response.data;

            if (!token) {
                setError('Токен не получен');
                return;
            }

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ name, status }));
            onLogin({ name, status });
            navigate('/');
        } catch (err) {
            const errorMsg = err.response?.data?.error;
            setError(typeof errorMsg === 'string' ? errorMsg : 'Ошибка входа');
        }
    };

    return (
        <div className="min-h-[calc(100vh-120px)] sm:min-h-screen flex items-center justify-center bg-gray-100 px-4 py-2 sm:p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4 sm:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-800">Вход</h1>
                
                {verified && (
                    <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                        ✅ Email подтвержден! Теперь можно войти.
                    </div>
                )}
                
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 sm:mb-6">
                        <label className="block text-gray-700 text-sm sm:font-semibold mb-2">
                            Email
                        </label>
                        <input 
                            type="email" 
                            placeholder="email@example.com" 
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base sm:text-lg"
                            required 
                        />
                    </div>
                    
                    <div className="mb-4 sm:mb-8">
                        <label className="block text-gray-700 text-sm sm:font-semibold mb-2">
                            Пароль
                        </label>
                        <input 
                            type="password" 
                            placeholder="Введите пароль" 
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base sm:text-lg"
                            required 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white font-semibold py-2.5 sm:py-4 px-4 rounded-lg hover:bg-blue-700 text-sm sm:text-lg"
                    >
                        Войти
                    </button>
                </form>
                
                <p className="mt-4 sm:mt-8 text-center text-sm sm:text-base text-gray-600">
                    Нет аккаунта?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline font-semibold">
                        Регистрация
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;