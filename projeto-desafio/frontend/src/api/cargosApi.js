import apiClient from './axiosClient';

export async function listarCargos({ codigo, descricao, page = 0, size = 10 }) {
  const { data } = await apiClient.get('/cargos', {
    params: { codigo: codigo || undefined, descricao: descricao || undefined, page, size },
  });
  return data;
}

export async function buscarCargoPorId(id) {
  const { data } = await apiClient.get(`/cargos/${id}`);
  return data;
}

export async function criarCargo(payload) {
  const { data } = await apiClient.post('/cargos', payload);
  return data;
}

export async function editarCargo(id, payload) {
  const { data } = await apiClient.put(`/cargos/${id}`, payload);
  return data;
}

export async function listarTodosCargos() {
  const { data } = await apiClient.get('/cargos', { params: { page: 0, size: 200 } });
  return data.content;
}

export async function baixarRelatorioCargos({ codigo, descricao }) {
  const response = await apiClient.get('/cargos/relatorio', {
    params: { codigo: codigo || undefined, descricao: descricao || undefined },
    responseType: 'blob',
  });
  return response.data;
}
