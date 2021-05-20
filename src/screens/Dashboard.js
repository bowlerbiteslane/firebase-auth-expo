import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import {Text} from 'react-native'

// Firebase
import firebase from 'firebase/app'
import "firebase/auth";

const signOut = () => {
  firebase.auth()
  .signOut()
  .then(() => console.log('User signed out!'));
}

export default function Dashboard({ navigation }) {
  const user = firebase.auth().currentUser;
  return (
    <Background>
      <Logo />
      <Header>Let’s start{user.displayName ?  " " + user.displayName : ""}!</Header>
      <Paragraph>
        Your amazing app starts here. Open you favorite code editor and start
        editing this project.
      </Paragraph>
      <Text>Name: {user.displayName}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Email Verified: {user.emailVerified}</Text>
      <Text>Phone Number: {user.phoneNumber}</Text>
      <Text>Photo URL: {user.photoURL}</Text>
      
      <Text>Tenant ID: {user.tenantId}</Text>
      <Text>Provider ID: {user.providerId}</Text>
      <Text>Provider Data: {JSON.stringify(user.providerData)}</Text>
      <Text>Refresh Token: {user.refreshToken}</Text>
      <Button
        mode="outlined"
        onPress={() => {
          // navigation.reset({
          //   index: 0,
          //   routes: [{ name: 'StartScreen' }],
          // })
          signOut();
        }}
      >
        Logout
      </Button>
    </Background>
  )
}
