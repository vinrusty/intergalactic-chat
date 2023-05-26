import { Button, Flex, Heading, Input, useDisclosure, useToast } from '@chakra-ui/react'
import { addDoc, collection, getDocs, getDoc, query, updateDoc, where, doc, arrayUnion } from 'firebase/firestore'
import React, { useState, useEffect } from 'react'
import { auth, db } from '../firebase-config'
import { useNavigate } from 'react-router-dom'
import { admins } from './admin'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

function ChatHome() {

  const roomRef = collection(db, "rooms")
  const [code, setCode] = useState("")
  const [roomCode, setRoomCode] = useState("")
  const [document, setDocument] = useState(null)
  const [teamName, setTeamName] = useState("")
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const addUser = async(documentId, newUser) => {
    try {
  
      const userRef = doc(roomRef, documentId);
  
      const docSnapshot = await getDoc(userRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const users = data.users;
        console.log(data)
  
        if (users.includes(newUser)) {
          console.log('User already exists in the document.');
          navigate(`/rooms/${data.code}`)
          return;
        }
  
        await updateDoc(userRef, {
          users: arrayUnion(newUser)
        });
        
        console.log('User added successfully.');
        navigate(`/rooms/${data.code}`)
        // Handle the successful addition of the user
      } else {
        console.log('Document does not exist.');
        // Handle the case where the document does not exist
      }
    } catch (error) {
      console.log('Error adding user:', error);
      // Handle the error while adding the user
    }
  }

  const handleSubmit = async (code) => {
    try{
      if(teamName === "" && code === ""){
        toast({
          description: "Enter your team name and room code",
          status: "warning",
          duration: "3000",
          isClosable: true
        })
        return
      }
      const result = await getDocs(query(roomRef, where("code", "==", code)))
      if(result.size === 0){
        toast({
          description: "Room doesn't exists",
          status: "error",
          duration: "3000",
          isClosable: true
        })
        return
      }
      result && result.forEach(res => {
        console.log(res.data())
        const id = res.id
        setDocument({
          id: id,
          ...res.data()
        })
      })
    }
    catch(err){
      console.error(err)
    }
  }

  const handleCreateRoom = async(newRoom) => {
    try{
      const rooms = await getDocs(query(roomRef, where("code", "==", newRoom.code)))
      if(rooms.size !== 0){
        toast({
          description: "Room already exists!",
          status: "info",
          duration: "3000",
          isClosable: true
        })
        return
      }
      const result = await addDoc(roomRef, newRoom)
      if(result.id){
        toast({
          description: "Room created successfully!",
          status: "success",
          duration: "3000",
          isClosable: true
        })
        onClose()
      }
    }
    catch(err){
      toast({
        description: "Room could not be created :(",
        status: "error",
        duration: "3000",
        isClosable: true
      })
      console.error(err)
    }
  }

  useEffect(() => {
    if (document && document.id) {
      addUser(document.id, 
        {
          teamName: teamName.toLowerCase(),
          user:auth.currentUser.displayName
        }
    );
    }
  }, [document]);

  return (
    <div>
      <Flex alignItems="center" height="100vh" direction="column" justifyContent="center" padding="2rem">
        <Heading color="white">INTERGALACTIC IMBECILES</Heading>
        <Flex width="50%" direction="column" mt="40px">
          <Input color="white" variant="filled" background="messenger.100" onChange={(e) => setTeamName(e.target.value)} placeholder='Enter team name' />
          <Input color="white" variant="filled" mt="10px" background="messenger.100" onChange={(e) => setCode(e.target.value)} placeholder='Enter room code' />
          <Button mt="20px" onClick={() => handleSubmit(code)} colorScheme='purple'>Enter Room</Button>
          {
            admins.includes(auth.currentUser.email) ?
            <Button onClick={onOpen} mt="10px" colorScheme="blue">Create a Room</Button>
            :
            <>
            </>
          }
        </Flex>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a Room</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input onChange={(e) => setRoomCode(e.target.value)} placeholder='Enter room code' />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => handleCreateRoom(
              {
                code: roomCode,
                messages: [],
                users: []
              }
            )} variant='ghost'>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ChatHome