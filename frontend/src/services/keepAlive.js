import API_URL from './apiConfig';

/**
 * Inicia um keep-alive que faz requisições periódicas ao backend
 * para evitar que o Render coloque o servidor em sleep mode
 */
export function startKeepAlive() {
  // Fazer um ping a cada 5 minutos (300000ms)
  const interval = setInterval(async () => {
    try {
      console.log('[Keep-Alive] Enviando ping ao backend...');
      const response = await fetch(`${API_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log('[Keep-Alive] Ping bem-sucedido');
      } else {
        console.warn('[Keep-Alive] Resposta do ping:', response.status);
      }
    } catch (error) {
      console.error('[Keep-Alive] Erro ao fazer ping:', error);
    }
  }, 5 * 60 * 1000); // 5 minutos

  // Retornar função para parar o keep-alive se necessário
  return () => clearInterval(interval);
}
