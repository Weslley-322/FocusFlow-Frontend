import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Button, Input, Alert } from '@/components';
import { getErrorMessage } from '@/utils/errorHandler';

export function Register() {
  const { register } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      const result = await register(name, email, password);
      // Mostrar mensagem de sucesso em vez de redirecionar
      setSuccessMessage(result.message);
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Logo/Título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600 mb-2">
            🎓 FocusFlow
          </h1>
          <p className="text-gray-600">Crie sua conta gratuita</p>
        </div>

        {/* Mensagem de sucesso */}
        {successMessage && (
          <div className="mb-6">
            <Alert type="success">
              <p className="font-medium">Cadastro realizado! 🎉</p>
              <p className="text-sm mt-1">{successMessage}</p>
            </Alert>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="mb-6">
            <Alert type="error">{error}</Alert>
          </div>
        )}

        {/* Formulário — oculto após sucesso */}
        {!successMessage && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Nome completo"
              type="text"
              placeholder="João Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              helperText="Mínimo de 6 caracteres"
            />
            <Input
              label="Confirmar senha"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <Button type="submit" fullWidth isLoading={isLoading} disabled={isLoading}>
              Criar conta
            </Button>
          </form>
        )}

        {/* Link para login */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}