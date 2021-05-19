import {
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Td
} from '@chakra-ui/table'
import {
  CircularProgress,
  Alert,
  AlertIcon,
  Text,
  Button,
  Box
} from '@chakra-ui/react'
import {
  ArrowForwardIcon,
  ArrowBackIcon
} from '@chakra-ui/icons'

import PropTypes from 'prop-types'
import { useEffect, useState, useRef } from 'react'

const PaginatedTable = (props) => {
  const { columns, pageSize, getData, errorText } = props

  const [currentPageNumber, setCurrentPageNumber] = useState(0)
  const [lastPage, setLastPage] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageLoading, setPageLoading] = useState(false)

  const cache = useRef([])

  const handleChangePage = (direction) => {
    if (direction === 'back') {
      setCurrentPageNumber(currentPageNumber ? currentPageNumber - 1 : 0)
      if (props.onPrev) props.onPrev()
    } else {
      setCurrentPageNumber(currentPageNumber + 1)
      if (props.onNext) props.onNext()
    }
  }

  useEffect(() => {
    const getRows = async () => {
      const limit = pageSize
      const offset = pageSize * currentPageNumber

      try {
        if (cache.current[currentPageNumber]) {
          setData(cache.current[currentPageNumber])
          return
        }

        setPageLoading(true)

        const data = await getData({ limit, offset })
        if (data && data.rows) {
          cache.current[currentPageNumber] = data.rows
          setData(data.rows)

          if (data.rows.length < pageSize) {
            setLastPage(currentPageNumber)
          }
        } else {
          setError(new Error('no rows in returned data'))
        }
      } catch (e) {
        console.error('Error fetching ledger:', e)
        setError(e)
      } finally {
        setLoading(false)
        setPageLoading(false)
      }
    }

    getRows()
  }, [currentPageNumber, pageSize])

  if (error) {
    return (
      <Alert
        status='info'
        backgroundColor='puddle'
        color='ocean'
        fontWeight='500'
        marginBottom='1.5rem'
      >
        <AlertIcon color='ocean' />
        <Text>{errorText}</Text>
      </Alert>
    )
  }

  if (loading) {
    return (
      <Box textAlign='center'>
        <CircularProgress isIndeterminate color='ocean' />
      </Box>
    )
  }

  return (
    <>
      <Table size='sm' colorScheme='blackAlpha'>
        <Thead>
          <Tr>
            {columns.map(({ displayName, fieldName, isNumeric }) => (
              <Th key={fieldName} isNumeric={isNumeric}>{displayName}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, idx) => (
            <Tr key={idx}>
              {columns.map(({ fieldName, isNumeric }) => (
                <Td key={fieldName} isNumeric={isNumeric}>
                  {row[fieldName]}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Box textAlign='center' paddingTop='1rem'>
        <Button
          backgroundColor='lightRock'
          disabled={!currentPageNumber}
          className='u-box-shadow'
          isLoading={pageLoading}
          borderRadius='5px'
          padding='1rem'
          marginRight='1rem'
          height='auto'
          lineHeight='1.2'
          transition='all 300ms ease-in-out'
          _hover={{
            backgroundColor: 'rock',
            color: 'white',
            transform: 'translateY(1px)'
          }}
          _active={{
            backgroundColor: 'boulder',
            color: 'white'
          }}
          onClick={() => handleChangePage('back')}
        >
          <ArrowBackIcon />
        </Button>
        <Button
          backgroundColor='lightRock'
          className='u-box-shadow'
          disabled={lastPage === currentPageNumber}
          isLoading={pageLoading}
          borderRadius='5px'
          padding='1rem'
          height='auto'
          lineHeight='1.2'
          transition='all 300ms ease-in-out'
          _hover={{
            backgroundColor: 'rock',
            color: 'white',
            transform: 'translateY(1px)'
          }}
          _active={{
            backgroundColor: 'boulder',
            color: 'white'
          }}
          onClick={() => handleChangePage('forward')}
        >
          <ArrowForwardIcon />
        </Button>
      </Box>
    </>
  )
}

PaginatedTable.propTypes = {
  pageSize: PropTypes.number.isRequired,

  columns: PropTypes.arrayOf(PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    fieldName: PropTypes.string
  })),

  // a function that takes { limit, offset } as input and returns { rows }
  // where are u typescript
  getData: PropTypes.func.isRequired,
  errorText: PropTypes.string.isRequired,
  onNext: PropTypes.func,
  onPrev: PropTypes.func
}

export default PaginatedTable
