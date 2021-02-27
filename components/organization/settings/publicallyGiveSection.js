import {
  Text,
  Flex,
  Box,
  Checkbox,
  useToast
} from '@chakra-ui/core'

import SettingsCard from './settingsCard'
import { updatePublicallyGive } from '../../../client/index'

const PublicallyGiveSection = ({ org }) => {
  const toast = useToast()

  const updateOrgPublicallyGive = async (e) => {
    const publicallyGive = e.target.checked
    try {
      await updatePublicallyGive({ organizationId: org.id, publicallyGive })
      toast({
        title: 'Success',
        description: 'Organization publically giving updated.',
        status: 'success',
        duration: 4000,
        isClosable: true
      })
    } catch (e) {
      toast({
        title: 'Uh oh.',
        description: 'Organization failed to update. Please contact us.',
        status: 'error',
        duration: 4000,
        isClosable: true
      })
    }
  }

  return (
    <>
      <SettingsCard headingText='Publically give'>
        <Box>
          <Text>
            Publically giving allows packages receiving donations from you to see your organization
            as the originator, increasing your brand awareness across the Open Source ecosystem.
          </Text>
          <Flex flexDirection='row' marginTop='1rem'>
            <Checkbox marginRight='1rem' value={org.publicallyGive} onChange={updateOrgPublicallyGive} />
            <Text>Show our logo on package pages that we give to</Text>
          </Flex>
        </Box>
      </SettingsCard>
    </>
  )
}
export default PublicallyGiveSection
