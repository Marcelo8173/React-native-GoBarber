import React, { createContext, useCallback, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface AuthState{
    token: string;
    user: object;
}

interface singInCredentias{
    email: string;
    password: string;
}

interface AuthContextData{
    user: object;
    loading: boolean;
    singIn(credentias: singInCredentias): Promise<void>;
    singOut(): void;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const Authprovider: React.FC = ({children}) => {
   // salvando os dados do login em um estado
    const [data, setData] = useState<AuthState>({} as AuthState);
    const [loading, setLoading] = useState(true);

useEffect(() =>{
    async function loadStorageData(): Promise<void>{
        const [token, user] = await AsyncStorage.multiGet(['@goBarber: token','@goBarber: user']);

        if(token[1] && user[1]){
            setData({token: token[1], user: JSON.parse(user[1])});
        };
       setLoading(false);
    }

    loadStorageData();

},[])

const singIn = useCallback( async ({email, password}) =>{

        const response = await api.post('sessions',{
            email,
            password,
        });

        const {token, user} = response.data;

        await AsyncStorage.multiSet([
            ['@goBarber: token',token],
            ['@goBarber: user', JSON.stringify(user)]
        ])

        setData({token, user});
    }, []);

const singOut = useCallback(async () => {

    await AsyncStorage.multiRemove([
        '@goBarber: token',
        '@goBarber: user'
    ]);

    setData({} as AuthState);
}, []);

    return(
        <AuthContext.Provider value = {{user: data.user, loading, singIn, singOut}}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth(): AuthContextData{
    const context = useContext(AuthContext);

    if(!context){
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}