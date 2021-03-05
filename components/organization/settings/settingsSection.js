import { useEffect, useState } from 'react'
import { CircularProgress } from '@chakra-ui/core'

import Section from '../../common/section'
import UnderlinedHeading from '../../common/underlinedHeading'

import BillingInformationSection from './billingInformationSection'
import DescriptionSection from './descriptionSection'
import PublicallyGiveSection from './publicallyGiveSection'
import { getOrganization } from '../../../client'

import { useLocalStorage } from '../../../utils/useLocalStorage'
import { localStorageOrgKey } from '../../../utils/constants'

const OrgSettingsSection = () => {
  const [orgLoading, setOrgLoading] = useState(true)
  const [org, setOrg] = useState(undefined)

  const [currentOrgId, _] = useLocalStorage(localStorageOrgKey, '') // eslint-disable-line  

  async function fetchOrg () {
    try {
      const res = await getOrganization({ orgId: currentOrgId })
      setOrg({
        id: currentOrgId,
        ...res.organization
      })
    } catch (e) {} finally {
      setOrgLoading(false)
    }
  }

  useEffect(() => {
    fetchOrg()
  }, [])

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
        text='Settings'
        align='center'
        marginBottom='3rem'
      />
      {orgLoading && <CircularProgress isIndeterminate color='ocean' />}
      {!orgLoading && org && <PublicallyGiveSection org={org} />}
      {!orgLoading && org && <DescriptionSection org={org} />}
      {/** Only show billing info section if billing info returned from API */}
      {!orgLoading && org && <BillingInformationSection org={org} />}
    </Section>
  )
}

export default OrgSettingsSection
