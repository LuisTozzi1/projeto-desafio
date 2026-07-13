export function dispararDownload(blob, nomeArquivo) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export function formatarCpf(cpf) {
  if (!cpf) return '';
  const digitos = cpf.replace(/\D/g, '');
  if (digitos.length !== 11) return cpf;
  return digitos.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function apenasDigitos(valor) {
  return (valor || '').replace(/\D/g, '');
}

export function extrairMensagemErro(error) {
  const corpo = error?.response?.data;
  if (!corpo) return 'Nao foi possivel completar a operacao. Tente novamente.';

  if (corpo.campos) {
    const primeiraMsg = Object.values(corpo.campos)[0];
    return primeiraMsg || corpo.mensagem || 'Verifique os campos preenchidos.';
  }

  return corpo.mensagem || 'Nao foi possivel completar a operacao. Tente novamente.';
}
