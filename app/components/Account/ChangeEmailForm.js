import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Input, Button } from 'react-native-elements'
import * as firebase from 'firebase'
import { reauthenticate } from '../../utils/Api'

export default function ChangeEmailForm(props) {

        const { email, setIsVisibleModal, setReloadData, toastRef } = props
        const [NewEmail, setNewEmail] = useState('')
        const [HidePassword, setHidePassword] = useState(true)
        const [password, setPassword] = useState('')
        const [IsLoading, setIsLoading] = useState(false)
        const [Error, setError] = useState({})

        const updateEmail = () => {
                setError({})
                if (!NewEmail || email === NewEmail) {
                        setError({ email: 'El email no puede ser igual o estar vacío' })
                } else {
                        setIsLoading(true)
                        reauthenticate(password)
                                .then(() => {
                                        firebase
                                                .auth()
                                                .currentUser.updateEmail(NewEmail)
                                                .then(() => {
                                                        setIsLoading(false)
                                                        setReloadData(true)
                                                        toastRef.current.show('Email actualizado')
                                                        setIsVisibleModal(false)
                                                })
                                                .catch((err) => {
                                                        setError({ email: 'Error al actualizar el Email' })
                                                        setIsLoading(false)
                                                });
                                })
                                .catch(() => {
                                        setError({ password: 'La contraseña Incorrecta' })
                                        setIsLoading(false)
                                });
                }

        }

        return (
                <View style={styles.view}>
                        <Input
                                placeholder='Correo electrónico'
                                containerStyle={styles.input}
                                defaultValue={email && email}
                                onChange={e => setNewEmail(e.nativeEvent.text)}
                                rightIcon={{
                                        type: 'material-community',
                                        name: 'at',
                                        color: '#c2c2c2',
                                }}
                                errorMessage={Error.email}
                        />
                        <Input
                                placeholder='Contraseña'
                                containerStyle={styles.input}
                                password={true}
                                secureTextEntry={HidePassword}
                                onChange={e => setPassword(e.nativeEvent.text)}
                                rightIcon={{
                                        type: 'material-community',
                                        name: HidePassword ? 'eye-outline' : 'eye-off-outline',
                                        color: '#c2c2c2',
                                        onPress: () => setHidePassword(!HidePassword)
                                }}
                                errorMessage={Error.password}
                        />
                        <Button
                                title='Cambiar Email'
                                containerStyle={styles.btnContainer}
                                buttonStyle={styles.btn}
                                onPress={updateEmail}
                                loading={IsLoading}
                        />
                </View>
        )
}

const styles = StyleSheet.create({
        view: {
                alignItems: 'center',
                paddingTop: 10,
                paddingBottom: 10,

        },
        input: {
                marginBottom: 10,
                marginTop: 10,
        },
        btnContainer: {
                marginTop: 20,
                width: '95%'
        },
        btn: {
                backgroundColor: '#00a680'
        }
})