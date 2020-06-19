import React, { useCallback, useState, useEffect } from 'react';

import { useAuth } from '../../hooks/AuthContext';
import Icon from 'react-native-vector-icons/Feather'
import {Container,Header,HeadersTitle,UserName,
    ProfileButton,UserAvatar, ProvidersList,
    ProviderContainer,ProviderAvatar,ProviderName,ProviderInfo,ProviderMeta,ProviderMetaText,
    ProvidersListTitle
    } from './styles';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';

export interface ProvidersData{
    id: string;
    name: string;
    avatar_url: string;
}

const Dashboard: React.FC = () => {
    const [providers, setProviders] = useState<ProvidersData[]>([]);
    const {navigate} = useNavigation();

    const { user, singOut } = useAuth();
    const navigateToProfile = useCallback(()=>{
        navigate('Profile')
        
    },[singOut]);

    const navigateToCreateAppointments = useCallback((providerId: string)=>{
        navigate('CreateAppointmenst',{providerId})
    },[navigate]);

    useEffect(()=>{
        api.get('/providers').then(response =>{
            setProviders(response.data);
        });
    });

    

    return(
        <Container>
            <Header>
                <HeadersTitle>
                    Bem vindo {"\n"}
                    <UserName>
                        {user.name} 
                    </UserName>
                </HeadersTitle>

                <ProfileButton onPress={navigateToProfile} >
                    <UserAvatar source={{uri: 'https://avatars3.githubusercontent.com/u/50594445?s=460&u=16dac43ef18932d9fe3d30b7e19f76bb9c0d170c&v=4'}} />
                </ProfileButton>
            </Header>

            <ProvidersList 
                data={providers}
                ListHeaderComponent={
                    <ProvidersListTitle>
                        Cabeleireiros
                    </ProvidersListTitle>
                }
                keyExtractor={(provider) => provider.id}
                renderItem={({item: provider})=>(
                    <ProviderContainer onPress={()=> navigateToCreateAppointments(provider.id)}>
                        <ProviderAvatar source={{uri: provider.avatar_url}} />
                        <ProviderInfo>
                            <ProviderName>{provider.name}</ProviderName>

                            <ProviderMeta>
                                <Icon name="calendar" size={14} color="#ff9000"/>
                                <ProviderMetaText>Segunda à sexta</ProviderMetaText>
                            </ProviderMeta>

                             <ProviderMeta>
                                <Icon name="clock" size={14} color="#ff9000"/>
                                <ProviderMetaText>08:00 às 18:00</ProviderMetaText>
                            </ProviderMeta>

                        </ProviderInfo>
                    </ProviderContainer>
                )}
            />
        </Container>
    )
}

export default Dashboard;