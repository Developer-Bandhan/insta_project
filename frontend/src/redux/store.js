import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from './authSlice.js';
import postSlice from './postSlice.js';
import socketSlice from './socketSlice.js'
import chatSlice from './chatSlice.js'
import rtnSlice from './rtnSlice.js'
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}
const rootReducer = combineReducers({
    auth: authSlice,
    post: postSlice,
    socketio: socketSlice,
    chat: chatSlice,
    realTimeNotification: rtnSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export default store;


{/*
    1. redux toolkit setup korar jonno prothome install kore nite hobe, 
       npm i @reduxjs/toolkit react-redux
    
    2. trpor src er vitore redux folder create korbo tarpor er vetore store.js file create korbo. 
       tarpor store.js file configure korbo, tar jonno configurestore store import korbo. tarpor 
       tarpor store create korte hobe, tarpor etar vetore reducer define korbo, reducer k slice o bola hoy.

    3. tarpor authslice import kore nebo, tarpor reducer er vetore auth er vetore authslice define korbo,
       tarpor store export korte hobe. (slice er name same hote hobe)
    
    4. tarpor main.jsx file a App.jsx file k provider er vetore wrap korte hobe. 
       tarpor store variable er vetore store props er moto pass korte hobe. 



    akhon refresh korle store theke asa information delete hoye jay, tai store er informaion persist korat jonno 
    store persist korte hoy. er jonno react toolkit website a giye redux toolkit persist search korte hobe, 
    tarpor install korte hobe, npm i redux-persist, 
    tarpot copy kore store.js file a paste korte hobe, 

    import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'
  
prothome ei part ta copy korte hobe, 

    tarpor ei part ta copy korte hobe, 

    const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

tarpor store er reducer part ta delete kore ei part ta bosate hobe, 

 reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),


    tarpor rootReducer create korte hobe, 
    const rootReducer = combineReducers({
    auth: authSlice,
})


  tarpor amin.jsx a persistGate import korte hobe, tarpor provider er vetore persistGate 
  use kore tar vetore App t Toster k rakhte hobe, tarpor perisistGate er vetore loading={null} 
  sathe persistor={ } provide korte hobe, persistor provide korar jonno ei line ta copy paste
  korte hobe. let persistor = persistStore(store) tarpor persistStore import korte hobe, 
  tarpor perisitor={persistor} define korte hobe. 
    
    */}