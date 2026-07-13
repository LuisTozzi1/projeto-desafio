import apiClient from './axiosClient';
import { apenasDigitos } from '../utils';

export async function listarFuncionarios({ nome, cpf, matricula, empresa, cargoId, departamentoId, page = 0, size = 10 }) {
  const { data } = await apiClient.get('/funcionarios', {
    params: {
      nome: nome || undefined,
      cpf: cpf ? apenasDigitos(cpf) : undefined,
      matricula: matricula || undefined,
      empresa: empresa || undefined,
      cargoId: cargoId || undefined,
      departamentoId: departamentoId || undefined,
      page,
      size,
    },
  });
  return data;
}

export async function buscarFuncionarioPorId(id) {
  const { data } = await apiClient.get(`/funcionarios/${id}`);
  return data;
}

export async function criarFuncionario(payload) {
  const { data } = await apiClient.post('/funcionarios', payload);
  return data;
}

export async function editarFuncionario(id, payload) {
  const { data } = await apiClient.put(`/funcionarios/${id}`, payload);
  return data;
}

export async function baixarRelatorioFuncionarios(filtros) {
  const response = await apiClient.get('/funcionarios/relatorio', {
    params: {
      nome: filtros.nome || undefined,
      cpf: filtros.cpf ? apenasDigitos(filtros.cpf) : undefined,
      matricula: filtros.matricula || undefined,
      empresa: filtros.empresa || undefined,
      cargoId: filtros.cargoId || undefined,
      departamentoId: filtros.departamentoId || undefined,
    },
    responseType: 'blob',
  });
  return response.data;
}
