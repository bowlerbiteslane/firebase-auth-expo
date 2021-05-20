import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import Paragraph from '../components/Paragraph'
import ErrorText from '../components/ErrorText'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { nameValidator } from '../helpers/nameValidator'
import FIREBASE_AUTH_ERRORCODE from '../helpers/firebaseErrorCodes'

// Firebase
import firebase from 'firebase/app'
import "firebase/auth";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [submitting, setSubmitting] = useState({value: false, error: '' })

  const onSignUpPressed = () => {
    const nameError = nameValidator(name.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'Dashboard' }],
    // })
    createUser();
  }

  const createUser = () => {
    setSubmitting({ value: true, error: '' })
    firebase.auth()
    .createUserWithEmailAndPassword(email.value, password.value)
    .then(() => {
      console.log('User account created & signed in!');
      const user = firebase.auth().currentUser;
      return user.updateProfile({
        displayName: name.value
      }).then(() => {
        console.log('Profile successfully updated!');
        setSubmitting({value: false, error: ''})
      }).catch(error => {
        console.error(error)
      })
    })
    .catch(error => {
      const create_error = FIREBASE_AUTH_ERRORCODE.CREATE_USER_WITH_EMAILPASSWORD;
      switch(error.code){
        case create_error.EMAIL_ALREADY_IN_USE:
          setEmail({...email, error: 'Email address is already in use!'})
          break;
        case create_error.INVALID_EMAIL:
          setEmail({...email, error: 'Email address is invalid!'})
          break;
        case create_error.WEAK_PASSWORD:
          setPassword({...password, error: 'Password is too weak'})
        default:
            break;
      }

      console.error(error);
      setSubmitting({value: false, error: "User registration failed, fix issues above or try again later."})
    })
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Create Account</Header>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
      >
        Sign Up
      </Button>
      {
        !submitting.value && !!submitting.error &&
        <ErrorText>{submitting.error}</ErrorText>
      }
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
