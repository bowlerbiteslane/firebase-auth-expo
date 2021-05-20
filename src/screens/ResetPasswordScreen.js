import React, { useState } from 'react'
import Background from '../components/Background'
import BackButton from '../components/BackButton'
import Logo from '../components/Logo'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import { emailValidator } from '../helpers/emailValidator'
import FIREBASE_AUTH_ERRORCODE from '../helpers/firebaseErrorCodes'

// Firebase
import firebase from 'firebase/app'
import "firebase/auth";

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [emailSent, setEmailSent] = useState({value: false, error: '' })

  const sendResetPasswordEmail = () => {
    const emailError = emailValidator(email.value)
    if (emailError) {
      setEmail({ ...email, error: emailError })
      return
    }
    //navigation.navigate('LoginScreen')

    firebase.auth().sendPasswordResetEmail(email.value).then(function() {
      // Email sent.
      console.log('Password reset email sent to ' + email.value);
      setEmailSent({...emailSent, value: true})
    }).catch(function(error) {
      const resetemail_error = FIREBASE_AUTH_ERRORCODE.SEND_PASSWORD_RESET_EMAIL;
      switch(error.code){
        case resetemail_error.USER_NOT_FOUND:
          // don't notify user that this account doesn't exist, consider logging this for analytics though
          break;
      }
      console.error(error);
      setEmailSent({...emailSent, value: true})
    });
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Restore Password</Header>
      {
        !emailSent.value ?
        (
          <React.Fragment>
            <TextInput
              label="E-mail address"
              returnKeyType="done"
              value={email.value}
              onChangeText={(text) => setEmail({ value: text, error: '' })}
              error={!!email.error}
              errorText={email.error}
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              description="You will receive email with password reset link."
            />
            <Button
              mode="contained"
              onPress={sendResetPasswordEmail}
              style={{ marginTop: 16 }}
            >
              Send Instructions
            </Button>
          </React.Fragment>
        ) :
        (
          <React.Fragment>
            <Paragraph>Password reset instructions sent to {email.value}.</Paragraph>
              <Button
                mode="contained"
                onPress={navigation.goBack}
                style={{ marginTop: 16 }}
                >
                  Back
              </Button>
          </React.Fragment>
        )
      }
    </Background>
  )
}
