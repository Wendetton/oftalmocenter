import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [stats, setStats] = useState({
    totalAgendamentos: 0,
    agendamentosHoje: 0,
    unidades: 0,
    medicos: 0
  });

  useEffect(() => {
    // Verificar autenticação
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/usuarios');
        const data = await res.json();
        
        if (!data.success) {
          router.push('/admin/login');
          return;
        }
        
        setUser({ nome: 'Administrador' }); // Placeholder
        setIsLoading(false);
        
        // Carregar dados
        fetchAgendamentos();
        fetchStats();
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        router.push('/admin/login');
      }
    };
    
    checkAuth();
  }, [router]);
  
  const fetchAgendamentos = async () => {
    try {
      const res = await fetch('/api/agendamentos');
      const data = await res.json();
      
      if (data.success) {
        setAgendamentos(data.data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    }
  };
  
  const fetchStats = async () => {
    try {
      // Em uma implementação real, teríamos um endpoint específico para estatísticas
      // Aqui estamos simulando com dados de exemplo
      
      // Carregar unidades
      const resUnidades = await fetch('/api/unidades');
      const dataUnidades = await resUnidades.json();
      
      // Carregar médicos
      const resMedicos = await fetch('/api/medicos');
      const dataMedicos = await resMedicos.json();
      
      setStats({
        totalAgendamentos: agendamentos.length,
        agendamentosHoje: agendamentos.filter(a => 
          new Date(a.dataConsulta).toDateString() === new Date().toDateString()
        ).length,
        unidades: dataUnidades.success ? dataUnidades.data.length : 0,
        medicos: dataMedicos.success ? dataMedicos.data.length : 0
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };
  
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST'
      });
      router.push('/admin/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Painel Administrativo - Oftalmocenter</title>
        <meta name="description" content="Painel administrativo da Oftalmocenter" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" />
      </Head>

      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse">
            <div className="position-sticky pt-3">
              <div className="text-center mb-4">
                <img src="/img/logo.png" alt="Oftalmocenter" className="img-fluid mb-3" style={{ maxWidth: '150px' }} />
                <h6 className="text-white">Central de Controle</h6>
              </div>
              
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Link href="/admin" className="nav-link active text-white">
                    <i className="bi bi-speedometer2 me-2"></i>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/admin/unidades" className="nav-link text-white">
                    <i className="bi bi-building me-2"></i>
                    Unidades
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/admin/medicos" className="nav-link text-white">
                    <i className="bi bi-person-badge me-2"></i>
                    Médicos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/admin/planos" className="nav-link text-white">
                    <i className="bi bi-card-list me-2"></i>
                    Planos de Saúde
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/admin/horarios" className="nav-link text-white">
                    <i className="bi bi-calendar-check me-2"></i>
                    Horários
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/admin/agendamentos" className="nav-link text-white">
                    <i className="bi bi-journal-text me-2"></i>
                    Agendamentos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/admin/usuarios" className="nav-link text-white">
                    <i className="bi bi-people me-2"></i>
                    Usuários
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/admin/configuracoes" className="nav-link text-white">
                    <i className="bi bi-gear me-2"></i>
                    Configurações
                  </Link>
                </li>
              </ul>
              
              <hr className="text-white-50" />
              
              <div className="px-3 mt-4">
                <button 
                  className="btn btn-outline-light w-100"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Sair
                </button>
              </div>
            </div>
          </nav>

          {/* Main content */}
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 className="h2">Dashboard</h1>
              <div className="btn-toolbar mb-2 mb-md-0">
                <div className="dropdown">
                  <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="bi bi-person-circle me-1"></i>
                    {user?.nome || 'Usuário'}
                  </button>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">Perfil</a></li>
                    <li><a className="dropdown-item" href="#">Configurações</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="#" onClick={handleLogout}>Sair</a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Stats cards */}
            <div className="row">
              <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-primary shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                          Total de Agendamentos
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.totalAgendamentos}</div>
                      </div>
                      <div className="col-auto">
                        <i className="bi bi-calendar-check fs-2 text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-success shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                          Agendamentos Hoje
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.agendamentosHoje}</div>
                      </div>
                      <div className="col-auto">
                        <i className="bi bi-calendar-day fs-2 text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-info shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                          Unidades
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.unidades}</div>
                      </div>
                      <div className="col-auto">
                        <i className="bi bi-building fs-2 text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-warning shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                          Médicos
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.medicos}</div>
                      </div>
                      <div className="col-auto">
                        <i className="bi bi-person-badge fs-2 text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent appointments */}
            <div className="card shadow mb-4">
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">Agendamentos Recentes</h6>
                <Link href="/admin/agendamentos" className="btn btn-sm btn-primary">
                  Ver Todos
                </Link>
              </div>
              <div className="card-body">
                {agendamentos.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>Paciente</th>
                          <th>Médico</th>
                          <th>Unidade</th>
                          <th>Data</th>
                          <th>Hora</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {agendamentos.slice(0, 5).map((agendamento) => (
                          <tr key={agendamento._id}>
                            <td>{agendamento.nomeCliente}</td>
                            <td>{agendamento.medico?.nome || 'Médico'}</td>
                            <td>{agendamento.unidade?.nome || 'Unidade'}</td>
                            <td>{new Date(agendamento.dataConsulta).toLocaleDateString('pt-BR')}</td>
                            <td>{agendamento.horaConsulta}</td>
                            <td>
                              <span className={`badge ${
                                agendamento.status === 'Agendado' ? 'bg-warning' :
                                agendamento.status === 'Confirmado' ? 'bg-primary' :
                                agendamento.status === 'Realizado' ? 'bg-success' :
                                'bg-danger'
                              }`}>
                                {agendamento.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="bi bi-calendar-x fs-1 text-muted"></i>
                    <p className="mt-2 text-muted">Nenhum agendamento encontrado</p>
                    <Link href="/admin/agendamentos/novo" className="btn btn-primary">
                      Criar Agendamento
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className="row">
              <div className="col-lg-6 mb-4">
                <div className="card shadow mb-4">
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Ações Rápidas</h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <Link href="/admin/unidades/nova" className="btn btn-block btn-outline-primary w-100">
                          <i className="bi bi-building-add me-2"></i>
                          Nova Unidade
                        </Link>
                      </div>
                      <div className="col-md-6 mb-3">
                        <Link href="/admin/medicos/novo" className="btn btn-block btn-outline-primary w-100">
                          <i className="bi bi-person-plus me-2"></i>
                          Novo Médico
                        </Link>
                      </div>
                      <div className="col-md-6 mb-3">
                        <Link href="/admin/planos/novo" className="btn btn-block btn-outline-primary w-100">
                          <i className="bi bi-card-list me-2"></i>
                          Novo Plano
                        </Link>
                      </div>
                      <div className="col-md-6 mb-3">
                        <Link href="/admin/horarios/novo" className="btn btn-block btn-outline-primary w-100">
                          <i className="bi bi-calendar-plus me-2"></i>
                          Novo Horário
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 mb-4">
                <div className="card shadow mb-4">
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Configuração Inicial</h6>
                  </div>
                  <div className="card-body">
                    <p>Para começar a usar a plataforma, siga os passos abaixo:</p>
                    <ol>
                      <li>Cadastre as unidades de atendimento</li>
                      <li>Cadastre os médicos</li>
                      <li>Cadastre os planos de saúde</li>
                      <li>Associe os planos aos médicos</li>
                      <li>Cadastre os horários disponíveis</li>
                      <li>Configure as mensagens de confirmação</li>
                    </ol>
                    <Link href="/admin/configuracoes" className="btn btn-primary">
                      <i className="bi bi-gear me-2"></i>
                      Ir para Configurações
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <style jsx global>{`
        body {
          font-size: .875rem;
          background-color: #f8f9fa;
        }
        
        .sidebar {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 100;
          padding: 48px 0 0;
          box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
        }
        
        .sidebar-sticky {
          position: relative;
          top: 0;
          height: calc(100vh - 48px);
          padding-top: .5rem;
          overflow-x: hidden;
          overflow-y: auto;
        }
        
        .sidebar .nav-link {
          font-weight: 500;
          color: #333;
        }
        
        .sidebar .nav-link.active {
          color: #2470dc;
        }
        
        .sidebar .nav-link:hover {
          color: #007bff;
        }
        
        .navbar-brand {
          padding-top: .75rem;
          padding-bottom: .75rem;
          font-size: 1rem;
          background-color: rgba(0, 0, 0, .25);
          box-shadow: inset -1px 0 0 rgba(0, 0, 0, .25);
        }
        
        .navbar .navbar-toggler {
          top: .25rem;
          right: 1rem;
        }
        
        .border-left-primary {
          border-left: .25rem solid #4e73df !important;
        }
        
        .border-left-success {
          border-left: .25rem solid #1cc88a !important;
        }
        
        .border-left-info {
          border-left: .25rem solid #36b9cc !important;
        }
        
        .border-left-warning {
          border-left: .25rem solid #f6c23e !important;
        }
        
        .text-gray-300 {
          color: #dddfeb !important;
        }
        
        .text-gray-800 {
          color: #5a5c69 !important;
        }
        
        @media (max-width: 767.98px) {
          .sidebar {
            top: 5rem;
          }
        }
      `}</style>
    </div>
  );
}
