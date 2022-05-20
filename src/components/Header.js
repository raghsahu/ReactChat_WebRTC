import React, {useState} from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

//ASSETS
import {COLORS, IMAGES} from '../assets';

//COMMON COMPONENT
import {Text} from '../components';

/**
 * Header is Component to render app top header/navigation bar
 * @property {string} title - button title
 * @property {search} searchBar - searchBar
 * @property {search} tint - color of subviews
 * @property {search} titleType - color of subviews
 */

const Header = props => {
  return (
    <View style={[styles.container, props.style]}>
      {props.onBack && (
        <TouchableOpacity style={styles.backContainer} onPress={props.onBack}>
          <Image
            style={styles.back}
            source={IMAGES.back}
            resizeMode="contain"
            tintColor={COLORS.white}
          />
        </TouchableOpacity>
      )}

      <Text
        style={[
          props.centerTitleStyle,
          {
            flex: 1.0,
            justifyContent: 'center',
            alignSelf: 'center',
            marginLeft: 5,
          },
        ]}
        size="18"
        weight="600"
        align="left"
        color={props.titleTextColor ? props.titleTextColor : COLORS.white}>
        {props.title}
      </Text>

      {props.onEdit && (
        <TouchableOpacity
          style={{justifyContent: 'center', marginEnd: 5}}
          onPress={props.onEdit}>
          <Image
            style={styles.back}
            source={IMAGES.edit}
            resizeMode="contain"
            tintColor={COLORS.white}
          />
        </TouchableOpacity>
      )}
      {props.onNotification && (
        <TouchableOpacity
          style={{justifyContent: 'center', marginEnd: 5}}
          onPress={props.onNotification}>
          <Image
            style={styles.back}
            source={IMAGES.notification}
            resizeMode="contain"
            tintColor={COLORS.white}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    height: Platform.OS == 'ios' ? 44 : 54,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primaryColor,
  },
  backContainer: {
    alignSelf: 'center',
    height: 40,
    width: 40,
    justifyContent: 'center',
  },
  back: {
    height: 24,
    width: 24,
    alignSelf: 'center',
  },
});

export default Header;
