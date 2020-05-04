import React from 'react';

// para quando o usuario ja estiver autenticado
import Dashboard from '../pages/Dashboard';
import { createStackNavigator } from '@react-navigation/stack';


const App = createStackNavigator();

const AppRoutes: React.FC = () =>{
    return(
        <App.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: {backgroundColor: '#312e38'}
            }}
        >
            
            <App.Screen name="Dashboard" component={Dashboard} />
        </App.Navigator>
    );
}

export default AppRoutes;