import React, { useState, useEffect, useRef } from 'react'
import { Button, Card, CardBody, Text, Flex, Box, Center, useMediaQuery, Tag } from '@chakra-ui/react'
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion, onSnapshot, setDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, db } from '../firebase-config';
import audioFile from "../assets/among.mp3";
import Header from './Header';

function Chat() {

    const [messages, setMessages] = useState([])
    const [teamName, setTeamName] = useState("")
    const { id } = useParams()
    const [islargerthan600] = useMediaQuery('(min-width: 960px)')
    const dummy = useRef()
    const navigate = useNavigate()

    useEffect(() => {
        
        const unsubscribe = onSnapshot(query(collection(db, "rooms"), where("code", "==", id)), (snapshot) => {
            const messageList = snapshot.docs.map(doc => doc.data().messages).flat();
            setMessages(messageList);
            const teamList = snapshot.docs.map(doc => doc.data().users).flat();
            const team = teamList.filter(t => t.user === auth.currentUser.displayName)
            setTeamName(team[0]?.teamName)
            const roomDoc = snapshot.docs[0];
            const roomId = roomDoc.id;

            const roomRef = doc(collection(db, 'rooms'), roomId);
            const roomData = roomDoc.data();

            if (roomData && roomData.audioPlaying) {
                // Play audio
                const audio = new Audio(audioFile);
                audio.play();

                // Update the audioPlaying field once audio playback is complete
                audio.onended = async () => {
                await updateDoc(roomRef, { audioPlaying: false });
            };
            }
        });
          
        return () => unsubscribe();
    }, [id])

    const handleOnButtonClick = async (newMessage) => {
        try {
            const roomRef = collection(db, 'rooms');
            const querySnapshot = await getDocs(query(roomRef, where('code', '==', id)));
        
            if (querySnapshot.empty) {
              navigate("/")
              return;
            }
            
            const roomDoc = querySnapshot.docs[0];
            const roomId = roomDoc.id;

            const time = new Date()

            const messageWithTimestamp = {
                ...newMessage,
                createdAt: time.getHours()+":"+time.getMinutes()+":"+time.getSeconds()
            };
            
            await updateDoc(doc(roomRef, roomId), {
              messages: arrayUnion(messageWithTimestamp)
            });
            setMessages([...messages, messageWithTimestamp])
            await setDoc(doc(roomRef, roomId), { audioPlaying: true }, { merge: true });
            dummy.current.scrollIntoView({ behavior: "smooth" })
          } catch (error) {
            console.error('Error adding message:', error);
          }
    }
    

  return (
    <div>
        <Flex justifyContent="center">
            <Flex direction="column" padding="2rem" width={islargerthan600 ? "70%": "100%"}>
                <Center>
                    <Card mb = "20px" background="gray.200">
                        <CardBody>
                            <Text>We are in ROOM #{id}. Raise Emergency meetings here!</Text>
                        </CardBody>
                    </Card>
                </Center>
                {
                    messages && messages.map((message, i) => (
                        <>
                        <Box width="50%" borderRadius="10px" textAlign="left" alignSelf={message.userName === auth.currentUser.displayName ? "flex-end" : "flex-start"} marginLeft="auto" key={i} padding="1rem" margin="5px" background={message.userName === auth.currentUser.displayName ? "purple.100" : "purple.400"}>
                            <Text>{message.userName} from team {message.teamName} raised an Emergency!!!</Text>
                            <Tag mt="5px" colorScheme='teal'>{message.createdAt}</Tag>
                        </Box>
                        <div ref={dummy}></div>
                        </>
                    ))
                }
                <Button onClick={() => handleOnButtonClick({
                    teamName: teamName,
                    userName: auth.currentUser.displayName
                })} alignSelf="flex-end" m="20px" colorScheme='red'>Emergency Meeting!!</Button>
            </Flex>
        </Flex>
    </div>
  )
}

export default Chat