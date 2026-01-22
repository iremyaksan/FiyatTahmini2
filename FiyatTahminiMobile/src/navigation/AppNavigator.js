import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import PricePredictionScreen from '../screens/PricePredictionScreen';
import PhoneEvaluationScreen from '../screens/PhoneEvaluationScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="PricePrediction" component={PricePredictionScreen} />
                <Stack.Screen name="PhoneEvaluation" component={PhoneEvaluationScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
