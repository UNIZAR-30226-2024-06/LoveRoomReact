import * as React from 'react';
import SafeArea from './src/components/SafeArea';
import BottomTab from './src/components/BottomTab';
import { ScrollView } from 'react-native';
import Login from './src/screens/LoginScreen';
import { View } from 'react-native';
import StackNavigator from './src/components/StackNavigator';
import AuthContext from './src/components/AuthContext';

export default function App() {
  const [isRegistered, setIsRegistered] = React.useState(false);

  return (
    <AuthContext.Provider value={{ isRegistered, setIsRegistered }}>
      <View
        style={{
          flex: 1,
        }}
      >
        <StackNavigator />
        {/*<ScrollView >
          < Login />
          <SafeArea />
      </ScrollView>*/}
      </View>
    </AuthContext.Provider>
  );
}
