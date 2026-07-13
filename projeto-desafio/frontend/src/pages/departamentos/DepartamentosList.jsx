import { useCallback, useEffect, useState } from 'react';
import { listarDepartamentos, baixarRelatorioDepartamentos } from '../../api/departamentosApi';
import { dispararDownload, extrairMensagemErro } from '../../utils';
import Pagination from '../../components/Pagination';
import DepartamentoForm from './DepartamentoForm';
import { useToast } from '../../context/ToastContext';

export default function DepartamentosList() {
  const { notify } = useToast();

  const [filtros, setFiltros] = useState({ codigo: '', descricao: '' });
  const [pagina, setPagina] = useState(0);
  const [dados, setDados] = useState({ content: [], totalPages: 0, totalElements: 0 });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [departamentoEditando, setDepartamentoEditando] = useState(null);
  const [baixandoRelatorio, setBaixandoRelatorio] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      const resultado = await listarDepartamentos({ ...filtros, page: pagina, size: 10 });
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
    setDepartamentoEditando(null);
    setModalAberto(true);
  }

  function abrirEdicao(departamento) {
    setDepartamentoEditando(departamento);
    setModalAberto(true);
  }

  function fecharModal(atualizou) {
    setModalAberto(false);
    setDepartamentoEditando(null);
    if (atualizou) carregar();
  }

  async function handleBaixarRelatorio() {
    setBaixandoRelatorio(true);
    try {
      const blob = await baixarRelatorioDepartamentos(filtros);
      dispararDownload(blob, 'relatorio-departamentos.csv');
      notify('Relatório de departamentos baixado com sucesso');
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
          <h1>Departamento</h1>
          <p>Veja os departamentos cadastrados no sistema.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-outline" onClick={handleBaixarRelatorio} disabled={baixandoRelatorio} data-cy="btn-relatorio-departamentos">
            {baixandoRelatorio ? <span className="spinner" /> : '⬇'} Baixar Relatório
          </button>
          <button className="btn btn-primary" onClick={abrirNovo} data-cy="btn-novo-departamento">
            + Novo Departamento
          </button>
        </div>
      </div>

      <div className="panel">
        <div className="filters-bar">
          <div className="field">
            <label>Descrição do Departamento</label>
            <input
              placeholder="Procure pelo nome do departamento"
              value={filtros.descricao}
              onChange={(e) => handleFiltroChange('descricao', e.target.value)}
              data-cy="filtro-descricao"
            />
          </div>
          <div className="field">
            <label>Código</label>
            <input
              placeholder="Procure pelo código do departamento"
              value={filtros.codigo}
              onChange={(e) => handleFiltroChange('codigo', e.target.value)}
              data-cy="filtro-codigo"
            />
          </div>
        </div>

        {erro && <div className="alert alert-error">{erro}</div>}

        <div className="table-wrapper">
          <table className="data-table" data-cy="tabela-departamentos">
            <thead>
              <tr>
                <th>Editar</th>
                <th>Descrição</th>
                <th>Código</th>
              </tr>
            </thead>
            <tbody>
              {!carregando && dados.content.map((departamento) => (
                <tr key={departamento.id} data-cy="linha-departamento">
                  <td>
                    <button className="icon-btn" onClick={() => abrirEdicao(departamento)} aria-label="Editar" data-cy="btn-editar-departamento">
                      ✎
                    </button>
                  </td>
                  <td>{departamento.descricao}</td>
                  <td>{departamento.codigo}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {!carregando && dados.content.length === 0 && (
            <div className="table-empty">Nenhum departamento encontrado com os filtros aplicados.</div>
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
        <DepartamentoForm departamento={departamentoEditando} onClose={fecharModal} />
      )}
    </div>
  );
}
