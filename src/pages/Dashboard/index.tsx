import React from 'react';
import { View, Button } from 'react-native';

import { useAuth } from '../../hooks/AuthContext';

const Dashboard: React.FC = () => {
    const { singOut } = useAuth();
    return(
        <View>
            <Button title="Sair" onPress={singOut} />
        </View>
    )
}

export default Dashboard;