// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { auth } from '../firebase'
// import { createUserWithEmailAndPassword } from 'firebase/auth'
// const SignUp = () => {

// const Register = () => {
//     if (pwd == pwd2) {
//         createUserWithEmailAndPassword(auth, email, pwd)
//             .then((x) => {
//              addDoc(colRef, {
//                 uid: x.user.uid,
//                 email: email,
//                 name: name,
//                 role: role,
//              })
//             })
//             .catch((error) => {
//                 alert(error.message)
//             });
//     } else {
//         alert("Passwords are different!")
//     }
// }
//   return (
//     <View>
//       <TextInput style={styles.input} placeholder="Full Name" onChangeText={text => setName(text)} />
//         <TextInput style={styles.input} placeholder="Email Address" onChangeText={text => setEmail(text)} />
//         <TextInput style={styles.input} placeholder="Who are you? (Student or Teacher)" onChangeText={text => setRole(text)}/>
//         <TextInput style={styles.input} placeholder="Password" secureTextEntry={true}  onChangeText={text => setPwd(text)}/>
//         <TextInput style={styles.input} placeholder="Confirme Password" secureTextEntry={true}  onChangeText={text => setPwd2(text)}/>

//         <TouchableOpacity
//             onPress={Register}
//             style={[styles.button, styles.buttonOutline]}
//         >
//             <Text style={styles.buttonOutLineText}>Register</Text>
//         </TouchableOpacity>
//     </View>
//   )
// }

// export default SignUp

// const styles = StyleSheet.create({})