import { Router } from 'express';

import {
    getAccounts,
    createAccount
} from '../controllers/account.controller.js';


const router =
    Router();


router.get(
    '/',
    getAccounts
);


router.post(
    '/',
    createAccount
);


export default router;