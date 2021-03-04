import { useState, useRef } from 'react'

import {
  Text,
  Button,
  Box,
  Input,
  Modal,
  ModalOverlay,
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/core'

import Divider from '../../common/divider'
import StripeWrapper from '../../common/stripe/stripeWrapper'
import UpdateBilling from './updateBilling'
import SettingsCard from './settingsCard'
import UnderlinedHeading from '../../common/underlinedHeading'
import { updateOrgEmail } from '../../../client/index'

const BillingInfo = ({ last4CardDigits }) => (
  <Box as='dl' display='flex'>
    <Box as='dt' fontWeight='500' marginRight='1rem'>
      Credit Card Number:
    </Box>
    <Box as='dd'>
      <span aria-hidden='true'>{'•••• '.repeat(3)} </span>
      {last4CardDigits}
    </Box>
  </Box>
)

const BillingInformationSection = ({ org }) => {
  const [last4CardDigits, setLast4CardDigits] = useState(
    org && org.billingInfo.last4
  )
  const [e, setE] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const finalRef = useRef()

  const handleUpdateBillingInfo = (billingInfo) => {
    setLast4CardDigits(billingInfo.last4)
  }

  const updateBillingEmail = async () => {
    if (!e) return
    try {
      await updateOrgEmail({
        organizationId: org.id.toString(),
        billingEmail: e
      })
      setSuccessMessage('Billing email updated successfully')
    } catch (e) {
      setErrorMessage(e.message)
    }
  }

  const updateEmail = (e) => {
    setE(e.target.value)
  }

  return (
    <>
      <SettingsCard headingText='Billing Information'>
        <Box marginBottom='1.5rem'>
          {!last4CardDigits && (
            <>
              <Text marginBottom='1.5rem'>
                <strong>
                  You currently have no billing information on file.
                </strong>
              </Text>
              <Text>
                Adding billing information will allow you to donate to the Open
                Source packages you use most.
              </Text>
            </>
          )}
          {last4CardDigits && <BillingInfo last4CardDigits={last4CardDigits} />}
        </Box>
        <Button
          backgroundColor='puddle'
          color='ocean'
          className='u-box-shadow'
          borderRadius='5px'
          padding='1rem'
          height='auto'
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
          ref={finalRef}
          onClick={onOpen}
        >
          {last4CardDigits
            ? 'Update billing information'
            : 'Add billing information'}
        </Button>
        <Divider />
        <Text>Your organization's billing email is where receipts will be sent</Text>
        <Box marginBottom='1.5rem' marginTop='1.5rem'>
          <Input
            placeholder={org.email || 'Billing email'}
            border='1px solid black'
            onChange={updateEmail}
          />
        </Box>
        <Button
          backgroundColor='puddle'
          color='ocean'
          className='u-box-shadow'
          borderRadius='5px'
          padding='1rem'
          height='auto'
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
          onClick={updateBillingEmail}
        >
          {org.email
            ? 'Update billing email'
            : 'Add billing email'}
        </Button>
        {successMessage && (
          <Alert status='success' margin='2rem' borderRadius='1rem'>
            <AlertIcon />
            <AlertTitle mr={2}>{successMessage}</AlertTitle>
            <CloseButton position='absolute' right='8px' top='8px' onClick={() => setSuccessMessage('')} />
          </Alert>
        )}
        {errorMessage && (
          <Alert status='error' margin='2rem' borderRadius='1rem'>
            <AlertIcon />
            <AlertTitle mr={2}>{errorMessage}</AlertTitle>
            <CloseButton position='absolute' right='8px' top='8px' onClick={() => setErrorMessage('')} />
          </Alert>
        )}
      </SettingsCard>

      <Modal
        isOpen={isOpen}
        size='xl'
        closeOnOverlayClick={false}
        onClose={onClose}
      >
        <ModalOverlay backgroundColor='rgba(0, 0, 0, .75)' />
        <ModalContent backgroundColor='white' padding='2rem'>
          <ModalHeader>
            <UnderlinedHeading
              text='Updating Billing Information'
              align='left'
              marginBottom='0'
            />
          </ModalHeader>
          <ModalCloseButton />
          <StripeWrapper>
            <UpdateBilling
              onClose={onClose}
              UpdateBilling={handleUpdateBillingInfo}
            />
          </StripeWrapper>
        </ModalContent>
      </Modal>
    </>
  )
}
export default BillingInformationSection
