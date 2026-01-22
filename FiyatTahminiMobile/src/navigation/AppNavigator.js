import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import PricePredictionScreen from '../screens/PricePredictionScreen';
import PhoneEvaluationScreen from '../screens/PhoneEvaluationScreen';

// Admin Ekranları
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminUsersScreen from '../screens/AdminUsersScreen';
import AdminAdsScreen from '../screens/AdminAdsScreen';

// Kullanıcı Ekranları
import ExploreAdsScreen from '../screens/ExploreAdsScreen';
import CreateAdScreen from '../screens/CreateAdScreen';
import AdDetailScreen from '../screens/AdDetailScreen';
import MyAdsScreen from '../screens/MyAdsScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                {/* Auth */}
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />

                {/* User */}
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="PricePrediction" component={PricePredictionScreen} />
                <Stack.Screen name="PhoneEvaluation" component={PhoneEvaluationScreen} />

                {/* İlanlar */}
                <Stack.Screen name="ExploreAds" component={ExploreAdsScreen} />
                <Stack.Screen name="CreateAd" component={CreateAdScreen} />
                <Stack.Screen name="AdDetail" component={AdDetailScreen} />
                <Stack.Screen name="MyAds" component={MyAdsScreen} />

                {/* Admin */}
                <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
                <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
                <Stack.Screen name="AdminAds" component={AdminAdsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
