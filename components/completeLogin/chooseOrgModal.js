import { useEffect } from 'react'
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
import FBDivider from '../common/divider'
import UnderlinedHeading from '../common/underlinedHeading'
import { useLocalStorage } from '../../utils/useLocalStorage'
import { localStorageOrgKey } from '../../utils/constants'

const ChooseOrgModal = ({ orgs }) => {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure(true)
  const [_, setCurrentOrgState] = useLocalStorage(localStorageOrgKey, '') // eslint-disable-line
  const subheadingExistingOrgs = 'Sign in with an existing Flossbank installation or create a new one for a new org?'

  const goToOrg = ({ id }) => {
    setCurrentOrgState(id)
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
          <FBDivider />
          {orgs.map((org) => (
            <>
              <ListItem
                _hover={{ backgroundColor: 'puddle', cursor: 'pointer' }}
                key={org.id} 
                onClick={() => goToOrg({ id: org.id })}
                borderRadius='5px'
                width='100%'>
                <Flex flexDirection='row'>
                  <Image width='5rem' height='5rem' borderRadius='2rem' src={org.avatarUrl} />
                  <Flex marginLeft='1rem' flexDirection='column' justifyContent='center'>
                    <Text textTransform='uppercase' fontWeight='bold'>{org.name}</Text>
                  </Flex>
                </Flex>
              </ListItem>
              <FBDivider />
            </>
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

