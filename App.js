import React, {useState, useEffect, useRef, useContext} from 'react';
import {View, Platform, LogBox, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

LogBox.ignoreAllLogs(true);

//SCREENS
import {
  Login,
  User_List,
  ChatScreen,
  CallingScreen,
} from './src/screens';
import {AppProvider} from './src/context/AppProvider';

const {Navigator, Screen} = createStackNavigator();


const App = () => {

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    LogBox.ignoreLogs([
      "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
    ]);
  }, []);

  useEffect(() => {
   
  }, []);

  return (
        <AppProvider>
          <NavigationContainer>
            <Navigator
              screenOptions={{
                headerShown: false,
              }}
              initialRouteName={'Login'}>
              <Screen name="Login" component={Login} />
              <Screen name="User_List" component={User_List} />
              <Screen name="ChatScreen" component={ChatScreen} />
              <Screen name="CallingScreen" component={CallingScreen} />
         
            </Navigator>
          </NavigationContainer>
        </AppProvider>
      
  );
};

export default App;
