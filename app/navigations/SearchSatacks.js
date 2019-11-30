import { createStackNavigator } from 'react-navigation-stack'
import SearchScreen from '../screens/Search'

const SeachScreenStacks = createStackNavigator({
        TopRestaurant: {
                screen: SearchScreen,
                navigationOptions: () => ({
                        title: 'Busca tu restaurante'
                })
        }
})

export default SeachScreenStacks;