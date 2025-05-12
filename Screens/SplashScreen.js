import React from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Image } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import { useEffect } from "react";

export default function SplashScreen({ navigation}) {

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Guide1'); 
        }, 4000); 

        return () => clearTimeout(timer); // Cleanup in case component unmounts early
    }, []); 

    return (
        <LinearGradient
            style={styles.container}
            colors={['#7FEDDF', '#FFFFFF']}
            start= {{ x: 2, y: 1}}
            end= {{ x: 2, y: 0 }}
        >
            {/* <Image style={styles.img} source={require('../assets/Persons exchanging skills.png' )}/> */}
            <Text style={styles.text}>Skill Swap</Text>
            <StatusBar style="auto" />
        </LinearGradient>
            
    );
       
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        },
    text: {
        fontSize: 30,
        fontFamily: 'serif', 
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: '#00a0a9',
    },
    // img: {
    //     width: 200,
    //     height: 200,
    //     marginBottom: 40,
    // },
    
});