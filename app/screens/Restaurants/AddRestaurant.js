import React, { useState, useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Toast from 'react-native-easy-toast'
import Loading from '../../components/Loading'
import AddRestaurantForm from '../../components/Restaurants/AddRestaurantForm'

export default function AddRestaurant(props) {

        const { navigation } = props
        const { setIsReloadRestaurants } = navigation.state.params
        const toastRef = useRef()
        const [IsLoading, setIsLoading] = useState(false)

        console.log(navigation.state.params)

        return (
                <View>
                        <AddRestaurantForm
                                toastRef={toastRef}
                                setIsLoading={setIsLoading}
                                navigation={navigation}
                                setIsReloadRestaurants={setIsReloadRestaurants}
                        />
                        <Toast
                                ref={toastRef}
                                position='center'
                                opacity={0.5}
                        />
                        <Loading
                                isVisible={IsLoading}
                                Text='Creando Restaurante'
                        />
                </View>
        )
}