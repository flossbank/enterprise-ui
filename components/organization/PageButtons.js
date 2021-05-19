import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Box } from '@chakra-ui/react'
import { ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons'

const baseBtnStyles = {
  backgroundColor: 'lightRock',
  padding: '1rem',
  marginLeft: '0.25rem',
  _hover: {
    backgroundColor: 'rock',
    color: 'white'
  },
  _active: {
    backgroundColor: 'boulder',
    color: 'white'
  },
  _focus: {
    outlineOffset: 0
  }
}

// adapted with love and frustration from https://github.com/htk159131721/react-pagination-list/blob/18007524fad2ba75593666ebec8295695591d593/src/index.tsx
const PageButtons = ({ totalPages, currentPageIdx, pageLoading, onClick }) => {
  // the number of page buttons visible, e.g.
  // 1 ... 6 7 8 9 10 ... 71
  // the middle part of the above example has 5 elements, that's this constant
  const jump = 5

  const [arrItemPage, setArrItemPage] = useState([])
  const [currentPageNum, setCurrentPageNum] = useState(1)
  const [flagEnd, setFlagEnd] = useState(false)
  const countJump = useRef(1)

  useEffect(() => {
    let currentPage
    const pageNumber = currentPageIdx + 1
    if (pageNumber !== 0) {
      if (pageNumber <= totalPages) {
        currentPage = pageNumber
      } else {
        currentPage = totalPages
      }
    } else {
      currentPage = 1
    }

    if (totalPages > jump) {
      setArrItemPage([...Array.from(Array(jump).keys())])
    } else {
      setArrItemPage([...Array.from(Array(totalPages).keys())])
    }
    setCurrentPageNum(currentPage)
  }, [])

  const handlePageChange = (num, type) => {
    setCurrentPageNum(num)
    if (type) {
      countJump.current = type === 'first' ? 1 : Math.ceil(totalPages / jump)
    }

    onClick(num)
  }

  const computePageNumber = (idx) => {
    if (countJump.current === 1 && !flagEnd) {
      return idx
    }

    if (totalPages - jump < 5) {
      return totalPages - (jump - idx)
    }

    if (jump * countJump.current > totalPages) {
      return totalPages - (jump - idx)
    }

    return jump * countJump.current - (jump - idx)
  }

  const renderPageButtons = () => {
    const firstPage = 1
    const lastPage = totalPages
    const firstPageBtn = (
      <Button
        {...baseBtnStyles}
        key={firstPage}
        onClick={() => handlePageChange(firstPage, 'first')}
      >{firstPage}
      </Button>
    )
    const lastPageBtn = (
      <Button
        {...baseBtnStyles}
        key={lastPage}
        onClick={() => handlePageChange(lastPage, 'last')}
      >{lastPage}
      </Button>
    )

    const setDefaultPageCurrent = (full) => {
      let pageDefaultNext
      if (!full) {
        pageDefaultNext = totalPages - (jump - 1)
      } else {
        pageDefaultNext = jump * countJump.current - (jump - 1)

        pageDefaultNext = pageDefaultNext === totalPages
          ? pageDefaultNext - (jump - 1)
          : pageDefaultNext
      }
      setCurrentPageNum(pageDefaultNext)
      handlePageChange(pageDefaultNext)
    }

    const handleGetJumpNext = () => {
      let isNextFull = true
      if (arrItemPage.length + jump > totalPages) {
        isNextFull = false
        setFlagEnd(true)
      } else {
        countJump.current = countJump.current + 1
      }
      setArrItemPage([...Array.from(Array(jump).keys())])
      setDefaultPageCurrent(isNextFull)
    }

    const handleGetJumpPrev = () => {
      let isNextFull = true
      if (arrItemPage.length + jump > totalPages) {
        isNextFull = false
        setFlagEnd(false)
      } else {
        countJump.current = countJump.current - 1
      }
      setArrItemPage([...Array.from(Array(jump).keys())])
      setDefaultPageCurrent(isNextFull)
    }

    const jumpNextBtn = totalPages > jump
      ? (
        <Button
          {...baseBtnStyles}
          key='jump_next'
          onClick={handleGetJumpNext}
          title='Jump Next'
        >...
        </Button>
        )
      : null

    const jumpPrevBtn = (
      <Button
        {...baseBtnStyles}
        key='jump_prev'
        onClick={handleGetJumpPrev}
        title='Jump Previous'
      >...
      </Button>
    )

    const pageButtons = arrItemPage.map((_, idx) => {
      const pagePos = computePageNumber(idx + 1)
      return (
        <Button
          {...baseBtnStyles}
          border={pagePos === currentPageNum && '1px solid gray'}
          key={pagePos}
          onClick={() => handlePageChange(pagePos)}
        >{pagePos}
        </Button>
      )
    })

    if (totalPages > jump) {
      if (countJump.current * jump < totalPages && !flagEnd) {
        pageButtons.push((
          <React.Fragment key='wrap_jump_next'>
            {jumpNextBtn}
            {lastPageBtn}
          </React.Fragment>
        ))
      }
      if (countJump.current > 1 || flagEnd) {
        pageButtons.unshift((
          <React.Fragment key='wrap_jump_prev'>
            {firstPageBtn}
            {jumpPrevBtn}
          </React.Fragment>
        ))
      }
    }

    return pageButtons
  }

  const handlePrevPage = () => {
    const prevPage = currentPageNum - 1
    if (currentPageNum !== 1) {
      handlePageChange(prevPage)
    }
    if (totalPages % jump === 0) {
      if (prevPage % jump === 0) {
        countJump.current = countJump.current - 1
      }
    } else {
      if (countJump.current === Math.ceil(totalPages / jump)) {
        if (totalPages - prevPage === jump) {
          countJump.current = countJump.current - 1
        }
      } else if (prevPage % jump === 0) {
        countJump.current = countJump.current - 1
      }
    }
  }

  const handleNextPage = () => {
    const nextPageNum = currentPageNum + 1
    if (currentPageNum !== totalPages) {
      handlePageChange(nextPageNum)
    }
    if (nextPageNum % jump === 1) {
      countJump.current = countJump.current + 1
    }
  }

  return (
    <Box textAlign='center' paddingTop='1rem'>
      <Button
        {...baseBtnStyles}
        disabled={currentPageNum === 1}
        isLoading={pageLoading}
        onClick={handlePrevPage}
      >
        <ArrowBackIcon />
      </Button>
      {renderPageButtons()}
      <Button
        {...baseBtnStyles}
        disabled={currentPageNum === totalPages}
        isLoading={pageLoading}
        onClick={handleNextPage}
      >
        <ArrowForwardIcon />
      </Button>
    </Box>
  )
}

PageButtons.propTypes = {
  totalPages: PropTypes.number.isRequired,

  // 0-indexed
  currentPageIdx: PropTypes.number.isRequired,

  // a function that takes a page number as input; fired when the user clicks a page button
  onClick: PropTypes.func.isRequired,

  pageLoading: PropTypes.bool
}

export default PageButtons
