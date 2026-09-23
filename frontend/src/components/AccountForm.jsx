import { useState } from 'react';

const initialForm = {
    name: '',
    phone: '',
    website: '',
    firstName: '',
    lastName: '',
    email: ''
};

function AccountForm({ onCreated }) {

    const [form, setForm] =
        useState(initialForm);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState('');

    function handleChange(event) {

        const {
            name,
            value
        } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value
        }));
    }

    async function handleSubmit(event) {

        event.preventDefault();

        setError('');

        if (!form.name.trim()) {
            setError(
                'Account name is required.'
            );
            return;
        }

        if (!form.lastName.trim()) {
            setError(
                'Contact last name is required.'
            );
            return;
        }

        try {

            setSubmitting(true);

            await onCreated({
                name: form.name.trim(),
                phone: form.phone.trim(),
                website: form.website.trim(),
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim()
            });

            setForm(initialForm);

        } catch (err) {

            setError(err.message);

        } finally {

            setSubmitting(false);

        }
    }

    return (
        <section className="card">

            <h2>
                Create Account
            </h2>

            <form
                onSubmit={handleSubmit}
            >

                <div className="form-grid">

                    <div className="form-group">

                        <label>
                            Account Name *
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="ABC Company"
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Phone
                        </label>

                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+95..."
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Website
                        </label>

                        <input
                            type="text"
                            name="website"
                            value={form.website}
                            onChange={handleChange}
                            placeholder="https://example.com"
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Contact First Name
                        </label>

                        <input
                            type="text"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            placeholder="John"
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Contact Last Name *
                        </label>

                        <input
                            type="text"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            placeholder="Doe"
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Contact Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                        />

                    </div>

                </div>

                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}

                <button
                    className="button"
                    type="submit"
                    disabled={submitting}
                >
                    {submitting
                        ? 'Creating...'
                        : 'Create Account'}
                </button>

            </form>

        </section>
    );
}

export default AccountForm;