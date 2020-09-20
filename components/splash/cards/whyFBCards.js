import { List, ListItem, Icon, Box, Text } from '@chakra-ui/core'
import UnderlinedHeading from '../../common/underlinedHeading'

const cardData = [
  {
    heading: 'Maximum impact',
    icon: 'stack',
    text: '99% of your donation goes to maintainers. 1% is to keep Flossbank\'s engines running.'
  },
  {
    heading: 'Easy',
    icon: 'heart',
    text:
      'Set up a monthly donation that can be cancelled at any time in less than 2 minutes.'
  },
  {
    heading: 'Equitable',
    icon: 'cycle',
    text: 'Flossbank compensates every open source dependency you have, not just those with name recognition.'
  },

  {
    heading: 'Build your brand',
    icon: 'bullseye',
    text: 'Based on your donation, you will receive a Flossbank badge to show that you value the work open source maintainers provide.'
  }
]

const Card = ({ icon, text, heading }) => (
  <ListItem
    padding='1.25rem 2rem'
    fontWeight='500'
    fontSize='0.875rem'
    lineHeight='1.3'
  >
    <Icon name={icon} size='1.25rem' margin='0rem 0 1rem 0' />
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
