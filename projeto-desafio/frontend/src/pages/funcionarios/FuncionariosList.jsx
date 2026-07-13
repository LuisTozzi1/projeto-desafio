import { useCallback, useEffect, useState } from 'react';
import { listarFuncionarios, buscarFuncionarioPorId, baixarRelatorioFuncionarios } from '../../api/funcionariosApi';
import { listarTodosCargos } from '../../api/cargosApi';
import { listarTodosDepartamentos } from '../../api/departamentosApi';
import { dispararDownload, extrairMensagemErro, formatarCpf } from '../../utils';
import Pagination from '../../components/Pagination';
import FuncionarioForm from './FuncionarioForm';
import { useToast } from '../../context/ToastContext';

const FILTROS_INICIAIS = { nome: '', cpf: '', matricula: '', empresa: '', cargoId: '', departamentoId: '' };

export default function FuncionariosList() {
  const { notify } = useToast();

  const [filtros, setFiltros] = useState(FILTROS_INICIAIS);
  const [pagina, setPagina] = useState(0);
  const [dados, setDados] = useState({ content: [], totalPages: 0, totalElements: 0 });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [cargos, setCargos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);

  const [modalAberto, setModalAberto] = useState(false);
  const [funcionarioEditando, setFuncionarioEditando] = useState(null);
  const [carregandoEdicao, setCarregandoEdicao] = useState(false);
  const [baixandoRelatorio, setBaixandoRelatorio] = useState(false);

  useEffect(() => {
    Promise.all([listarTodosCargos(), listarTodosDepartamentos()])
      .then(([listaCargos, listaDepartamentos]) => {
        setCargos(listaCargos);
        setDepartamentos(listaDepartamentos);
      })
      .catch(() => {});
  }, []);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      const resultado = await listarFuncionarios({ ...filtros, page: pagina, size: 10 });
      setDados(resultado);
    } catch (err) {
      setErro(extrairMensagemErro(err));
    } finally {
      setCarregando(false);
    }
  }, [filtros, pagina]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function handleFiltroChange(campo, valor) {
    setPagina(0);
    setFiltros((atual) => ({ ...atual, [campo]: valor }));
  }

  function abrirNovo() {
    setFuncionarioEditando(null);
    setModalAberto(true);
  }

  async function abrirEdicao(linha) {
    setCarregandoEdicao(true);
    try {
      const detalhe = await buscarFuncionarioPorId(linha.id);
      setFuncionarioEditando(detalhe);
      setModalAberto(true);
    } catch (err) {
      notify(extrairMensagemErro(err), 'error');
    } finally {
      setCarregandoEdicao(false);
    }
  }

  function fecharModal(atualizou) {
    setModalAberto(false);
    setFuncionarioEditando(null);
    if (atualizou) carregar();
  }

  async function handleBaixarRelatorio() {
    setBaixandoRelatorio(true);
    try {
      const blob = await baixarRelatorioFuncionarios(filtros);
      dispararDownload(blob, 'relatorio-funcionarios.csv');
      notify('Relatório de funcionários baixado com sucesso');
    } catch (err) {
      notify(extrairMensagemErro(err), 'error');
    } finally {
      setBaixandoRelatorio(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Funcionários</h1>
          <p>Veja os funcionários cadastrados no sistema.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-outline" onClick={handleBaixarRelatorio} disabled={baixandoRelatorio} data-cy="btn-relatorio-funcionarios">
            {baixandoRelatorio ? <span className="spinner" /> : '⬇'} Baixar Relatório
          </button>
          <button className="btn btn-primary" onClick={abrirNovo} data-cy="btn-novo-funcionario">
            + Novo Funcionário
          </button>
        </div>
      </div>

      <div className="panel">
        <div className="filters-bar">
          <div className="field">
            <label>Nome do Funcionário</label>
            <input
              placeholder="Procure pelo funcionário"
              value={filtros.nome}
              onChange={(e) => handleFiltroChange('nome', e.target.value)}
              data-cy="filtro-nome"
            />
          </div>
          <div className="field">
            <label>CPF</label>
            <input
              placeholder="000.000.000-00"
              value={filtros.cpf}
              onChange={(e) => handleFiltroChange('cpf', e.target.value)}
              data-cy="filtro-cpf"
            />
          </div>
          <div className="field">
            <label>Matrícula</label>
            <input
              placeholder="0000000000"
              value={filtros.matricula}
              onChange={(e) => handleFiltroChange('matricula', e.target.value)}
              data-cy="filtro-matricula"
            />
          </div>
          <div className="field">
            <label>Empresa</label>
            <input
              placeholder="Nome da empresa"
              value={filtros.empresa}
              onChange={(e) => handleFiltroChange('empresa', e.target.value)}
              data-cy="filtro-empresa"
            />
          </div>
          <div className="field">
            <label>Cargo</label>
            <select value={filtros.cargoId} onChange={(e) => handleFiltroChange('cargoId', e.target.value)} data-cy="filtro-cargo">
              <option value="">Selecione uma opção</option>
              {cargos.map((c) => (
                <option key={c.id} value={c.id}>{c.descricao}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Departamento</label>
            <select value={filtros.departamentoId} onChange={(e) => handleFiltroChange('departamentoId', e.target.value)} data-cy="filtro-departamento">
              <option value="">Selecione uma opção</option>
              {departamentos.map((d) => (
                <option key={d.id} value={d.id}>{d.descricao}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="table-hint">Clique para ver os vínculos de empresa do funcionário</p>

        {erro && <div className="alert alert-error">{erro}</div>}

        <div className="table-wrapper">
          <table className="data-table" data-cy="tabela-funcionarios">
            <thead>
              <tr>
                <th>Editar</th>
                <th>Nome</th>
                <th>CPF</th>
                <th>Cargo(s)</th>
                <th>Departamento(s)</th>
              </tr>
            </thead>
            <tbody>
              {!carregando && dados.content.map((f) => (
                <tr key={f.id} data-cy="linha-funcionario">
                  <td>
                    <button
                      className="icon-btn"
                      onClick={() => abrirEdicao(f)}
                      aria-label="Editar"
                      disabled={carregandoEdicao}
                      data-cy="btn-editar-funcionario"
                    >
                      ✎
                    </button>
                  </td>
                  <td>{f.nome}</td>
                  <td>{formatarCpf(f.cpf)}</td>
                  <td>{f.cargos || '—'}</td>
                  <td>{f.departamentos || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {!carregando && dados.content.length === 0 && (
            <div className="table-empty">Nenhum funcionário encontrado com os filtros aplicados.</div>
          )}
        </div>

        <Pagination
          page={dados.number ?? pagina}
          totalPages={dados.totalPages}
          totalElements={dados.totalElements}
          onPageChange={setPagina}
        />
      </div>

      {modalAberto && (
        <FuncionarioForm funcionario={funcionarioEditando} onClose={fecharModal} />
      )}
    </div>
  );
}
