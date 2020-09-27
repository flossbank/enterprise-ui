import { Text, Box, Image } from '@chakra-ui/core'

import PageWrapper from '../components/common/pageWrapper'
import Section from '../components/common/section'
import Card from '../components/common/card'
import UnderlinedHeading from '../components/common/underlinedHeading'
import TextLink from '../components/common/textLink'
import FAQHeading from '../components/common/faqHeading'
import Divider from '../components/common/divider'

const FAQ = () => (
  <PageWrapper title='FAQs'>
    <Section
      display='flex'
      justifyItems='center'
      flexDirection='column'
      alignItems='center'
      padding={{ base: '3rem 1.5rem', lg: '3rem 7.5rem 6rem' }}
      backgroundColor='lightRock'
    >
      <UnderlinedHeading as='h1' text='FAQs' align='center' />
      <Card shadowSz='lg' maxW='60rem'>
        <FAQHeading>Who does my donation go to?</FAQHeading>
        <Text marginBottom='1.5rem'>
          Your donation is distributed to each package your organization uses. The list is retrieved fresh from
          your GitHub each month, meaning your donation is never going to packages you've stopped using.
        </Text>
        <Divider />
        <FAQHeading>What do the recipients do with our donation?</FAQHeading>
        <Text marginBottom='1.5rem'>
          The package maintainers and authors can do whatever they'd like with the money! Just as you pay an
          employee and don't dictate how they use the funds, this is how we view paying the Open Source
          maintainers you rely on. As with any infusion of capital, progress is inevitible.
        </Text>
        <Divider />
        <FAQHeading>Can I cancel my donation at any time?</FAQHeading>
        <Text marginBottom='1.5rem'>
          Of course. Be sure to remove your badge from display however, as
          your badge links to your public profile on Flossbank, so if you keep
          your badge displayed and viewers click on it, they might see your profile has no donation
          and yet you display your badge, doing more damage to your brand than good.
        </Text>
        <Divider />
        <FAQHeading>
          How do you know if I donate 1% of our profits?
        </FAQHeading>
        <Text marginBottom='1.5rem'>
          We trust you! That's right, the relationship is built on trust, just like Open Source is built on trust
          and integrity. Donating the 1% of profits badge does mean more upkeep for your donation, as you'll have to
          manually adjust your donation amount anually. Don't let this disaude you from purchasing the most prestigious
          badge though.
        </Text>
        <Divider />
        <FAQHeading>What data do you collect?</FAQHeading>
        <Text marginBottom='1.5rem'>
          None. We simply faciliate payments to Open Source maintainers and authors with the underlying 
          motivation being Open Source development begets technological progress. We don't store anything about
          your organization except your donation info.
        </Text>
        <Divider />
        <FAQHeading>Can I ask maintainers for a deliverable, such as a blog post?</FAQHeading>
        <Text marginBottom='1.5rem'>
          No, maintaing Open Source software is a job enough, and by not demanding more deliverables the code
          you depend on will actually be better off. You wouldn't ask your lead data science engineer to write a blog
          post because they have more important priorities. For the same reason, we don't allow asking or expecting
          Open Source maintainers to do anything more than to continue building.
        </Text>
        <Divider />
        <FAQHeading textAlign='center'>I still have a question</FAQHeading>
        <Text marginBottom='1.5rem' textAlign='center'>
          <TextLink text='Contact us' href='contact' /> and we'll address it
          ASAP!
        </Text>
      </Card>
    </Section>
  </PageWrapper>
)

export default FAQ
