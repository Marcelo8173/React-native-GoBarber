import React from 'react';
import SingUp from '../pages/Sing-up';
import SingIn from '../pages/Sing-in';
import { createStackNavigator } from '@react-navigation/stack';


const Auth = createStackNavigator();

const AuthRoutes: React.FC = () =>{
    return(
        <Auth.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: {backgroundColor: '#312e38'}
            }}
            // initialRouteName='SingUp'
        >
            
            <Auth.Screen name="SingIn" component={SingIn} />
            <Auth.Screen name="SingUp" component={SingUp} />
        </Auth.Navigator>
    );
}

export default AuthRoutes;