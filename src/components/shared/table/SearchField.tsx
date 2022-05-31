import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

export const SearchField = ({ ...props }) => {
  const [queryParams, setQueryParams] = useSearchParams()
  const [search, setSearch] = useState(queryParams.get('search') || '')
  const onChange = (e) => {
    setQueryParams({ search: e.target.value})
    setSearch(e.target.value)
  }

  useEffect(() => {
  }, [search])
  
  
  return (
    <div>
      <input type='text' value={search} placeholder='search' onChange={onChange} { ...props } />
    </div>
  )
}

