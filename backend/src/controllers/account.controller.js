import {
    getSalesforceAccounts,
    createSalesforceAccount,
    createSalesforceContact
} from '../services/salesforce.service.js';

import {
    appendContactToSheet
} from '../services/googleSheet.service.js';


export async function getAccounts(
    req,
    res,
    next
) {

    try {

        const result =
            await getSalesforceAccounts(
                req.session
            );


        return res.json({

            success: true,

            data: result
        });

    } catch (error) {

        next(error);
    }
}


export async function createAccount(
    req,
    res,
    next
) {

    try {

        const {
            name,
            phone,
            website,
            firstName,
            lastName,
            email
        } = req.body;


        /*
         * Validate Account.
         */
        if (!name?.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    'Account name is required'
            });
        }


        /*
         * Validate Contact.
         */
        if (!lastName?.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    'Contact last name is required'
            });
        }


        /*
         * 1. Create Account in Salesforce.
         */
        const account =
            await createSalesforceAccount(
                req.session,
                {
                    name:
                        name.trim(),

                    phone:
                        phone?.trim(),

                    website:
                        website?.trim()
                }
            );


        /*
         * 2. Create Contact linked to
         *    the newly-created Account.
         */
        const contact =
            await createSalesforceContact(
                req.session,
                {
                    accountId:
                        account.id,

                    firstName:
                        firstName?.trim(),

                    lastName:
                        lastName.trim(),

                    email:
                        email?.trim()
                }
            );


        /*
         * 3. Add Contact ID to Google Sheet.
         */
        await appendContactToSheet({
            contactId: contact.id,
            accountId: account.id,
            accountName: name.trim(),
            phone: phone?.trim(),
            website: website?.trim(),
            email: email?.trim()
        });


        return res.status(201).json({

            success: true,

            message:
                'Account and Contact created successfully',

            data: {

                accountId:
                    account.id,

                contactId:
                    contact.id
            }
        });

    } catch (error) {

        next(error);
    }
}