import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  Heading,
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

import FBButton from '../components/common/fbButton'
import UnderlinedHeading from '../components/common/underlinedHeading'
import { useLocalStorage } from '../utils/useLocalStorage'
import PageWrapper from '../components/common/pageWrapper'
import Section from '../components/common/section'
import WomanWorking from '../components/completeLogin/womanWorking'

import { localStorageOrgKey } from '../utils/constants'

import { fetchOrgByName } from '../client'

const FindOrganizationPage = () => {
  const router = useRouter()

  const [fetchingOrg, setFetchingOrg] = useState(false)
  const [org, setOrg] = useState(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [searchInvoked, setSearchInvoked] = useState(false)
  const [_, setCurrentOrgState] = useLocalStorage(localStorageOrgKey, '') // eslint-disable-line
  const subheadingExistingOrgs = "If Flossbank has already been installed on your organization, find it using the search box below. If it's not found, try installing Flossbank on your organization using the button below."

  // Unsure if callback_url is correct or is doing anything, in our app settings we have a post installation setup url
  // which restricts it to enterprise.flossbank.com/complete-install
  const githubInstallLink = 'https://github.com/apps/flossbank/installations/new?callback_url=https://enterprise.flossbank.com/complete-install'

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
      const orgRes = await fetchOrgByName({ name, host: 'GitHub' })
      setOrg(orgRes.organization)
    } catch (e) {} finally {
      setFetchingOrg(false)
    }
  }

  return (
    <PageWrapper title='Log In'>
      <Section
        backgroundColor='lightRock'
        minHeight='85vh'
        aria-live='polite'
        aria-atomic='true'
        aria-busy={isLoading}
        display='grid'
        justifyItems={{ base: 'center', lg: 'start' }}
        gridTemplateColumns={{ base: '1fr', lg: 'minmax(18rem, 1fr) 1fr' }}
        alignItems='center'
        gridTemplateRows='1fr'
        gridColumnGap={{ lg: '4rem', xl: '8rem' }}
        padding={{ base: '3rem 1.5rem', lg: '6rem 7.5rem' }}
        backgroundColor='lightRock'
      >
        <Box
          width={{ base: '60%', md: '40%', lg: '100%' }}
          marginBottom={{ base: '3rem', lg: 0 }}
          marginTop={{ lg: '1.5rem' }}
          position={{ lg: 'sticky' }}
          top={{ lg: '10%' }}
          gridColumn='1'
          alignSelf='baseline'
        >
          <WomanWorking />
        </Box>
        <Box gridColumn={{ base: 1, lg: 2 }} maxW={{ base: '80ch', lg: '55ch' }}>
          <UnderlinedHeading
            marginBottom='3rem'
            text="Enter organization name:"
            align='left'
          />
          <Text marginBottom='2rem'>
              {subheadingExistingOrgs}
            </Text>
          <Flex flexDirection='row' marginBottom='1rem' border='1px solid gray' borderRadius='0.5rem'>
            <Text paddingLeft='1rem' paddingTop='0.5rem' backgroundColor='lightGray'>https://github.com/</Text>
            <Box borderLeft='1px solid black'>
              <Input
                id='org-name' 
                placeholder='flossbank'
                onChange={setOrgName}
                type='text'
                aria-describedby='org-name-label'
                name='org name'
              />
            </Box>
          </Flex>
          <List spacing={3} margin=''>
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
            <Link href={githubInstallLink} width='100%'>
              <FBButton>
                Install Flossbank On New Organization
              </FBButton>
            </Link>
          </List>
        </Box>
      </Section>
    </PageWrapper>
  )
}

export default FindOrganizationPage
