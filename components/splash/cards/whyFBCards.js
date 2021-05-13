import { List, ListItem, Box, Text } from '@chakra-ui/react'
import Icons from '../../../public/icons'

const cardData = [
  {
    heading: 'Fortify your code base',
    icon: <Icons.Lock w='1.5rem' h='1.5rem' margin='0rem 0 1rem 0' />,
    text: 'Your company relies on the maintenance and integrity of Open Source. Make sure the maintainers have the resources needed to not only maintain, but improve the code your company relies on.'
  },
  {
    heading: 'Easy',
    icon: <Icons.Clock w='1.5rem' h='1.5rem' margin='0rem 0 1rem 0' />,
    text:
      'Set up a monthly donation that can be cancelled at any time in less than 1 minute.'
  },
  {
    heading: 'Build your brand',
    icon: <Icons.DuotoneStar w='1.5rem' h='1.5rem' margin='0rem 0 1rem 0' />,
    text: 'Based on your donation amount, you will receive a Flossbank badge to show that you value the work open source maintainers provide.'
  },
  {
    heading: 'Equitable',
    icon: <Icons.Equitable w='1.5rem' h='1.5rem' margin='0rem 0 1rem 0' />,
    text: 'Flossbank compensates every open source dependency you have, not just those with name recognition.'
  }
]

const Card = ({ icon, text, heading }) => (
  <ListItem
    padding='1.25rem 2rem'
    fontWeight='500'
    fontSize='0.875rem'
    lineHeight='1.3'
  >
    {icon}
    <Box
      as='h3'
      marginBottom='1rem'
      align='left'
      lineGap='1'
      fontSize='24px'
      letterSpacing='1px'
      textTransform='none'
      fontWeight='400'
    >
      {heading}
    </Box>
    <Text fontSize='16px' fontWeight='400'>{text}</Text>
  </ListItem>
)

const WhyFBCards = () => (
  <List
    margin='auto'
    display='grid'
    paddingRight='0'
    gridGap='1.625rem'
    gridTemplateColumns={{
      base: 'minmax(12rem, 17rem)',
      sm: 'repeat(2, minmax(12rem, 30rem))'
    }}
    justifyContent='center'
    maxW='75rem'
    width='100%'
    marginBottom='3rem'
  >
    {cardData.map((card, i) => (
      <Card key={i} icon={card.icon} text={card.text} heading={card.heading} />
    ))}
  </List>
)

export default WhyFBCards
