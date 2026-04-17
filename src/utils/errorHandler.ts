export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  
  if (typeof err === 'object' && err !== null && 'response' in err) {
    const axiosError = err as { response?: { data?: { message?: string } } };
    return axiosError.response?.data?.message || 'Ocorreu um erro inesperado';
  }
  
  return 'Ocorreu um erro inesperado';
}