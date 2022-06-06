import React from 'react';
import {View, Modal, ActivityIndicator} from 'react-native';

import {COLORS} from '../assets';

/**
 * ProgressView is Function Component to render indicator modal
 * @property {bool} visible - show modal
 */

const ProgressView = props => {
  return (
    <Modal visible={true} transparent={true}>
      <View
        style={{
          flex: 1.0,
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            alignSelf: 'center',
            padding: 30,
            borderRadius: 10,
          }}>
          <ActivityIndicator
            size="large"
            animating={true}
            color={COLORS.primaryColor}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ProgressView;
