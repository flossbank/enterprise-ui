import React, { useEffect, useRef, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import BackButton from '../common/backButton'
import Section from '../common/section'
import UnderlinedHeading from '../common/underlinedHeading'
import PaginatedTable from './PaginatedTable'
import { getOrgDonationLedger } from '../../client'

import { useAuth } from '../../utils/useAuth'
import TextLink from '../common/textLink'

const ledgerColumns = [
  {
    displayName: 'Registry',
    fieldName: 'registry'
  },
  {
    displayName: 'Name',
    fieldName: 'name'
  },
  {
    displayName: 'Total Donated',
    fieldName: 'totalPaid',
    isNumeric: true
  }
]

const OrgDonationLedger = () => {
  const router = useRouter()
  const { getOrg } = useAuth()
  const [localOrg, setLocalOrg] = useState({})
  const topOfLedger = useRef(null)

  const getOrgNamePossessive = () => localOrg.name ? `${localOrg.name}'s` : ''

  const handlePageChange = () => {
    topOfLedger.current?.scrollIntoView()
  }

  async function fetchLedger ({ limit, offset }) {
    const orgId = localOrg.id || router?.query?.organizationId
    if (!orgId) return

    try {
      const res = await getOrgDonationLedger({ orgId, limit, offset })

      if (!res || !res.ledger) return

      return {
        rows: res.ledger
          .map(({ name, registry, totalPaid, id }) => ({
            id,
            name: (
              <TextLink text={name} external href={`https://maintainer.flossbank.com/package/${id}`} />
            ),
            registry: registry.toUpperCase(),
            totalPaid: `$${(totalPaid / 100000).toFixed(2)}`
          }))
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function fetchLedgerSize () {
    const orgId = localOrg.id || router?.query?.organizationId
    if (!orgId) return

    const res = await getOrgDonationLedger({ orgId, sizeRequest: true })

    return res && res.ledgerSize
  }

  useEffect(() => {
    (async () => {
      if (!router.query || !router.query.organizationId) return

      const { organization } = await getOrg({ orgId: router.query.organizationId, noAuth: true })
      setLocalOrg(organization)
    })()
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
      <BackButton destination={`/organization/${localOrg?.id}`} />
      <Box ref={topOfLedger}>
        <UnderlinedHeading
          as='h1'
          text={`${getOrgNamePossessive()} Donation Ledger`}
          align='center'
          marginBottom='3rem'
        />
      </Box>
      {router?.query?.organizationId &&
        <Box width='100%' padding='0 10% 0 10%' margin='auto'>
          <PaginatedTable
            getData={fetchLedger}
            getRowCount={fetchLedgerSize}
            columns={ledgerColumns}
            pageSize={20}
            onPageChange={handlePageChange}
            errorText="It looks like we don't currently have a donation ledger for this organization. Please check back at a later time."
          />
        </Box>}
    </Section>
  )
}

export default OrgDonationLedger
