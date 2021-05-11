import React, { useEffect, useState } from 'react'
import {
  Box,
  Alert,
  AlertIcon,
  Text,
  CircularProgress
} from '@chakra-ui/core'
import PaginationList from 'react-pagination-list'
import { useRouter } from 'next/router'

import Section from '../common/section'
import UnderlinedHeading from '../common/underlinedHeading'
import { getOrgDonationLedger } from '../../client'

import { useAuth } from '../../utils/useAuth'
import TextLink from '../common/textLink'

const OrgSettingsSection = () => {
  const router = useRouter()
  const { getOrg } = useAuth()
  // const [localOrg, setLocalOrg] = useState()
  const [ledgerLoading, setLedgerLoading] = useState(true)
  const [ledger, setLedger] = useState(undefined)

  function getOrgNamePossessive () {
    // try {
    // if (localOrg) return `${localOrg.name}'s`
    return ''
    // } catch (e) {
    //   console.error(e)
    //   return ''
    // }
  }

  async function fetchLedger () {
    if (!router.query || !router.query.organizationId) return
    try {
      const { organization } = await getOrg({ orgId: router.query.organizationId })
      // setLocalOrg(organization)
      const res = await getOrgDonationLedger({ orgId: organization.id })
      setLedger(res.ledger)
    } catch (e) {
    } finally {
      setLedgerLoading(false)
    }
  }

  useEffect(() => {
    fetchLedger()
  }, [router.query])

  return (
    <Section
      display='flex'
      justifyItems='center'
      flexDirection='column'
      alignItems='center'
      minHeight='90vh'
      padding={{ base: '3rem 1.5rem', lg: '4rem 7.5rem' }}
      backgroundColor='lightRock'
    >
      <UnderlinedHeading
        as='h1'
        text={`${getOrgNamePossessive()} Donation Ledger`}
        align='center'
        marginBottom='3rem'
      />
      {ledgerLoading && <CircularProgress isIndeterminate color='ocean' />}
      {!ledgerLoading && !ledger && (
        <Alert
          status='info'
          backgroundColor='puddle'
          color='ocean'
          fontWeight='500'
          marginBottom='1.5rem'
        >
          <AlertIcon color='ocean' />
          <Text>It looks like we don't currently have a donation ledger for this organization. Please check back at a later time.</Text>
        </Alert>
      )}
      {!ledgerLoading && ledger && (
        <Box width='100%' padding='0 10% 0 10%' margin='auto'>
          <PaginationList
            data={ledger.sort((a, b) => b.totalPaid - a.totalPaid)}
            pageSize={20}
            renderItem={(item, key) => (
              <React.Fragment key={key}>
                <TextLink text={`${item.registry.toUpperCase()} ${item.name}: $${(item.totalPaid / 100000).toFixed(2)}`} external href={`https://maintainer.flossbank.com/package/${item.id}`} />
                <Box
                  as='hr'
                  borderColor='white'
                  margin='0.5rem'
                />
              </React.Fragment>
            )}
          />
        </Box>
      )}
    </Section>
  )
}

export default OrgSettingsSection
