import React, {useState} from 'react';
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import CoordsButton from './components/Button';
// Function to get permission for location
const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    console.log('granted', granted);
    if (granted === 'granted') {
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};

//we need to create the websocket connection from here
function startTracking() {
  var ws = new WebSocket('ws://127.0.0.1:8881/websocket');

  ws.onopen = () => {
    // connection opened
    ws.send('something'); // send a message
  };

  ws.onmessage = e => {
    // a message was received
    console.log(e.data);
  };

  ws.onerror = e => {
    // an error occurred
    console.log(e.message);
  };

  ws.onclose = e => {
    // connection closed
    console.log(e.code, e.reason);
  };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
const App = () => {
  // state to hold location
  const [location, setLocation] = useState(false);
  // function to check permissions and get Location
  const getLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            console.log(position);
            setLocation(position);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setLocation(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
  };

  //this it to change the state of the button for tracking location,,,
  // should be moved in a seperate component
  const [buttonTitle, setButtonTitle] = useState(false);
  const titleHandler = () => {
    setButtonTitle(!buttonTitle);
    startTracking();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View>
          <CoordsButton location={location} getLocation={getLocation} />
          {/* <Button title="Get Location" onPress={getLocation} />

          <Text style={styles.title}>
            Latitude: {location ? location.coords.latitude : null}
          </Text>
          <Text style={styles.title}>
            Longitude: {location ? location.coords.longitude : null}
          </Text> */}
        </View>
        <View style={styles.separator} />
        <Button
          title={buttonTitle ? 'Stop Tracking' : 'Start Tracking Location'}
          onPress={() => titleHandler()}
        />
        <Text style={styles.title}>{}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default App;
