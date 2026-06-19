import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    useEffect(() => {
        if (id) {
            window.location.href = `https://serverusers-87tl.onrender.com/api/verify-email?id=${id}`;
        }
    }, [id]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <p>Подтверждение email...</p>
        </div>
    );
}

export default VerifyEmail;