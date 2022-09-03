import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, Image, ImageBackground, Dimensions, ScrollView, TouchableOpacity, Alert} from "react-native";
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { db } from '../firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore' 
import { Avatar, ListItem } from 'react-native-elements'
import InfoText from '../components/infoText';
const  Profile = ({ navigation }) => {
    const [profile, setProfile] = useState({})
    const colRef = query(collection(db, 'Friends'), where('uid', '==', auth.currentUser?.uid))

    const handleSignOut = () => {
        signOut(auth)
        .then(() => {
            navigation.navigate('Login')
        })
    }

    useEffect(
        () => 
            onSnapshot(query(collection(db, 'users'), where('uid', '==', auth.currentUser?.uid)), (snapshot) =>
            setProfile(snapshot.docs[0].data())
            )
    ,[])
    const signOutAlert = () => {
      Alert.alert(
        `Sign Out`,
        `Are you sure you want to sign out?`,
        [
          {
            text: "Sign Out",
            onPress: () => handleSignOut()
          },
          {
            text: "Cancel",
            style: "cancel"
          }
        ]
      )
    }
    return (
      <ScrollView style={styles.scroll}>
           <View style={styles.headerContainer}>
            <View style={styles.coverContainer}>
              <ImageBackground
                style={styles.coverImage}
                source={require('../gifs/mountain-magic-hour.jpeg')}
                resizeMode="cover"
              >
                  <View style={styles.coverTitleContainer}>
                    <Text style={styles.coverTitle} />
                  </View>
                <View style={styles.coverMetaContainer}>
                  <Text style={styles.coverName}>{profile.name}</Text>
                  <Text style={styles.coverBio}>{profile.role}</Text>
                </View>
              </ImageBackground>
              <View>
              {profile.role === 'helper' ?   
              <View style={styles.profileImageContainer}>
                <Image source={require('../gifs/download.jpeg')} style={styles.profileImage} />
              </View> : <View style={styles.profileImageContainer}>
                <Image source={require('../gifs/default-user-image.png')} style={styles.profileImage} />
              </View>
              }
              </View>
            </View>
          </View>

          <InfoText text="Edit Friends" />
            <View >
              <ListItem 
                onPress={() => navigation.navigate('FriendsView')}
                containerStyle={styles.listItemContainer}
              >
                <Avatar source={require('../gifs/1141031.png')}/>
                <ListItem.Content>
                  <ListItem.Title >Friends</ListItem.Title>
                  </ListItem.Content>
                <ListItem.Chevron color="gray" />
              </ListItem>
            </View>
            <InfoText text="Edit..." />
            <ListItem title='Profile'  onPress={() => navigation.navigate('EditProfile')} containerStyle={styles.listItemContainer}>
                <Avatar source={require('../gifs/942748.png')}/>
                <ListItem.Content>
                  <ListItem.Title>Profile</ListItem.Title>
                  </ListItem.Content>
                <ListItem.Chevron color="gray" />
            </ListItem>
            <ListItem 
                onPress={() => navigation.navigate('MyPosts')}
                containerStyle={styles.listItemContainer}
              >
                <Avatar source={require('../gifs/2921222.png')}/>
                <ListItem.Content>
                  <ListItem.Title >Posts</ListItem.Title>
                  </ListItem.Content>
                <ListItem.Chevron color="gray" />
              </ListItem>
            <InfoText text="More..." />
            <ListItem onPress={signOutAlert} containerStyle={styles.listItemContainer}>
                <Avatar source={require('../gifs/4081653.png')}/>
                <ListItem.Content>
                  <ListItem.Title style={{color: 'red'}}>Sign Out</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron color="gray" />
            </ListItem>
            {profile.role === 'admin' ? 
             <ListItem onPress={() => navigation.navigate('Report')} containerStyle={styles.listItemContainer}>
              <Avatar source={require('../gifs/3093091.png')}/>
              <ListItem.Content>
               <ListItem.Title style={{color: 'red'}}>Report</ListItem.Title>
             </ListItem.Content>
             <ListItem.Chevron color="gray" />
            </ListItem>
            :''}
    </ScrollView>
    )
}

export default Profile

const styles = StyleSheet.create({
    line: {
      borderWidth: 1,
      margin: 5,
      opacity: 0.1
    },
    divider: {
      borderWidth: 1,
      margin: 5,
      opacity: 0.3
    },
    info: {
      paddingHorizontal: 5,
      paddingVertical: 5,
      fontSize: 25
    },
    border: {
      borderColor: 'white',
      borderWidth: 3,
      marginTop: 5,
      borderRadius: 10,
      shadowColor: 'black',
      shadowOffset: {width: 2, height: 6},
      shadowRadius: 2,
      shadowOpacity: 0.15
    },
    container: {
      margin: 5,
      alignItems: 'center'
    },
    buttonText: {
      fontSize: 20
    },
    button: {
      backgroundColor: '#0782F9',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: 5,
      margin: 5
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      shadowColor: 'black',
      shadowOffset: {width: 4, height: 4},
      shadowRadius: 2,
      shadowOpacity: 0.2
    },
    textInput: {
      height: 54,
      width: '40%',
      alignSelf: 'center',
      borderWidth: 1,
      borderRadius: 5,
      paddingLeft: 20,
      margin: 5,
      borderColor: '#0782F9',
      backgroundColor: 'white'
    },
    header: {
      alignSelf: 'center',
      fontSize: 25,
      padding: 7,
      backgroundColor: '#C0C0C0',
      shadowOffset: {width: 4, height: 4},
      shadowRadius: 2,
      shadowOpacity: 0.2
    },
    profileImage: {
      width: 200,
      height: 200,
      borderRadius: 100,
      overflow: 'hidden'
    },
    coverImage: {
      height: Dimensions.get('window').width * (3.5 / 4),
      width: Dimensions.get('window').width,
    },
    coverContainer: {
      position: 'relative',
    },
    headerContainer: {
      alignItems: 'center',
      backgroundColor: '#FFF',
    },
    profileImageContainer: {
      bottom: 0,
      left: 10,
      position: 'absolute',
    },
    profileImage: {
      borderColor: '#FFF',
      borderRadius: 55,
      borderWidth: 3,
      height: 110,
      width: 110,
    },
    coverMetaContainer: {
      backgroundColor: 'transparent',
      paddingBottom: 10,
      paddingLeft: 135,
    },
    coverName: {
      color: '#FFF',
      fontSize: 28,
      fontWeight: 'bold',
      paddingBottom: 2,
    },
    coverBio: {
      color: '#FFF',
      fontSize: 15,
      fontWeight: '600',
    },
    coverTitleContainer: {
      backgroundColor: 'transparent',
      flex: 1,
      justifyContent: 'space-between',
      paddingTop: 45,
    },
    coverTitle: {
      color: '#FFF',
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    listItemContainer: {
      height: 55,
      borderWidth: 0.5,
      borderColor: '#ECECEC',
    },
     scroll: {
    backgroundColor: 'white',
  },
  })