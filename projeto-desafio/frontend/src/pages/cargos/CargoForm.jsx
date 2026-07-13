import { useState } from 'react';
import Modal from '../../components/Modal';
import { criarCargo, editarCargo } from '../../api/cargosApi';
import { extrairMensagemErro } from '../../utils';
import { useToast } from '../../context/ToastContext';

export default function CargoForm({ cargo, onClose }) {
  const { notify } = useToast();
  const editando = Boolean(cargo);

  const [descricao, setDescricao] = useState(cargo?.descricao || '');
  const [codigo, setCodigo] = useState(cargo?.codigo || '');
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [salvando, setSalvando] = useState(false);

  function validar() {
    const novosErros = {};
    if (!descricao.trim()) novosErros.descricao = 'A descrição do cargo é obrigatória';
    if (!codigo.trim()) novosErros.codigo = 'O código do cargo é obrigatório';
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
        await editarCargo(cargo.id, payload);
        notify('Cargo atualizado com sucesso');
      } else {
        await criarCargo(payload);
        notify('Cargo cadastrado com sucesso');
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
      title={editando ? 'Editar Cargo' : 'Cadastro de Cargo'}
      subtitle={editando ? 'Altere as informações deste cargo' : 'Adicione as informações do novo cargo'}
      onClose={() => onClose(false)}
    >
      <form onSubmit={handleSubmit} data-cy="form-cargo">
        {erroGeral && <div className="alert alert-error" data-cy="erro-form-cargo">{erroGeral}</div>}

        <div className="form-grid">
          <div className="field">
            <label>Descrição do Cargo</label>
            <input
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Desenvolvedor"
              className={erros.descricao ? 'invalid' : ''}
              data-cy="input-descricao-cargo"
              autoFocus
            />
            {erros.descricao && <span className="error">{erros.descricao}</span>}
          </div>

          <div className="field">
            <label>Código do Cargo</label>
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ex: CG001"
              className={erros.codigo ? 'invalid' : ''}
              data-cy="input-codigo-cargo"
            />
            {erros.codigo && <span className="error">{erros.codigo}</span>}
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={() => onClose(false)}>
            ✕ Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={salvando} data-cy="btn-confirmar-cargo">
            {salvando ? <span className="spinner" /> : '✓ Confirmar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
