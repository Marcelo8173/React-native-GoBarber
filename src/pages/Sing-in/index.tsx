import React, {useCallback, useRef} from 'react';
import { Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Input from '../../components/input';
import Button from '../../components/button';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import { useNavigation } from '@react-navigation/native';

import { Container, Title, ForgotPassword, ForgotPasswordText, CreateAccount, CreateAccountText } from './styles';
import LogoImg from '../../assets/logo.png';

const SingIn: React.FC = () =>{
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
                <Title>Faça seu Logon</Title>

                <Form ref={formRef} onSubmit={handleSubmit} >
                    <Input name="email" icon='mail' placeholder="E-mail" />
                    <Input name="password" icon='lock' placeholder="Senha"/>
                </Form>

                <Button onPress={() =>{
                    formRef.current?.submitForm();
                }} >Entrar</Button>

                <ForgotPassword onPress={()=>{}} > 
                    <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
                </ForgotPassword>
            </Container>

            <CreateAccount onPress={() => navigation.navigate('SingUp')}>
                <Icon name='log-in' size={20} color="#ff9000" />
                <CreateAccountText>Criar uma conta</CreateAccountText>
            </CreateAccount>
            </ScrollView>
        </>
    );
}

export default SingIn