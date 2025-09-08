// API base URL from environment variables or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Simple fetch wrapper for API calls
const apiFetch = async (url: string, options: RequestInit = {}): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'An error occurred');
    }

    return response.json();
};

export const api = {
    // Chat API
    sendMessage: async (message: string, sessionId?: string) => {
        return apiFetch('/chat', {
            method: 'POST',
            body: JSON.stringify({
                message,
                session_id: sessionId,
            }),
        });
    },

    // Knowledge Base API
    uploadDocument: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        return fetch(`${API_BASE_URL}/knowledge/upload`, {
            method: 'POST',
            body: formData,
        }).then(async (response) => {
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'An error occurred');
            }
            return response.json();
        });
    },

    // Workflow API
    saveWorkflow: async (workflow: any) => {
        return apiFetch('/workflows', {
            method: 'POST',
            body: JSON.stringify(workflow),
        });
    },

    getWorkflows: async () => {
        return apiFetch('/workflows');
    },

    // Session management
    createSession: async () => {
        return apiFetch('/sessions', { method: 'POST' });
    },

    getSession: async (sessionId: string) => {
        return apiFetch(`/sessions/${sessionId}`);
    }
};
