export const salesforceConfig = {
    clientId: process.env.SALESFORCE_CLIENT_ID,

    clientSecret: process.env.SALESFORCE_CLIENT_SECRET,

    callbackUrl: process.env.SALESFORCE_CALLBACK_URL,

    loginUrl:
        process.env.SALESFORCE_LOGIN_URL ||
        'https://login.salesforce.com',

    apiVersion:
        process.env.SALESFORCE_API_VERSION ||
        'v66.0'
};