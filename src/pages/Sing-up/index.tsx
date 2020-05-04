import React, {useCallback, useRef} from 'react';
import { Image, ScrollView, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Input from '../../components/input';
import Button from '../../components/button';
import getValidationErros from '../../utils/getValidationErros';
import * as Yup from 'yup';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import { useNavigation } from '@react-navigation/native';
import { Container, Title, BackLogon, BackLogonText } from './styles';
import LogoImg from '../../assets/logo.png';

interface singInFormData{
    email: string;
    name: string;
    password: string;
}

const SingUp: React.FC = () =>{
    const formRef = useRef<FormHandles>(null);
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    const navigation = useNavigation();

    const handleSubmit = useCallback(async(data: singInFormData) => {
        formRef.current?.setErrors({});
            try {
                const schema = Yup.object().shape({
                    name: Yup.string().required('Nome obrigatorio'),
                    email: Yup.string().email().required('E-mail obrigatorio'),
                    password: Yup.string().required('Senha obrigatoria'),
                });
    
                await schema.validate(data,{
                    abortEarly: false,
                });
                
                // await singIn({
                //     email: data.email,
                //     password: data.password,
                // });

            } catch (error) {
                if(error instanceof Yup.ValidationError){
                    const erros = getValidationErros(error)
                    formRef.current?.setErrors(erros);
                }
                
                Alert.alert('Erro no cadastro',
                'Ocorreu um erro ao fazer o cadastro, tente novamente');
            }
        },[]);

    return(
        <>  
            <ScrollView 
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={{flex: 1}}
            >
            <Container>
                <Image source={LogoImg}/>
                <Title>Crie sua conta</Title>

                <Form ref={formRef} onSubmit={handleSubmit}>
                    <Input 
                    autoCapitalize='words' 
                    name="name" 
                    icon='user' 
                    placeholder="Nome"
                    returnKeyType='next'
                    onSubmitEditing={()=>{
                        emailRef.current?.focus();
                    }}
                    />
                    
                    <Input
                    ref={emailRef}
                    keyboardType="email-address"
                    autoCorrect={false}
                    autoCapitalize="none" 
                    name="email" 
                    icon='mail'
                    returnKeyType="next"
                    onSubmitEditing={()=>{
                        passwordRef.current?.focus();
                    }}
                    placeholder="E-mail" 
                    />

                    <Input 
                    ref={passwordRef}
                    secureTextEntry 
                    textContentType="newPassword" 
                    name="password" 
                    icon='lock'
                    returnKeyType="send"
                    onSubmitEditing={() => formRef.current?.submitForm()} 
                    placeholder="Senha"/>

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