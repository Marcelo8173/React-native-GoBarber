import React, {useCallback, useRef} from 'react';
import { Image, ScrollView, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Input from '../../components/input';
import Button from '../../components/button';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { useAuth } from '../../hooks/AuthContext';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import getValidationErros from '../../utils/getValidationErros';
import { Container, Title, ForgotPassword, ForgotPasswordText, CreateAccount, CreateAccountText } from './styles';
import LogoImg from '../../assets/logo.png';

interface singInFormData{
    email: string;
    password: string;
}

const SingIn: React.FC = () =>{
    const formRef = useRef<FormHandles>(null);
    const passwordRef = useRef<TextInput>(null);
    const navigation = useNavigation();
    const { singIn } = useAuth();

    const handleSubmit = useCallback(async(data: singInFormData) => {
        formRef.current?.setErrors({});
            try {
                const schema = Yup.object().shape({
                    email: Yup.string().email().required('E-mail obrigatorio'),
                    password: Yup.string().required('Senha obrigatoria'),
                });
    
                await schema.validate(data,{
                    abortEarly: false,
                });
                
                await singIn({
                    email: data.email,
                    password: data.password,
                });

            } catch (error) {
                if(error instanceof Yup.ValidationError){
                    const erros = getValidationErros(error)
                    formRef.current?.setErrors(erros);
                }
                
                Alert.alert('Erro na autenticação',
                'Ocorreu um erro ao fazer login, reveja as credencias')
            }
        },[singIn]);

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
                    <Input
                    autoCorrect={false} 
                    autoCapitalize='none'
                    keyboardType="email-address"
                    name="email" 
                    icon='mail' 
                    returnKeyType='next'
                    onSubmitEditing={()=>{
                        passwordRef.current?.focus();
                    }}
                    placeholder="E-mail" />


                    <Input 
                    ref={passwordRef}
                    secureTextEntry
                    returnKeyType='send'
                    name="password" 
                    icon='lock' 
                    placeholder="Senha"
                    onSubmitEditing={formRef.current?.submitForm}
                    />
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