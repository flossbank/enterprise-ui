import { useState } from 'react'

import {
  Text,
  Button,
  Box,
  Textarea,
  Alert,
  AlertIcon,
  CloseButton,
  AlertTitle,
  useToast
} from '@chakra-ui/react'

import SettingsCard from './settingsCard'
import { updateDescription as updateOrgDescription } from '../../../client/index'

const DescriptionSection = ({ org }) => {
  const [oldDesc, setOldDesc] = useState(org.description)
  const [descUpdating, setDescUpdating] = useState(false)
  const [desc, setDesc] = useState(org.description)
  const [error, setError] = useState('')
  const toast = useToast()

  const updateDescriptionApi = async () => {
    if (!desc) return
    if (desc.length > 1024) {
      setError('Maximum description length is 1024 characters')
      return
    }
    setDescUpdating(true)
    try {
      await updateOrgDescription({ organizationId: org.id, description: desc })
      setOldDesc(desc)
      toast({
        title: 'Success',
        description: 'Organization description updated.',
        status: 'success',
        duration: 4000,
        isClosable: true
      })
    } catch (e) {
      setDesc(oldDesc)
      toast({
        title: 'Uh oh.',
        description: 'Organization failed to update, you may not have permissions to do so. Please contact us.',
        status: 'error',
        duration: 4000,
        isClosable: true
      })
    } finally {
      setDescUpdating(false)
    }
  }

  const updateDescription = (e) => {
    setError('')
    setDesc(e.target.value)
  }

  return (
    <>
      <SettingsCard headingText='Organization description'>
        <Text>
          Your organization's description helps visitors learn about your organization as
          well as any info regarding recruiting or other information you'd like to share.
        </Text>
        <Box marginBottom='1.5rem' marginTop='1.5rem'>
          <Textarea
            placeholder={org.description || 'Organization description'}
            value={desc}
            border='1px solid black'
            onChange={updateDescription}
          />
        </Box>
        {error && (
          <Alert status='error' margin='2rem' borderRadius='1rem'>
            <AlertIcon />
            <AlertTitle mr={2}>{error}</AlertTitle>
            <CloseButton position='absolute' right='8px' top='8px' onClick={() => setError('')} />
          </Alert>
        )}
        <Button
          backgroundColor='puddle'
          color='ocean'
          className='u-box-shadow'
          borderRadius='5px'
          padding='1rem'
          height='auto'
          isLoading={descUpdating}
          lineHeight='1.2'
          transition='all 300ms ease-in-out'
          _hover={{
            backgroundColor: 'ocean',
            color: 'white',
            transform: 'translateY(3px)'
          }}
          _active={{
            backgroundColor: 'ocean',
            color: 'white'
          }}
          onClick={updateDescriptionApi}
        >
          {org.description
            ? 'Update description'
            : 'Add description'}
        </Button>
      </SettingsCard>
    </>
  )
}
export default DescriptionSection
