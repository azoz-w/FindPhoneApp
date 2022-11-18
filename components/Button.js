import React from 'react';
import {View, Button, Text, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native';

const CoordsButton = props => {
  return (
    <SafeAreaView>
      <View>
        <Button title="Get Location" onPress={props.getLocation} />

        <Text style={styles.title}>
          Latitude: {props.location ? props.location.coords.latitude : null}
        </Text>
        <Text style={styles.title}>
          Longitude: {props.location ? props.location.coords.longitude : null}
        </Text>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
});
export default CoordsButton;
