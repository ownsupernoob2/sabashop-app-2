import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  StyleSheet,
  Alert,
  ScrollView,
  Linking,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../../constants/Colors";
import CartItem from "../../components/shop/CartItem";
import * as cartActions from "../../store/actions/cart";
import * as ordersActions from "../../store/actions/orders";
import NumberFormat from "react-number-format";
import Card from "../../components/UI/Card";

const CartScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [completeAddress, setCompleteAddress] = useState("");
  const [rtRw, setRtRw] = useState("");
  const [districtOrCity, setDistrictOrCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [msg, setMsg] = useState("");

  const fee = 0;

  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
  const cartTotalAmount = useSelector((state) => state.cart.totalAmount);
  const cartItems = useSelector((state) => {
    const transformedCartItems = [];
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
        productImage: state.cart.items[key].productImage,
        productPushToken: state.cart.items[key].pushToken

      });
    }
    return transformedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  });

  const dispatch = useDispatch();

  const totalAmountCart =
    cartItems &&
    cartItems.reduce((value, cart) => {
      return (value = value + (cartTotalAmount + 4000 * cart.quantity));
    }, fee) * 100;

  const delivery =
    cartItems &&
    cartItems.reduce((value, cart) => {
      return (value = value + 4000 * cart.quantity);
    }, fee) * 100;

  const clearCartHandler = () => {
    Alert.alert("Clear Cart", "Are you sure you want to clear the cart?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => dispatch(cartActions.clearCart()),
      },
    ]);
  };

  useEffect(() => {
    let address =
      "Complete Address: " +
      completeAddress +
      "\n" +
      "Rt And Rw: " +
      rtRw +
      "\n" +
      "District/City: " +
      districtOrCity +
      "\n" +
      "Province: " +
      province +
      "\n" +
      "Postal Code: " +
      postalCode;

    setMsg(
      "whatsapp://send?text=" +
        address.replace(/(?:\r\n|\r|\n)/g, "%0A") +
        "&phone=62087784779639"
    );
  }, [completeAddress, rtRw, districtOrCity, province, postalCode]);

  const sendWhatsAppMessage = (link) => {
     Linking.canOpenURL(link)
      .then((supported) => {
        if (!supported) {
          alert("Please install Whatsapp to send your address via Whatsapp");
        } else {
          setIsLoading(true);
          setIsVisible(true);

          //  Alert.alert(
          //    "Almost there!",
          //    "You have to put your address now via Whatsapp!",
          //    [
          //      {
          //        text: "Cancel Order",
          //        onPress: () => console.log("Cancel Pressed"),
          //        style: "cancel",
          //      },
          //      {
          //        text: "Okay",
          //        onPress: () => {
          //         return Linking.openURL(link),
          //        }
          //      },
          //    ]
          //  );
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const sendMsg = async () => {
     await dispatch(
        ordersActions.addOrder(
          cartItems,
          Math.round(delivery + cartTotalAmount * 100) / 100
        ),
      );
      setIsVisible(false)
      setIsLoading(false)
      Linking.openURL(msg)
      setMsg("")
      props.navigate("Orders");

  };
  return (
    <View style={styles.screen}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {
          setIsVisible(false);
        }}
      >
        <View
          style={{
            backgroundColor: "black",
            opacity: 0.8,
            flex: 1,
            justifyContent: "center",
          }}
          onPress={() => setIsVisible(!isVisible)}
        >
          <Card style={styles.modalView}>
            <Text style={styles.modalText}>
              Almost there! now all you have to do is put your address.
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Complete Address"
              onChangeText={(value) => setCompleteAddress(value)}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="District/City"
              onChangeText={(value) => setDistrictOrCity(value)}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Rt & Rw"
              onChangeText={(value) => setRtRw(value)}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="province"
              onChangeText={(value) => setProvince(value)}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Postal Code"
              onChangeText={(value) => setPostalCode(value)}
            />
            {completeAddress.length &&
            districtOrCity.length &&
            rtRw.length &&
            province.length &&
            postalCode.length ? (
              <TouchableCmp
                onPress={() => {
                  sendMsg();
                }}
                disabled={cartItems.length === 0}
              >
                <View
                  style={
                    cartItems.length === 0
                      ? styles.disabledButton
                      : styles.button
                  }
                >
                  <Text
                    style={
                      cartItems.length === 0
                        ? {
                            color: Platform.OS === "android" ? "#888" : "#999",
                            fontFamily: "Arial",
                          }
                        : {
                            color:
                              Platform.OS === "android"
                                ? "white"
                                : Colors.primary,
                            fontFamily: "Arial",
                          }
                    }
                  >
                    Send
                  </Text>
                </View>
              </TouchableCmp>
            ) : (
              <TouchableCmp
                onPress={() => {}}
                disabled={
                  completeAddress.length &&
                  districtOrCity.length &&
                  rtRw.length &&
                  province.length &&
                  postalCode.length
                }
              >
                <View
                  style={[
                    styles.disabledButton,
                    {
                      backgroundColor: "#aaa",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: Platform.OS === "android" ? "#666" : "#888",
                      fontFamily: "Arial",
                    }}
                  >
                    Send
                  </Text>
                </View>
              </TouchableCmp>
            )}
          </Card>
        </View>
      </Modal>
      <ScrollView style={styles.product}>
        {cartItems.length !== 0 ? (
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.productId}
            renderItem={(itemData) => (
              <CartItem
                quantity={itemData.item.quantity}
                title={itemData.item.productTitle}
                amount={itemData.item.sum}
                image={itemData.item.productImage}
                onRemove={() => {
                  dispatch(cartActions.removeFromCart(itemData.item.productId));
                }}
                onAdd={() => {
                  dispatch(cartActions.addOnCart(itemData.item.productId));
                }}
              />
            )}
          />
        ) : (
          <Text
            style={{
              color: "#999",
              paddingVertical: "25%",
              textAlign: "center",
              fontFamily: "ArialBold",
            }}
          >
            No items found. Start adding some in your Cart!
          </Text>
        )}
      </ScrollView>
      <View style={styles.summary}>
        <NumberFormat
          value={Math.round(delivery + cartTotalAmount * 100) / 100}
          className="foo"
          displayType={"text"}
          thousandSeparator={true}
          prefix={"Rp"}
          renderText={(value, props) => (
            <Text style={styles.summaryText}>
              Total:{" "}
              <Text {...props} style={styles.amount}>
                {value}
              </Text>
            </Text>
          )}
        />

        <NumberFormat
          value={Math.round(cartTotalAmount * 100) / 100}
          className="foo"
          displayType={"text"}
          thousandSeparator={true}
          prefix={"Rp"}
          renderText={(value, props) => (
            <Text style={{ fontFamily: "ArialBold" }}>
              Sub Total:{" "}
              <Text
                {...props}
                style={{
                  color: Colors.accent,
                  textAlign: "center",
                  fontFamily: "ArialBold",
                }}
              >
                {value}
              </Text>
            </Text>
          )}
        />
        <NumberFormat
          value={Math.round(delivery) / 100}
          className="foo"
          displayType={"text"}
          thousandSeparator={true}
          prefix={"Rp"}
          renderText={(value, props) => (
            <Text style={{ fontFamily: "ArialBold", fontSize: 13.9 }}>
              Delivery:{" "}
              <Text
                {...props}
                style={{
                  color: "#fc4a3a",
                  textAlign: "center",
                  fontFamily: "ArialBold",
                  fontSize: 14.9,
                }}
              >
                {value}
              </Text>
            </Text>
          )}
        />

        <View style={styles.action}>
          <TouchableCmp
            onPress={clearCartHandler}
            disabled={cartItems.length === 0}
          >
            <View
              style={
                cartItems.length === 0
                  ? styles.disabledClearCart
                  : styles.clearCart
              }
            >
              <Text
                style={
                  cartItems.length === 0
                    ? {
                        color: Platform.OS === "android" ? "#888" : "#999",
                        fontFamily: "Arial",
                      }
                    : {
                        color: Platform.OS === "android" ? "white" : "red",
                        fontFamily: "Arial",
                      }
                }
              >
                Clear Cart
              </Text>
            </View>
          </TouchableCmp>
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <TouchableCmp
              onPress={() => {
                sendWhatsAppMessage(msg);
              }}
              disabled={cartItems.length === 0}
            >
              <View
                style={
                  cartItems.length === 0 ? styles.disabledButton : styles.button
                }
              >
                <Text
                  style={
                    cartItems.length === 0
                      ? {
                          color: Platform.OS === "android" ? "#888" : "#999",
                          fontFamily: "Arial",
                        }
                      : {
                          color:
                            Platform.OS === "android"
                              ? "white"
                              : Colors.primary,
                          fontFamily: "Arial",
                        }
                  }
                >
                  Order Now
                </Text>
              </View>
            </TouchableCmp>
          )}
        </View>
      </View>
    </View>
  );
};
export const screenOptions = {
  
    headerTitle: "Your Cart",
  
};

const styles = StyleSheet.create({
  screen: {
    margin: 20,
    flex: 1,
  },
  shadowOverlay: {
    backgroundColor: "#000",
    opacity: 0.8,
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },

  modalInput: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
    width: "100%",
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    zIndex: 2,
  },

  product: {
    borderWidth: 1,
    borderColor: "#eee",
    maxHeight: "70%",
    borderRadius: 15,
  },
  summary: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    borderRadius: 10,
    backgroundColor: "white",
    position: "absolute",
    bottom: -15,
    width: "100%",
  },
  summaryText: {
    fontFamily: "ArialBold",
    fontSize: 15,
  },
  amount: {
    color: Colors.primary,
  },
  action: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  clearCart: {
    width: "43%",
    height: 45,
    backgroundColor: Platform.OS === "android" ? "#f93636" : "transparent",
    alignItems: "center",
    borderRadius: 5,
    borderColor: Platform.OS === "android" ? "transparent" : "#f93636",
    borderWidth: 2,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 5,
    marginRight: 67,
  },
  button: {
    width: "43%",
    height: 45,
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 2,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 5,
    backgroundColor: Platform.OS === "android" ? Colors.primary : "transparent",
    borderColor: Platform.OS === "android" ? "transparent" : Colors.primary,
  },
  disabledButton: {
    width: "43%",
    height: 45,
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 2,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 5,
    backgroundColor: Platform.OS === "android" ? "#ccc" : "transparent",
    borderColor: Platform.OS === "android" ? "transparent" : "#ccc",
  },
  disabledClearCart: {
    width: "43%",
    height: 45,
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 2,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 5,
    marginRight: 65,
    marginTop: 5,
    backgroundColor: Platform.OS === "android" ? "#ccc" : "transparent",
    borderColor: Platform.OS === "android" ? "transparent" : "#ccc",
  },
  modalText: {
    textAlign: "center",
    fontFamily: "Arial",
    paddingBottom: 10,
  },
});

export default CartScreen;
