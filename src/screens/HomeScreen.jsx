import React from "react";
import { View, Button } from "react-native";
import NotRegisteredScreen from "./NotRegisteredScreen";
import AuthContext from "../components/AuthContext";
import YouTubeIframe from "react-native-youtube-iframe";
import YoutubeSearch from "../components/YoutubeSearch";

export default function HomeScreen({ navigation }) {
  const { isRegistered } = React.useContext(AuthContext);

  if (!isRegistered) {
    return <NotRegisteredScreen />;
  }
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <YouTubeIframe videoId={"TQtT9QgWjIY"} height={220} width={"100%"} />
      {/* <YoutubeSearch /> */}
      {/* <Button
        title="Go to Login"
        onPress={() => navigation.navigate('Login')}
      /> */}
    </View>
  );
}
