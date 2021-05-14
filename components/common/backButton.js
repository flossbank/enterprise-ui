import {
  Flex,
  Text,
  Link
} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'

const BackButton = ({ destination }) => {
  const router = useRouter()

  return (
    <Link onClick={() => router.push(destination)}>
      <Flex flexDirection='row' position='absolute' zIndex={1000} top='10rem' left='5rem' padding='1rem' cursor='pointer'>
        <ArrowBackIcon w='1.5rem' h='1.5rem' />
        <Text paddingLeft='1rem'>Back</Text>
      </Flex>
    </Link>
  )
}

export default BackButton
