function handleError(error: Error): string {
    return error.message || "An unexpected error occurred.";
}

function logError(error: Error): void {
    console.error("Error logged:", error);
}

export { handleError, logError };