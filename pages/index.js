import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [step, setStep] = useState(0);
  const [unidades, setUnidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  
  const [selectedUnidade, setSelectedUnidade] = useState(null);
  const [selectedMedico, setSelectedMedico] = useState(null);
  const [selectedPlano, setSelectedPlano] = useState(null);
  const [selectedHorario, setSelectedHorario] = useState(null);
  
  const [formData, setFormData] = useState({
    nomeCliente: '',
    sexo: 'Masculino',
    dataNascimento: '',
    cpf: '',
    telefone: '',
    email: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Carregar unidades ao iniciar
  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const res = await fetch('/api/unidades');
        const data = await res.json();
        if (data.success) {
          setUnidades(data.data);
        }
      } catch (error) {
        console.error('Erro ao carregar unidades:', error);
      }
    };
    
    fetchUnidades();
  }, []);
  
  // Carregar médicos quando unidade for selecionada
  useEffect(() => {
    if (selectedUnidade) {
      const fetchMedicos = async () => {
        try {
          const res = await fetch('/api/medicos');
          const data = await res.json();
          if (data.success) {
            // Filtrar médicos por unidade
            const medicosUnidade = data.data.filter(medico => 
              medico.unidades.some(u => u._id === selectedUnidade._id)
            );
            setMedicos(medicosUnidade);
          }
        } catch (error) {
          console.error('Erro ao carregar médicos:', error);
        }
      };
      
      fetchMedicos();
    }
  }, [selectedUnidade]);
  
  // Carregar planos quando médico for selecionado
  useEffect(() => {
    if (selectedMedico) {
      const fetchPlanos = async () => {
        try {
          const res = await fetch('/api/planos');
          const data = await res.json();
          if (data.success) {
            setPlanos(data.data);
          }
        } catch (error) {
          console.error('Erro ao carregar planos:', error);
        }
      };
      
      fetchPlanos();
    }
  }, [selectedMedico]);
  
  // Carregar horários quando médico e unidade forem selecionados
  useEffect(() => {
    if (selectedMedico && selectedUnidade) {
      const fetchHorarios = async () => {
        try {
          const res = await fetch(`/api/horarios?medico=${selectedMedico._id}&unidade=${selectedUnidade._id}`);
          const data = await res.json();
          if (data.success) {
            setHorarios(data.data);
          }
        } catch (error) {
          console.error('Erro ao carregar horários:', error);
        }
      };
      
      fetchHorarios();
    }
  }, [selectedMedico, selectedUnidade]);
  
  const handleUnidadeSelect = (unidade) => {
    setSelectedUnidade(unidade);
    setSelectedMedico(null);
    setSelectedPlano(null);
    setSelectedHorario(null);
    setStep(1);
  };
  
  const handleMedicoSelect = (medico) => {
    setSelectedMedico(medico);
    setSelectedPlano(null);
    setSelectedHorario(null);
    setStep(2);
  };
  
  const handlePlanoSelect = (plano) => {
    setSelectedPlano(plano);
    setSelectedHorario(null);
    setStep(3);
  };
  
  const handleHorarioSelect = (horario) => {
    setSelectedHorario(horario);
    setStep(4);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validar nome
    if (!formData.nomeCliente.trim()) {
      newErrors.nomeCliente = 'Nome é obrigatório';
    }
    
    // Validar data de nascimento
    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    }
    
    // Validar CPF
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else {
      // Validar formato do CPF
      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      if (!cpfRegex.test(formData.cpf)) {
        newErrors.cpf = 'CPF inválido. Use o formato 000.000.000-00';
      }
    }
    
    // Validar telefone
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else {
      // Validar formato do telefone
      const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
      if (!telefoneRegex.test(formData.telefone)) {
        newErrors.telefone = 'Telefone inválido. Use o formato (00) 00000-0000';
      }
    }
    
    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else {
      // Validar formato do email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'E-mail inválido';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const res = await fetch('/api/agendamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          medico: selectedMedico._id,
          unidade: selectedUnidade._id,
          plano: selectedPlano._id,
          horarioId: selectedHorario._id
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSubmitSuccess(true);
        setStep(5);
      } else {
        setSubmitError(data.message || 'Erro ao agendar consulta');
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setSubmitError('Erro ao conectar com o servidor. Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setStep(0);
    setSelectedUnidade(null);
    setSelectedMedico(null);
    setSelectedPlano(null);
    setSelectedHorario(null);
    setFormData({
      nomeCliente: '',
      sexo: 'Masculino',
      dataNascimento: '',
      cpf: '',
      telefone: '',
      email: ''
    });
    setErrors({});
    setSubmitSuccess(false);
    setSubmitError('');
  };
  
  return (
    <div className="container">
      <Head>
        <title>Oftalmocenter - Agendamento de Consultas</title>
        <meta name="description" content="Agende sua consulta na Oftalmocenter" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" />
      </Head>
      
      <main>
        <div className="text-center my-5">
          <img src="/img/logo.png" alt="Oftalmocenter" className="img-fluid mb-4" style={{ maxWidth: '300px' }} />
          <h1 className="display-5 fw-bold text-primary">Central de Agendamentos</h1>
          <p className="lead">Agende sua consulta de forma rápida e fácil</p>
        </div>
        
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                {/* Progresso */}
                <div className="progress mb-4" style={{ height: '10px' }}>
                  <div 
                    className="progress-bar bg-primary" 
                    role="progressbar" 
                    style={{ width: `${(step / 5) * 100}%` }}
                    aria-valuenow={(step / 5) * 100} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  ></div>
                </div>
                
                {/* Etapa 0: Seleção de Unidade */}
                {step === 0 && (
                  <div>
                    <h2 className="card-title mb-4">Selecione a Unidade</h2>
                    {unidades.length === 0 ? (
                      <div className="alert alert-info">
                        Carregando unidades disponíveis...
                        {/* Mostrar unidades de exemplo enquanto carrega */}
                        <div className="row mt-3">
                          <div className="col-md-6 mb-3">
                            <div className="card h-100">
                              <div className="card-body">
                                <h5 className="card-title placeholder-glow">
                                  <span className="placeholder col-6"></span>
                                </h5>
                                <p className="card-text placeholder-glow">
                                  <span className="placeholder col-7"></span>
                                  <span className="placeholder col-4"></span>
                                  <span className="placeholder col-4"></span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className="card h-100">
                              <div className="card-body">
                                <h5 className="card-title placeholder-glow">
                                  <span className="placeholder col-6"></span>
                                </h5>
                                <p className="card-text placeholder-glow">
                                  <span className="placeholder col-7"></span>
                                  <span className="placeholder col-4"></span>
                                  <span className="placeholder col-4"></span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="row">
                        {unidades.map((unidade) => (
                          <div key={unidade._id} className="col-md-6 mb-3">
                            <div 
                              className="card h-100 cursor-pointer"
                              onClick={() => handleUnidadeSelect(unidade)}
                              style={{ cursor: 'pointer' }}
                            >
                              <img 
                                src={unidade.imagemPath || "/img/unidade-default.jpg"} 
                                className="card-img-top" 
                                alt={unidade.nome}
                                style={{ height: '150px', objectFit: 'cover' }}
                              />
                              <div className="card-body">
                                <h5 className="card-title">{unidade.nome}</h5>
                                <p className="card-text">
                                  <small className="text-muted">
                                    <i className="bi bi-geo-alt"></i> {unidade.endereco}
                                  </small>
                                  <br />
                                  <small className="text-muted">
                                    <i className="bi bi-telephone"></i> {unidade.telefone}
                                  </small>
                                </p>
                                <button className="btn btn-primary">Selecionar</button>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Unidades de exemplo se não houver nenhuma cadastrada */}
                        {unidades.length === 0 && (
                          <>
                            <div className="col-md-6 mb-3">
                              <div 
                                className="card h-100 cursor-pointer"
                                onClick={() => handleUnidadeSelect({
                                  _id: 'exemplo1',
                                  nome: 'Oftalmocenter - Unidade Centro',
                                  endereco: 'Av. Principal, 123 - Centro',
                                  telefone: '(91) 3322-1234'
                                })}
                                style={{ cursor: 'pointer' }}
                              >
                                <img 
                                  src="/img/unidade-default.jpg" 
                                  className="card-img-top" 
                                  alt="Unidade Centro"
                                  style={{ height: '150px', objectFit: 'cover' }}
                                />
                                <div className="card-body">
                                  <h5 className="card-title">Oftalmocenter - Unidade Centro</h5>
                                  <p className="card-text">
                                    <small className="text-muted">
                                      <i className="bi bi-geo-alt"></i> Av. Principal, 123 - Centro
                                    </small>
                                    <br />
                                    <small className="text-muted">
                                      <i className="bi bi-telephone"></i> (91) 3322-1234
                                    </small>
                                  </p>
                                  <button className="btn btn-primary">Selecionar</button>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 mb-3">
                              <div 
                                className="card h-100 cursor-pointer"
                                onClick={() => handleUnidadeSelect({
                                  _id: 'exemplo2',
                                  nome: 'Oftalmocenter - Unidade Norte',
                                  endereco: 'Rua das Flores, 456 - Bairro Norte',
                                  telefone: '(91) 3322-5678'
                                })}
                                style={{ cursor: 'pointer' }}
                              >
                                <img 
                                  src="/img/unidade-default.jpg" 
                                  className="card-img-top" 
                                  alt="Unidade Norte"
                                  style={{ height: '150px', objectFit: 'cover' }}
                                />
                                <div className="card-body">
                                  <h5 className="card-title">Oftalmocenter - Unidade Norte</h5>
                                  <p className="card-text">
                                    <small className="text-muted">
                                      <i className="bi bi-geo-alt"></i> Rua das Flores, 456 - Bairro Norte
                                    </small>
                                    <br />
                                    <small className="text-muted">
                                      <i className="bi bi-telephone"></i> (91) 3322-5678
                                    </small>
                                  </p>
                                  <button className="btn btn-primary">Selecionar</button>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Etapa 1: Seleção de Médico */}
                {step === 1 && (
                  <div>
                    <h2 className="card-title mb-4">Selecione o Médico</h2>
                    <div className="mb-3">
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => setStep(0)}
                      >
                        <i className="bi bi-arrow-left"></i> Voltar
                      </button>
                    </div>
                    
                    {medicos.length === 0 ? (
                      <div className="alert alert-info">
                        Carregando médicos disponíveis...
                        {/* Mostrar médicos de exemplo enquanto carrega */}
                        <div className="row mt-3">
                          <div className="col-md-6 mb-3">
                            <div className="card h-100">
                              <div className="card-body text-center">
                                <div className="rounded-circle placeholder mb-3" style={{ width: '120px', height: '120px', margin: '0 auto' }}></div>
                                <h5 className="card-title placeholder-glow">
                                  <span className="placeholder col-6"></span>
                                </h5>
                                <p className="card-text placeholder-glow">
                                  <span className="placeholder col-4"></span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className="card h-100">
                              <div className="card-body text-center">
                                <div className="rounded-circle placeholder mb-3" style={{ width: '120px', height: '120px', margin: '0 auto' }}></div>
                                <h5 className="card-title placeholder-glow">
                                  <span className="placeholder col-6"></span>
                                </h5>
                                <p className="card-text placeholder-glow">
                                  <span className="placeholder col-4"></span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="row">
                        {medicos.map((medico) => (
                          <div key={medico._id} className="col-md-6 mb-3">
                            <div 
                              className="card h-100 cursor-pointer"
                              onClick={() => handleMedicoSelect(medico)}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="card-body text-center">
                                <img 
                                  src={medico.fotoPath || "/img/medico-default.jpg"} 
                                  className="rounded-circle mb-3" 
                                  alt={medico.nome}
                                  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                />
                                <h5 className="card-title">{medico.nome}</h5>
                                <p className="card-text text-muted">
                                  {medico.especialidade || "Médico Oftalmologista"}
                                </p>
                                <button className="btn btn-primary">Selecionar</button>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Médicos de exemplo se não houver nenhum cadastrado */}
                        {medicos.length === 0 && (
                          <>
                            <div className="col-md-6 mb-3">
                              <div 
                                className="card h-100 cursor-pointer"
                                onClick={() => handleMedicoSelect({
                                  _id: 'exemplo1',
                                  nome: 'Dr. João Silva',
                                  especialidade: 'Médico Oftalmologista'
                                })}
                                style={{ cursor: 'pointer' }}
                              >
                                <div className="card-body text-center">
                                  <img 
                                    src="/img/medico-default.jpg" 
                                    className="rounded-circle mb-3" 
                                    alt="Dr. João Silva"
                                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                  />
                                  <h5 className="card-title">Dr. João Silva</h5>
                                  <p className="card-text text-muted">
                                    Médico Oftalmologista
                                  </p>
                                  <button className="btn btn-primary">Selecionar</button>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 mb-3">
                              <div 
                                className="card h-100 cursor-pointer"
                                onClick={() => handleMedicoSelect({
                                  _id: 'exemplo2',
                                  nome: 'Dra. Maria Santos',
                                  especialidade: 'Médica Oftalmologista'
                                })}
                                style={{ cursor: 'pointer' }}
                              >
                                <div className="card-body text-center">
                                  <img 
                                    src="/img/medico-default.jpg" 
                                    className="rounded-circle mb-3" 
                                    alt="Dra. Maria Santos"
                                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                  />
                                  <h5 className="card-title">Dra. Maria Santos</h5>
                                  <p className="card-text text-muted">
                                    Médica Oftalmologista
                                  </p>
                                  <button className="btn btn-primary">Selecionar</button>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Etapa 2: Seleção de Plano de Saúde */}
                {step === 2 && (
                  <div>
                    <h2 className="card-title mb-4">Selecione o Plano de Saúde</h2>
                    <div className="mb-3">
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => setStep(1)}
                      >
                        <i className="bi bi-arrow-left"></i> Voltar
                      </button>
                    </div>
                    
                    {planos.length === 0 ? (
                      <div className="alert alert-info">
                        Carregando planos disponíveis...
                        {/* Mostrar planos de exemplo enquanto carrega */}
                        <div className="list-group mt-3">
                          <div className="list-group-item placeholder-glow">
                            <span className="placeholder col-6"></span>
                          </div>
                          <div className="list-group-item placeholder-glow">
                            <span className="placeholder col-6"></span>
                          </div>
                          <div className="list-group-item placeholder-glow">
                            <span className="placeholder col-6"></span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="list-group">
                        {planos.map((plano) => (
                          <button
                            key={plano._id}
                            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                            onClick={() => handlePlanoSelect(plano)}
                          >
                            {plano.nome}
                            <i className="bi bi-chevron-right"></i>
                          </button>
                        ))}
                        
                        {/* Plano particular sempre disponível */}
                        <button
                          className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                          onClick={() => handlePlanoSelect({
                            _id: 'particular',
                            nome: 'Particular'
                          })}
                        >
                          Particular
                          <span className="badge bg-primary rounded-pill">R$ 300,00</span>
                        </button>
                        
                        {/* Planos de exemplo se não houver nenhum cadastrado */}
                        {planos.length === 0 && (
                          <>
                            <button
                              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                              onClick={() => handlePlanoSelect({
                                _id: 'exemplo1',
                                nome: 'Unimed'
                              })}
                            >
                              Unimed
                              <i className="bi bi-chevron-right"></i>
                            </button>
                            <button
                              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                              onClick={() => handlePlanoSelect({
                                _id: 'exemplo2',
                                nome: 'Bradesco Saúde'
                              })}
                            >
                              Bradesco Saúde
                              <i className="bi bi-chevron-right"></i>
                            </button>
                            <button
                              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                              onClick={() => handlePlanoSelect({
                                _id: 'exemplo3',
                                nome: 'SulAmérica'
                              })}
                            >
                              SulAmérica
                              <i className="bi bi-chevron-right"></i>
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Etapa 3: Seleção de Horário */}
                {step === 3 && (
                  <div>
                    <h2 className="card-title mb-4">Selecione o Horário</h2>
                    <div className="mb-3">
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => setStep(2)}
                      >
                        <i className="bi bi-arrow-left"></i> Voltar
                      </button>
                    </div>
                    
                    {horarios.length === 0 ? (
                      <div className="alert alert-info">
                        Carregando horários disponíveis...
                        {/* Mostrar horários de exemplo enquanto carrega */}
                        <div className="row mt-3">
                          <div className="col-md-4 mb-3">
                            <div className="card placeholder-glow">
                              <div className="card-body">
                                <h5 className="card-title">
                                  <span className="placeholder col-6"></span>
                                </h5>
                                <p className="card-text">
                                  <span className="placeholder col-4"></span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 mb-3">
                            <div className="card placeholder-glow">
                              <div className="card-body">
                                <h5 className="card-title">
                                  <span className="placeholder col-6"></span>
                                </h5>
                                <p className="card-text">
                                  <span className="placeholder col-4"></span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 mb-3">
                            <div className="card placeholder-glow">
                              <div className="card-body">
                                <h5 className="card-title">
                                  <span className="placeholder col-6"></span>
                                </h5>
                                <p className="card-text">
                                  <span className="placeholder col-4"></span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {horarios.length > 0 ? (
                          <div className="row">
                            {horarios.map((horario) => (
                              <div key={horario._id} className="col-md-4 mb-3">
                                <div 
                                  className="card cursor-pointer"
                                  onClick={() => handleHorarioSelect(horario)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <div className="card-body text-center">
                                    <h5 className="card-title">
                                      {new Date(horario.data).toLocaleDateString('pt-BR')}
                                    </h5>
                                    <p className="card-text">
                                      {horario.horaInicio}
                                    </p>
                                    <button className="btn btn-primary">Selecionar</button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="alert alert-warning">
                            Não há horários disponíveis para este médico nesta unidade.
                          </div>
                        )}
                        
                        {/* Horários de exemplo se não houver nenhum cadastrado */}
                        {horarios.length === 0 && (
                          <div className="row">
                            <div className="col-md-4 mb-3">
                              <div 
                                className="card cursor-pointer"
                                onClick={() => handleHorarioSelect({
                                  _id: 'exemplo1',
                                  data: new Date(),
                                  horaInicio: '08:00'
                                })}
                                style={{ cursor: 'pointer' }}
                              >
                                <div className="card-body text-center">
                                  <h5 className="card-title">
                                    {new Date().toLocaleDateString('pt-BR')}
                                  </h5>
                                  <p className="card-text">
                                    08:00
                                  </p>
                                  <button className="btn btn-primary">Selecionar</button>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4 mb-3">
                              <div 
                                className="card cursor-pointer"
                                onClick={() => handleHorarioSelect({
                                  _id: 'exemplo2',
                                  data: new Date(),
                                  horaInicio: '10:30'
                                })}
                                style={{ cursor: 'pointer' }}
                              >
                                <div className="card-body text-center">
                                  <h5 className="card-title">
                                    {new Date().toLocaleDateString('pt-BR')}
                                  </h5>
                                  <p className="card-text">
                                    10:30
                                  </p>
                                  <button className="btn btn-primary">Selecionar</button>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4 mb-3">
                              <div 
                                className="card cursor-pointer"
                                onClick={() => handleHorarioSelect({
                                  _id: 'exemplo3',
                                  data: new Date(new Date().setDate(new Date().getDate() + 1)),
                                  horaInicio: '14:00'
                                })}
                                style={{ cursor: 'pointer' }}
                              >
                                <div className="card-body text-center">
                                  <h5 className="card-title">
                                    {new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString('pt-BR')}
                                  </h5>
                                  <p className="card-text">
                                    14:00
                                  </p>
                                  <button className="btn btn-primary">Selecionar</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Etapa 4: Formulário de Dados do Paciente */}
                {step === 4 && (
                  <div>
                    <h2 className="card-title mb-4">Dados do Paciente</h2>
                    <div className="mb-3">
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => setStep(3)}
                      >
                        <i className="bi bi-arrow-left"></i> Voltar
                      </button>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="nomeCliente" className="form-label">Nome Completo</label>
                        <input
                          type="text"
                          className={`form-control ${errors.nomeCliente ? 'is-invalid' : ''}`}
                          id="nomeCliente"
                          name="nomeCliente"
                          value={formData.nomeCliente}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.nomeCliente && (
                          <div className="invalid-feedback">
                            {errors.nomeCliente}
                          </div>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="sexo" className="form-label">Sexo</label>
                        <select
                          className="form-select"
                          id="sexo"
                          name="sexo"
                          value={formData.sexo}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="Masculino">Masculino</option>
                          <option value="Feminino">Feminino</option>
                          <option value="Não Informar">Prefiro não informar</option>
                        </select>
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="dataNascimento" className="form-label">Data de Nascimento</label>
                        <input
                          type="date"
                          className={`form-control ${errors.dataNascimento ? 'is-invalid' : ''}`}
                          id="dataNascimento"
                          name="dataNascimento"
                          value={formData.dataNascimento}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.dataNascimento && (
                          <div className="invalid-feedback">
                            {errors.dataNascimento}
                          </div>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="cpf" className="form-label">CPF</label>
                        <input
                          type="text"
                          className={`form-control ${errors.cpf ? 'is-invalid' : ''}`}
                          id="cpf"
                          name="cpf"
                          placeholder="000.000.000-00"
                          value={formData.cpf}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.cpf && (
                          <div className="invalid-feedback">
                            {errors.cpf}
                          </div>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="telefone" className="form-label">Telefone</label>
                        <input
                          type="text"
                          className={`form-control ${errors.telefone ? 'is-invalid' : ''}`}
                          id="telefone"
                          name="telefone"
                          placeholder="(00) 00000-0000"
                          value={formData.telefone}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.telefone && (
                          <div className="invalid-feedback">
                            {errors.telefone}
                          </div>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">E-mail</label>
                        <input
                          type="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.email && (
                          <div className="invalid-feedback">
                            {errors.email}
                          </div>
                        )}
                      </div>
                      
                      {submitError && (
                        <div className="alert alert-danger mb-3">
                          {submitError}
                        </div>
                      )}
                      
                      <div className="d-grid gap-2">
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Agendando...' : 'Confirmar Agendamento'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Etapa 5: Confirmação */}
                {step === 5 && (
                  <div className="text-center">
                    <div className="mb-4">
                      <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
                    </div>
                    <h2 className="card-title mb-3">Agendamento Confirmado!</h2>
                    <p className="lead mb-4">
                      Sua consulta foi agendada com sucesso. Em breve você receberá uma confirmação por WhatsApp e e-mail.
                    </p>
                    
                    <div className="card mb-4">
                      <div className="card-body">
                        <h5 className="card-title">Detalhes da Consulta</h5>
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item d-flex justify-content-between">
                            <span>Médico:</span>
                            <span className="text-end">{selectedMedico?.nome || 'Médico'}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between">
                            <span>Unidade:</span>
                            <span className="text-end">{selectedUnidade?.nome || 'Unidade'}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between">
                            <span>Data:</span>
                            <span className="text-end">
                              {selectedHorario?.data ? new Date(selectedHorario.data).toLocaleDateString('pt-BR') : 'Data'}
                            </span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between">
                            <span>Horário:</span>
                            <span className="text-end">{selectedHorario?.horaInicio || 'Horário'}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between">
                            <span>Plano:</span>
                            <span className="text-end">{selectedPlano?.nome || 'Plano'}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="d-grid gap-2">
                      <button 
                        className="btn btn-primary"
                        onClick={resetForm}
                      >
                        Fazer Novo Agendamento
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="mt-5 py-3 text-center text-muted">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Oftalmocenter. Todos os direitos reservados.</p>
        </div>
      </footer>
      
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
        .progress-bar {
          background-color: #3b5998;
        }
        .text-primary {
          color: #3b5998 !important;
        }
      `}</style>
    </div>
  );
}
