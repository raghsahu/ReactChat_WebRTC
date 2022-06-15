import React, {useEffect, useContext, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore'

//ASSETS
import {COLORS, IMAGES, DIMENSION} from '../assets';
import Toast from 'react-native-simple-toast';

//COMMON COMPONENT
import {
  Button,
  Text,
  Header,
  ProgressView,
  UserItemList
} from '../components';

function User_List(props) {
  const {name, id} = props.route.params;
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
      const filteredData = Users.filter(item => item.name !== name);
      setUserList(filteredData)
      return () => unsubscribe()
    })
  }

  function findLinkByName(list, nodeName) {
    for (const item of list) {
      if (item.name === nodeName) {
        return item._id;
      }
    }
  }

  const getNodeId = (name, recieverName) => {
    return name + '_' + recieverName 
  };

  const getNodeId1 = (name, recieverName) => {
    return recieverName + '_' + name 
  };

  const checkChatRoom = (groupChat, recieverName) => {
      const unsubscribe = firestore()
        .collection('MESSAGES')
        .onSnapshot(querySnapshot => {
          const threads = querySnapshot.docs.map(documentSnapshot => {
            return {
              _id: documentSnapshot.id,
              name: '',
              ...documentSnapshot.data()
            }
          })

          if (threads.length > 0) {
              if(groupChat){
                const threadIdGroup = findLinkByName(threads, 'GroupChat');
                if (threadIdGroup) {
                    props.navigation.navigate('ChatScreen', {
                      headerTitle: 'GroupChat',
                      chatRoomId: threadIdGroup,
                      finalNodeId: 'GroupChat',
                      userId: id,
                      myName: name,
                    })
                  }else{
                    NewThreadCreateGroup('GroupChat');
                  }
              }else{
                const threadId = findLinkByName(threads, getNodeId(name, recieverName));
                const threadId1 = findLinkByName(threads, getNodeId1(name, recieverName));
                if (threadId || threadId1) {
                  props.navigation.navigate('ChatScreen', {
                    headerTitle: recieverName,
                    chatRoomId: threadId ? threadId : threadId1,
                    finalNodeId: threadId ? getNodeId(name, recieverName) : getNodeId1(name, recieverName),
                    userId: id,
                    myName: name,
                  })
                } else {
                  NewThreadCreate(name, recieverName);
                }
              }
        
          }
        })
      return () => unsubscribe()
  };

  const NewThreadCreate = (name, recieverName) => {
    //// create new thread using firebase & firestore
    firestore()
      .collection('MESSAGES')
      .add({
        name: getNodeId(name, recieverName),
        createdAt: new Date().getTime(),
      })
      .then(docRef => {
        docRef.collection(getNodeId(name, recieverName))
        .add({
          text: `Chat room created. Welcome!`,
          createdAt: new Date().getTime(),
          system: true
        })
        if (docRef.id) {
          props.navigation.navigate('ChatScreen', {
            headerTitle: recieverName,
            chatRoomId: docRef.id,
           // chatRoomId1: '',
            finalNodeId: getNodeId(name, recieverName),
           // finalNodeId1: getNodeId1(name, recieverName),
            userId: id,
            myName: name,
          })
        }

      })
  };

  const NewThreadCreateGroup = (name) => {
    //// create new thread using firebase & firestore
    firestore()
      .collection('MESSAGES')
      .add({
        name: name,
        createdAt: new Date().getTime(),
      })
      .then(docRef => {
        docRef.collection(name).add({
          text: `Chat room created. Welcome!`,
          createdAt: new Date().getTime(),
          system: true
        })
        if (docRef.id) {
          props.navigation.navigate('ChatScreen', {
            headerTitle: 'GroupChat',
            chatRoomId: docRef.id,
            finalNodeId: 'GroupChat',
            userId: id,
            myName: name,
          })
        }

      })
  };


  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={COLORS.primaryColor}
      />
      <SafeAreaView>
      <Header
          title={'Welcome '+ name}
          onBack={() => {
             props.navigation.goBack();
          }}
        />
          <Text
            style={[styles.inputContainer]}
            size="18"
            weight="500"
            align="center"
            color={COLORS.black}
            onPress={() => {}}>
            {'All User List'}
          </Text>

          <Text
            style={[{backgroundColor: COLORS.gray, width: 150, margin: 10}]}
            size="24"
            weight="700"
           // align="center"
            color={COLORS.black}
            onPress={() => {
                checkChatRoom(true, '');
            }}>
            {'Group Chat'}
          </Text>
        
          <FlatList
          showsVerticalScrollIndicator={false}
          data={userList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return <UserItemList
              item={item}
              onPress={(item) => {
                checkChatRoom(false, item.name);
              }}
            />;
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
  },
  inputView: {
    marginHorizontal: DIMENSION.marginHorizontal,
  },
  inputContainer: {
    marginTop: 16,
  },
});

export default User_List;
