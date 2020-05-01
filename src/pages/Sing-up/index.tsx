import React, {useCallback, useRef} from 'react';
import { Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Input from '../../components/input';
import Button from '../../components/button';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import { useNavigation } from '@react-navigation/native';
import { Container, Title, BackLogon, BackLogonText } from './styles';
import LogoImg from '../../assets/logo.png';

const SingUp: React.FC = () =>{
    const formRef = useRef<FormHandles>(null);
    const navigation = useNavigation();

    const handleSubmit = useCallback((data: Object) =>{
        console.log(data);
    }, []);

    return(
        <>  
            <ScrollView 
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={{flex: 1}}
            >
            <Container>
                <Image source={LogoImg}/>
                <Title>Crie sua conta</Title>

                <Form ref={formRef} onSubmit={(data)=>{console.log(data)}}>
                    <Input name="name" icon='user' placeholder="Nome" />
                    <Input name="email" icon='mail' placeholder="E-mail" />
                    <Input name="password" icon='lock' placeholder="Senha"/>
                    <Button onPress={()=>formRef.current?.submitForm()} >Cadastrar</Button>
                </Form>

            </Container>

            <BackLogon onPress={() => navigation.navigate('SingIn')}>
                <Icon name='arrow-left' size={20} color="#fff" />
                <BackLogonText>Voltar para o Logon</BackLogonText>
            </BackLogon>
            </ScrollView>
        </>
    );
}

export default SingUp;