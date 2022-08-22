import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore' 
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

const Chat = () => {

  return (
    <View>
      <Text>chat</Text>
    </View>
  )
}

export default Chat

const styles = StyleSheet.create({})