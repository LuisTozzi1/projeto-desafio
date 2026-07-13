import { useCallback, useEffect, useState } from 'react';
import { listarCargos, baixarRelatorioCargos } from '../../api/cargosApi';
import { dispararDownload, extrairMensagemErro } from '../../utils';
import Pagination from '../../components/Pagination';
import CargoForm from './CargoForm';
import { useToast } from '../../context/ToastContext';

export default function CargosList() {
  const { notify } = useToast();

  const [filtros, setFiltros] = useState({ codigo: '', descricao: '' });
  const [pagina, setPagina] = useState(0);
  const [dados, setDados] = useState({ content: [], totalPages: 0, totalElements: 0 });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [cargoEditando, setCargoEditando] = useState(null);
  const [baixandoRelatorio, setBaixandoRelatorio] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      const resultado = await listarCargos({ ...filtros, page: pagina, size: 10 });
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
    setCargoEditando(null);
    setModalAberto(true);
  }

  function abrirEdicao(cargo) {
    setCargoEditando(cargo);
    setModalAberto(true);
  }

  function fecharModal(atualizou) {
    setModalAberto(false);
    setCargoEditando(null);
    if (atualizou) carregar();
  }

  async function handleBaixarRelatorio() {
    setBaixandoRelatorio(true);
    try {
      const blob = await baixarRelatorioCargos(filtros);
      dispararDownload(blob, 'relatorio-cargos.csv');
      notify('Relatório de cargos baixado com sucesso');
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
          <h1>Cargos</h1>
          <p>Veja os cargos cadastrados no sistema.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-outline" onClick={handleBaixarRelatorio} disabled={baixandoRelatorio} data-cy="btn-relatorio-cargos">
            {baixandoRelatorio ? <span className="spinner" /> : '⬇'} Baixar Relatório
          </button>
          <button className="btn btn-primary" onClick={abrirNovo} data-cy="btn-novo-cargo">
            + Novo Cargo
          </button>
        </div>
      </div>

      <div className="panel">
        <div className="filters-bar">
          <div className="field">
            <label>Descrição do Cargo</label>
            <input
              placeholder="Procure pelo nome do cargo"
              value={filtros.descricao}
              onChange={(e) => handleFiltroChange('descricao', e.target.value)}
              data-cy="filtro-descricao"
            />
          </div>
          <div className="field">
            <label>Código</label>
            <input
              placeholder="Procure pelo código do cargo"
              value={filtros.codigo}
              onChange={(e) => handleFiltroChange('codigo', e.target.value)}
              data-cy="filtro-codigo"
            />
          </div>
        </div>

        {erro && <div className="alert alert-error">{erro}</div>}

        <div className="table-wrapper">
          <table className="data-table" data-cy="tabela-cargos">
            <thead>
              <tr>
                <th>Editar</th>
                <th>Nome</th>
                <th>Código</th>
              </tr>
            </thead>
            <tbody>
              {!carregando && dados.content.map((cargo) => (
                <tr key={cargo.id} data-cy="linha-cargo">
                  <td>
                    <button className="icon-btn" onClick={() => abrirEdicao(cargo)} aria-label="Editar" data-cy="btn-editar-cargo">
                      ✎
                    </button>
                  </td>
                  <td>{cargo.descricao}</td>
                  <td>{cargo.codigo}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {!carregando && dados.content.length === 0 && (
            <div className="table-empty">Nenhum cargo encontrado com os filtros aplicados.</div>
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
        <CargoForm cargo={cargoEditando} onClose={fecharModal} />
      )}
    </div>
  );
}
