import PageWrapper from '../components/common/pageWrapper'
import AuthProcess from '../components/common/authProcess'

const descriptionText = 'Build your brand and ensure the open source packages you rely on have the resources to continue to improve.'

const Signup = () => (
  <PageWrapper
    title='Sign Up'
    description={descriptionText}
  >
    <AuthProcess
      login={false}
      headingText='Sign up for Flossbank Enterprise'
      subHeadingText={descriptionText}
      submitText='Sign up'
      otherProcessText='Already have an account?'
      otherProcessHref='/login'
      otherProcessLinkText='Log in'
    />
  </PageWrapper>
)

export default Signup
