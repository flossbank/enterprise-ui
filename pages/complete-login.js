import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Heading, Text, Icon } from '@chakra-ui/core'

import { useLocalStorage } from '../utils/useLocalStorage'
import PageWrapper from '../components/common/pageWrapper'
import Section from '../components/common/section'
import BouncyLoader from '../components/common/bouncyLoader'

import { gitHubListOrgs } from '../client/index'
import { localStorageGHStateKey } from '../utils/constants'
import { useAuth } from '../utils/useAuth'

const CompleteLoginPage = () => {
  const router = useRouter()
  const auth = useAuth()
  const [status, setStatus] = useState('Verifying…')
  const [isLoading, setIsLoading] = useState(false)
  const [verified, setVerified] = useState(false)
  const [subHeader, setSubHeader] = useState('')
  const [loginAttempted, setLoginAttempted] = useState(false)
  const [ghState, _] = useLocalStorage(localStorageGHStateKey, '') // eslint-disable-line

  function showError () {
    setIsLoading(false)
    setStatus('Authentication Failed')
    setSubHeader(`It looks like our GitHub communication was lost in translation.`)
  }

  async function redirectUser ({ orgs }) {
    if (orgs.length === 1) {
      // If only one org was auth'd, auto redirect them to that org
      router.push(`/organization/${orgs[0].id}`)
    } else {
      // TODO: If more than one org is auth'd for flossbank, show picker popup
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
      let orgs = []
      if (state === ghState) {
        await auth.completeGHLogin({ code, state })
        const { organizations } = await gitHubListOrgs()
        orgs = organizations
      } else {
        showError()
        return
      }

      setTimeout(() => {
        setStatus('Authenticating…')
        setVerified(true)
        setIsLoading(false)
      }, 1000)
      
      setTimeout(() => {
        redirectUser({ orgs })
      }, 2000)
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
        {verified && (
          <Icon
            name='check'
            size='4rem'
            color='puddle'
            backgroundColor='lake'
            borderRadius='50%'
            padding='1rem'
          />
        )}
        {subHeader && <Text>{subHeader}</Text>}
      </Section>
    </PageWrapper>
  )
}

export default CompleteLoginPage
