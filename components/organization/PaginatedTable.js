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
  Box
} from '@chakra-ui/react'
import PageButtons from './PageButtons'

import PropTypes from 'prop-types'
import { useEffect, useState, useRef } from 'react'

const PaginatedTable = (props) => {
  const { columns, pageSize, getData, getRowCount, errorText } = props

  const [currentPageIdx, setCurrentPageIdx] = useState(0)
  const [error, setError] = useState(null)
  const [data, setData] = useState([])
  const [rowCount, setRowCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [pageLoading, setPageLoading] = useState(false)

  const cache = useRef([])

  const handleChangePage = (newPageNumber) => {
    // page numbers are 1-indexed; page indices are 0-indexed
    setCurrentPageIdx(newPageNumber - 1)
    if (props.onPageChange) props.onPageChange()
  }

  useEffect(() => {
    (async () => {
      const rc = await getRowCount()
      setRowCount(rc)
    })()
  }, [])

  useEffect(() => {
    const getRows = async () => {
      const limit = pageSize
      const offset = pageSize * currentPageIdx

      try {
        if (cache.current[currentPageIdx]) {
          setData(cache.current[currentPageIdx])
          return
        }

        setPageLoading(true)

        const data = await getData({ limit, offset })
        if (data && data.rows) {
          cache.current[currentPageIdx] = data.rows
          setData(data.rows)
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
  }, [currentPageIdx, pageSize])

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
      <PageButtons
        totalPages={Math.ceil(rowCount / pageSize)}
        currentPageIdx={currentPageIdx}
        pageLoading={pageLoading}
        onClick={handleChangePage}
      />
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

  // a function that takes no input and returns a number
  getRowCount: PropTypes.func.isRequired,

  errorText: PropTypes.string.isRequired,
  onPageChange: PropTypes.func
}

export default PaginatedTable
