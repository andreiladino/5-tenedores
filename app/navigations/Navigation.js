import React from "react";
import { Icon } from "react-native-elements";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";

import RestaurantsScreenStacks from "./RestaurantsStacks";
import TopListScreenStacks from './TopListSatacks'
import SearchScreenStacks from './SearchSatacks'
import AccountScreenStacks from './AccountStacks'


const NavigationStacks = createBottomTabNavigator(
        {
                Restaurants: {
                        screen: RestaurantsScreenStacks,
                        navigationOptions: () => ({
                                tabBarLabel: "Restaurantes",
                                tabBarIcon: ({ tinColor }) => (
                                        <Icon
                                                type="material-comunity"
                                                name="restaurant"
                                                size={22}
                                                color={tinColor}
                                        />
                                )
                        })
                },
                TopLists: {
                        screen: TopListScreenStacks,
                        navigationOptions: () => ({
                                tabBarLabel: 'Ranking',
                                tabBarIcon: ({ tinColor }) => (
                                        <Icon
                                                type="material-comunity"
                                                name="stars"
                                                size={22}
                                                color={tinColor}
                                        />
                                )
                        })
                },
                Search: {
                        screen: SearchScreenStacks,
                        navigationOptions: () => ({
                                tabBarLabel: 'Buscar',
                                tabBarIcon: ({ tinColor }) => (
                                        <Icon
                                                type="material-comunity"
                                                name="search"
                                                size={22}
                                                color={tinColor}
                                        />
                                )
                        })
                },
                Account: {
                        screen: AccountScreenStacks,
                        navigationOptions: () => ({
                                tabBarLabel: 'Cuenta',
                                tabBarIcon: ({ tinColor }) => (
                                        <Icon
                                                type="material-comunity"
                                                name="home"
                                                size={22}
                                                color={tinColor}
                                        />
                                )
                        })
                }
        },
        {
                initialRouteName: 'Account',
                order: ['Restaurants', 'TopLists', 'Search', 'Account'],
                tabBarOptions: {
                        inactiveTintColor: '#646464',
                        activeTintColor: '#00a680'
                }
        }
);

export default createAppContainer(NavigationStacks);
