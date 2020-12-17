import { Text, Box, List, ListItem } from '@chakra-ui/core'

import PageWrapper from '../components/common/pageWrapper'
import Section from '../components/common/section'
import Card from '../components/common/card'
import UnderlinedHeading from '../components/common/underlinedHeading'
import TextLink from '../components/common/textLink'
import FAQHeading from '../components/common/faqHeading'

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
              {'According to a '}
              <TextLink
                external
                href='https://thenewstack.io/theres-one-thing-stopping-developers-from-using-open-source-even-more/'
                text='recent survey'
              />
              , Open Source is overwhelmingly better than proprietary solutions.
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
          Of course, this comes with the risk of relying on code not internally maintained. The risk is
          exasperated by the fact that the maintainers maintaining the external code are nine times out of ten
          working for free.
        </Text>
        <Text marginBottom='1rem'>
          If, at any point in a companies internal operations a team was a linch pin of success and had a risk of folding,
          the company would hire another engineer or give the current engineers raises to ensure the future viability
          of the company as a whole.
        </Text>
        <Text marginBottom='1rem'>
          <b>That's why at Flossbank we recommend donating one full engineers salary back to the Open Source code
          you as a company rely on
          </b>. This ensures the code is not only well maintained, but will continue improving
          in the background. Not only that, but enable the birth of the next 10 Open Source packages that could take
          your company to the next level.
        </Text>
        <Text marginBottom='1rem'>
          Flossbank distributes the monthly donation down the entire dependency tree of
          Ruby and Javascript (more language support coming soon) Open Source packages you rely
          on, meaning every aspect of the code you rely on is supported with one easy monthly donation.
        </Text>
        <Text marginBottom='1rem'>
          No maintenance, no
          questions asked, know that the code you use is supported, just as you'd want it to be supported if it were an
          internal team working on business critical operations.
        </Text>
        <Text marginBottom='1rem'>
          In addition to knowing your code base is fortified, we give you a badge to show the world that you support open
          source. You'd be surprised how many talented engineers will come knocking to work at your company if you
          acknowledge the value of Open Source.
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
