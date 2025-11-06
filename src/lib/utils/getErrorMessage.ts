
export function getErrorMessage(error: unknown, defaultMessage: string): string {
    if (error && typeof error === 'object') {
        // Error de Axios con respuesta del servidor
        if ('response' in error && error.response && typeof error.response === 'object') {
            const response = error.response as { data?: { message?: string } };
            if (response.data?.message) {
                return response.data.message;
            }
        }

        // Error estándar con mensaje
        if ('message' in error && typeof error.message === 'string') {
            return error.message;
        }
    }

    return defaultMessage;
}
