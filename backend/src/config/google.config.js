export const googleConfig = {
    keyFile:
        process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,

    spreadsheetId:
        process.env.GOOGLE_SHEET_ID,

    sheetName:
        process.env.GOOGLE_SHEET_NAME || 'Sheet1'
};