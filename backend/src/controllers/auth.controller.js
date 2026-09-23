import {
    buildAuthorizationUrl,
    generatePkce,
    exchangeAuthorizationCode
} from '../services/salesforce.service.js';


export function loginToSalesforce(
    req,
    res,
    next
) {

    try {

        const {
            codeVerifier,
            codeChallenge
        } = generatePkce();


        /*
         * Store verifier in server-side session.
         *
         * It must NOT be sent to React.
         */
        req.session.pkce = {
            codeVerifier
        };


        const authorizationUrl =
            buildAuthorizationUrl(
                codeChallenge
            );


        return res.redirect(
            authorizationUrl
        );

    } catch (error) {

        next(error);
    }
}


export async function salesforceCallback(
    req,
    res,
    next
) {

    try {

        const {
            code,
            error,
            error_description: errorDescription
        } = req.query;


        if (error) {

            return res.status(400).json({

                success: false,

                message:
                    errorDescription ||
                    error
            });
        }


        if (!code) {

            return res.status(400).json({

                success: false,

                message:
                    'Authorization code is missing'
            });
        }


        const codeVerifier =
            req.session.pkce?.codeVerifier;


        if (!codeVerifier) {

            return res.status(400).json({

                success: false,

                message:
                    'PKCE code verifier is missing. Please start the Salesforce connection again.'
            });
        }


        const tokenData =
            await exchangeAuthorizationCode(
                code,
                codeVerifier
            );


        /*
         * Save Salesforce tokens in session.
         *
         * Never send these tokens to React.
         */
        req.session.salesforce = {

            accessToken:
                tokenData.access_token,

            refreshToken:
                tokenData.refresh_token,

            instanceUrl:
                tokenData.instance_url
        };


        /*
         * PKCE verifier is no longer needed.
         */
        delete req.session.pkce;


        /*
         * Make sure session is saved before
         * redirecting to React.
         */
        req.session.save(
            (sessionError) => {

                if (sessionError) {
                    return next(sessionError);
                }

                return res.redirect(
                    'http://localhost:5173/?salesforce=connected'
                );
            }
        );

    } catch (error) {

        next(error);
    }
}


/*
 * React calls this endpoint when it starts.
 */
export function getSalesforceStatus(
    req,
    res
) {

    const connected =
        !!req.session.salesforce?.accessToken;

    return res.json({

        success: true,

        connected
    });
}


/*
 * Disconnect Salesforce.
 */
export function logoutSalesforce(
    req,
    res,
    next
) {

    req.session.destroy(
        (error) => {

            if (error) {
                return next(error);
            }

            res.clearCookie(
                'connect.sid'
            );

            return res.json({

                success: true,

                message:
                    'Salesforce disconnected'
            });
        }
    );
}