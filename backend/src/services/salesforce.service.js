import crypto from 'crypto';

import {
    salesforceConfig
} from '../config/salesforce.config.js';


function base64Url(buffer) {
    return buffer
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}


/*
 * Generate PKCE values.
 *
 * codeVerifier:
 *   Secret value stored in the user's session.
 *
 * codeChallenge:
 *   SHA-256 hash of codeVerifier.
 */
export function generatePkce() {

    const codeVerifier =
        base64Url(
            crypto.randomBytes(32)
        );

    const codeChallenge =
        base64Url(
            crypto
                .createHash('sha256')
                .update(codeVerifier)
                .digest()
        );

    return {
        codeVerifier,
        codeChallenge
    };
}


/*
 * Build Salesforce authorization URL.
 */
export function buildAuthorizationUrl(
    codeChallenge
) {

    const url = new URL(
        `${salesforceConfig.loginUrl}/services/oauth2/authorize`
    );

    url.searchParams.set(
        'response_type',
        'code'
    );

    url.searchParams.set(
        'client_id',
        salesforceConfig.clientId
    );

    url.searchParams.set(
        'redirect_uri',
        salesforceConfig.callbackUrl
    );

    /*
     * Mandatory PKCE parameters.
     */
    url.searchParams.set(
        'code_challenge',
        codeChallenge
    );

    url.searchParams.set(
        'code_challenge_method',
        'S256'
    );

    return url.toString();
}


/*
 * Exchange authorization code for
 * access token + refresh token.
 */
export async function exchangeAuthorizationCode(
    code,
    codeVerifier
) {

    const tokenUrl =
        `${salesforceConfig.loginUrl}/services/oauth2/token`;

    const body = new URLSearchParams({

        grant_type:
            'authorization_code',

        code,

        client_id:
            salesforceConfig.clientId,

        client_secret:
            salesforceConfig.clientSecret,

        redirect_uri:
            salesforceConfig.callbackUrl,

        code_verifier:
            codeVerifier
    });

    const response = await fetch(
        tokenUrl,
        {
            method: 'POST',

            headers: {
                'Content-Type':
                    'application/x-www-form-urlencoded'
            },

            body
        }
    );

    const data =
        await response.json();

    if (!response.ok) {

        const error =
            new Error(
                data.error_description ||
                data.error ||
                'Salesforce authorization failed'
            );

        error.statusCode =
            response.status;

        throw error;
    }

    return data;
}


/*
 * Refresh Salesforce access token.
 */
export async function refreshSalesforceToken(
    session
) {

    const currentToken =
        session.salesforce;

    if (!currentToken?.refreshToken) {

        const error =
            new Error(
                'Salesforce refresh token is not available. Please connect Salesforce again.'
            );

        error.statusCode = 401;

        throw error;
    }

    const tokenUrl =
        `${salesforceConfig.loginUrl}/services/oauth2/token`;

    const body = new URLSearchParams({

        grant_type:
            'refresh_token',

        refresh_token:
            currentToken.refreshToken,

        client_id:
            salesforceConfig.clientId,

        client_secret:
            salesforceConfig.clientSecret
    });

    const response = await fetch(
        tokenUrl,
        {
            method: 'POST',

            headers: {
                'Content-Type':
                    'application/x-www-form-urlencoded'
            },

            body
        }
    );

    const data =
        await response.json();

    if (!response.ok) {

        const error =
            new Error(
                data.error_description ||
                data.error ||
                'Salesforce token refresh failed'
            );

        error.statusCode =
            response.status;

        throw error;
    }

    /*
     * Salesforce may not return a new
     * refresh token.
     *
     * Keep the existing refresh token.
     */
    session.salesforce.accessToken =
        data.access_token;

    if (data.instance_url) {

        session.salesforce.instanceUrl =
            data.instance_url;
    }

    return data.access_token;
}


function getApiBaseUrl(instanceUrl) {

    return `${instanceUrl}/services/data/${salesforceConfig.apiVersion}`;
}


/*
 * Common Salesforce API request.
 */
async function salesforceRequest(
    session,
    url,
    options = {}
) {

    const token =
        session.salesforce;

    if (
        !token?.accessToken ||
        !token?.instanceUrl
    ) {

        const error =
            new Error(
                'Salesforce is not connected. Please connect Salesforce first.'
            );

        error.statusCode = 401;

        throw error;
    }

    let accessToken =
        token.accessToken;

    let response =
        await fetch(
            url,
            {
                ...options,

                headers: {
                    ...(options.headers || {}),

                    Authorization:
                        `Bearer ${accessToken}`
                }
            }
        );


    /*
     * Access token expired.
     *
     * Automatically refresh it and
     * retry the original request.
     */
    if (response.status === 401) {

        accessToken =
            await refreshSalesforceToken(
                session
            );

        response =
            await fetch(
                url,
                {
                    ...options,

                    headers: {
                        ...(options.headers || {}),

                        Authorization:
                            `Bearer ${accessToken}`
                    }
                }
            );
    }


    const data =
        await response.json().catch(
            () => ({})
        );


    if (!response.ok) {

        const error =
            new Error(
                data[0]?.message ||
                data.message ||
                'Salesforce API request failed'
            );

        error.statusCode =
            response.status;

        throw error;
    }

    return data;
}


/*
 * Get existing Salesforce Accounts.
 */
export async function getSalesforceAccounts(
    session
) {

    const token =
        session.salesforce;

    if (!token) {

        const error =
            new Error(
                'Salesforce is not connected.'
            );

        error.statusCode = 401;

        throw error;
    }

    const query = `
    SELECT Id, Name, Phone, Website
    FROM Account
    ORDER BY CreatedDate DESC
  `;

    const url =
        `${getApiBaseUrl(token.instanceUrl)}/query/?q=${encodeURIComponent(query)}`;

    return salesforceRequest(
        session,
        url
    );
}


/*
 * Create Salesforce Account.
 */
export async function createSalesforceAccount(
    session,
    {
        name,
        phone,
        website
    }
) {

    const token =
        session.salesforce;

    if (!token) {

        const error =
            new Error(
                'Salesforce is not connected.'
            );

        error.statusCode = 401;

        throw error;
    }

    const url =
        `${getApiBaseUrl(token.instanceUrl)}/sobjects/Account/`;

    const account = {
        Name: name
    };

    if (phone) {
        account.Phone = phone;
    }

    if (website) {
        account.Website = website;
    }

    return salesforceRequest(
        session,
        url,
        {
            method: 'POST',

            headers: {
                'Content-Type':
                    'application/json'
            },

            body:
                JSON.stringify(account)
        }
    );
}


/*
 * Create Contact linked to Account.
 */
export async function createSalesforceContact(
    session,
    {
        accountId,
        firstName,
        lastName,
        email
    }
) {

    const token =
        session.salesforce;

    if (!token) {

        const error =
            new Error(
                'Salesforce is not connected.'
            );

        error.statusCode = 401;

        throw error;
    }

    const url =
        `${getApiBaseUrl(token.instanceUrl)}/sobjects/Contact/`;

    const contact = {

        LastName:
            lastName,

        AccountId:
            accountId
    };

    if (firstName) {
        contact.FirstName =
            firstName;
    }

    if (email) {
        contact.Email =
            email;
    }

    return salesforceRequest(
        session,
        url,
        {
            method: 'POST',

            headers: {
                'Content-Type':
                    'application/json'
            },

            body:
                JSON.stringify(contact)
        }
    );
}