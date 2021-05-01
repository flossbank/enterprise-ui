import React, { useState, useContext, createContext } from 'react'
import { useRouter } from 'next/router'
import { useLocalStorage } from './useLocalStorage'
import * as api from '../client/index'

import { Flex, Text } from '@chakra-ui/core'

import BouncyLoader from '../components/common/bouncyLoader'

const authContext = createContext()

const Loader = () => (
  <Flex
    as='section'
    height='100vh'
    bg='rgba(255, 255, 255, .15)'
    color='boulder'
    direction='column'
    justify='center'
    align='center'
    aria-busy='true'
  >
    <Text fontSize='1.25rem' fontWeight='500' marginBottom='3rem'>
      Loading…
    </Text>
    <BouncyLoader />
  </Flex>
)

// Provider component that wraps your app and makes auth available
export function ProvideAuth ({ children }) {
  const router = useRouter()
  const [rcCaptured, setRcCaptured] = useState(false)
  const auth = useProvideAuth()
  const [isUserAuthed, setIsUserAuthed] = useLocalStorage('flossbank_auth', false)
  const [_, setUserReferrer] = useLocalStorage('flossbank_rc', '') // eslint-disable-line

  if (router.query.rc && !rcCaptured) {
    setRcCaptured(true)
    setUserReferrer(router.query.rc)
    router.replace(router.route)
  }

  // 1. user has no session in React state
  // 2. user has auth flag in local storage
  // Assumption: they have a valid API cookie, but React doesn't know about it (e.g. they refreshed the page)
  // Result: we will resume their session and update React session state
  if (isUserAuthed && !auth.user) {
    auth.resume().catch((_) => {
      setIsUserAuthed(false)
    })
    return <Loader />
  }

  // User is either completely authed OR accessing a page that requires no authentication
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

// Hook for child components to get the auth object and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext)
}

// Provider hook that creates auth object and handles state
function useProvideAuth () {
  const [user, setUser] = useState(null)
  const [_, setAuthedFlag] = useLocalStorage('flossbank_auth', false) // eslint-disable-line
  const [org, setOrg] = useState(null)
  const [isUserOrgAdmin, setIsUserOrgAdmin] = useState(false)

  const setSessionUser = (u) => {
    setUser(u || null)
    setAuthedFlag(!!u)
  }

  const setSessionOrg = (o) => {
    setOrg(o || null)
  }

  const getOrg = async ({ orgId, force }) => {
    const { organization } = await api.getOrganization({ orgId })
    // If requested org has same ID as cached org, return cached isOrgAdmin check
    if (org && !force && orgId === org.id) {
      setSessionOrg(organization)
      return {
        organization,
        isOrgAdmin: isUserOrgAdmin
      }
    }
    let isAdmin = false
    // Throw this into a try catch because if the user is unauthed, this will 401, but
    // we still want to return successfully with the org we retrieved even if this call
    // 401's
    try {
      const { isOrgAdmin } = await api.isUserAllowedToViewOrgSettings({ orgId })
      isAdmin = isOrgAdmin
    } catch (e) {}
    // If the user is an admin of the org, persist this org
    if (isAdmin) {
      setIsUserOrgAdmin(true)
      setSessionOrg(organization)
    }
    return {
      organization,
      isOrgAdmin: isAdmin
    }
  }

  const completeGHLogin = async ({ state, code }) => {
    const res = await api.completeGHLogin({ state, code })
    setSessionUser(res.success && res.user)
    return res
  }

  const logout = async () => {
    await api.logout()
    setSessionUser(undefined)
  }

  const resume = async () => {
    const res = await api.resume()
    setSessionUser(res.success && res.user)
  }

  return {
    resume,
    getOrg,
    completeGHLogin,
    logout,
    user,
    org,
    isOrgAdmin: isUserOrgAdmin
  }
}
