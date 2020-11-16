import { useState, useEffect } from 'react'

import {
  getOrganization,
  fetchDonationInfo,
} from '../../../client'

import {
  Text,
  Box,
  Flex,
  Heading,
  List,
  Link,
  Image,
  ListItem,
  CircularProgress,
  Icon
} from '@chakra-ui/core'

import { downloadData } from '../../../utils/downloader'
import { fetchOrgOssUsage } from '../../../client'

import PageWrapper from '../../../components/common/pageWrapper'
import Section from '../../../components/common/section'
import DashboardDataCard from '../../../components/dashboard/dashboardDataCard'
import DonationCard from '../../../components/dashboard/donationCard'
import { useRouter } from 'next/router'

const Dashboard = () => {
  const router = useRouter()

  const [topLevelPackagesLoading, setTopLevelPackagesLoading] = useState(true)
  const [topLevelPackages, setTopLevelPackages] = useState(0)

  const [totalContributionsAmountLoading, setTotalContributionsAmountLoading] = useState(true)
  const [totalContributionsAmount, setTotalContributionsAmount] = useState(0)

  const [orgDepCountLoading, setOrgDepCountLoading] = useState(true)
  const [orgDepCount, setOrgDepCount] = useState(0)
  
  const [donationLoading, setDonationLoading] = useState(true)
  const [donation, setDonation] = useState(0)

  const [org, setOrg] = useState({})

  function resetDonationLoaders () {
    setDonationLoading(true)
    setTotalContributionsAmountLoading(true)
  }

  async function fetchAllData () {
    await Promise.all([fetchOssUsageData(), fetchDonationData()])
  }

  async function fetchDonationData() {
    if (!router.query || !router.query.organizationId) return 
    const orgId = router.query.organizationId
    try {
      const donationInfoRes = await fetchDonationInfo({ orgId })
      if (donationInfoRes && donationInfoRes.success) {
        setDonation(donationInfoRes.donationInfo.amount / 100)
        setTotalContributionsAmount(donationInfoRes.donationInfo.totalDonated / 100)
      }
    } catch {
      setDonation(0)
    } finally {
      setTotalContributionsAmountLoading(false)
      setDonationLoading(false)
    }
  }

  async function fetchOssUsageData() {
    if (!router.query || !router.query.organizationId) return 
    const orgId = router.query.organizationId
    try {
      const orgRes = await getOrganization({ orgId })
      setOrg(orgRes.organization)
      const orgOssUsage = await fetchOrgOssUsage({ orgId })
      setTopLevelPackages(orgOssUsage.details.topLevelDependencies)
      setOrgDepCount(orgOssUsage.details.totalDependencies)
    } catch (e) {
      setTopLevelPackages('N/A')
      setOrgDepCount('N/A')
    } finally {
      setTopLevelPackagesLoading(false)
      setOrgDepCountLoading(false)
    }
  }

  async function refreshDonationDashboard () {
    resetDonationLoaders()
    await fetchDonationData()
  }

  useEffect(() => {
    fetchAllData()
  }, [router.query]) // only run on mount

  function getOrgName() {
    try {
      return org.name.toUpperCase()
    } catch (e) {
      return ''
    }
  }

  function getBadgePath() {
    if (donation >= 10000) {
      return '/images/badges/platinum.svg'
    } else if (donation >= 5000) {
      return '/images/badges/gold.svg'
    } else if (donation >= 1000) {
      return '/images/badges/silver.svg'
    } else if (donation >= 500) {
      return '/images/badges/bronze.svg'
    }
  }

  return (
    <PageWrapper title='Dashboard'>
      <h1 className='sr-only'>Organization dashboard</h1>
      <Section
        backgroundColor='lightRock'
        height='100vh'
        display={{ md: 'grid' }}
        gridTemplateColumns={{ lg: 'repeat(4, minmax(14rem, 20rem))' }}
        justifyContent='center'
        gridColumnGap={{ md: '3rem' }}
        gridRowGap={{ base: '3rem', lg: '1rem' }}
        gridTemplateRows={{ lg: '13rem 13rem 5rem' }}
      >
        <Box gridRow='1' display={{ base: 'none', lg: 'inline' }} gridColumn='1' padding='2rem'>
          <Image height='10rem' width='10rem' borderRadius='1rem' src={org.avatarUrl} />
        </Box>
        <Flex flexDirection='column' justifyContent='space-around' gridRow='1' gridColumn={{ base: '1 / span 5', lg: '2 / span 4' }}>
          <Box padding={{ base: '3rem 0', lg: '0 3rem 0 3rem' }}>
            <Text marginBottom='2rem'>Flossbank distributes {getOrgName()}'s contributions either down the entire dependency tree of {getOrgName()}'s 
              dependencies, or across the entire open source ecosystem. To learn more about how Flossbank works, 
              visit <a href='https://enterprise.flossbank.com/how-it-works'>enterprise.flossbank.com/how-it-works</a>.
            </Text>
            <Text>Below, you can see how much {org && org.name} is 
              currently donating, as well as how much they've given in total. This is both a statement, and 
              commitment by {getOrgName()} to Open Source and sustaining Open Source maintainers for all the work they do.</Text>
          </Box>
        </Flex>
        <Box gridRow='2' gridColumn='1 / span 4'>
          <Heading
            textTransform='uppercase'
            letterSpacing='1px'
            fontWeight='bold'
            marginTop='0'
            fontSize='1rem'
            textAlign={{ base: 'center', md: 'left' }}
            marginBottom='1.5rem'
          >
            {getOrgName()}'s impact overview
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
                    Top Level Dependencies
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
                    Total Current Package Dependencies
                  </Heading>
                </DashboardDataCard>
              </ListItem>
              <ListItem>
                <DashboardDataCard>
                  {totalContributionsAmountLoading && (
                    <CircularProgress isIndeterminate color='ocean' />
                  )}
                  {!totalContributionsAmountLoading && (
                    <Text
                      aria-describedby='org-total-donations'
                      fontSize='2.25rem'
                      color='ocean'
                    >
                      $ {totalContributionsAmount}
                    </Text>
                  )}
                  <Heading
                    as='h3'
                    fontSize='1rem'
                    fontWeight='400'
                    id='org-total-donations'
                  >
                    Total Donations to Open Source
                  </Heading>
                </DashboardDataCard>
              </ListItem>
              <ListItem>
                <DonationCard
                  donationLoading={donationLoading}
                  hasDonation={!!donation}
                  refreshDashboard={refreshDonationDashboard}
                  donationAmount={donation}
                />
              </ListItem>
            </List>
          </Box>
        </Box>
        <Box
          marginTop={{ base: '3rem', lg: '0' }}
          gridRow='3'
          gridColumn='4'
          justifySelf='end'
          alignSelf='end'
          textAlign={{ base: 'center', md: 'right' }}
        >
          {donation >= 500 && (
            <Link href={getBadgePath()} download='flossbank_support_badge.svg' padding='1rem'>
              Download support badge
              <Icon marginLeft='1rem' name='download' size='1.75rem' />
            </Link>
          )}
        </Box>
      </Section>
    </PageWrapper>
  )
}

export default Dashboard
