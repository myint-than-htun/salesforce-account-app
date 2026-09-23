function AccountTable({ accounts }) {

    return (
        <section className="card">

            <div className="table-header">

                <h2>
                    Existing Accounts
                </h2>

                <span>
                    {accounts.length} account(s)
                </span>

            </div>

            {accounts.length === 0 ? (

                <p>
                    No accounts found.
                </p>

            ) : (

                <div className="table-wrapper">

                    <table>

                        <thead>
                            <tr>
                                <th>Salesforce ID</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Website</th>
                            </tr>
                        </thead>

                        <tbody>

                            {accounts.map((account) => (

                                <tr key={account.Id}>

                                    <td>
                                        {account.Id}
                                    </td>

                                    <td>
                                        {account.Name}
                                    </td>

                                    <td>
                                        {account.Phone || '-'}
                                    </td>

                                    <td>
                                        {account.Website || '-'}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </section>
    );
}

export default AccountTable;