import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, getApiErrorMessage } from '../api';

function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setError('');
        setLoading(true);

        try {
            await api.post('/register', formData);
            navigate('/login?registered=true', { replace: true });
        } catch (err) {
            setError(getApiErrorMessage(err, 'Ошибка регистрации'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 sm:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">Регистрация</h1>
                
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 sm:p-4 rounded mb-4 text-sm sm:text-base">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 sm:mb-6">
                        <label className="block text-gray-700 text-sm sm:font-semibold mb-2">
                            Имя
                        </label>
                        <input 
                            type="text" 
                            placeholder="Ваше имя" 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base sm:text-lg"
                            required 
                        />
                    </div>
                    
                    <div className="mb-4 sm:mb-6">
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
                    
                    <div className="mb-6 sm:mb-8">
                        <label className="block text-gray-700 text-sm sm:font-semibold mb-2">
                            Пароль
                        </label>
                        <input 
                            type="password" 
                            placeholder="Придумайте пароль" 
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-base sm:text-lg"
                            required 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-green-600 text-white font-semibold py-3 sm:py-4 px-4 rounded-lg hover:bg-green-700 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>
                
                <p className="mt-6 sm:mt-8 text-center text-sm sm:text-base text-gray-600">
                    Есть аккаунт?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline font-semibold">
                        Вход
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;