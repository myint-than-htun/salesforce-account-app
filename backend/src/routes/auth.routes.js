import { Router } from 'express';

import {
    loginToSalesforce,
    salesforceCallback,
    getSalesforceStatus,
    logoutSalesforce
} from '../controllers/auth.controller.js';


const router =
    Router();


router.get(
    '/salesforce',
    loginToSalesforce
);


router.get(
    '/salesforce/callback',
    salesforceCallback
);


router.get(
    '/status',
    getSalesforceStatus
);


router.post(
    '/logout',
    logoutSalesforce
);


export default router;