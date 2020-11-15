import { useEffect, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  useDisclosure,
  CircularProgress,
  Text,
  Box,
  List,
  Image,
  ListItem,
  Flex,
  Input,
  Link,
} from '@chakra-ui/core'

import { useRouter } from 'next/router'

import FBButton from '../common/fbButton'
import FBDivider from '../common/divider'
import UnderlinedHeading from '../common/underlinedHeading'
import { useLocalStorage } from '../../utils/useLocalStorage'
import { localStorageOrgKey } from '../../utils/constants'

import { fetchOrgByName } from '../../client'

const ChooseOrgModal = () => {
  const router = useRouter()

  const [fetchingOrg, setFetchingOrg] = useState(false)
  const [org, setOrg] = useState(undefined)
  const [searchInvoked, setSearchInvoked] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure(true)
  const [_, setCurrentOrgState] = useLocalStorage(localStorageOrgKey, '') // eslint-disable-line
  const subheadingExistingOrgs = "If Flossbank has already been installed on your organization, find it using the search box below."

  const githubInstallLink = 'https://github.com/apps/flossbank/installations/new?redirect_uri=https://enterprise.flossbank.com/complete-install'

  const goToOrg = ({ id }) => {
    setCurrentOrgState(id)
    router.push(`/organization/${id}`)
  }

  const setOrgName = async (e) => {
    setFetchingOrg(true)
    setOrg(undefined)
    const name = e.target.value.trim().toLowerCase()
    setSearchInvoked(!!name)
    try {
      const orgRes = await fetchOrgByName({ name })
      setOrg(orgRes.organization)
    } catch (e) {} finally {
      setFetchingOrg(false)
    }
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
            text="Find organization"
            align='left'
            marginBottom='1rem'
          />
          <Text>
            {subheadingExistingOrgs}
          </Text>
        </ModalHeader>
        <ModalCloseButton /> 
        <Text id='org-name-label'>Enter Organization Name:</Text>
        <Box border='1px solid black' marginBottom='2rem'>
          <Input
            id='org-name'
            placeholder='Flossbank'
            onChange={setOrgName}
            type='text'
            aria-describedby='org-name-label'
            name='org name'
          />
        </Box>
        <List spacing={3} marginBottom='1rem'>
          {fetchingOrg && (
            <ListItem>
              <CircularProgress isIndeterminate color='ocean' />
            </ListItem>
          )}
          {org && (
            <ListItem
              _hover={{ backgroundColor: 'puddle', cursor: 'pointer' }}
              onClick={() => goToOrg({ id: org.id })}
              borderRadius='5px'
              width='100%'>
              <Flex flexDirection='row'>
                <Image width='5rem' height='5rem' borderRadius='1rem' src={org.avatarUrl} />
                <Flex marginLeft='1rem' flexDirection='column' justifyContent='center'>
                  <Text textTransform='uppercase' fontWeight='bold'>{org.name}</Text>
                </Flex>
              </Flex>
            </ListItem>
          )}
          {!org && searchInvoked && (
            <ListItem
              borderRadius='5px'
              width='100%'>
             <Text textTransform='uppercase' fontWeight='bold'>No org found by that name</Text>
            </ListItem>
          )}
          <FBDivider />
          <Link href={githubInstallLink} width='100%'>
            <FBButton>
              Install Flossbank On New Organization
            </FBButton>
          </Link>
        </List>
      </ModalContent>
    </Modal>
  )
}

export default ChooseOrgModal

