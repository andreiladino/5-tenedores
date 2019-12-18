import React, { useState, useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Toast from 'react-native-easy-toast'
import Loading from '../../components/Loading'
import AddRestaurantForm from '../../components/Restaurants/AddRestaurantForm'

export default function AddRestaurant(props) {

        const { navigation } = props
        const toastRef = useRef()
        const [IsLoading, setIsLoading] = useState(false)

        return (
                <View>
                        <AddRestaurantForm
                                navigation={navigation}
                                toastRef={toastRef}
                                setIsLoading={setIsLoading}
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