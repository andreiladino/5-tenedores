import React, { useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Input, Icon, Button } from 'react-native-elements'
import { validateEmail } from '../../utils/Validation'
import * as firebase from 'firebase'
import { withNavigation } from 'react-navigation';
import Loading from '../Loading'

function RegisterForm(props) {
        const { toastRef, navigation } = props
        const [hidePassword, setHidePassword] = useState(true)
        const [hideRepeatPassword, setHideRepeatPassword] = useState(true)
        const [email, setemail] = useState('')
        const [password, setpassword] = useState('')
        const [repeatPassword, setRepeatPassword] = useState('')
        const [isVisibleLoading, setisVisibleLoading] = useState(false)

        const register = async () => {
                setisVisibleLoading(true)
                if (!email || !password || !repeatPassword) {
                        toastRef.current.show('Todos los campos son obligatorios')
                } else {
                        if (!validateEmail(email)) {
                                toastRef.current.show('El email no es válido')
                        } else {
                                if (password !== repeatPassword) {
                                        toastRef.current.show('Las contraseñas no son iguales')
                                } else {
                                        await firebase
                                                .auth()
                                                .createUserWithEmailAndPassword(email.trim(), password)
                                                .then(() => {
                                                        navigation.navigate('MyAccount')
                                                })
                                                .catch(() => {
                                                        toastRef.current.show('Error al crear la cuenta')
                                                })
                                }
                        }
                }
                setisVisibleLoading(false)
        }

        return (
                <View style={styles.formContainer}>
                        <Input
                                placeholder='Correo Electrónico'
                                containerStyle={styles.inputForm}
                                onChange={e => setemail(e.nativeEvent.text)}
                                rightIcon={
                                        <Icon
                                                type='material-comunity'
                                                name='email'
                                                iconStyle={styles.iconRight}
                                        />
                                }
                        />
                        <Input
                                placeholder='Contraseña'
                                password={true}
                                secureTextEntry={hidePassword}
                                containerStyle={styles.inputForm}
                                onChange={e => setpassword(e.nativeEvent.text)}
                                rightIcon={
                                        <Icon
                                                type='material-comunity'
                                                name={hidePassword ? 'remove-red-eye' : 'panorama-fish-eye'}
                                                iconStyle={styles.iconRight}
                                                onPress={() => setHidePassword(!hidePassword)}
                                        />
                                }
                        />
                        <Input
                                placeholder='Repetir Contraseña'
                                password={true}
                                secureTextEntry={hideRepeatPassword}
                                containerStyle={styles.inputForm}
                                onChange={e => setRepeatPassword(e.nativeEvent.text)}
                                rightIcon={
                                        <Icon
                                                type='material-comunity'
                                                name={hideRepeatPassword ? 'remove-red-eye' : 'panorama-fish-eye'}
                                                iconStyle={styles.iconRight}
                                                onPress={() => setHideRepeatPassword(!hideRepeatPassword)}
                                        />
                                }
                        />
                        <Button
                                title='Unirse'
                                containerStyle={styles.btnContainerRegister}
                                buttonStyle={styles.btnRegister}
                                onPress={register}
                        />
                        <Loading
                                text='Creando Cuenta...'
                                isVisible={isVisibleLoading}
                        />
                </View>
        )
}

export default withNavigation(RegisterForm)

const styles = StyleSheet.create({
        formContainer: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 30,
        },
        iconRight: {
                color: '#c1c1c1'
        },
        inputForm: {
                width: '100%',
                marginTop: 20,
        },
        btnContainerRegister: {
                marginTop: 20,
                width: '95%',
        },
        btnRegister: {
                backgroundColor: '#00a680'
        }
})