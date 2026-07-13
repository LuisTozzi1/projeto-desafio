import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DixiLogoMark from '../../components/DixiLogoMark';
import { useAuth } from '../../context/AuthContext';
import { extrairMensagemErro } from '../../utils';
import '../../components/sidebar.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await login(username.trim(), senha);
      navigate('/funcionarios');
    } catch (err) {
      setErro(extrairMensagemErro(err) || 'Usuário ou senha inválidos');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-box">
        <div className="login-logo">
          <div className="login-logo-mark">
            <DixiLogoMark size={32} />
          </div>
          <strong>DIXI SOLUÇÕES</strong>
          <span>GESTÃO DE FUNCIONÁRIOS</span>
        </div>

        <h1>Acesse sua conta</h1>
        <p className="subtitle">Entre com seu usuário e senha para continuar</p>

        {erro && <div className="alert alert-error" data-cy="login-error">{erro}</div>}

        <form onSubmit={handleSubmit} data-cy="login-form">
          <div className="field">
            <label htmlFor="username">Usuário</label>
            <input
              id="username"
              data-cy="login-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              autoFocus
              required
            />
          </div>

          <div className="field">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              data-cy="login-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={carregando} data-cy="login-submit">
            {carregando ? <span className="spinner" /> : 'Entrar'}
          </button>
        </form>

        <p className="login-hint">Usuário de teste: admin / admin123</p>
      </div>
    </div>
  );
}
