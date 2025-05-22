import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirecionar para a página de login
    router.push('/admin/login');
  }, [router]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Head>
        <title>Redirecionando - Oftalmocenter</title>
      </Head>
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p>Redirecionando para a área administrativa...</p>
      </div>
    </div>
  );
}
