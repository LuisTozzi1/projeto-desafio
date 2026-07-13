import apiClient from './axiosClient';

export async function login(username, senha) {
  const { data } = await apiClient.post('/auth/login', { username, senha });
  return data;
}
