import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Settings from './screens/Settings';
import Login from './screens/login';
import MainMenu from './screens/MainMenu';
import Army from './screens/Army';
import Play from './screens/Play';
import TestPlay from './screens/TestPlay';
import CreateArmy from './screens/CreateArmy'; // Import the CreateArmy screen
import { auth } from './firebase';
import SquadCustomizationScreen from './screens/SquadCustomizationScreen';
import ModelCustomizationScreen from './screens/ModelCustomizationScreen';


const Stack = createStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NavigationContainer>
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


          </>
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
