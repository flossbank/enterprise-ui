import { useEffect, useState } from 'react'
import { CircularProgress, Text } from '@chakra-ui/core'
import { useRouter } from 'next/router'

import Section from '../../common/section'
import Card from '../../common/card'
import UnderlinedHeading from '../../common/underlinedHeading'

import BillingInformationSection from './billingInformationSection'
import DescriptionSection from './descriptionSection'
import PublicallyGiveSection from './publicallyGiveSection'

import { useAuth } from '../../../utils/useAuth'

const OrgSettingsSection = () => {
  const [orgLoading, setOrgLoading] = useState(true)
  const [allowedToView, setAllowedToView] = useState(true)
  const { org: currentOrg, getOrg } = useAuth()
  const router = useRouter()

  async function fetchOrg () {
    if (!router.query || !router.query.organizationId) return
    const orgId = router.query.organizationId
    try {
      const { isOrgAdmin } = await getOrg({ orgId })
      if (!isOrgAdmin) {
        setAllowedToView(false)
      }
    } catch (e) {
      if (e.status === 401) {
        setAllowedToView(false)
      }
    } finally {
      setOrgLoading(false)
    }
  }

  useEffect(() => {
    fetchOrg()
  }, [])

  function getTitle () {
    if (currentOrg) {
      return `${currentOrg.name} Settings`
    }
    return 'Settings'
  }

  return (
    <Section
      display='flex'
      minHeight='90vh'
      justifyItems='center'
      flexDirection='column'
      alignItems='center'
      padding={{ base: '3rem 1.5rem', lg: '4rem 7.5rem' }}
      backgroundColor='lightRock'
    >
      <UnderlinedHeading
        as='h1'
        text={getTitle()}
        align='center'
        marginBottom='3rem'
      />
      {orgLoading && <CircularProgress isIndeterminate color='ocean' />}
      {!orgLoading && !allowedToView && (
        <Card shadowSz='lg' w='100%' maxW='50rem' marginBottom='3rem'>
          <Text>You don't have permissions to view this organizations settings</Text>
        </Card>
      )}
      {!orgLoading && allowedToView && currentOrg && <PublicallyGiveSection org={currentOrg} />}
      {!orgLoading && allowedToView && currentOrg && <DescriptionSection org={currentOrg} />}
      {/** Only show billing info section if billing info returned from API */}
      {!orgLoading && allowedToView && currentOrg && <BillingInformationSection org={currentOrg} />}
    </Section>
  )
}

export default OrgSettingsSection
