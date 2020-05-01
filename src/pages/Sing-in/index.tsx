import React from 'react';
import { Image } from 'react-native';
import Input from '../../components/input';
import Button from '../../components/button';

import { Container, Title } from './styles';
import LogoImg from '../../assets/logo.png';

const SingIn: React.FC = () =>{
    return(
        <Container>
            <Image source={LogoImg}/>
            <Title>Faça seu Logon</Title>

            <Input name="email" icon='mail' placeholder="E-mail" />
            <Input name="password" icon='lock' placeholder="Senha"/>

            <Button onPress={()=>(console.log(''))} >Entrar</Button>
        </Container>
    );
}

export default SingIn