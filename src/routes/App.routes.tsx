import React from 'react';

// para quando o usuario ja estiver autenticado
import Dashboard from '../pages/Dashboard';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../pages/profile';
import CreateAppointmenst from '../pages/CreateAppointments';
import AppointmenstCreated from '../pages/AppointmentsCreated';


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
            <App.Screen name="Profile" component={Profile} />
            <App.Screen name="CreateAppointmenst" component={CreateAppointmenst} />
            <App.Screen name="AppointmenstCreated" component={AppointmenstCreated} />

        </App.Navigator>
    );
}

export default AppRoutes;