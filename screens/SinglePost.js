import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

const SinglePost = (props) => {
  console.log('----------',props.userPost)
  return (
    <View>
      <Text>Post By: {props.userPost.post.username}</Text>
      <Text>Description: {props.userPost.post.description}</Text>
      <Text>Content: {props.userPost.post.contents}</Text>
    </View>
  )
}

const mapState = (state) => {
  return {
    userPost: state
  }
}

export default connect(mapState)(SinglePost)

const styles = StyleSheet.create({})