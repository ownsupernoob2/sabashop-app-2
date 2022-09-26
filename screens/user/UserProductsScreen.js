import React, {useState, useEffect} from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";

import HeaderButton from "../../components/UI/HeaderButton";
import ProductItem from "../../components/shop/ProductItem";
import * as productsActions from '../../store/actions/products';


const UserProductScreen = (props) => {
  const userProducts = useSelector((state) => state.products.userProducts);
  const dispatch = useDispatch();


  const editProductHandler = (id) => {
    props.navigation.navigate("EditProduct", { productId: id });
  };

  if(userProducts.length === 0) {
    return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontFamily: 'ArialBold'}}>No products found, let start adding some!</Text>
    </View>
  }

  return (
    <FlatList
      numColumns={2}
      data={userProducts}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          discountPrice={itemData.item.discountedPrice}
          discount={itemData.item.discount}
          onSelect={() => {
            editProductHandler(itemData.item.id);
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              flex: 1,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Delete",
                  "Are you sure you want to delete this product?",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "Yes",
                      style: "destructive",
                      onPress: () =>
                        dispatch(
                          productsActions.deleteProduct(itemData.item.id)
                        ),
                    },
                  ]
                );
              }}
            >
              <Ionicons
                name={
                  Platform.OS === "android" ? "md-trash" : "ios-trash-outline"
                }
                size={28}
                color="#d8280d"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                editProductHandler(itemData.item.id);
              }}
            >
              <Ionicons
                name={
                  Platform.OS === "android" ? "md-create" : "ios-create-outline"
                }
                size={28}
                color="#0d83d8"
              />
            </TouchableOpacity>
          </View>
        </ProductItem>
      )}
    />
  );
};

export const screenOptions = (navData) => {
  return {
    headerTitle: "Your Products",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add"
          iconName={Platform.OS === "android" ? "md-add-circle" : "ios-add-circle-outline"}
          onPress={() => {
            navData.navigation.navigate('EditProduct');
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({});

export default UserProductScreen;
