import {useState} from 'react';
import { StyleSheet, Text, View,Image,TouchableOpacity, ImageBackground,Dimensions,Pressable, TextInput,ActivityIndicator,ScrollView} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';
import styles from "../styles";

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTogglePasswordVisibility } from "./useTogglePasswordVisibility";

// import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import {signInWithEmailAndPassword,auth,sendPasswordResetEmail,createUserWithEmailAndPassword} from "../firebase"
//import firebase from "firebase";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  color,
} from "react-native-reanimated";
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';



export default function Login({ navigation }) {
  const [email, setEmail] = useState(null)
  //const [name, setName] = useState('')
  const [isLoading, setLoading] = useState(false);
  const [password, setPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)
  const [validationMessage, setValidationMessage] = useState('')
  const { height, width } = Dimensions.get("window");
  const formButtonScale = useSharedValue(1);
  const [setRightIcon] = useState('eye');
  const [setPasswordVisibility] = useState(true);
  const { passwordVisibility, rightIcon, handlePasswordVisibility} =
  useTogglePasswordVisibility();
  let validateAndSet = (value,setValue) => {
   setValue(value)
}


const forgotPassword=()=>{
  if(email != ""){
    sendPasswordResetEmail(auth, email)
.then(() => {
  alert("The Email has been sent")
})
.catch((error) => {
  const errorCode = error.code;
  const errorMessage = error.message;
  alert(errorMessage)
});
  }else {
    alert("Please provide Email")
  }
}
const formButtonAnimatedStyle = useAnimatedStyle(() => {
  return {
    transform: [{scale: formButtonScale.value}]
  }
})
// function checkPassword(firstpassword,secondpassword) {
//   if(firstpassword !== secondpassword){
//     setValidationMessage('Password do not match') 
//   }
//   else setValidationMessage('')
// }
  async function createAccount() {
    setLoading(true)
    email === '' || password === '' 
    ? setValidationMessage('required filled missing')
    : ''
    
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    alert("Welcome to SchoolTime");
    console.log(auth.currentUser.uid)
    navigation.replace('DrawerNavigator');
    setEmail(null);
    setPassword(null);
    setConfirmPassword(null);
     
    }).catch ((error) =>{
      setValidationMessage(error.message);
      // alert('Please check the detail')
      alert(error.message)
    });
    setInterval(() => {
      setLoading(false)
  }, 2000);
  }
  return (
<KeyboardAwareScrollView>
    <View styles={{flex:1}} backgroundColor="black" height={height} width={width}>
     
     <View style={{flexDirection:'row'}}> 
      <Image source={require("../assets/Gold-Wings-Logo(New).png")} style={{height:100,width:100,alignSelf:'flex-start',margin:5}}></Image>
    <Text style={{ fontSize: 22, fontWeight: 'bold', alignSelf:'center',color: '#FFCC00', alignContent:'center',marginLeft: 20}}>School Time</Text>
    </View>
     
      <View style={{borderRadius:50,backgroundColor:'white',justifyContent:'center',height:height/1.6,margin:10,shadowColor: "#000",alignSelf:'center',marginTop:20,alignItems:'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,}}> 
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginLeft: 15, marginTop: 15, color: '#FFCC00' ,alignSelf:'flex-start'}}>Sign In</Text>
      <ActivityIndicator animating={isLoading} style={{alignSelf: 'center', justifyContent: 'center'}} size = {'large'} shadowColor ={'black'} color = {'black'}/>
      <ScrollView style={{flex:1, marginBottom:5}}>
        <Input
          placeholder='Email*'
          placeholderTextColor={'gray'}
         // containerStyle={{marginTop: 10}}
          value={email}
          onChangeText={(text) => setEmail(text)}
         
          leftIcon={<MaterialCommunityIcons name="email-outline" size={16} color="black" />}

            />
            <View style={{flexDirection:'row'}}>
        <Input
          placeholder='Pin*'
         // containerStyle={{marginTop:10,}}
          placeholderTextColor={'gray'}
          value={password}
          onChangeText={(value) => validateAndSet(value, setPassword)}
          secureTextEntry={passwordVisibility}
          enablesReturnKeyAutomatically
          
          leftIcon={<Icon name='key' size={16} color="black"/>}
          rightIcon={<Pressable onPress={handlePasswordVisibility}>
          <MaterialCommunityIcons name={rightIcon} size={22} color="#232323" />
        </Pressable>}

            />
          </View>
        <Pressable onPress={forgotPassword} style={{alignSelf:'center'}}>
            <Text style={{fontSize:14, color: 'red'}}>Forgot Password?</Text>
        </Pressable>
        {<Text style={styles.error}>{validationMessage}</Text>}
       
        <Animated.View style={[styles.formButton, formButtonAnimatedStyle]}>
            <Pressable onPress={createAccount}>
              <Text style={styles.buttonText}>
               Sign In
              </Text>
            </Pressable>
            </Animated.View>
            <Pressable onPress={()=>navigation.navigate('Register')} style={{alignContent:'center',alignSelf:'center',marginTop:10}}>
              <Text styles={{fontSize:16}}>
              New User? Register Here
              </Text>
            </Pressable>
            </ScrollView>
            </View>
     
      
    </View>
    </KeyboardAwareScrollView>
  );
}