import { KeyboardAvoidingView, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase'
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged} from 'firebase/auth'
import { db } from '../firebase'
import { collection, addDoc} from 'firebase/firestore' 

const LoginScreen = ({ navigation }) => {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [isSignedIn, setIsSignedIn] = useState(false)

   const [name, setName] = useState('')
   const [role, setRole] = useState('')
   const [pwd, setPwd] = useState('')
   const [pwd2, setPwd2] = useState('')

   const colRef = collection(db, 'users')




    useEffect(() => {
       const unsbuscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigation.navigate('Home')
            }
          })
          return unsbuscribe
    },[])

   const handleSignUp = () => {
  
      createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Registered with:', user.email);
        setIsSignedIn(true)
      })
      .catch(error => alert(error.message))
  }

const handleSignIn = () => {
  
    signInWithEmailAndPassword(auth, email, password)
    .then((re) => {

      setIsSignedIn(true)
    })
    .catch(error => alert(error.message))
}



const SignUp = () => {

    if (pwd == pwd2) {
        createUserWithEmailAndPassword(auth, email, pwd)
            .then((x) => {
             addDoc(colRef, {
                uid: x.user.uid,
                email: email,
                name: name,
                role: role,
             })
            })
            .catch((error) => {
                alert(error.message)
                // ..
            });
    } else {
        alert("Passwords are different!")
    }
}

const In = () => {
  
    signInWithEmailAndPassword(auth, email, pwd)
    .then((re) => {

      setIsSignedIn(true)
    })
    .catch(error => alert(error.message))
}
  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior="padding"
  >
            <View style={styles.inputContainer}>
                <TextInput 
                placeholder='Email'
                value={email}
                 onChangeText={text => setEmail(text)}
                style={styles.input}
                />

                <TextInput 
                placeholder='Password'
                value={password}
                onChangeText={text => setPassword(text)}
                style={styles.input}
                secureTextEntry
                />

            </View>

            <View style={styles.buttonContainer}>
            
                <TouchableOpacity
                    onPress={handleSignIn}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                

                <TouchableOpacity
                    onPress={handleSignUp}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutLineText}>Register</Text>
                </TouchableOpacity>


                
            </View>

            <View>
            <TextInput style={styles.input} placeholder="Full Name" onChangeText={text => setName(text)} />
        <TextInput style={styles.input} placeholder="Email Address" onChangeText={text => setEmail(text)} />
        <TextInput style={styles.input} placeholder="Who are you? (Student or Teacher)" onChangeText={text => setRole(text)}/>
        <TextInput style={styles.input} placeholder="Password" secureTextEntry={true}  onChangeText={text => setPwd(text)}/>
        <TextInput style={styles.input} placeholder="Confirme Password" secureTextEntry={true}  onChangeText={text => setPwd2(text)}/>
        
        <TouchableOpacity
                    style={[styles.button, styles.buttonOutline]}
                    onPress={In}
                >   
                    <Text style={styles.buttonOutLineText}>in</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={SignUp}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutLineText}>up</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
   
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputContainer: {
      width: '80%'
    },
    input: {
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      marginTop: 5,
    },
    buttonContainer: {
      width: '60%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 40,
    },
    button: {
      backgroundColor: '#0782F9',
      width: '100%',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonOutline: {
      backgroundColor: 'white',
      marginTop: 5,
      borderColor: '#0782F9',
      borderWidth: 2,
    },
    buttonText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 16,
    },
    buttonOutlineText: {
      color: '#0782F9',
      fontWeight: '700',
      fontSize: 16,
    },
  })