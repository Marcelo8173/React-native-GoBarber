import React, { useCallback, useEffect, useState, useMemo } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { Container, Header, 
    BackButton, HeaderTitle,UserAvatar, 
    ProvidersListContainer, ProvidersList,
    ProviderContainer ,ProviderAvatar, ProviderName,
    Calendar, Title, OpenDatePickerButton,OpenDatePickerText,Schedule, Section,
    SectionTitle, SectionContent, Hour, HourText, CreateAppointmenstButton, CreateAppointmenstButtonText } from './styles';
import { useRoute, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { useAuth } from '../../hooks/AuthContext';
import api from '../../services/api';
import DateTimePicker from '@react-native-community/datetimepicker'
import { Platform, Alert } from 'react-native';

interface RouteParams{
    providerId: string;
}


export interface ProvidersData{
    id: string;
    name: string;
    avatar_url: string;
}

interface DayAvailability{
    hour: number,
    available: boolean,
}

const CreateAppointmenst: React.FC = () => {
    const route = useRoute();
    const { goBack, navigate } = useNavigation();
    const { user } = useAuth();
    const {providerId} = route.params as RouteParams;

    //states
    const [availavility,setAvailavility] =useState<DayAvailability[]>([]);
    const [showPicker, setShowPicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedHour, setSelectedHour] = useState(0);
    const [providers, setProviders] = useState<ProvidersData[]>([]);
    const [selectdProvider, setSelectedProvider] = useState(providerId);

    useEffect(()=>{
        api.get('/providers').then(response =>{
            setProviders(response.data);
        });
    },[]);

    useEffect(()=>{
        api.get(`providers/${selectdProvider}/day-availability`,{
            params: {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() +1,
                day: selectedDate.getDate(),
            }
        }).then(response => {
            setAvailavility(response.data)
        })
    },[selectedDate, selectdProvider]);


    const NavigateBack = useCallback(()=>{
        goBack();
    },[goBack]);

    const handleSelectedProvider = useCallback((id:string)=>{
        setSelectedProvider(id);
    },[])

    const handleToogleDatePicker = useCallback(()=>{
        setShowPicker((state) => !state);
    },[]);

    const handleDateChanged = useCallback((event: any, date: Date | undefined) =>{
        if(Platform.OS === 'android'){
            setShowPicker(false);
        }
        if(date){
            setSelectedDate(date);
        }
    },[]);

    const handleSelectHour = useCallback((hour: number) => {
        setSelectedHour(hour);  
    },[]);

    const MorginAvailability = useMemo(()=>{
        return availavility.filter(({hour}) => hour < 12)
        .map(({available,hour}) =>{
            return {
                hour,
                available,
                hourFormatted: format(new Date().setHours(hour), 'HH:00')
            }
        })
    },[availavility]);

    const AffternonAvailability = useMemo(()=>{
        return availavility.filter(({hour}) => hour >= 12)
        .map(({available,hour}) =>{
            return {
                hour,
                available,
                hourFormatted: format(new Date().setHours(hour), 'HH:00')
            }
        })
    },[availavility]);

    const HandleCreateAppointments =  useCallback( async ()=>{
        try {
            const date = new Date(selectedDate);

            date.setHours(selectedHour);
            date.setMinutes(0);

            await api.post('/appoitments', {
                provider_id: selectdProvider,
                date,
            })

            navigate('AppointmenstCreated', { date: date.getTime()})
        } catch (error) {
            Alert.alert('Erro ao criar um agendamento', 'Ocorreu um erro ao fazer o agendamento')
        }
    },[selectedHour,selectedDate, navigate, selectdProvider])

    return(
       <Container>
           <Header>
               <BackButton onPress={NavigateBack}>
                    <Icon name="chevron-left" size={24} color="#999591" />
               </BackButton>
               <HeaderTitle>Cabeleireiros</HeaderTitle>
               <UserAvatar source={{uri: user.avatar_url}} />
           </Header>

            <ProvidersListContainer>
                <ProvidersList
                    horizontal
                    showsHorizontalScrollIndicator={false}

                    data={providers}
                    keyExtractor={(provider) => provider.id}
                    renderItem={({item: provider}) =>(
                        <ProviderContainer
                            onPress={()=>handleSelectedProvider(provider.id)}
                            selected = {selectdProvider === provider.id}
                        >
                            <ProviderAvatar source={{uri : provider.avatar_url}} />
                            <ProviderName
                                selected = {selectdProvider === provider.id}
                            >{provider.name}</ProviderName>
                        </ProviderContainer>
                    )}
                 />
            </ProvidersListContainer>
            <Calendar>
                <Title>Escolha a data</Title>
               
               <OpenDatePickerButton onPress={handleToogleDatePicker}>
                        <OpenDatePickerText>Selecionar outra Data</OpenDatePickerText>
               </OpenDatePickerButton>

               {showPicker &&
                (<DateTimePicker
                    mode='date'
                    onChange={handleDateChanged}
                    display="calendar"
                    textColor="#f4ede8"
                    value={selectedDate}
                />)}
            </Calendar>

            <Schedule>
                <Title>Escolha o horario</Title>
                <Section>
                    <SectionTitle>Manhã</SectionTitle>
                    <SectionContent horizontal>
                        {MorginAvailability.map(({hourFormatted, hour, available}) =>(
                            <Hour 
                            enabled={available}
                            seleceted={selectedHour === hour}
                            available={available} 
                            key={hourFormatted}
                            onPress={() => handleSelectHour(hour)}
                            >
                                <HourText
                                    seleceted={selectedHour === hour}
                                >{hourFormatted}</HourText>
                            </Hour>
                        ))}
                    </SectionContent>
                </Section>


                <Section>
                    <SectionTitle>Tarde</SectionTitle>
                    <SectionContent horizontal>
                        {AffternonAvailability.map(({hourFormatted , hour ,available}) =>(
                            <Hour 
                            enabled={available}
                            seleceted={selectedHour === hour}
                            available={available} 
                            key={hourFormatted}
                            onPress={() => handleSelectHour(hour)}
                            >
                                <HourText
                                    seleceted={selectedHour === hour}
                                >{hourFormatted}</HourText>
                            </Hour>
                        ))}
                    </SectionContent>
                </Section>
            </Schedule>
        
            <CreateAppointmenstButton onPress={HandleCreateAppointments} >
                <CreateAppointmenstButtonText>
                    Agendar
                </CreateAppointmenstButtonText>
            </CreateAppointmenstButton>
       </Container>
    )
}

export default CreateAppointmenst;