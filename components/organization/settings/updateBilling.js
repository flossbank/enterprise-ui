import { useState } from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'

import {
  Box,
  ModalBody,
  ModalFooter,
  useToast
} from '@chakra-ui/react'

import {
  CheckIcon
} from '@chakra-ui/icons'

import BillingForm from '../../dashboard/billingForm'
import FBButton from '../../common/fbButton'
import ErrorMessage from '../../common/errorMessage'
import { updateOrgBillingInfo } from '../../../client'
import Icons from '../../../public/icons'

const UpdateBilling = ({ updateBillingInfo, onClose, org }) => {
  const [submitLoading, setSubmitLoading] = useState(false)
  const stripe = useStripe()
  const elements = useElements()
  const toast = useToast()
  const [cardError, setCardError] = useState('')
  const [submitError, setSubmitError] = useState(""); // eslint-disable-line

  const handleSaveBilling = async () => {
    setSubmitLoading(true)

    let token

    try {
      const cardElement = elements.getElement(CardElement)
      const res = await stripe.createToken(cardElement)
      token = res.token
    } catch (e) {
      setSubmitError(e.message)
      setSubmitLoading(false)
      return
    }

    if (!token) {
      setCardError('Invalid credit card information')
      setSubmitLoading(false)
    }

    try {
      await updateOrgBillingInfo({ organizationId: org.id, billingToken: token.id })
      toast({
        title: 'Success',
        description: 'Organization billing info updated.',
        status: 'success',
        duration: 4000,
        isClosable: true
      })
      updateBillingInfo(token.card.last4)
      onClose()
    } catch (e) {
      setCardError(e.message)
      toast({
        title: 'Uh oh.',
        description: 'Organization failed to update, you may not have permissions to do so. Please try again or contact us.',
        status: 'error',
        duration: 4000,
        isClosable: true
      })
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <>
      <ModalBody>
        <BillingForm />
      </ModalBody>
      {cardError && <ErrorMessage msg={cardError} marginTop='1rem' />}
      <ModalFooter display='flex' justifyContent='space-evenly'>
        <FBButton
          onClick={onClose}
          className='u-box-shadow'
          backgroundColor='lightRock'
          color='ocean'
          fontWeight='600'
        >
          <Box as='span' display='flex' alignItems='center'>
            <Icons.Close fontSize='1rem' marginRight='1rem' />
            Cancel
          </Box>
        </FBButton>
        <FBButton
          onClick={handleSaveBilling}
          isLoading={submitLoading}
          loadingText='Saving billing information…'
          className='u-box-shadow'
          fontWeight='600'
        >
          <Box as='span' display='flex' alignItems='center'>
            <CheckIcon fontSize='1rem' marginRight='1rem' />
            Save billing information
          </Box>
        </FBButton>
      </ModalFooter>
    </>
  )
}

export default UpdateBilling
