import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native'
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'


export default function AddRestaurantForm(props) {

        const { toastRef, setIsLoading, navigation } = props
        const [imagesSelected, setImagesSelected] = useState([])

        return (
                <ScrollView>
                        <UpLoadImagen
                                imagesSelected={imagesSelected}
                                setImagesSelected={setImagesSelected}
                                toastRef={toastRef}
                        />
                </ScrollView>
        )
}

function UpLoadImagen(props) {

        const { imagesSelected, setImagesSelected, toastRef } = props

        const imageSelect = async () => {
                const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL)
                const resultPermissionCamera = resultPermission.permissions.cameraRoll.status
                if (resultPermissionCamera === 'denied') {
                        toastRef.current.show('Es necesario aceptar los permisos de la galería, en ajustes del celular ', 5000)
                } else {
                        const result = await ImagePicker.launchImageLibraryAsync({
                                allowsEditing: true,
                                aspect: [4, 3]
                        })
                        if (result.cancelled) {
                                toastRef.current.show('Has cerrado la galería sin seleccionar imagen', 2500)
                        } else {
                                setImagesSelected([...imagesSelected, result.uri])
                        }
                }
        }

        console.log(imagesSelected)

        return (
                <View style={styles.viewImages}>
                        <Icon
                                type='material-community'
                                name='camera'
                                color='#7a7a7a'
                                containerStyle={styles.containerIcon}
                                onPress={imageSelect}
                        />

                        {imagesSelected.map(imageRestaurant => {
                                <Avatar
                                        key={imageRestaurant}
                                        onPress={() => console.log('eliminando imagen')}
                                        style={styles.miniatureStyle}
                                        source={{ uri: imageRestaurant }}
                                />
                        })}
                </View>
        )
}

const styles = StyleSheet.create({
        viewImages: {
                flexDirection: 'row',
                marginLeft: 20,
                marginRight: 20,
                marginTop: 30,
        },
        containerIcon: {
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
                height: 70,
                width: 70,
                backgroundColor: '#e3e3e3',
        },
        miniatureStyle: {
                width: 70,
                height: 70,
                marginRight: 1,
        }
})