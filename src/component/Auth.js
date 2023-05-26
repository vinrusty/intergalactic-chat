import { Button, Flex } from '@chakra-ui/react'
import { auth, provider } from '../firebase-config'
import { signInWithPopup } from 'firebase/auth'
import Cookies from 'universal-cookie'
import React from 'react'

function Auth() {

    const cookie = new Cookies()

    const signInWithGoogle = async() => {
        try{
            const result = await signInWithPopup(auth, provider);
            cookie.set("auth-token", result.user.refreshToken)
        }
        catch(err){
            console.error(err)
        }
    }

  return (
    <div>
        <Flex height="100vh" alignItems="center" justifyContent="center">
            <Button onClick={signInWithGoogle} colorScheme='purple'>
                Sign In With Google
            </Button>
        </Flex>
    </div>
  )
}

export default Auth