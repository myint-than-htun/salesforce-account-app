const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:5000/api';

async function request(url, options = {}) {
    const response = await fetch(
        `${API_BASE_URL}${url}`,
        {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            },
            credentials: 'include'
        }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.message || 'Request failed'
        );
    }

    return data;
}

export function connectSalesforce() {
    window.location.href =
        `${API_BASE_URL}/auth/salesforce`;
}

export function getSalesforceStatus() {
    return request('/auth/status');
}

export function getAccounts() {
    return request('/accounts');
}

export function createAccount(account) {
    return request('/accounts', {
        method: 'POST',
        body: JSON.stringify(account)
    });
}