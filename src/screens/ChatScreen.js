import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Dimensions,
    TouchableOpacity,
    Image,
} from 'react-native';

//ASSETS
import { COLORS, IMAGES, DIMENSION } from '../assets';

//COMMON COMPONENT
import { Header, Text } from '../components';
const { height, width } = Dimensions.get('screen');
import { GiftedChat } from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from 'react-native-actions-sheet';


function ChatScreen(props) {
    const actionSheetRef = useRef();
    const { headerTitle, chatRoomId, finalNodeId, userId, myName } = props.route.params;
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        getLatestMessage();
    }, [props])

    const backAction = () => {
        props.navigation.goBack();
    };

    const getLatestMessage = () => {
        const unsubscribeListener = firestore()
            .collection('MESSAGES')
            .doc(chatRoomId)
            .collection(finalNodeId)
            .orderBy('createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                const messages = querySnapshot.docs.map(doc => {
                    const firebaseData = doc.data()

                    const data = {
                        _id: doc.id,
                        text: '',
                        image: '',
                        createdAt: new Date().getTime(),
                        ...firebaseData
                    }

                    if (!firebaseData.system) {
                        data.user = {
                            ...firebaseData.user,
                            name: firebaseData.user.displayName
                        }
                    }

                    return data
                })

                setMessages(messages)
            })

        return () => unsubscribeListener()
    }

    async function handleSend(newMessage = [], image) {
        const text = newMessage ? newMessage[0].text : ''
        const msg = {
            createdAt: new Date().getTime(),
            user: {
                _id: userId,
                displayName: myName,
            },
            image: image,
            text: text,
            sent: true,
            received: true,
          }
       
        setMessages(GiftedChat.append(messages, msg))

        firestore()
            .collection('MESSAGES')
            .doc(chatRoomId)
            .collection(finalNodeId)
            .add(
                msg
            ).then(docRef => {

            })
    }

    const onPressUpload = () => {
        actionSheetRef.current?.setModalVisible(true);
    };

    const onPressLibrary = async type => {
        var result = null;
        if (type == 1) {
            result = await launchCamera();
            actionSheetRef.current?.setModalVisible(false);
        } else {
            result = await launchImageLibrary();
            actionSheetRef.current?.setModalVisible(false);
        }
        console.log(result);
        if (result && result.assets.length > 0) {
            let uri = result.assets[0].uri;
            // setImages(uri);
            UploadImageInFirestore(uri)
        }
    };

    const UploadImageInFirestore =  (uri) => {
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

                storage()
                .ref('images/'+filename)
                .putFile(uploadUri)
                .then((snapshot) => {
                    //You can check the image is now uploaded in the storage bucket
                    console.log(`${filename} has been successfully uploaded.`);
                    downloadImageUrl(filename);
                })
                .catch((e) => console.log('uploading image error => ', e));
    }

    const downloadImageUrl = (imageName)=>{
        let imageRef = storage().ref('images/' + imageName);

            imageRef
            .getDownloadURL()
            .then((url) => {
                //from url you can fetched the uploaded image easily
                console.log('imageUrll ', url)
                handleSend('', url);
            })
            .catch((e) => console.log('getting downloadURL of image error => ', e));
    }


    return (
        <View style={styles.container}>
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor={COLORS.primaryColor}
            />
            <SafeAreaView>
                <Header
                    title={headerTitle}
                    onBack={() => {
                        backAction();
                    }}
                    onVideoCall={() => {
                       props.navigation.navigate('CallingScreen', {
                        chatRoomId: chatRoomId,
                        finalNodeId: finalNodeId,
                        userId: userId,
                        myName: myName,
                       })
                    }}
                />
            </SafeAreaView>
            <GiftedChat
                messages={messages}
                onSend={newMessage => handleSend(newMessage, '')}
                user={{
                    _id: userId
                }}
                renderActions={() => (
                    <TouchableOpacity
                        style={[{ height: 32, width: 32, alignSelf: 'center', marginStart: 5 }]}
                        onPress={() => onPressUpload()}
                    >
                        <Image
                            source={IMAGES.add}
                        />
                    </TouchableOpacity>
                )}
            />

            <ActionSheet ref={actionSheetRef}>
                <View style={[styles.bottomView, {}]}>
                    <View style={[styles.bottomViewItem, {}]}>
                        <TouchableOpacity onPress={() => onPressLibrary(1)}>
                            <View style={[styles.bottomViewIcon, {}]}>
                                <View
                                    style={{
                                        backgroundColor: COLORS.primaryColor,
                                        height: 40,
                                        width: 40,
                                        borderRadius: 20,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>

                                </View>
                                <Text
                                    style={[styles.modalText]}
                                    size="16"
                                    weight="500"
                                    color={COLORS.textColor}>
                                    {'Camera'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View
                            style={{
                                height: 1,
                                width: '100%',
                                borderColor: COLORS.primaryColor,
                                borderWidth: 1,
                            }}></View>
                        <TouchableOpacity onPress={() => onPressLibrary(2)}>
                            <View style={[styles.bottomViewIcon, {}]}>
                                <View
                                    style={{
                                        backgroundColor: COLORS.primaryColor,
                                        height: 40,
                                        width: 40,
                                        borderRadius: 20,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>

                                </View>

                                <Text
                                    style={[styles.modalText]}
                                    size="16"
                                    weight="500"
                                    color={COLORS.textColor}>
                                    {'Photo library'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ActionSheet>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1.0,
        backgroundColor: COLORS.white,
    },
    inputView: {
        position: 'absolute',
        bottom: 0,
        marginBottom: 20,
        width: width,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    input: {
        width: width - 80,
        marginRight: 10,
        flex: 1.0,
        fontFamily: 'Poppins-Regular',
        fontWeight: '400',
        fontSize: 16,
        color: COLORS.black,
    },
    back: {
        height: 24,
        width: 24,
        alignSelf: 'center',
    },
    bottomView: {
        height: 150,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: '#ffffff',
    },
    bottomViewItem: {
        margin: 25,
        borderColor: COLORS.primaryColor,
        borderWidth: 2,
        borderRadius: 8,
    },
    bottomViewIcon: {
        flexDirection: 'row',
        height: 50,
        marginStart: 20,
        alignItems: 'center',
    },
    modalText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
        marginStart: 20,
    },
});

export default ChatScreen;
