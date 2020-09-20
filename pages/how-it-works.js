import { Text, Box, Image } from '@chakra-ui/core'

import PageWrapper from '../components/common/pageWrapper'
import Section from '../components/common/section'
import Card from '../components/common/card'
import UnderlinedHeading from '../components/common/underlinedHeading'
import TextLink from '../components/common/textLink'
import FAQHeading from '../components/common/faqHeading'
import Divider from '../components/common/divider'

const HowItWorks = () => (
  <PageWrapper title='How It Works'>
    <Section
      display='flex'
      justifyItems='center'
      flexDirection='column'
      alignItems='center'
      padding={{ base: '3rem 1.5rem', lg: '3rem 7.5rem 6rem' }}
      backgroundColor='lightRock'
    >
      <UnderlinedHeading as='h1' text='How It Works' align='center' />
      <Card shadowSz='lg' maxW='60rem'>
        <FAQHeading>Fortifying your code base</FAQHeading>
        <Box marginBottom='1rem'>
          Right now, every fortune 500 company pulls in Open Source code for two main reasons:
          <List as='ol' styleType='decimal'>
            <ListItem margin='1rem 0'>
              According to a 
              <a href='https://thenewstack.io/theres-one-thing-stopping-developers-from-using-open-source-even-more/'>
                recent survey
              </a>, Open Source is overwhelmingly better than proprietary solutions.
            </ListItem>
            <ListItem margin='1rem 0'>
              Open Source is overwhelmingly cheaper than building a proprietary solution
            </ListItem>
          </List>
        </Box>
        <Text marginBottom='1rem'>
          This is fantastic, and goes to show just how impactful the concept of open source 
          software is. The ability for anyone, anywhere in the world, to build a building block and publish
          it is truly remarkable. That building block can then be used, no strings attached, to
          build any desired system.
        </Text>
        <Text marginBottom='1rem'>
          Of course, this comes with risks.
        </Text>
        <Text marginBottom='1rem'>
          How to companies currently mitigate risks associated with pulling in Open Source code?
        </Text>
        <Text marginBottom='1rem'>
          
        </Text>
        <Text color='boulder' textAlign='center' fontWeight='500'>
          Have more questions? Visit our{' '}
          <TextLink href='/faq' text='FAQ page' /> to find out more.
        </Text>
      </Card>
    </Section>
  </PageWrapper>
)

export default HowItWorks
