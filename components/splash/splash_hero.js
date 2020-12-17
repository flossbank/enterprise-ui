import { Box, Text, Flex } from '@chakra-ui/core'

import SplashSVG from '../../public/images/splash/splash_svg.svg'
import LinkBtn from '../common/linkBtn'
import UnderlinedHeading from '../common/underlinedHeading'
import Subheading from '../common/subheading'

const SplashHero = () => (
  <Flex 
    as='section' 
    flexDirection='row' 
    padding={['3rem 3rem', '5rem 8rem 0rem 8rem']} 
    justifyContent='center'
    backgroundColor='lightRock'
  >
    <Flex flexDirection='column' width={['100%', '30rem']} paddingTop={['0', '8rem']}>
      <UnderlinedHeading text='Enterprise' />
      <Subheading>
        Support what sustains you
      </Subheading>
      <Text
        id='hero_header'
        textAlign='center'
        fontSize='1.25rem'
        lineHeight='normal'
        textAlign='left'
        marginBottom={{ base: '1.5rem', md: '.5rem' }}
      >
        Directly impact your business by supporting the Open Source authors and maintainers serving as the backbone of your code base.  
      </Text>
      <LinkBtn
        href='/signup'
        className='u-box-shadow'
        backgroundColor='ocean'
        color='white'
        minW={{ base: 'unset', sm: '10rem' }}
        maxWidth={['unset', '10rem']}
        margin={{ base: '1rem 0 1.5rem 0', sm: '1rem 1.5rem 0 0 ' }}
      >
        Get Started
      </LinkBtn>
    </Flex>
    <Box display={['none', 'none', 'none', 'inline']} maxWidth='90%'>
      <SplashSVG />
    </Box>
  </Flex>
)

export default SplashHero
