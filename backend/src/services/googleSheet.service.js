import { google } from 'googleapis';

import {
    googleConfig
} from '../config/google.config.js';


async function getSheetsClient() {

    const auth =
        new google.auth.GoogleAuth({

            keyFile:
                googleConfig.keyFile,

            scopes: [
                'https://www.googleapis.com/auth/spreadsheets'
            ]
        });


    return google.sheets({

        version: 'v4',

        auth
    });
}

export async function appendContactToSheet({
    contactId,
    accountId,
    accountName,
    phone,
    website,
    email
}) {
    const sheets =
        await getSheetsClient();

    await sheets.spreadsheets.values.append({
        spreadsheetId:
            googleConfig.spreadsheetId,

        range:
            `${googleConfig.sheetName}!A:F`,

        valueInputOption:
            'USER_ENTERED',

        insertDataOption:
            'INSERT_ROWS',

        requestBody: {
            values: [
                [
                    contactId,
                    accountId,
                    accountName,
                    phone || '',
                    website || '',
                    email || ''
                ]
            ]
        }
    });

    return {
        success: true,
        contactId
    };
}