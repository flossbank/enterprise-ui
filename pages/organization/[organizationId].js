import { useState, useEffect } from 'react'

import {
  getOrganization,
  fetchDonationInfo,
} from '../../client'

import {
  Text,
  Box,
  Heading,
  List,
  ListItem,
  CircularProgress,
  Icon
} from '@chakra-ui/core'

import { downloadData } from '../../utils/downloader'
import { useAuth } from '../../utils/useAuth'

import PageWrapper from '../../components/common/pageWrapper'
import Section from '../../components/common/section'
import Card from '../../components/common/card'
import Subheading from '../../components/common/subheading'
import DashboardDataCard from '../../components/dashboard/dashboardDataCard'
import DonationCard from '../../components/dashboard/donationCard'
import FBButton from '../../components/common/fbButton'
import TopTenPackagesView from '../../components/dashboard/topTenPackagesView'
import { useRouter } from 'next/router'

const Dashboard = () => {
  const { resume } = useAuth()
  const router = useRouter()

  const [topLevelPackagesLoading, setTopLevelPackagesLoading] = useState(true)
  const [topLevelPackages, setTopLevelPackages] = useState(0)

  const [topUsedPackages, setTopUsedPackages] = useState([])

  const [orgDepCountLoading, setOrgDepCountLoading] = useState(true)
  const [orgDepCount, setOrgDepCount] = useState(0)
  
  const [donationLoading, setDonationLoading] = useState(true)
  const [donation, setDonation] = useState(0)

  const [org, setOrg] = useState({})

  function resetLoaders () {
    setTopLevelPackagesLoading(true)
    setDonationLoading(true)
    setOrgDepCountLoading(true)
  }

  /**
   * Fetch data will first try to get the org that is being viewed. Based on the headers,
   * the api will either return public or private org data and functionality will be
   * allowed as such.
   */
  async function fetchData () {
    if (!router.query || !router.query.organizationId) return 

    try {
      const orgRes = await getOrganization({ orgId: router.query.organizationId })
      setOrg(orgRes.organization)
      setDonation(orgRes.organization.donationAmount || 0)
      // TODO: Branch logic here if private data is returned or public
    } catch (e) {
      setTopLevelPackages('N/A')
      setOrgDepCount('N/A')
    } finally {
      setTopLevelPackagesLoading(false)
      setOrgDepCountLoading(false)
    }

    try {
      const donationInfoRes = await fetchDonationInfo({ orgId: router.query.organizationId })
      if (donationInfoRes && donationInfoRes.success) {
        setDonation(donationInfoRes.donationInfo.amount / 100)
      }
    } catch (e) {
      setDonation(0)
    } finally {
      setDonationLoading(false)
    }
  }

  async function refreshDashboard () {
    resetLoaders()
    await fetchData()
    await resume()
  }

  useEffect(() => {
    fetchData()
  }, [router.query]) // only run on mount

  return (
    <PageWrapper title='Dashboard'>
      <h1 className='sr-only'>Organization dashboard</h1>
      <Section
        backgroundColor='lightRock'
        display={{ md: 'grid' }}
        gridTemplateColumns={{ lg: 'repeat(4, minmax(16rem, 20rem))' }}
        justifyContent='center'
        gridColumnGap={{ md: '3rem' }}
        gridRowGap={{ base: '3rem', lg: '1.5rem' }}
        gridTemplateRows={{ lg: '15rem auto auto auto auto' }}
      >
        <Box gridRow='1' gridColumn='1 / span 4'>
          <Heading
            textTransform='uppercase'
            letterSpacing='1px'
            fontWeight='bold'
            marginTop='0'
            fontSize='1rem'
            textAlign={{ base: 'center', md: 'left' }}
            marginBottom='1.5rem'
          >
            {org && org.name}'s impact overview
          </Heading>
          <Box>
            <List
              display={{ base: 'grid' }}
              alignItems={{ md: 'stretch', lg: 'initial' }}
              gridGap='1.75rem'
              gridTemplateColumns={{
                base: 'repeat(auto-fit, minmax(16rem, 1fr))'
              }}
              width='100%'
              margin={{ base: '0 auto 1.5rem auto' }}
            >
              <ListItem>
                <DashboardDataCard>
                  {topLevelPackagesLoading && (
                    <CircularProgress isIndeterminate color='ocean' />
                  )}
                  {!topLevelPackagesLoading && (
                    <Text
                      aria-describedby='packages-touched'
                      fontSize='2.25rem'
                      color='ocean'
                    >
                      {topLevelPackages}
                    </Text>
                  )}
                  <Heading
                    as='h3'
                    fontSize='1rem'
                    fontWeight='normal'
                    id='user-session-count'
                  >
                    Top level dependencies
                  </Heading>
                </DashboardDataCard>
              </ListItem>
              <ListItem>
                <DashboardDataCard>
                  {orgDepCountLoading && (
                    <CircularProgress isIndeterminate color='ocean' />
                  )}
                  {!orgDepCountLoading && (
                    <Text
                      aria-describedby='user-session-count'
                      fontSize='2.25rem'
                      color='ocean'
                    >
                      {orgDepCount}
                    </Text>
                  )}
                  <Heading
                    as='h3'
                    fontSize='1rem'
                    fontWeight='400'
                    id='user-session-count'
                  >
                    Total package dependencies
                  </Heading>
                </DashboardDataCard>
              </ListItem>
              <ListItem>
                <DashboardDataCard>
                  <Text
                    aria-describedby='org-total-donations'
                    fontSize='2.25rem'
                    color='ocean'
                  >
                    $ 0
                  </Text>
                  <Heading
                    as='h3'
                    fontSize='1rem'
                    fontWeight='400'
                    id='org-total-donations'
                  >
                    Total donations supporting Open Source
                  </Heading>
                </DashboardDataCard>
              </ListItem>
              <ListItem>
                <DonationCard
                  donationLoading={donationLoading}
                  hasDonation={!!donation}
                  refreshDashboard={refreshDashboard}
                  donationAmount={donation}
                />
              </ListItem>
            </List>
          </Box>
        </Box>
        <Box width='100%' gridRow='2 / span 4' gridColumn='1 / span 3' display={['none', 'grid']}>
          <TopTenPackagesView topTenPackages={topUsedPackages} />
        </Box>
        <Card
          marginTop={{ base: '3rem', lg: '0' }}
          gridRow='2 / span 3'
          gridColumn='4'
          height='100%'
          width='100%'
          justifySelf='end'
          alignSelf='end'
          textAlign={{ base: 'center', md: 'right' }}
        >
          <Subheading>Need help?</Subheading>
        </Card>
        <Box
          marginTop={{ base: '3rem', lg: '0' }}
          gridRow='5'
          gridColumn='4'
          justifySelf='end'
          alignSelf='end'
          textAlign={{ base: 'center', md: 'right' }}
        >
          <FBButton
            backgroundColor='transparent'
            fontWeight='600'
            borderRadius='0'
            color='ocean'
            onClick={() =>
              downloadData('poopy badge', 'flossbank_org_badge.svg')}
          >
            Download your badge
            <Icon marginLeft='1rem' name='download' size='1.75rem' />
          </FBButton>
        </Box>
      </Section>
    </PageWrapper>
  )
}

export default Dashboard
