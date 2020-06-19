import React, {useCallback, useRef} from 'react';
import { ScrollView, TextInput, Alert } from 'react-native';
import Input from '../../components/input';
import Button from '../../components/button';
import getValidationErros from '../../utils/getValidationErros';
import * as Yup from 'yup';
import ImagePicker from 'react-native-image-picker';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import api from '../../services/api';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../hooks/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Container, Title, UserAvatarButton, UserAvatar, BackButton} from './styles';

interface ProfileFormData{
    email: string;
    name: string;
    password: string;
    old_password:string;
    password_confirmation:string;
}

const SingUp: React.FC = () =>{
    const { user, updateUser} = useAuth();
    const formRef = useRef<FormHandles>(null);
    const emailRef = useRef<TextInput>(null);
    const OldPasswordRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    const ConfirmPasswordRef = useRef<TextInput>(null);

    const navigation = useNavigation();

    const handleSubmit = useCallback(async(data: ProfileFormData) => {
        formRef.current?.setErrors({});
            try {
                const schema = Yup.object().shape({
                    name: Yup.string().required('Nome obrigatorio'),
                    email: Yup.string().email().required('Email obrigatorio'),
                    old_password: Yup.string(),
                    
                    password: Yup.string().when('old_password',{
                        is: val => !!val.length,
                        then: Yup.string().required('Campo obrigatorio'),
                        otherwise: Yup.string(),
                    }),
                    
                    password_confirmation: Yup.string().when('old_password',{
                        is: val => !!val.length,
                        then: Yup.string().required('Campo obrigatorio'),
                        otherwise: Yup.string(),
                    })
                    .oneOf(
                        [Yup.ref('password'), null],
                        'Confirmação incorreta',
                    )
                });
    
                await schema.validate(data,{
                    abortEarly: false,
                });

                const {name, email, old_password, password, password_confirmation } = data;
                
                const formData = Object.assign({
                    name,
                    email,
                }, old_password ? {
                    old_password,
                    password,
                    password_confirmation
                }: {});
        
                
               const responseUpdate = await api.put('/profile', formData);
                
               updateUser(responseUpdate.data);


                Alert.alert('Perfil atulizado com sucesso')

                navigation.goBack();

            } catch (error) {
                if(error instanceof Yup.ValidationError){
                    const erros = getValidationErros(error)
                    formRef.current?.setErrors(erros);
                }
                
                Alert.alert('Ocorreu um erro ao atulizar o seu perfil');
            }
        },[navigation, updateUser]);
    
    const handleGoBack = useCallback(()=>{
        navigation.goBack();

    },[navigation]);

    const handleUpdateAvatar = useCallback(() =>{
        ImagePicker.showImagePicker({
            title: 'selecione um avatar',
            cancelButtonTitle: 'Cancelar',
            takePhotoButtonTitle: 'Usar Camera',
            chooseFromLibraryButtonTitle: 'Pegar da galeria',
        }, response => {

            if (response.didCancel) {
                return;
            }
            if (response.error) {
                
            }
            if (response.customButton) {
                Alert.alert('Erro ao atulizar o avatar');
                return;
            }
    
            const data = new FormData();

            data.append('avatar', {
                uri: response.uri,
                name: `${user.id}.jpeg`,
                type: 'image/jpg',
            });

            api.patch('/users/avatar', data).then(apiResponse => {
                updateUser(apiResponse.data);
            })

        });
    },[updateUser, user.id])
    return(
        <>  
            <ScrollView 
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={{flex: 1}}
            >
            <Container>

                <BackButton onPress={handleGoBack} >
                    <Icon name="chevron-left" size={24} color='#999591' />
                </BackButton>

                <UserAvatarButton onPress={handleUpdateAvatar}>
                    <UserAvatar source={{uri : user.avatar_url}}/>
                </UserAvatarButton>

                <Title>Meu Perfil</Title>

                <Form initialData={{name: user.name, email: user.email}} ref={formRef} onSubmit={handleSubmit}>
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
                        OldPasswordRef.current?.focus();
                    }}
                    placeholder="E-mail" 
                    />

                    <Input 
                    ref={OldPasswordRef}
                    secureTextEntry 
                    textContentType="newPassword" 
                    name="old_password" 
                    icon='lock'
                    containerStyle={{marginTop: 16}}
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current?.focus()} 
                    placeholder="Senha atual"/>
                    
                    <Input 
                        ref={passwordRef}
                        secureTextEntry 
                        textContentType="newPassword" 
                        name="password" 
                        icon='lock'
                        returnKeyType="next"
                        onSubmitEditing={() => ConfirmPasswordRef.current?.focus()} 
                        placeholder="Nova Senha"/>

                    <Input 
                         ref={passwordRef}
                         secureTextEntry 
                         textContentType="newPassword" 
                         name="password_confirmation" 
                         icon='lock'
                         returnKeyType="send"
                         onSubmitEditing={() => ConfirmPasswordRef.current?.focus()} 
                         placeholder="Confirmar senha"    
                    />


                    <Button onPress={()=>formRef.current?.submitForm()} >Confirmar mudanças</Button>
                </Form>

            </Container>
            </ScrollView>
        </>
    );
}

export default SingUp;