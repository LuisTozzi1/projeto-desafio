import apiClient from './axiosClient';

export async function listarDepartamentos({ codigo, descricao, page = 0, size = 10 }) {
  const { data } = await apiClient.get('/departamentos', {
    params: { codigo: codigo || undefined, descricao: descricao || undefined, page, size },
  });
  return data;
}

export async function buscarDepartamentoPorId(id) {
  const { data } = await apiClient.get(`/departamentos/${id}`);
  return data;
}

export async function criarDepartamento(payload) {
  const { data } = await apiClient.post('/departamentos', payload);
  return data;
}

export async function editarDepartamento(id, payload) {
  const { data } = await apiClient.put(`/departamentos/${id}`, payload);
  return data;
}

export async function listarTodosDepartamentos() {
  const { data } = await apiClient.get('/departamentos', { params: { page: 0, size: 200 } });
  return data.content;
}

export async function baixarRelatorioDepartamentos({ codigo, descricao }) {
  const response = await apiClient.get('/departamentos/relatorio', {
    params: { codigo: codigo || undefined, descricao: descricao || undefined },
    responseType: 'blob',
  });
  return response.data;
}
