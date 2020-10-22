import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Heading, Text, Icon } from '@chakra-ui/core'

import { useLocalStorage } from '../utils/useLocalStorage'
import PageWrapper from '../components/common/pageWrapper'
import Section from '../components/common/section'
import ChooseOrgModal from '../components/completeLogin/chooseOrgModal'
import BouncyLoader from '../components/common/bouncyLoader'

import { localStorageGHStateKey } from '../utils/constants'
import { useAuth } from '../utils/useAuth'

const CompleteLoginPage = () => {
  const router = useRouter()
  const auth = useAuth()
  const [status, setStatus] = useState('Verifying…')
  const [orgs, setOrgs] = useState([])
  const [showChooseModal, setShowChooseModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [subHeader, setSubHeader] = useState('')
  const [loginAttempted, setLoginAttempted] = useState(false)
  const [ghState, _] = useLocalStorage(localStorageGHStateKey, '') // eslint-disable-line

  function showError () {
    setIsLoading(false)
    setStatus('Authentication Failed')
    setSubHeader(`It looks like our GitHub communication was lost in translation.`)
  }

  async function redirectUser ({ organizations }) {
    setOrgs(organizations)
    if (organizations.length >= 1) {
      setShowChooseModal(true)
    } else {
      window.location.href = 'https://github.com/apps/flossbank/installations/new'
    }
  } 

  async function attemptCompleteLogin () {
    setIsLoading(true)
    try {
      const { code, state } = router.query

      if (!code || !state) return

      if (loginAttempted) {
        showError()
        return
      }

      setLoginAttempted(true)

      // If code and state are passed in, then it as a GH auth redirect
      // Before processing GH redirect, we need to make sure the state we passed in
      // is the state returned
      if (state === ghState) {
        const { organizations } = await auth.completeGHLogin({ code, state })
        redirectUser({ organizations })
      } else {
        showError()
        return
      }
      setIsLoading(false)
      setVerified(true)
    } catch (e) {
      showError()
      setIsLoading(false)
    }
  }

  useEffect(() => {
    attemptCompleteLogin()
  }, [router.query]) // only run on mount

  return (
    <PageWrapper title='Log In'>
      <Section
        backgroundColor='lightRock'
        minHeight='85vh'
        display='flex'
        alignItems='center'
        justifyContent='center'
        flex='1'
        flexDirection='column'
        paddingBottom={{ lg: '6rem !important' }}
        aria-live='polite'
        aria-atomic='true'
        aria-busy={isLoading}
      >
        <Heading marginBottom='3rem' color='boulder' fontWeight='400'>
          {status}
        </Heading>
        {isLoading && <BouncyLoader />}
        {subHeader && <Text>{subHeader}</Text>}
        {showChooseModal && orgs.length && <ChooseOrgModal orgs={orgs} />}
      </Section>
    </PageWrapper>
  )
}

export default CompleteLoginPage
