// Estado global simples para rastrear qual handle iniciou a conexão
export const connectionState = {
  sourceHandle: undefined as string | undefined,
};