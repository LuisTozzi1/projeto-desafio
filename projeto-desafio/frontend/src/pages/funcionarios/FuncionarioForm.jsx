import { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import VinculoModal from './VinculoModal';
import { criarFuncionario, editarFuncionario } from '../../api/funcionariosApi';
import { listarTodosCargos } from '../../api/cargosApi';
import { listarTodosDepartamentos } from '../../api/departamentosApi';
import { apenasDigitos, extrairMensagemErro, formatarCpf } from '../../utils';
import { useToast } from '../../context/ToastContext';

let vinculoTempId = 0;

export default function FuncionarioForm({ funcionario, onClose }) {
  const { notify } = useToast();
  const editando = Boolean(funcionario);

  const [nome, setNome] = useState(funcionario?.nome || '');
  const [cpf, setCpf] = useState(funcionario ? formatarCpf(funcionario.cpf) : '');
  const [vinculos, setVinculos] = useState(
    (funcionario?.vinculos || []).map((v) => ({ ...v, tempId: `existente-${v.id}` }))
  );

  const [cargos, setCargos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [carregandoOpcoes, setCarregandoOpcoes] = useState(true);

  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [salvando, setSalvando] = useState(false);

  const [vinculoModalAberto, setVinculoModalAberto] = useState(false);
  const [vinculoEditando, setVinculoEditando] = useState(null);

  useEffect(() => {
    async function carregarOpcoes() {
      try {
        const [listaCargos, listaDepartamentos] = await Promise.all([
          listarTodosCargos(),
          listarTodosDepartamentos(),
        ]);
        setCargos(listaCargos);
        setDepartamentos(listaDepartamentos);
      } catch (err) {
        setErroGeral('Não foi possível carregar cargos e departamentos.');
      } finally {
        setCarregandoOpcoes(false);
      }
    }
    carregarOpcoes();
  }, []);

  function validar() {
    const novosErros = {};
    if (!nome.trim()) novosErros.nome = 'O nome do funcionário é obrigatório';
    if (apenasDigitos(cpf).length !== 11) novosErros.cpf = 'Informe um CPF válido com 11 dígitos';
    if (vinculos.length === 0) novosErros.vinculos = 'Adicione ao menos um vínculo empresarial';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function abrirNovoVinculo() {
    setVinculoEditando(null);
    setVinculoModalAberto(true);
  }

  function abrirEdicaoVinculo(vinculo) {
    setVinculoEditando(vinculo);
    setVinculoModalAberto(true);
  }

  function handleConfirmarVinculo(vinculoDados) {
    setErros((atual) => ({ ...atual, vinculos: undefined }));

    if (vinculoEditando) {
      setVinculos((atual) =>
        atual.map((v) => (v.tempId === vinculoEditando.tempId ? { ...vinculoDados, tempId: v.tempId } : v))
      );
    } else {
      setVinculos((atual) => [...atual, { ...vinculoDados, tempId: `novo-${++vinculoTempId}` }]);
    }
    setVinculoModalAberto(false);
    setVinculoEditando(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErroGeral('');
    if (!validar()) return;

    setSalvando(true);
    const payload = {
      nome: nome.trim(),
      cpf: apenasDigitos(cpf),
      vinculos: vinculos.map((v) => ({
        id: v.id || null,
        empresa: v.empresa,
        matricula: v.matricula,
        cargoId: v.cargoId,
        departamentoId: v.departamentoId,
      })),
    };

    try {
      if (editando) {
        await editarFuncionario(funcionario.id, payload);
        notify('Funcionário atualizado com sucesso');
      } else {
        await criarFuncionario(payload);
        notify('Funcionário cadastrado com sucesso');
      }
      onClose(true);
    } catch (err) {
      setErroGeral(extrairMensagemErro(err));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal
      title={editando ? 'Editar Funcionário' : 'Cadastro de Funcionário'}
      subtitle={editando ? 'Altere as informações deste funcionário' : 'Adicione as informações do novo funcionário'}
      onClose={() => onClose(false)}
      width={720}
    >
      <form onSubmit={handleSubmit} data-cy="form-funcionario">
        {erroGeral && <div className="alert alert-error" data-cy="erro-form-funcionario">{erroGeral}</div>}

        <div className="panel" style={{ padding: 20, marginBottom: 20 }}>
          <div className="form-grid">
            <div className="field">
              <label>Nome do Funcionário</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Insira o nome do funcionário"
                className={erros.nome ? 'invalid' : ''}
                data-cy="input-nome-funcionario"
                autoFocus
              />
              {erros.nome && <span className="error">{erros.nome}</span>}
            </div>

            <div className="field">
              <label>CPF</label>
              <input
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                maxLength={14}
                className={erros.cpf ? 'invalid' : ''}
                data-cy="input-cpf-funcionario"
              />
              {erros.cpf && <span className="error">{erros.cpf}</span>}
            </div>
          </div>
        </div>

        <div className="vinculos-panel">
          <div className="vinculos-panel-header">
            <h3>Empresas <span className="badge">{vinculos.length}</span></h3>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={abrirNovoVinculo}
              disabled={carregandoOpcoes}
              data-cy="btn-novo-vinculo"
            >
              + Novo Vínculo
            </button>
          </div>

          {erros.vinculos && <span className="error">{erros.vinculos}</span>}

          <div className="table-wrapper">
            <table className="data-table" data-cy="tabela-vinculos">
              <thead>
                <tr>
                  <th>Editar</th>
                  <th>Empresa</th>
                  <th>Matrícula</th>
                  <th>Cargo</th>
                  <th>Departamento</th>
                </tr>
              </thead>
              <tbody>
                {vinculos.map((v) => (
                  <tr key={v.tempId} data-cy="linha-vinculo">
                    <td>
                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() => abrirEdicaoVinculo(v)}
                        aria-label="Editar vínculo"
                        data-cy="btn-editar-vinculo"
                      >
                        ✎
                      </button>
                    </td>
                    <td>{v.empresa}</td>
                    <td>{v.matricula}</td>
                    <td>{v.cargoDescricao}</td>
                    <td>{v.departamentoDescricao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {vinculos.length === 0 && (
              <div className="table-empty">Nenhum vínculo adicionado ainda.</div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={() => onClose(false)}>
            ✕ Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={salvando} data-cy="btn-salvar-funcionario">
            {salvando ? <span className="spinner" /> : '💾 Salvar'}
          </button>
        </div>
      </form>

      {vinculoModalAberto && (
        <VinculoModal
          vinculo={vinculoEditando}
          cargos={cargos}
          departamentos={departamentos}
          onConfirm={handleConfirmarVinculo}
          onClose={() => { setVinculoModalAberto(false); setVinculoEditando(null); }}
        />
      )}
    </Modal>
  );
}
