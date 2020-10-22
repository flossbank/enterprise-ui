import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  useDisclosure,
  List,
  ListItem,
  Image,
  Text,
  Flex,
} from '@chakra-ui/core'

import { useRouter } from 'next/router'

import FBButton from '../common/fbButton'
import UnderlinedHeading from '../common/underlinedHeading'
import { useEffect } from 'react'

const ChooseOrgModal = ({ orgs }) => {
  console.log('wtf', orgs)
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure(true)
  const subheadingExistingOrgs = 'Sign in with an existing Flossbank installation or create a new one for a new org?'

  const goToOrg = ({ id }) => {
    router.push(`/organization/${id}`)
  }

  useEffect(() => onOpen(), [])

  return (
    <Modal
      isOpen={isOpen}
      size='xl'
      closeOnOverlayClick={false}
      onClose={onClose}
      aria-live='polite'
      aria-atomic='true'
    >
      <ModalOverlay backgroundColor='rgba(0, 0, 0, .75)' />
      <ModalContent backgroundColor='white' padding='2rem'>
        <ModalHeader>
          <UnderlinedHeading
            text='Choose organization to sign in with'
            align='left'
            marginBottom='1rem'
          />
          <Text>
            {subheadingExistingOrgs}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <List spacing={3} marginBottom='1rem'>
          {orgs.map((org) => (
            <ListItem
              _hover={{ backgroundColor: 'puddle', cursor: 'pointer' }}
              key={org.id} 
              onClick={() => goToOrg({ id: org.id })}
              borderRadius='5px'
              width='100%'
              border='solid 1px black'>
              <Flex flexDirection='row'>
                <Image width='5rem' height='5rem' borderRadius='2rem' src={org.avatarUrl} />
                <Flex marginLeft='1rem' flexDirection='column' justifyContent='center'>
                  <Text textTransform='uppercase' fontWeight='bold'>{org.name}</Text>
                </Flex>
              </Flex>
            </ListItem>
          ))}
        </List>
        <FBButton>
          Install Flossbank On New Organization
        </FBButton>
      </ModalContent>
    </Modal>
  )
}

export default ChooseOrgModal

