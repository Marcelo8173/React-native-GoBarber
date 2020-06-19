import React, { useState,useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { TextInputProps } from 'react-native';
import { Container, TextInput, Icon } from './styles';
import { useField } from '@unform/core';

interface InputProps extends TextInputProps{
    name: string;
    icon: string;
    containerStyle?: {}; 
}

interface inputValueRef{
    value: string;
}

interface InputRef{
    focus(): void;
}

const Input: React.RefForwardingComponent<InputRef,InputProps> = ({name, icon,containerStyle={}, ...rest}, ref) =>{
    const inputElementRef = useRef<any>(null)

    const {clearError,defaultValue = '',error, fieldName,registerField } = useField(name);

    const inputValueRef = useRef<inputValueRef>({ value: defaultValue});

    //estado para marcação de formularios
    const [isFocus, setIsfocus] = useState(false);
    const [isField, setIsfield] = useState(false);

    const handleInputFocus = useCallback(()=>{
        setIsfocus(true)
    },[]);
    
    const handleInputBlur = useCallback(() =>{
        setIsfocus(false);
        setIsfield(!!inputValueRef.current.value);
    },[])

    //passando referencia de filho para pai
    useImperativeHandle(ref, ()=>({
        focus(){
            inputElementRef.current.focus();
        },
    }));

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
        <Container style={containerStyle} isFocus={isFocus} isErrored={!!error}>
            <Icon name={icon} size={20} color={isFocus || isField ? '#ff9000': '#666360'}/>
            <TextInput 
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
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

export default forwardRef(Input);