import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Settings from './screens/Settings';
import Login from './screens/login';
import MainMenu from './screens/MainMenu';
import Army from './screens/Army';
import Play from './screens/Play';
import TestPlay from './screens/TestPlay';
import CreateArmy from './screens/CreateArmy';
import { auth } from './firebase';
import SquadCustomizationScreen from './screens/SquadCustomizationScreen';
import ModelCustomizationScreen from './screens/ModelCustomizationScreen';
import EditArmy from './screens/EditArmy';

const Stack = createStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  const navigationRef = useRef();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        if (navigationRef.current) {
          navigationRef.current.reset({
            index: 0,
            routes: [{ name: 'MainMenu' }],
          });
        }
      } else {
        setUser(null);
        if (navigationRef.current) {
          navigationRef.current.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="MainMenu" component={MainMenu} />
            <Stack.Screen name="Army" component={Army} />
            <Stack.Screen name="Play" component={Play} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="CreateArmy" component={CreateArmy} />
            <Stack.Screen name="TestPlay" component={TestPlay} />
            <Stack.Screen name="SquadCustomization" component={SquadCustomizationScreen} />
            <Stack.Screen name="ModelCustomization" component={ModelCustomizationScreen} />
            <Stack.Screen name="EditArmy" component={EditArmy} />
          </>
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
