import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native'
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import MapView from 'react-native-maps';
import Modal from '../Modal'
import Toast from 'react-native-easy-toast'
import uuid from 'uuid/v4'
import { firebaseApp } from '../../utils/FireBase'
import firebase from 'firebase/app'
import 'firebase/firestore'

const db = firebase.firestore(firebaseApp)

const WidthScreen = Dimensions.get('window').width

export default function AddRestaurantForm(props) {

        const { toastRef, setIsLoading, navigation, setIsReloadRestaurants } = props
        const [imagesSelected, setImagesSelected] = useState([])
        const [restaurantName, setRestaurantName] = useState('')
        const [restaurantAddress, setRestaurantAddress] = useState('')
        const [restaurantDescription, setRestaurantDescription] = useState('')
        const [isVisibleMap, setIsVisibleMap] = useState(false)
        const [locationRestaurant, setLocationRestaurant] = useState(null)

        const addRestaurant = () => {
                if (!restaurantName || !restaurantAddress || !restaurantDescription) {
                        toastRef.current.show('Todos los campos son obligatarios', 3000)
                } else if (imagesSelected.length === 0) {
                        toastRef.current.show('El restaurante debe tener al menos una foto', 3000)
                } else if (!locationRestaurant) {
                        toastRef.current.show('Debes localizar el Restaurante en el mapa', 3000)
                } else {
                        setIsLoading(true)
                        uploadImageStorage(imagesSelected).then((arrayImages) => {
                                db.collection('restaurants').add({
                                        name: restaurantName,
                                        address: restaurantAddress,
                                        description: restaurantDescription,
                                        location: locationRestaurant,
                                        images: arrayImages,
                                        rating: 0,
                                        ratingTotal: 0,
                                        quatityVoting: 0,
                                        createAt: new Date(),
                                        createBy: firebaseApp.auth().currentUser.uid
                                }).then(() => {
                                        setIsReloadRestaurants(true)
                                        navigation.navigate('Restaurants')
                                }).catch((err) => {
                                        // toastRef.current.show(`Error al subir el Restaurante: ${err}, 3000`)
                                        console.log(`Error al subir el Restaurante: ${err}`)
                                });
                                setIsLoading(false)
                        }).catch((err) => {
                                toastRef.current.show(`Error al subir el Restaurante: ${err}, 3000`)

                        });
                }
        }

        const uploadImageStorage = async imageArray => {
                const imagesBlob = []
                await Promise.all(
                        imageArray.map(async image => {
                                const response = await fetch(image)
                                const blob = await response.blob()
                                const ref = firebase
                                        .storage()
                                        .ref('restaurant-images')
                                        .child(uuid())
                                await ref.put(blob).then((result) => {
                                        imagesBlob.push(result.metadata.name)
                                        // imagesBlod.push()
                                }).catch((err) => {

                                });
                        })
                )
                return imagesBlob
        }

        return (
                <ScrollView>
                        <ImageRestaurant
                                imageRestaurant={imagesSelected[0]}
                        />
                        <FormAdd
                                setRestaurantName={setRestaurantName}
                                setRestaurantAddress={setRestaurantAddress}
                                setRestaurantDescription={setRestaurantDescription}
                                setIsVisibleMap={setIsVisibleMap}
                                locationRestaurant={locationRestaurant}
                        />
                        <UpLoadImagen
                                imagesSelected={imagesSelected}
                                setImagesSelected={setImagesSelected}
                                toastRef={toastRef}
                        />
                        <Button
                                title='Crear Restaurante'
                                onPress={addRestaurant}
                                buttonStyle={styles.btnAddRestaurant}
                        />
                        <Map
                                isVisibleMap={isVisibleMap}
                                setIsVisibleMap={setIsVisibleMap}
                                setLocationRestaurant={setLocationRestaurant}
                                toastRef={toastRef}
                        />
                </ScrollView>
        )
}

function ImageRestaurant(props) {
        const { imageRestaurant } = props
        return (
                <View style={styles.viewPhoto}>
                        {imageRestaurant ? (
                                <Image
                                        source={{ uri: imageRestaurant }}
                                        style={{ width: WidthScreen, height: 200 }}
                                />
                        ) :
                                (
                                        <Image
                                                source={require('../../../assets/img/no-image.png')}
                                                style={{ width: WidthScreen, height: 200 }}
                                        />
                                )}
                </View>
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

        const removeImage = image => {
                const arrayImages = imagesSelected
                Alert.alert(
                        'Eliminar Imagen',
                        'Estás seguro de que quieres eliminar la imagen?',
                        [
                                {
                                        text: 'Cancel',
                                        style: 'cancel'
                                },
                                {
                                        text: 'Eliminar',
                                        onPress: () => setImagesSelected(arrayImages.filter(imageUrl => imageUrl !== image))
                                }
                        ],
                        { cancelable: false }
                )
        }

        return (
                <View style={styles.viewImages}>
                        {imagesSelected.length < 5 && (
                                <Icon
                                        type='material-community'
                                        name='camera'
                                        color='#7a7a7a'
                                        containerStyle={styles.containerIcon}
                                        onPress={imageSelect}
                                />

                        )}

                        {imagesSelected.map(imageRestaurant => (
                                <Avatar
                                        key={imageRestaurant}
                                        onPress={() => removeImage(imageRestaurant)}
                                        style={styles.miniatureStyle}
                                        source={{ uri: imageRestaurant }}
                                />
                        ))}
                </View>
        )
}

function FormAdd(props) {

        const { setRestaurantName,
                setRestaurantAddress,
                setRestaurantDescription,
                setIsVisibleMap,
                locationRestaurant,
        } = props

        return (
                <View style={styles.viewForm}>
                        <Input
                                placeholder='nombre del restaurante'
                                containerStyle={styles.input}
                                onChange={e => setRestaurantName(e.nativeEvent.text)}
                        />
                        <Input
                                placeholder='Dirección'
                                containerStyle={styles.input}
                                rightIcon={{
                                        type: 'material-community',
                                        name: 'google-maps',
                                        color: locationRestaurant ? '#00a680' : '#c2c2c2',
                                        onPress: () => setIsVisibleMap(true)

                                }}
                                onChange={e => setRestaurantAddress(e.nativeEvent.text)}
                        />
                        <Input
                                placeholder='Descripción del restaurante'
                                multiline={true}
                                inputContainerStyle={styles.textArea}
                                onChange={e => setRestaurantDescription(e.nativeEvent.text)}
                        />
                </View>
        )
}


function Map(props) {
        const { isVisibleMap,
                setIsVisibleMap,
                setLocationRestaurant,
                toastRef
        } = props

        const [location, setLocation] = useState(null)


        useEffect(() => {
                (async () => {
                        const resultPermissions = await Permissions.askAsync(Permissions.LOCATION)
                        const statusPermissions = resultPermissions.permissions.location.status

                        if (statusPermissions !== 'granted') {
                                toastRef.current.show('Debes aceptar los permisos de Localización para crear un Restaurante', 3000)
                        } else {
                                const loc = await Location.getCurrentPositionAsync({})
                                setLocation({
                                        latitude: loc.coords.latitude,
                                        longitude: loc.coords.longitude,
                                        latitudeDelta: 0.001,
                                        longitudeDelta: 0.001,
                                })
                        }
                })()
        }, [])

        const confirmLocation = () => {
                setLocationRestaurant(location)
                toastRef.current.show('Localización guardada correctamente', 3000)
                setIsVisibleMap(false)
        }

        return (
                <Modal
                        isVisible={isVisibleMap}
                        setIsVisible={setIsVisibleMap}
                >
                        <View>
                                {location && (
                                        <MapView
                                                style={styles.mapStyle}
                                                initialRegion={location}
                                                showsUserLocation={true}
                                                onRegionChange={region => setLocation(region)}
                                        >
                                                <MapView.Marker
                                                        coordinate={{
                                                                latitude: location.latitude,
                                                                longitude: location.longitude
                                                        }}
                                                        draggable
                                                />
                                        </MapView>
                                )}
                                <View
                                        style={styles.viewMapBtn}
                                >
                                        <Button
                                                title='Guardar Ubicación'
                                                onPress={confirmLocation}
                                                containerStyle={styles.viewMapBtnContainerSave}
                                                buttonStyle={styles.viewMapBtnSave}
                                        />
                                        <Button
                                                title='Cancelar Ubicación'
                                                onPress={() => setIsVisibleMap(false)}
                                                containerStyle={styles.viewMapBtnContainerCancel}
                                                buttonStyle={styles.viewBtnCancel}
                                        />
                                </View>
                        </View>
                </Modal>
        )
}

const styles = StyleSheet.create({
        viewPhoto: {
                alignItems: 'center',
                height: 200,
                marginBottom: 20,
        },
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
        },
        viewForm: {
                marginLeft: 10,
                marginRight: 10,
        },
        input: {
                marginBottom: 10,

        },
        textArea: {
                height: 100,
                width: '100%',
                padding: 0,
                margin: 0,
        },
        mapStyle: {
                width: '100%',
                height: 450,
        },
        viewMapBtn: {
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 10,
        },
        viewMapBtnContainerSave: {
                paddingRight: 5,
        },
        viewMapBtnSave: {
                backgroundColor: '#00a680'
        },
        viewMapBtnContainerCancel: {
                paddingLeft: 5,
        },
        viewBtnCancel: {
                backgroundColor: '#a60d0d'
        },
        btnAddRestaurant: {
                backgroundColor: '#00a680',
                margin: 20
        }
})