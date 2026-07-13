import { useState } from 'react';
import Modal from '../../components/Modal';
import { criarDepartamento, editarDepartamento } from '../../api/departamentosApi';
import { extrairMensagemErro } from '../../utils';
import { useToast } from '../../context/ToastContext';

export default function DepartamentoForm({ departamento, onClose }) {
  const { notify } = useToast();
  const editando = Boolean(departamento);

  const [descricao, setDescricao] = useState(departamento?.descricao || '');
  const [codigo, setCodigo] = useState(departamento?.codigo || '');
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [salvando, setSalvando] = useState(false);

  function validar() {
    const novosErros = {};
    if (!descricao.trim()) novosErros.descricao = 'A descrição do departamento é obrigatória';
    if (!codigo.trim()) novosErros.codigo = 'O código do departamento é obrigatório';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErroGeral('');
    if (!validar()) return;

    setSalvando(true);
    const payload = { codigo: codigo.trim(), descricao: descricao.trim() };

    try {
      if (editando) {
        await editarDepartamento(departamento.id, payload);
        notify('Departamento atualizado com sucesso');
      } else {
        await criarDepartamento(payload);
        notify('Departamento cadastrado com sucesso');
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
      title={editando ? 'Editar Departamento' : 'Cadastro de Departamento'}
      subtitle={editando ? 'Altere as informações deste departamento' : 'Adicione as informações do novo departamento'}
      onClose={() => onClose(false)}
    >
      <form onSubmit={handleSubmit} data-cy="form-departamento">
        {erroGeral && <div className="alert alert-error" data-cy="erro-form-departamento">{erroGeral}</div>}

        <div className="form-grid">
          <div className="field">
            <label>Descrição do Departamento</label>
            <input
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Desenvolvimento"
              className={erros.descricao ? 'invalid' : ''}
              data-cy="input-descricao-departamento"
              autoFocus
            />
            {erros.descricao && <span className="error">{erros.descricao}</span>}
          </div>

          <div className="field">
            <label>Código do Departamento</label>
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ex: DP001"
              className={erros.codigo ? 'invalid' : ''}
              data-cy="input-codigo-departamento"
            />
            {erros.codigo && <span className="error">{erros.codigo}</span>}
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={() => onClose(false)}>
            ✕ Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={salvando} data-cy="btn-confirmar-departamento">
            {salvando ? <span className="spinner" /> : '✓ Confirmar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
