import { Flex, Button, Heading } from '@chakra-ui/react'
import React from 'react'
import { auth } from '../firebase-config'
import { useNavigate } from 'react-router-dom'

function Header() {

    const navigate = useNavigate()

  return (
    <div>
        <Flex padding="1.5rem" width="100%">
            <Heading size="sm" color="white">{auth.currentUser.displayName}</Heading>
            <Button onClick={() => {
                auth.signOut()
            }} colorScheme="purple" ml="auto">Sign out</Button>
        </Flex>
    </div>
  )
}

export default Header