import React from 'react';

import {Authprovider} from './AuthContext';

const AppProvider: React.FC = ({children}) =>{
    return(
        <Authprovider>
            {children}
        </Authprovider>
    );
};

export default AppProvider;