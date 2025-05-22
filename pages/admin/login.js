import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin');
      } else {
        setError(data.message || 'Credenciais inválidas');
      }
    } catch (error) {
      setError('Erro ao conectar com o servidor. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Login - Oftalmocenter</title>
        <meta name="description" content="Área administrativa da Oftalmocenter" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" />
      </Head>

      <main>
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-md-6 col-lg-4">
            <div className="text-center mb-4">
              <img src="/img/logo.png" alt="Oftalmocenter" className="img-fluid mb-4" style={{ maxWidth: '200px' }} />
              <h1 className="h4 text-primary">Central de Controle</h1>
            </div>

            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h2 className="card-title text-center mb-4">Login</h2>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Usuário</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={credentials.username}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Senha</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Entrando...' : 'Entrar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="text-center mt-3">
              <p className="text-muted">
                <small>
                  Acesso restrito à equipe da Oftalmocenter.<br />
                  Credenciais padrão: admin/admin
                </small>
              </p>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        body {
          background-color: #f8f9fa;
          color: #333;
        }
        .card {
          border-radius: 10px;
          border: none;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .btn-primary {
          background-color: #3b5998;
          border-color: #3b5998;
          border-radius: 30px;
          padding: 8px 20px;
        }
        .btn-primary:hover {
          background-color: #2d4373;
          border-color: #2d4373;
        }
        .text-primary {
          color: #3b5998 !important;
        }
      `}</style>
    </div>
  );
}
