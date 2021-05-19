import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import PropTypes from 'prop-types'

import {
  useTheme,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react'
import {
  ChevronDownIcon, ChevronUpIcon, InfoIcon, QuestionIcon, SearchIcon, SettingsIcon, UnlockIcon
} from '@chakra-ui/icons'

import Icons from '../../../public/icons'
import { useAuth } from '../../../utils/useAuth'

const AuthNav = ({ user, onLogout }) => {
  const router = useRouter()
  const { org: currentOrg } = useAuth()

  const [isExpanded, setIsExpanded] = useState(false)
  const { colors } = useTheme()

  const menuButtonActiveStyles = {
    backgroundColor: 'lightPuddle',
    boxShadow: `0 0 0 10px ${colors.lightPuddle}`
  }

  const itemFocusStyles = {
    color: 'lightPuddle',
    backgroundColor: 'ocean',
    outline: 'none !important'
  }

  const itemActiveStyles = {
    color: 'ocean',
    backgroundColor: 'lightPuddle'
  }

  const handleNav = (dest) => router.push(dest)

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          {!isOpen && setIsExpanded(false)}
          <MenuButton
            as={Button}
            height='auto'
            aria-label='User menu'
            borderRadius='0'
            _hover={menuButtonActiveStyles}
            _expanded={menuButtonActiveStyles}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Box
              as='span'
              display={{ base: 'none', sm: 'initial' }}
              fontWeight='500'
              marginRight='1rem'
            >
              {user.email}
            </Box>
            <Box
              as='span'
              display='inline-flex'
              width='3rem'
              height='3rem'
              alignItems='center'
              justifyContent='center'
              borderRadius='50%'
              fontWeight='400'
              backgroundColor='rock'
              color='white'
              fontSize='1.25rem'
              textTransform='uppercase'
            >
              {user.email.charAt(0)}
            </Box>
            {isExpanded
              ? (
                <ChevronUpIcon
                  marginLeft='.5rem'
                  size='1.5rem'
                />
                )
              : (
                <ChevronDownIcon
                  marginLeft='.5rem'
                  size='1.5rem'
                />
                )}
          </MenuButton>
          <MenuList backgroundColor='lightRock'>
            {currentOrg && (
              <>
                <MenuItem
                  _focus={itemFocusStyles}
                  _active={itemActiveStyles}
                  onClick={() => handleNav(`/organization/${currentOrg.id}`)}
                >
                  <Link href={`/organization/${currentOrg.id}`}>
                    <a>
                      <Box as='span' display='flex' alignItems='center'>
                        <Icons.Home marginRight='.5rem' />
                        <span>{currentOrg.name} Dashboard</span>
                      </Box>
                    </a>
                  </Link>
                </MenuItem>
                <MenuItem
                  _focus={itemFocusStyles}
                  _active={itemActiveStyles}
                  onClick={() => handleNav(`/organization/${currentOrg.id}/settings`)}
                >
                  <Link href={`/organization/${currentOrg.id}/settings`}>
                    <a>
                      <Box as='span' display='flex' alignItems='center'>
                        <SettingsIcon marginRight='.5rem' />
                        <span>{currentOrg.name} Settings</span>
                      </Box>
                    </a>
                  </Link>
                </MenuItem>
              </>
            )}
            <MenuItem
              _focus={itemFocusStyles}
              _active={itemActiveStyles}
              onClick={() => handleNav('/find-organization')}
            >
              <Link href='/find-organization'>
                <a>
                  <Box as='span' display='flex' alignItems='center'>
                    <SearchIcon marginRight='.5rem' />
                    <span>Search organizations</span>
                  </Box>
                </a>
              </Link>
            </MenuItem>
            <MenuItem
              _focus={itemFocusStyles}
              _active={itemActiveStyles}
              onClick={() => handleNav('/faq')}
            >
              <Link href='/faq'>
                <a>
                  <Box as='span' display='flex' alignItems='center'>
                    <QuestionIcon marginRight='.5rem' />
                    <span>FAQ</span>
                  </Box>
                </a>
              </Link>
            </MenuItem>
            <MenuItem
              _focus={itemFocusStyles}
              _active={itemActiveStyles}
              onClick={() => handleNav('/how-it-works')}
            >
              <Link href='/how-it-works'>
                <a>
                  <Box as='span' display='flex' alignItems='center'>
                    <InfoIcon marginRight='.5rem' />
                    <span>How it works</span>
                  </Box>
                </a>
              </Link>
            </MenuItem>
            <MenuItem
              _focus={itemFocusStyles}
              _active={itemActiveStyles}
              onClick={onLogout}
            >
              <Link href='/'>
                <a>
                  <Box as='span' display='flex' alignItems='center'>
                    <UnlockIcon marginRight='.5rem' />
                    <span>Log out</span>
                  </Box>
                </a>
              </Link>
            </MenuItem>
          </MenuList>
        </>
      )}
    </Menu>
  )
}

AuthNav.propTypes = {
  user: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired
}

export default AuthNav
