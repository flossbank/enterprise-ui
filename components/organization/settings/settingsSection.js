import { useEffect, useState } from 'react'
import { CircularProgress } from '@chakra-ui/core'

import Section from '../../common/section'
import UnderlinedHeading from '../../common/underlinedHeading'

import BillingInformationSection from './billingInformationSection'
import { getOrganization } from '../../../client'

import { useLocalStorage } from '../../../utils/useLocalStorage'
import { localStorageOrgKey } from '../../../utils/constants'

const OrgSettingsSection = () => {
  let [orgLoading, setOrgLoading] = useState(true)
  let [org, setOrg] = useState(undefined)

  const [currentOrgId, _] = useLocalStorage(localStorageOrgKey, '') // eslint-disable-line  

  async function fetchOrg() {
    const o = await getOrganization({ orgId: currentOrgId })
    setOrg(o)
    setOrgLoading(false)
  }

  useEffect(() => {
    fetchOrg()
  }, [])
  return (
    <Section
      display='flex'
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
      {org && <BillingInformationSection org={org} />}
    </Section>
  )
}

export default OrgSettingsSection
