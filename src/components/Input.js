import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';

//Assets
import {COLORS, IMAGES} from '../assets';

//Common Component
import {Text} from '../components';

//Packages

/**
 * Input is Component to render app text input
 * @property {Any} extraStyle - style as per parent view
 * @property {string} label - input title header text
 */

const Input = props => {
  const [open, setOpen] = useState(false);

  return (
    <View style={props.style}>
      <View style={[styles.inputContainer, props.border]}>
        {props.isLeft && (
          <View
            style={{
              backgroundColor: COLORS.primaryColor,
              height: 40,
              width: 40,
              borderRadius: 20,
              alignSelf: 'center',
              justifyContent: 'center',
              marginRight: 5,
            }}>
            <Image
              source={props.isLeft}
              tintColor={COLORS.white}
              style={{
                height: 24,
                width: 24,
                alignSelf: 'center',
                justifyContent: 'center',
                resizeMode: 'contain',
              }}
            />
          </View>
        )}
        <TextInput
          {...props}
          style={[styles.input, props.input]}
          placeholderTextColor={COLORS.placeHolderTextColor}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={props.secureTextEntry && !open}
        />
        {props.isShow && (
          <TouchableOpacity
            style={{justifyContent: 'center', alignSelf: 'center'}}
            onPress={props.isShow}>
            <Image
              source={IMAGES.eye}
              tintColor={COLORS.black}
              style={{
                height: 24,
                width: 24,
                alignSelf: 'center',
                justifyContent: 'center',
                marginRight: 5,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// const Label = (props) => {
//     return (
//         <Text
//             style={{ marginLeft: 1, marginBottom: 4}}
//             size="14"
//             weight="400"
//             color={COLORS.black}>
//             {props.title}
//         </Text>
//     )
// }

const styles = StyleSheet.create({
  inputContainer: {
    height: 48,
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 24,
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
  },
  input: {
    flex: 1.0,
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 16,
    color: COLORS.black,
  },
});

export default Input;
