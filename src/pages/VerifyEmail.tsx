import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authService } from '@/services';
import { getErrorMessage } from '@/utils/errorHandler';

type Status = 'loading' | 'success' | 'error';

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Link de verificação inválido.');
        return;
      }

      try {
        const res = await authService.verifyEmail(token);
        setStatus('success');
        setMessage(res.message);
      } catch (err) {
        setStatus('error');
        setMessage(getErrorMessage(err));
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
        <h1 className="text-3xl font-bold text-primary-600 mb-6">🎓 FocusFlow</h1>

        {status === 'loading' && (
          <>
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Verificando seu email...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Email verificado!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Fazer login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Falha na verificação</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              to="/register"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Cadastrar novamente
            </Link>
          </>
        )}
      </div>
    </div>
  );
}