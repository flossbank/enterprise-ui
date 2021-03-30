import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  CircularProgress,
  Text,
  Box,
  List,
  Image,
  ListItem,
  Flex,
  Input
} from '@chakra-ui/core'
import debounce from 'p-debounce'

import UnderlinedHeading from '../components/common/underlinedHeading'
import PageWrapper from '../components/common/pageWrapper'
import TextLink from '../components/common/textLink'
import Section from '../components/common/section'
import WomanWorking from '../components/completeLogin/womanWorking'

import { fetchOrgsByName } from '../client'

const FindOrganizationPage = () => {
  const router = useRouter()

  const [fetchingOrg, setFetchingOrg] = useState(false)
  const [orgs, setOrgs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchInvoked, setSearchInvoked] = useState(false)
  const subheadingExistingOrgs = 'If Flossbank has already been installed on your organization, find it using the search box below.'

  // Unsure if callback_url is correct or is doing anything, in our app settings we have a post installation setup url
  // which restricts it to enterprise.flossbank.com/complete-install
  const githubInstallLink = 'https://github.com/apps/flossbank/installations/new?callback_url=https://enterprise.flossbank.com/complete-install'

  const goToOrg = ({ id }) => {
    router.push(`/organization/${id}`)
  }

  const findOrgDebounced = debounce(async (name) => {
    setFetchingOrg(true)
    setOrgs([])
    setSearchInvoked(!!name)
    try {
      const matchingOrgs = await fetchOrgsByName({ name, host: 'GitHub' })
      setOrgs(matchingOrgs || [])
    } catch (e) {} finally {
      setFetchingOrg(false)
      setIsLoading(false)
    }
  }, 350)

  const findOrg = (e) => findOrgDebounced(e.target.value.trim().toLowerCase())

  return (
    <PageWrapper title='Search'>
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
            text='Find your organization'
            align='left'
          />
          <Text marginBottom='1rem'>
            {subheadingExistingOrgs}
          </Text>
          <Text marginBottom='1rem'>
            <TextLink text='Otherwise, click here to install Flossbank on your organization.' href={githubInstallLink} external />
          </Text>
          <Flex flexDirection='row' marginBottom='1rem' border='1px solid gray' borderRadius='0.5rem'>
            <Text
              paddingLeft='1rem'
              paddingRight='0.5rem'
              paddingTop='0.5rem'
              borderRadius='0.5rem 0 0 0.5rem'
              backgroundColor='lightGray'
            >
              https://github.com/
            </Text>
            <Box borderLeft='1px solid black' width='100%'>
              <Input
                autoComplete='off'
                id='org-name'
                placeholder='flossbank'
                onChange={findOrg}
                type='text'
                borderRadius='0 0.5rem 0.5rem 0'
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
            {orgs.map(org => (
              <ListItem
                key={org.id}
                _hover={{ backgroundColor: 'puddle', cursor: 'pointer' }}
                onClick={() => goToOrg({ id: org.id })}
                borderRadius='5px'
                width='100%'
              >
                <Flex flexDirection='row'>
                  <Image width='5rem' height='5rem' borderRadius='1rem' src={org.avatarUrl} />
                  <Flex marginLeft='1rem' flexDirection='column' justifyContent='center'>
                    <Text textTransform='uppercase' fontWeight='bold'>{org.name}</Text>
                  </Flex>
                </Flex>
              </ListItem>
            ))}
            {!orgs && searchInvoked && (
              <ListItem
                borderRadius='5px'
                width='100%'
              >
                <Text textTransform='uppercase' fontWeight='bold'>No org found by that name</Text>
              </ListItem>
            )}
          </List>
        </Box>
      </Section>
    </PageWrapper>
  )
}

export default FindOrganizationPage
