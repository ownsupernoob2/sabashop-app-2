import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  StyleSheet,
  Alert,
  Linking,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import Menu from "react-native-material-menu";
import { Badge } from "react-native-elements";

import HeaderButton from "../UI/HeaderButton";
import Colors from "../../constants/Colors";
import CartItem from "../../components/shop/CartItem";
import * as cartActions from "../../store/actions/cart";
import * as ordersActions from "../../store/actions/orders";
import NumberFormat from "react-number-format";
import Card from "../../components/UI/Card";

function Cart(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [completeAddress, setCompleteAddress] = useState("");
  const [rtRw, setRtRw] = useState("");
  const [districtOrCity, setDistrictOrCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [msg, setMsg] = useState("");
  const [isOpened, setIsOpened] = useState(false);
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
        productPushToken: state.cart.items[key].pushToken,
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
  const menu = useRef();

  const showMenu = () => {
    menu.current.show();
    setIsOpened(true);
    if (menu.current.show() == false) {
      setIsOpened(false);
    }
  };

  return (
    <HeaderButtons HeaderButtonComponent={HeaderButton}>
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
      <View style={styles.container}>
        <Menu
          style={styles.cartContainer}
          ref={menu}
          button={
            <View>
              <Item
                title="Cart"
                iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
                onPress={() => {
                  showMenu();
                  /* setIsOpened(true) */
                }}
              />
              {cartItems.length == 0 ? null : (
                <Badge
                  value={100 < cartItems.length ? "99+" : cartItems.length}
                  status="error"
                  containerStyle={
                    100 < cartItems.length
                      ? {
                          position: "absolute",
                          top: -4,

                          right: -4,
                        }
                      : {
                          position: "absolute",
                          top: -4,

                          right: -0,
                        }
                  }
                />
              )}
            </View>
          }
        >
          <View style={styles.content}>
            <TouchableOpacity
              onPress={() => {
                props.navigate("Cart");
              }}
            >
              <Text style={styles.title}>Your Cart</Text>
            </TouchableOpacity>
            <View style={styles.items}></View>
            {cartItems.length !== 0 ? (
              <FlatList
                data={cartItems.slice(0, 3)}
                keyExtractor={(item) => item.productId}
                renderItem={(itemData) => (
                  <>
                    {}
                    <CartItem
                      productId={itemData.productId}
                      quantity={itemData.item.quantity}
                      title={itemData.item.productTitle}
                      amount={itemData.item.sum}
                      image={itemData.item.productImage}
                      onRemove={() => {
                        dispatch(
                          cartActions.removeFromCart(itemData.item.productId)
                        );
                      }}
                      onAdd={() => {
                        dispatch(
                          cartActions.addOnCart(itemData.item.productId)
                        );
                      }}
                    />
                  </>
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
                {" "}
                No items found. Start adding some in your Cart!{" "}
              </Text>
            )}
            <View
              style={{
                ...{ top: cartItems.length ^ 3 ? 235 : /* 259 */ 255 },
                ...styles.extra,
              }}
            >
              {cartItems.length > 3 ? (
                <TouchableOpacity onPress={() => props.navigate("Cart")}>
                  <Text style={styles.link}>Show more...</Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
              <NumberFormat
                value={Math.round(delivery + cartTotalAmount * 100) / 100}
                className="foo"
                displayType={"text"}
                thousandSeparator={true}
                prefix={"Rp"}
                renderText={(value, props) => (
                  <Text>
                    Total:{" "}
                    <Text {...props} style={styles.sum}>
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
                  <Text>
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
                  <Text>
                    Delivery:{" "}
                    <Text
                      {...props}
                      style={{
                        color: "#fc4a3a",
                        textAlign: "center",
                        fontFamily: "ArialBold",
                      }}
                    >
                      {value}
                    </Text>
                  </Text>
                )}
              />

              <Text></Text>
            </View>
          </View>
          <View style={styles.actions}>
            <TouchableCmp
              onPress={() => {
                clearCartHandler();
              }}
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
                  sendWhatsAppMessage(msg)
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
                    Order Now
                  </Text>
                </View>
              </TouchableCmp>
            )}
          </View>
        </Menu>
      </View>
    </HeaderButtons>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 399,
  },

  cartContainer: {
    marginTop: 30,
    width: "95%",
    height: 399,
  },
  content: {
    alignItems: "center",
    marginVertical: 15,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: "ArialBold",
    color: Colors.primary,
  },

  link: {
    textDecorationLine: "underline",
    color: Colors.primary,
    fontFamily: "ArialBold",
    marginBottom: 5,
    margin: 0,
  },
  extra: {
    position: "absolute",
    left: 0,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  sum: {
    fontFamily: "ArialBold",
    color: Colors.primary,
    textAlign: "center",
  },
  actions: {
    justifyContent: "space-between",
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    paddingHorizontal: 10,
  },
  clearCart: {
    width: "39%",
    height: 43,
    backgroundColor: Platform.OS === "android" ? "#f93636" : "transparent",
    alignItems: "center",
    borderRadius: 5,
    borderColor: Platform.OS === "android" ? "transparent" : "#f93636",
    borderWidth: 2,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
    marginRight: 67,
  },
  button: {
    width: "39%",
    height: 43,
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 2,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: Platform.OS === "android" ? Colors.primary : "transparent",
    borderColor: Platform.OS === "android" ? "transparent" : Colors.primary,
  },
  disabledButton: {
    width: "40%",
    height: 45,
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 2,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: Platform.OS === "android" ? "#ccc" : "transparent",
    borderColor: Platform.OS === "android" ? "transparent" : "#ccc",
  },
  disabledClearCart: {
    width: "40%",
    height: 45,
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 2,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
    marginRight: 65,
    marginTop: 20,
    backgroundColor: Platform.OS === "android" ? "#ccc" : "transparent",
    borderColor: Platform.OS === "android" ? "transparent" : "#ccc",
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
  modalText: {
    textAlign: "center",
    fontFamily: "Arial",
    paddingBottom: 10,
  },
});

export default Cart;
