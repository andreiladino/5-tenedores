import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Input, Button } from 'react-native-elements'
import * as firebase from 'firebase'
import { reauthenticate } from '../../utils/Api'

export default function ChangePasswordForm(props) {

        const { setIsVisibleModal, toastRef } = props
        const [Password, setPassword] = useState('')
        const [NewPassword, setNewPassword] = useState('')
        const [NewPasswordRepeat, setNewPasswordRepeat] = useState('')
        const [Error, setError] = useState({})
        const [IsLoading, setIsLoading] = useState(false)
        const [HidePassword, setHidePassword] = useState(true)
        const [HideNewPassword, setHideNewPassword] = useState(true)
        const [HideNewPasswordRepeat, setHideNewPasswordRepeat] = useState(true)

        const updatePassword = () => {
                setError({})
                if (!Password || !NewPassword || !NewPasswordRepeat) {
                        console.log(`Password: ${Password}`)
                        let objError = {}
                        !Password && (objError.Password = 'No puede estar vacío')
                        !NewPassword && (objError.NewPassword = 'No puede estar vacío')
                        !NewPasswordRepeat && (objError.NewPasswordRepeat = 'No puede estar vacío')
                        setError(objError)
                } else {
                        if (NewPasswordRepeat !== NewPassword) {
                                setError({
                                        NewPassword: 'Las nuevas contraseñas deben ser igules',
                                        NewPasswordRepeat: 'Las nuevas contraseñas deben ser igules'
                                })
                        } else {
                                setIsLoading(true)
                                reauthenticate(Password)
                                        .then(() => {
                                                firebase.auth().currentUser.updatePassword(NewPassword).then(() => {
                                                        setIsLoading(false)
                                                        toastRef.current.show('Contraseña actualizada correctamente')
                                                        setIsVisibleModal(false)
                                                        // firebase.auth().signOut()
                                                }).catch(() => {
                                                        setError({ general: 'Erros al actualizar la contraseña' })
                                                        setIsLoading(false)
                                                });
                                        }).catch(() => {
                                                setError({ Password: 'La contraseña no es correcta' })
                                                setIsLoading(false)
                                        });
                        }
                }
        }

        return (
                <View style={styles.view}>
                        <Input
                                placeholder='Contraseña actual'
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
                                errorMessage={Error.Password}
                        />
                        <Input
                                placeholder='Nueva Contraseña'
                                containerStyle={styles.input}
                                password={true}
                                secureTextEntry={HideNewPassword}
                                onChange={e => setNewPassword(e.nativeEvent.text)}
                                rightIcon={{
                                        type: 'material-community',
                                        name: HideNewPassword ? 'eye-outline' : 'eye-off-outline',
                                        color: '#c2c2c2',
                                        onPress: () => setHideNewPassword(!HideNewPassword)
                                }}
                                errorMessage={Error.NewPassword}
                        />
                        <Input
                                placeholder='Repita Nueva Contraseña'
                                containerStyle={styles.input}
                                password={true}
                                secureTextEntry={HideNewPasswordRepeat}
                                onChange={e => setNewPasswordRepeat(e.nativeEvent.text)}
                                rightIcon={{
                                        type: 'material-community',
                                        name: HideNewPasswordRepeat ? 'eye-outline' : 'eye-off-outline',
                                        color: '#c2c2c2',
                                        onPress: () => setHideNewPasswordRepeat(!HideNewPasswordRepeat)
                                }}
                                errorMessage={Error.NewPasswordRepeat}
                        />
                        <Button
                                title='Cambiar Contraseña'
                                containerStyle={styles.btnContainer}
                                buttonStyle={styles.btn}
                                onPress={updatePassword}
                                loading={IsLoading}
                        />
                        <Text>
                                {error.general}
                        </Text>
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