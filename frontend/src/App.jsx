import { useEffect, useState } from 'react';

import AccountForm from './components/AccountForm.jsx';
import AccountTable from './components/AccountTable.jsx';

import {
    connectSalesforce,
    getSalesforceStatus,
    getAccounts,
    createAccount
} from './services/api.js';

function App() {
    const [connected, setConnected] = useState(false);

    const [accounts, setAccounts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState('');

    const [error, setError] = useState('');

    async function loadAccounts() {
        try {
            const result = await getAccounts();

            setAccounts(
                result.data?.records || []
            );
        } catch (err) {
            setError(err.message);
        }
    }

    async function checkSalesforceConnection() {
        try {
            setLoading(true);
            setError('');

            const result =
                await getSalesforceStatus();

            setConnected(result.connected);

            if (result.connected) {
                await loadAccounts();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        checkSalesforceConnection();
    }, []);

    async function handleCreateAccount(account) {
        try {
            setMessage('');
            setError('');

            const result =
                await createAccount(account);

            setMessage(
                `Account created successfully. Account ID: ${result.data.accountId}, Contact ID: ${result.data.contactId}`
            );

            await loadAccounts();
        } catch (err) {
            throw err;
        }
    }

    if (loading) {
        return (
            <div className="container">
                <h1>Salesforce Account App</h1>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="container">

            <header className="header">

                <div>
                    <h1>Salesforce Account App</h1>

                    <p>
                        Create and view Salesforce accounts
                    </p>
                </div>

                {connected && (
                    <span className="connected">
                        Salesforce Connected
                    </span>
                )}

            </header>

            {error && (
                <div className="error">
                    {error}
                </div>
            )}

            {message && (
                <div className="success">
                    {message}
                </div>
            )}

            {!connected ? (

                <div className="card center">

                    <h2>
                        Connect Salesforce
                    </h2>

                    <p>
                        Connect your Salesforce account
                        to view and create accounts.
                    </p>

                    <button
                        className="button"
                        onClick={connectSalesforce}
                    >
                        Connect Salesforce
                    </button>

                </div>

            ) : (

                <>
                    <AccountForm
                        onCreated={handleCreateAccount}
                    />

                    <AccountTable
                        accounts={accounts}
                    />
                </>

            )}

        </div>
    );
}

export default App;