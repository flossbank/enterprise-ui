import PageWrapper from '../components/common/pageWrapper'
import SplashHero from '../components/splash/splash_hero'
import SplashWhyFlossbank from '../components/splash/splash_why_flossbank'
import SplashBussinessesUsing from '../components/splash/splash_bussinesses_using'
import SplashBadges from '../components/splash/splash_badges'

const Splash = () => (
  <PageWrapper>
    <SplashHero />
    <SplashWhyFlossbank />
    <SplashBussinessesUsing />
    <SplashBadges />
  </PageWrapper>
)

export default Splash
