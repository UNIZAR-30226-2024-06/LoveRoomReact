import * as React from 'react';
import SafeArea from './src/components/SafeArea';
import BottomTab from './src/components/BottomTab';
import { ScrollView } from 'react-native';
import Login from './src/screens/LoginScreen';
import { View } from 'react-native';
import StackNavigator from './src/components/StackNavigator';

export default function App() {
  return (
    <View
      style={{
        flex: 1
      }} >
      <StackNavigator />
      {/*<ScrollView >
        < Login />
        <SafeArea />
    </ScrollView>*/}
      </View>
  );
}

