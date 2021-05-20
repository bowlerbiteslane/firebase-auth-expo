import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import ErrorText from '../components/ErrorText'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import FIREBASE_AUTH_ERRORCODE from '../helpers/firebaseErrorCodes'

// Firebase
import firebase from 'firebase/app'
import "firebase/auth";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [submitting, setSubmitting] = useState({ value: false, error:'' })

  const onLoginPressed = () => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'Dashboard' }],
    // });
    signIn();
  }

  const signIn = () => {
    setSubmitting({ value: true, error: '' })
    firebase.auth()
    .signInWithEmailAndPassword(email.value, password.value)
    .then(() => {
      console.log('User account created & signed in!');
      setSubmitting({ value: false, error: ''})
    })
    .catch(error => {
      const signin_error = FIREBASE_AUTH_ERRORCODE.SIGNIN_WITH_EMAILPASSWORD;
      let error_msg = "Failed to authenticate, please try again later."
      switch(error.code){
        case signin_error.INVALID_EMAIL:
          setEmail({...email, error: 'That email address is invalid!'})
          break;
        case signin_error.USER_DISABLED:
          setEmail({...email, error: 'This account has been disabled.'})
          break;
        case signin_error.USER_NOT_FOUND:
        case signin_error.WRONG_PASSWORD:
        default:
          error_msg = "Invalid email/password combination."
          break;
      }

      console.error(error);
      setSubmitting({value: false, error: error_msg})
    })
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Welcome back.</Header>
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
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
      {
        !submitting.value && !!submitting.error &&
        <ErrorText>{submitting.error}</ErrorText>
      }
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
