import React, {useContext} from 'react';
import {View, Dimensions, Image, TouchableOpacity} from 'react-native';
const {height, width} = Dimensions.get('screen');
//ASSETS
import {COLORS, IMAGES} from '../assets';
//COMMON COMPONENT
import {Text, Button} from '../components';


const UserItemList = props => {
  const item = props.item;
  return (
    <TouchableOpacity
      style={{
        //paddingVertical: 10,
    
      }}
      onPress={() => props.onPress(item)}>
    <View
      style={{
        flexDirection: 'row',
        marginTop: 10,
        marginHorizontal: 10,
        backgroundColor: COLORS.white,
        borderRadius: 8,
      }}>

      <View
        style={{
          flex: 1,
          margin: 5,
          backgroundColor: COLORS.gray,
          padding: 5,
          borderRadius: 8,
        }}>
        <Text style={{}} color={COLORS.primaryColor} size="16" weight="500">
          {item.name}
        </Text>
        
      </View>
    </View>
    </TouchableOpacity>
  );
};

export default UserItemList;
