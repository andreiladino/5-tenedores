import React, { useState } from 'react'
import { SocialIcon } from 'react-native-elements'
import * as Facebook from 'expo-facebook'
import * as firebase from 'firebase'
import { FacebookApi } from '../../utils/Social'
import Loading from '../Loading'



export default function LoginFacebook(props) {
        const { toastRef, navigation } = props
        const [isLoading, setisLoading] = useState(false)
        const login = async () => {
                const { type, token } = await Facebook.logInWithReadPermissionsAsync(
                        FacebookApi.application_id,
                        { permissions: FacebookApi.permissions }
                )
                if (type === 'success') {
                        setisLoading(true)
                        const credentials = firebase.auth.FacebookAuthProvider.credential(token)
                        await firebase
                                .auth()
                                .signInWithCredential(credentials)
                                .then(() => {
                                        navigation.navigate('MyAccount')
                                })
                                .catch(() => {
                                        toastRef.current.show('Error accidiendo con Facebook')
                                })
                } else if (type === 'cancel') {
                        toastRef.current.show('Inicio de Sesión cancelado')
                } else {
                        toastRef.current.show('error desconocido')
                }
                setisLoading(false)
        }

        return (
                <>
                        <SocialIcon
                                title='Iniciar sesión con Facebook'
                                button
                                type='facebook'
                                onPress={login}
                        />
                        <Loading
                                isVisible={isLoading}
                                text='Iniciando Sesión'
                        />
                </>
        )
}