import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
// import { ratings, votes } from "./Rate";
import { Rating, AirbnbRating } from "react-native-ratings";
const Ratings = (props) => {
  const element = props.route.params.id;
  const [defaultRating, setdefaultRating] = useState(2);
  const [maxRating, setmaxRating] = useState([1, 2, 3, 4, 5]);

  const starImgFilled =
    "https://github.com/tranhonghan/images/blob/main/star_filled.png?raw=true";
  const starImgCorner =
    "https://github.com/tranhonghan/images/blob/main/star_corner.png?raw=true";
  const totalReview = element.ratings / element.vote;
  // console.log(totalReview);
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>Please rate this location</Text>

      <View style={styles.customRatingBarStyle}>
        {maxRating.map((item, key) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              onPress={() => setdefaultRating(item)}
            >
              <Image
                style={styles.starImgStyle}
                source={
                  item <= defaultRating
                    ? { uri: starImgFilled }
                    : { uri: starImgCorner }
                }
              ></Image>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.textStyle}>
        {defaultRating + "/" + maxRating.length}
      </Text>
      <AirbnbRating
        showRating={false}
        isDisabled={true}
        count={5}
        defaultRating={totalReview}
        size={20}
      />
      <Text style={styles.textStyle}>{totalReview.toFixed(2)}</Text>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.buttonStyle}
        onPress={() => {
          ratings(element.id, defaultRating);
          votes(element.id);
          Alert.alert("Review Submitted!");
        }}
        // onPress={() => navigation.navigate("maps")}
      >
        <Text>Submit Rating</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Ratings;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    justifyContent: "center",
  },
  textStyle: {
    textAlign: "center",
    fontSize: 23,
    marginTop: 20,
  },

  customRatingBarStyle: {
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 30,
  },
  starImgStyle: {
    width: 30,
    height: 30,
    resizeMode: "cover",
  },
  buttonStyle: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    padding: 15,
    backgroundColor: "#bcd4e6",
  },
});
