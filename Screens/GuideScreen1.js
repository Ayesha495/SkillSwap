import React from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Image , View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import { Button } from "react-native-paper";

export default function GuideScreen1({ navigation}) {
    return (
        <LinearGradient
            style={styles.container}
            colors={['#7FEDDF', '#FFFFFF']}
            start= {{ x: 2, y: 1}}
            end= {{ x: 2, y: 0 }}
        >
            <Text style={styles.text}>
                Welcome to SkillSwap
            </Text>
            {/* <Image style={styles.img} source={require('../assets/Persons exchanging skills teal-Photoroom.png' )}/> */}
            <StatusBar style="auto" />
            <View style={styles.textbox}>
            <Text style={styles.text2}> 
            Learn. Teach. Grow 
            </Text>
            <Text style={styles.text2}>
            Connect with people to exchange skills
            </Text>
            <Text style={styles.text2}>
            and knowledge.
            </Text>
            <Button title ='Next' onPress={()=> {navigation.navigate('Signup')}}>Next</Button> 

            </View>
        </LinearGradient>
            
    );
       
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        },
    text: {
        marginTop: 10,
        marginBottom: 20,
        fontSize: 25,
        fontFamily: 'serif', 
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: '#00a0a9',
    },
    text2: {
        
        fontSize: 14,
        fontFamily: 'san-serif', 
        fontWeight: 'bold',
        color: '#00a0a9',   
    },
    textbox: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 60,
        marginTop: 20,

    },

    // img: {
    //     width: 200,
    //     height: 200,
    //     marginBottom: 30,
    // marginTop: 30,
    // },
    
});