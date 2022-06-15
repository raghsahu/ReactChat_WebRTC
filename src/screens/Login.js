import React, {useEffect, useContext, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import firestore from '@react-native-firebase/firestore'

//ASSETS
import {COLORS, IMAGES, DIMENSION} from '../assets';

import {APPContext} from '../context/AppProvider';
import Toast from 'react-native-simple-toast';

//COMMON COMPONENT
import {
  Button,
  Text,
  Input,
  ProgressView,
} from '../components';

function Login(props) {
  const [email, setEmail] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
 // const {} = useContext(APPContext);

  useEffect(() => {
    getAllUserList();
  }, []);

  const getAllUserList = () => {
    const unsubscribe = firestore()
    .collection('Users')
    .onSnapshot(querySnapshot => {
      const Users = querySnapshot.docs.map(documentSnapshot => {
        return {
          _id: documentSnapshot.id,
          name: '',
          id: '',
          ...documentSnapshot.data()
        }
      })
      setUserList(Users)
      //console.log('userrrr ', JSON.stringify(Users))
      return () => unsubscribe()
    })
  }

  const LoginApi = () => {
    //setLoading(true);
    if(!email){
        Toast.show('Please enter name')
    }else if(findLinkByName()){
        // go to userList screen
        Toast.show('Login Success')
        props.navigation.navigate('User_List', {
            name: email,
            id: findLinkByName(),
        })
    }else{
        CreateNewUser()
    }
    
  };
  function findLinkByName() {
    for (const item of userList) {
      if (item.name === email) {
        return item.id;
      }
    }
  }

  const CreateNewUser =()=>{
      const userId= new Date().getTime();
    firestore()
    .collection('Users')
    .add({
      name: email,
      id: userId,
    })
    .then(docRef => {
        Toast.show('Login Success')
        props.navigation.navigate('User_List', {
            name: email,
            id: userId,
        })
    })

  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={COLORS.primaryColor}
      />
      <SafeAreaView>
          <Text
            style={[styles.inputContainer]}
            size="24"
            weight="700"
            align="center"
            color={COLORS.black}
            onPress={() => {}}>
            {'Login'}
          </Text>

          <Input
            style={[styles.inputView, styles.inputContainer]}
            placeholder={'Enter name'}
            onChangeText={text => {
              setEmail(text);
            }}
          />

          <Button
            style={[styles.inputView, {marginTop: 40}]}
            title={'Next'}
            onPress={() => {
              LoginApi();
            }}
          />

      </SafeAreaView>
      {isLoading ? <ProgressView></ProgressView> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1.0,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
  },
  inputView: {
    marginHorizontal: DIMENSION.marginHorizontal,
  },
  inputContainer: {
    marginTop: 16,
  },
});

export default Login;
