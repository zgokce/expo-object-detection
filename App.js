import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image,  Platform } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { atob } from 'abab' 
global.atob = atob;
import Constants from 'expo-constants';
import { v4 as uuidv4 } from 'uuid';

var firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  }else{
    firebase.app();
  }

export default function App() {
 
  var databaseRef = firebase.database();  
  var storageRef = firebase.storage().ref();
  let pickerResult = null;
  let [image, setImage] = useState(null);
  let [islenmisResim, setresim] = useState(null)
  

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();  
    if (permissionResult.granted === false) 
    {
      alert("Permission to access camera roll is required!");
      return;
    }
    pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality:1
    });
    if (!pickerResult.cancelled) {
      setImage(pickerResult);
    }
  }
  let takeApicture = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    pickerResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
     quality:1
    });   
    if (!pickerResult.cancelled) {
      setImage(pickerResult);
    }
  }

  let firebasePhotoYolla =  async () =>{
      var filename = "resim"     
    var object= await databaseRef.ref("photos/").push({filename: filename},(error)=>{
      if(error)
      console.log(error);
    })
    var ref = storageRef.child(object.key+".jpg");
        
    const blob = await (await fetch(image.uri)).blob();
    var cevap = await ref.put(blob);
    databaseRef.ref("photos/"+object.key).child("bitis").on('value',async (dataSnapShot,context)=>{
      if(dataSnapShot.val() == true){
      var url =   await storageRef.child("islenmis_"+object.key+".jpg").getDownloadURL()
      setresim(url);
      }
    })
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={openImagePickerAsync} />
      <Button title="take a picture camera" onPress={takeApicture} />
      {image && <Image source={{ uri: image.uri }} style={{ width: 100, height: 100 }} />}
      {image && <Button title="firebase'e gönder" onPress={firebasePhotoYolla}/>}
      {islenmisResim && <Image source={{ uri: islenmisResim }} style={{resizeMode:'center', width: 400, height: 400 }} />}
  
      {}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
