import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";
import { default as NumberFormat } from "react-number-format";

import Colors from "../../constants/Colors";
import Card from "../UI/Card";

const ProductItem = (props) => {
  let TouchableCmp = TouchableOpacity;
  const [isFound, setIsFound] = useState({ uri: props.image })
  const [isStyle, setIsStyle] = useState(styles.image);
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
// useEffect(() => {
//   if (props.isFound == false) {
//     setIsFound({ uri: props.image })  
//     } else   {
//       setIsFound(require('../../assets/default.png'))
//     }
// },  [props.image]) 



  return (
    <Card style={styles.product}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View>
            <View style={styles.imageContainer}>
            <Image

onError={
  (e) => {
    setIsFound(require("../../assets/default.png"));
  // my vscode extension figured out what i would say here.
  // My vscode went black when I tried to use this. I don't know why lol.
    setIsStyle(styles.imageError);
  } /*console.log(e)*/
}
style={isStyle}
defaultSource={require("../../assets/default.png")}
source={isFound}
/>
            </View>
            <View style={styles.content}>
              <Text style={styles.title}>{props.title}</Text>
              <View>
                <NumberFormat
                  value={props.discount > 0 ? props.discountPrice : props.price}
                  className="foo"
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"Rp"}
                  renderText={(value, props) => (
                    <Text {...props} style={styles.newPrice}>
                      {value}
                    </Text>
                  )}
                />

                {props.discount > 0 ? (
                  <View style={styles.discountDrop}>
                    <NumberFormat
                      value={props.price}
                      className="foo"
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"Rp"}
                      renderText={(value, props) => (
                        <Text>
                          <Text {...props} style={styles.oldPrice}>
                            {value}
                          </Text>{" "}
                        </Text>
                      )}
                    />
                    <Text
                      style={{
                        color: Colors.accent,
                        textDecorationLine: "none",
                        fontFamily: "ArialBold",
                      }}
                    >
                      {props.discount}%
                    </Text>
                  </View>
                ) : null}
              </View>
              <View style={styles.actions}>{props.children}</View>
            </View>
          </View>
        </TouchableCmp>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  product: {
    height: 300,
    margin: 6,
    width: "47%",
  },
  touchable: {
    borderRadius: 5,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: "hidden",
  },
  content: {
    paddingHorizontal: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontFamily: "Arial",
    fontSize: 18,
    marginVertical: 5,
  },
  oldPrice: {
    fontFamily: "Arial",
    fontSize: 15,
    color: "#666",
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
  },
  newPrice: {
    fontSize: 17,
    color: Colors.primary,
    fontFamily: "ArialBold",
  },
  actions: {
    height: 45,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  discountDrop: {
    flexDirection: "row",
  },
  imageError: {
    width: "100%",
    height: "90%",
  }
});

export default ProductItem;
