import { Flex, Text, Image } from '@chakra-ui/core'
import UnderlinedHeading from '../common/underlinedHeading'
import Subheading from '../common/subheading'
import LinkBtn from '../common/linkBtn'

const Badge = ({ badgeImageSrc, title, amount}) => (
  <Flex flexDirection='row' color='ocean' margin='1rem'>
    <Image src={badgeImageSrc} size='10rem' objectFit='contain'/>
    <Flex justifyContent='center' 
          flexDirection='column'
          width='10rem'
          marginLeft='2rem'>
      <Text textTransform='uppercase'>{title}</Text>
      <Text>{amount}</Text>
    </Flex>
  </Flex>
)

const BadgeRow = ({ children }) => (
  <Flex flexDirection='row' justifyContent='space-around'>
    {children}
  </Flex>
)

const SplashBadges = () => (
  <Flex
    as='section'
    height='40rem'
    flexDirection='row'
    padding={['3rem', '7rem']}
  >
    <Flex flexDirection='column' flex={1} display={{ base: 'none', lg: 'inline' }}>
      <BadgeRow>
        <Badge badgeImageSrc='/images/badges/platinum.svg'
               title='Platinum'
               amount='$10,000' />
        <Badge badgeImageSrc='/images/badges/gold.svg'
               title='Gold'
               amount='$5,000' />
      </BadgeRow>
      <BadgeRow>
        <Badge badgeImageSrc='/images/badges/silver.svg'
               title='Silver'
               amount='$1,000' />
        <Badge badgeImageSrc='/images/badges/bronze.svg'
               title='Bronze'
               amount='$500' />
      </BadgeRow>
    </Flex>

    <Flex flexDirection='column' flex={1}>
      <UnderlinedHeading text='Flossbank badges' />
      <Subheading>Display your dedication</Subheading>
      <Text marginBottom='1rem'>
        Flossbank badges are the perfect way to show your continued support of open source authors and maintainers on your website, Glassdoor, and social media. With participation, you are free to use the Flossbank trademarks appropriate for you in any promotional activities or events. 
      </Text>
      <Text marginBottom='1rem'>
        Show stakeholders and employees that you not only care about them but the countless others on which you rely.
      </Text>
      <LinkBtn
        href='/signup'
        className='u-box-shadow'
        minW={{ base: '6rem', sm: '10rem' }}
        maxW={['100%', '10rem']}
        backgroundColor='ocean'
        color='white'
        marginTop='2rem'
      >
        Get Started
      </LinkBtn>
    </Flex>
  </Flex>
)

export default SplashBadges