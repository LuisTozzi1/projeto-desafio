import { useState } from 'react';
import Modal from '../../components/Modal';

export default function VinculoModal({ vinculo, cargos, departamentos, onConfirm, onClose }) {
  const editando = Boolean(vinculo);

  const [empresa, setEmpresa] = useState(vinculo?.empresa || '');
  const [matricula, setMatricula] = useState(vinculo?.matricula || '');
  const [cargoId, setCargoId] = useState(vinculo?.cargoId || '');
  const [departamentoId, setDepartamentoId] = useState(vinculo?.departamentoId || '');
  const [erros, setErros] = useState({});

  function validar() {
    const novosErros = {};
    if (!empresa.trim()) novosErros.empresa = 'O nome da empresa é obrigatório';
    if (!matricula.trim()) novosErros.matricula = 'A matrícula é obrigatória';
    if (!cargoId) novosErros.cargoId = 'Selecione um cargo';
    if (!departamentoId) novosErros.departamentoId = 'Selecione um departamento';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function handleConfirmar() {
    if (!validar()) return;

    const cargo = cargos.find((c) => c.id === cargoId);
    const departamento = departamentos.find((d) => d.id === departamentoId);

    onConfirm({
      id: vinculo?.id || null,
      empresa: empresa.trim(),
      matricula: matricula.trim(),
      cargoId,
      cargoDescricao: cargo?.descricao || '',
      departamentoId,
      departamentoDescricao: departamento?.descricao || '',
    });
  }

  return (
    <Modal title={editando ? 'Editar Vínculo' : 'Novo Vínculo'} onClose={onClose} width={520}>
      <div data-cy="form-vinculo">
        <div className="form-grid">
          <div className="field">
            <label>Nome da Empresa</label>
            <input
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              placeholder="Insira o nome da empresa"
              className={erros.empresa ? 'invalid' : ''}
              data-cy="input-empresa-vinculo"
              autoFocus
            />
            {erros.empresa && <span className="error">{erros.empresa}</span>}
          </div>

          <div className="field">
            <label>Matrícula</label>
            <input
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              placeholder="0000000000"
              className={erros.matricula ? 'invalid' : ''}
              data-cy="input-matricula-vinculo"
            />
            {erros.matricula && <span className="error">{erros.matricula}</span>}
          </div>

          <div className="field">
            <label>Cargo</label>
            <select
              value={cargoId}
              onChange={(e) => setCargoId(e.target.value)}
              className={erros.cargoId ? 'invalid' : ''}
              data-cy="select-cargo-vinculo"
            >
              <option value="">Selecione uma opção</option>
              {cargos.map((c) => (
                <option key={c.id} value={c.id}>{c.descricao}</option>
              ))}
            </select>
            {erros.cargoId && <span className="error">{erros.cargoId}</span>}
          </div>

          <div className="field">
            <label>Departamento</label>
            <select
              value={departamentoId}
              onChange={(e) => setDepartamentoId(e.target.value)}
              className={erros.departamentoId ? 'invalid' : ''}
              data-cy="select-departamento-vinculo"
            >
              <option value="">Selecione uma opção</option>
              {departamentos.map((d) => (
                <option key={d.id} value={d.id}>{d.descricao}</option>
              ))}
            </select>
            {erros.departamentoId && <span className="error">{erros.departamentoId}</span>}
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            ✕ Cancelar
          </button>
          <button type="button" className="btn btn-primary" onClick={handleConfirmar} data-cy="btn-confirmar-vinculo">
            ✓ Confirmar
          </button>
        </div>
      </div>
    </Modal>
  );
}
