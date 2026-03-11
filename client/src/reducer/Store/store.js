import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../authSlice";
import gameReducer from "../gameSlice";
import providerReducer from "../providerSlice";
import userAdminReducer from '../userAdminSlice';
import rechargeReducer from '../rechargeAdminSlice';
import userProviderAccessReducer from '../userProviderAccessSlice'
import cricketReducer from '../cricketProviderSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        games: gameReducer,
        providers: providerReducer,
        userAdmin: userAdminReducer,
        recharge: rechargeReducer,
        userProviderAccess: userProviderAccessReducer,
        cricketProviders: cricketReducer
    },
});
