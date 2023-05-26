import { Flex, Button } from '@chakra-ui/react'
import React from 'react'
import { auth } from '../firebase-config'

function Header() {
  return (
    <div>
        <Flex padding="1.5rem" width="100%">
            <Button onClick={() => auth.signOut()} colorScheme="purple" ml="auto">Sign out</Button>
        </Flex>
    </div>
  )
}

export default Header