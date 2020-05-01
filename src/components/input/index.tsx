import React, { useEffect, useRef } from 'react';
import { TextInputProps } from 'react-native';
import { Container, TextInput, Icon } from './styles';
import { useField } from '@unform/core';

interface InputProps extends TextInputProps{
    name: string;
    icon: string;
}

interface inputValueRef{
    value: string;
}

const Input: React.FC<InputProps> = ({name, icon, ...rest}) =>{
    const inputElementRef = useRef<any>(null)

    const {clearError,defaultValue = '',error, fieldName,registerField } = useField(name);

    const inputValueRef = useRef<inputValueRef>({ value: defaultValue});


    useEffect(() =>{
         registerField<string>({
             name: fieldName,
             ref: inputValueRef.current,
             path: 'value',
             setValue(ref: any, value){
                inputValueRef.current.value = value;
                inputElementRef.current.setNativeProps({text: value});
             },
             clearValue(){
                 inputValueRef.current.value = '';

             }
         })
    },[fieldName, registerField]);

    return(
        <Container>
            <Icon name={icon} size={20} color="#666360"/>
            <TextInput 
                ref={inputElementRef}
                placeholderTextColor="#666360"
                {...rest}
                onChangeText={(value) =>{
                inputValueRef.current.value = value;    
                }}
            />
        </Container>
    );
}

export default Input;