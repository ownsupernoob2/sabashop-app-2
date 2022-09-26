import React from 'react'
import { StyleSheet, Platform, View, Text, TouchableOpacity, TouchableNativeFeedback } from 'react-native'
import Colors from '../../constants/Colors'

export const Button = props => {
    let TouchableCmp = TouchableOpacity;


    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    return (
        <TouchableCmp onPress={props.onClick}>
            <View style={{...props.style, ...styles.button}}>
                <Text style={{...props.style, ...{ 
                    color:  Colors.primary ,
                     fontFamily: 'Arial' }}}>{props.title}</Text>
            </View>
        </TouchableCmp>
    )
}

export const InvertedButton = props => {
    let TouchableCmp = TouchableOpacity;


    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    return (
        <TouchableCmp onPress={props.onClick}>
            <View style={{...props.style, ...styles.invertedButton}}>
                <Text style={{...props.style, ...{ 
                    color: Platform.OS === 'android' ? 'white' : Colors.primary,
                     fontFamily: 'Arial' 
                     }}}>{props.title}</Text>
            </View>
        </TouchableCmp>
    )
}

const styles = StyleSheet.create({
    button: {
        width: '56%',
        height: 50,
        backgroundColor: Platform.OS === 'android' ? '#B9D7C4' : 'transparent',
        alignItems: 'center',
        borderRadius: 5,
        borderColor: Colors.primary ,
        borderWidth: 2,
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 30
    },
    invertedButton: {
        width: '56%',
        height: 50,
        backgroundColor: Platform.OS === 'android' ? Colors.primary : 'transparent',
        alignItems: 'center',
        borderRadius: 5,
        borderColor: Platform.OS === 'android' ? '#B9D7C4' : Colors.primary,
        borderWidth: 2,
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 20
    },
})

