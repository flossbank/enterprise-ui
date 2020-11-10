import { useState, useEffect } from 'react'

import {
  getOrganization,
  fetchDonationInfo,
} from '../../../client'

import {
  Text,
  Box,
  Heading,
  List,
  ListItem,
  CircularProgress,
  Icon
} from '@chakra-ui/core'

import { downloadData } from '../../../utils/downloader'
import { useAuth } from '../../../utils/useAuth'
import { fetchOrgOssUsage } from '../../../client'

import PageWrapper from '../../../components/common/pageWrapper'
import Section from '../../../components/common/section'
import DashboardDataCard from '../../../components/dashboard/dashboardDataCard'
import DonationCard from '../../../components/dashboard/donationCard'
import FBButton from '../../../components/common/fbButton'
import { useRouter } from 'next/router'

const Dashboard = () => {
  const { resume } = useAuth()
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

  function resetLoaders () {
    setTopLevelPackagesLoading(true)
    setDonationLoading(true)
    setOrgDepCountLoading(true)
  }

  async function fetchData () {
    if (!router.query || !router.query.organizationId) return 

    const orgId = router.query.organizationId

    try {
      const orgRes = await getOrganization({ orgId })
      setOrg(orgRes.organization)
      setDonation(orgRes.organization.donationAmount || 0)
      const orgOssUsage = await fetchOrgOssUsage({ orgId })
      setTopLevelPackages(orgOssUsage.topLevelDependencies)
      setOrgDepCount(orgOssUsage.totalDependencies)
    } catch (e) {
      setTopLevelPackages('N/A')
      setOrgDepCount('N/A')
    } finally {
      setTopLevelPackagesLoading(false)
      setOrgDepCountLoading(false)
    }

    try {
      const donationInfoRes = await fetchDonationInfo({ orgId })
      if (donationInfoRes && donationInfoRes.success) {
        setDonation(donationInfoRes.donationInfo.amount / 100)
        setTotalContributionsAmount(donationInfoRes.donationInfo.totalDonated / 100)
      }
    } catch (e) {
      setDonation(0)
    } finally {
      setTotalContributionsAmountLoading(false)
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
        gridTemplateRows={{ lg: '15rem auto' }}
      >
        <Box gridRow='1' gridColumn='1 / span 4'>
          <Box padding={['0','0 3rem 0 3rem']}>
            <Text>Flossbank does x to try and accomplish y, thanks for using Flossbank, and if you're looking to sign
              up another organization, click here.
            </Text>
          </Box>
        </Box>
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
                  refreshDashboard={refreshDashboard}
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
