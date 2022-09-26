import React, { useReducer, useEffect, useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Button,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import Input from "../../components/UI/Input";
import Card from "../../components/UI/Card";
import Colors from "../../constants/Colors";
import * as authActions from "../../store/actions/auth";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const AuthScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    inputValidities: {
      firstName: false,
      lastName: false,
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const authHandler = async () => {
    let action;
    if (isSignup) {
      action =
         authActions.signup(
          formState.inputValues.email,
          formState.inputValues.password,
          formState.inputValues.firstName,
          formState.inputValues.lastName
        )
    } else {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      )
      
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      // props.navigation.navigate("Products");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  //  const isSignupOrLogin = () => {
  //    isSignup ? setIsSignup(false) : setIsSignup(true)}

  if (authActions.SIGNUP == true) {
    navigation.navigate("ProductsOverviewScreen");
  }

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={-1000}
        style={styles.keyboard}
      >
        <LinearGradient
          colors={[Colors.primary, "#018038"]}
          style={styles.gradient}
        >
          <Card style={styles.authContainer}>
            <ScrollView>
              <View style={styles.container}>
                <View style={styles.header}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: "ArialBold",
                      paddingBottom: 10,
                    }}
                  >
                    {isSignup ? "Register" : "Login"}
                  </Text>
                  {isLoading ? (
                    <View
                      style={{
                        paddingLeft: "55%",
                      }}
                    >
                      <ActivityIndicator size="small" color={Colors.primary} />
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setIsSignup(!isSignup);
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: Colors.primary,
                          fontFamily: "ArialBold",
                          paddingLeft: "55%",
                        }}
                      >
                        {isSignup ? "Login ➤" : "Register ➤"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                {isSignup ? (
                  <View
                    style={{
                      justifyContent: "space-around",
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ width: 120 }}>
                      <Input
                        id="firstName"
                        label="First Name"
                        keyboardType="default"
                        required
                        autoCapitalize="sentences"
                        errorText="Your first name is not valid."
                        onInputChange={inputChangeHandler}
                        initialValue=""
                        minLength={2}
                      />
                    </View>
                    <View style={{ width: 120 }}>
                      <Input
                        id="lastName"
                        label="Last Name"
                        keyboardType="default"
                        required
                        autoCapitalize="sentences"
                        errorText="Your last name is not valid."
                        onInputChange={inputChangeHandler}
                        initialValue=""
                        minLength={3}
                      />
                    </View>
                  </View>
                ) : (
                  <Text> </Text>
                )}
                <Input
                  id="email"
                  label="E-Mail"
                  keyboardType="email-address"
                  required
                  email
                  autoCapitalize="none"
                  errorText="Your email address is not valid."
                  onInputChange={inputChangeHandler}
                  initialValue=""
                />
                <Input
                  id="password"
                  label="Password"
                  keyboardType="default"
                  secureTextEntry
                  required
                  autoCapitalize={"none"}
                  minLength={6}
                  errorText={"your password is not valid."}
                  onInputChange={inputChangeHandler}
                  initialValue=""
                />
                {/* <View style={styles.forgetPassword}>
                  <Text style={{ color: Colors.primary, fontFamily: "Arial" }}>
                    Reset Password{" "}
                  </Text>
                  <Text style={{ color: "#bbb", fontFamily: "Arial" }}>
                    {" "}
                    | Need help?
                  </Text>
                </View> */}
                {!isLoading ? (
                  <View style={styles.buttonsContainer}>
                    <View style={styles.button}>
                      <Button
                        title={isSignup ? "Register" : "Login"}
                        color={Colors.primary}
                        onPress={authHandler}
                      />
                    </View>
                  </View>
                ) : (
                  <ActivityIndicator size="small" color={Colors.primary} />
                )}
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{ flex: 1, height: 1.5, backgroundColor: "#aaa" }}
                />
                <View>
                  <Text
                    style={{
                      width: 50,
                      textAlign: "center",
                      fontFamily: "Arial",
                    }}
                  >
                    OR
                  </Text>
                </View>
                <View
                  style={{ flex: 1, height: 1.5, backgroundColor: "#aaa" }}
                />
              </View>
              <View style={styles.externalLogin}>
                <TouchableOpacity
                  style={{ ...styles.login, ...{ backgroundColor: "#1a8bf6" } }}
                  onPress={() => {}}
                >
                  <View
                    style={{
                      backgroundColor: "white",
                      padding: 7,
                      marginLeft: 2,
                    }}
                  >
                    <Image
                      onError={(e) => {
                        require("../../assets/default.png");
                      }}
                      style={{
                        width: 20,
                        height: 20,
                        alignSelf: "center",
                        justifyContent: "center",
                      }}
                      defaultSource={require("../../assets/default.png")}
                      source={require("../../assets/google.png")}
                    />
                  </View>
                  <Text style={{ color: "white", fontFamily: "ArialBold" }}>
                    Login with Google
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ ...styles.login, ...{ backgroundColor: "#36639f" } }}
                  onPress={() => {}}
                >
                  <View style={{ padding: 1 }}>
                    <Ionicons
                      name={
                        Platform.OS === "android"
                          ? "md-logo-facebook"
                          : "ios-logo-facebook"
                      }
                      size={34}
                      color={"white"}
                    />
                  </View>
                  <Text style={{ color: "white", fontFamily: "ArialBold" }}>
                    Login with Facebook
                  </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={{ ...styles.login, ...{ backgroundColor: "salmon" } }}
                >
                  <Text style={{ fontFamily: "ArialBold", color: "white" }}>
                  <Image
              onError={(e) => {
                require('../../assets/default.png')
                } }
                style={{width: 25, height: 25, alignSelf:'center', justifyContent: 'center'}}
                defaultSource={require("../../assets/default.png")}
                source={require('../../assets/google.png')}
              />     
              Login with Google
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ ...styles.login, ...{ backgroundColor: "#4c6aa9" } }}
                >
                  <Text style={{ fontFamily: "ArialBold", color: "white" }}>
                    <Ionicons
                      name={
                        Platform.OS === "android"
                          ? "md-logo-facebook"
                          : "ios-logo-facebook"
                      }
                      size={23}
                      color={"white"}
                    />{" "}
                    Facebook
                  </Text>
                </TouchableOpacity> */}
              </View>
            </ScrollView>
          </Card>
        </LinearGradient>
      </KeyboardAvoidingView>
    </View>
  );
};

export const screenOptions = {
  headerTitle: "Authenticate",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  authContainer: {
    width: "90%",
    maxWidth: 400,
    maxHeight: 450,
  },
  container: {
    padding: 20,
  },
  keyboard: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  gradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonsContainer: {
    flex: 1,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },

  button: {
    width: "50%",
    paddingBottom: 10,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginRight: "5%",
    paddingTop: 5,
  },
  forgetPassword: {
    paddingTop: 10,
    alignSelf: "flex-end",
    flexDirection: "row",
  },
  externalLogin: {
    flex: 1,
    backgroundColor: "#eee",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    borderBottomEndRadius: 5,
    borderBottomStartRadius: 5,
    height: 90,
  },
  login: {
    width: 200,
    height: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 15,
    shadowColor: "#000",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});

export default AuthScreen;
