import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, Icon, Button } from 'react-native-elements'
import { validateEmail } from '../../utils/Validation'
import Loading from '../Loading'

export default function LoginForm(props) {
        const { toastRef } = props
        const [hidePassword, sethidePassword] = useState(true)
        const [email, setemail] = useState('')
        const [password, setpassword] = useState('')
        const [isVisibleLoading, setisVisibleLoading] = useState(false)

        const login = () => {
                setisVisibleLoading(true)
                if (!email || !password) {
                        toastRef.current.show('Todos los campos son obligatorios')
                } else {
                        if (!validateEmail(email)) {
                                toastRef.current.show('El email no es válido')
                        } else {
                                // TO DO : Lógica para hacer login con firebase
                                console.log('Login correcto...')
                        }
                }
                setisVisibleLoading(false)

        }

        return (
                <View style={styles.formContainer}>
                        <Input
                                placeholder='Correo electrónico'
                                containerStyle={styles.inputForm}
                                onChange={e => setemail(e.nativeEvent.text)}
                                rightIcon={
                                        <Icon
                                                type='material-community'
                                                name='at'
                                                iconStyle={styles.iconRight}
                                        />
                                }
                        />
                        <Input
                                placeholder='Contraseña'
                                containerStyle={styles.inputForm}
                                password={true}
                                secureTextEntry={hidePassword}
                                onChange={e => setpassword(e.nativeEvent.text)}
                                rightIcon={
                                        <Icon
                                                type='material-community'
                                                name={hidePassword ? 'eye-outline' : 'eye-off-outline'}
                                                iconStyle={styles.iconRight}
                                                onPress={() => sethidePassword(!hidePassword)}
                                        />
                                }
                        />
                        <Button
                                title='Iniciar Sesión'
                                containerStyle={styles.btnContainerLogin}
                                buttonStyle={styles.btnLogin}
                                onPress={login}
                        />
                        <Loading
                                isVisible={isVisibleLoading}
                                text='Iniciando sesión'
                        />
                </View>
        )
};

const styles = StyleSheet.create({
        formContainer: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 30
        },
        inputForm: {
                width: '100%',
                marginTop: 20,
        },
        iconRight: {
                color: '#c1c1c1'
        },
        btnContainerLogin: {
                marginTop: 20,
                width: '95%',
        },
        btnLogin: {
                backgroundColor: '#00a680'
        }
})