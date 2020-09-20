import { Flex, Image, Link } from '@chakra-ui/core'
import UnderlinedHeading from '../common/underlinedHeading'

const logos = [{
  image: 'everblue-logo-154x34.png',
  url: 'https://everbluetraining.com'
}]

const SplashBussinessesUsing = () => (
  <Flex 
    as='section' 
    flexDirection='column' 
    justifyContent='center'
    backgroundColor='lightPuddle'
    height='18rem'
  > 
    <UnderlinedHeading textAlign='center' text='Participating Companies' />
    <Flex 
      flexDirection='row' 
      padding={['0 3rem', '0 8rem']} 
      justifyContent='space-around' 
    >
      {logos.map((item, i) => (
        <Link href={item.url} key={i}>
          <Image src={`/images/companyLogos/${item.image}`} height='3rem' width='14rem'/>
        </Link>
      ))}
    </Flex>
  </Flex>
)

export default SplashBussinessesUsing