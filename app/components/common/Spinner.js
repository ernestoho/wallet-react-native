// import lib for making component
import React from 'react';
import { View, ActivityIndicator, Image } from 'react-native';
import context from './context';

// make component
const _Spinner = ({ size, type }) => {
  return (
    <View style={styles.containerStyle}>
      {type === 'rehive' ? (
        <Image
          style={{
            height: size === 'large' ? 150 : 50,
            width: size === 'large' ? 150 : 50,
          }}
          source={require('./../../../assets/icons/rehive_spinner_150.gif')}
        />
      ) : (
        <ActivityIndicator size={size || 'large'} />
      )}
    </View>
  );
};

const styles = {
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

const Spinner = context(_Spinner);

export { Spinner };
