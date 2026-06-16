import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
await axios.post('https://the-app-pi.vercel.app/api/register', formData);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
} catch (err) {
            const errorMsg = err.response?.data?.error;
            setError(typeof errorMsg === 'string' ? errorMsg : 'Ошибка регистрации');
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
                    <div className="bg-green-100 text-green-700 p-4 sm:p-6 rounded-lg text-base sm:text-lg">
                        ✅ Регистрация успешна!
                        <br/>
                        <span className="text-sm">Перенаправление на страницу входа...</span>
                    </div>
                </div>
            </div>
        );
    }

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
                        className="w-full bg-green-600 text-white font-semibold py-3 sm:py-4 px-4 rounded-lg hover:bg-green-700 text-base sm:text-lg"
                    >
                        Зарегистрироваться
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