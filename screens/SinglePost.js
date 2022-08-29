import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

const SinglePost = (props) => {
  let element = props.route.params.item;
  console.log("route", props.route.params);
  return (
    <View>
      <Text>Post By: {element.username}</Text>
      <Text>Description: {element.description}</Text>
      <Text>Content: {element.contents}</Text>
    </View>
  );
};

const mapState = (state) => {
  return {
    userPost: state,
  };
};

export default connect(mapState)(SinglePost);

const styles = StyleSheet.create({});
