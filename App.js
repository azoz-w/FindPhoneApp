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
            console.log(
              position.coords.latitude + '||' + position.coords.longitude,
            );
            setLocation(position);
            ws.send(
              position.coords.latitude + '||' + position.coords.longitude,
            );
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
  var ws = new WebSocket('ws://10.0.2.2:8881/websocket');

  ws.onopen = () => {
    ws.send('something');
  };
  ws.onmessage = e => {
    console.log(e.data);
  };
  ws.onerror = e => {
    console.log(e.message);
  };
  ws.onclose = e => {
    console.log(e.code, e.reason);
  };

  //this it to change the state of the button for tracking location,
  const [buttonTitle, setButtonTitle] = useState(true);
  const startTracking = () => {
    setButtonTitle(!buttonTitle);
    getLocation();
    // ws.send(JSON.stringify(location.coords));
  };
  const stopTracking = () => {
    setButtonTitle(!buttonTitle);
    ws.close();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View>
          <CoordsButton location={location} getLocation={getLocation} />
        </View>
        <View style={styles.separator} />
        {buttonTitle ? (
          <Button
            title="Start Tracking Location"
            onPress={startTracking}
            style={styles.startButton}
            color="#238823"
          />
        ) : (
          <Button
            title="Stop Tracking"
            onPress={stopTracking}
            style={styles.stopButton}
            color="#D2222D"
          />
        )}
        <Text style={styles.title}>{}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  startButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  stopButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    marginHorizontal: 16,
    marginBottom: 35,
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
