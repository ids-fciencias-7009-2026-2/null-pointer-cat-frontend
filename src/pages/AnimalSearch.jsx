import { useState, useEffect, useRef, useCallback } from 'react'
import { BiSearch, BiX } from 'react-icons/bi'
import { searchAnimals } from '../services/api'
import { PostCard } from './PostFeed'
import '../styles/AnimalSearch.css'

const FILTER_KEYS = ['species', 'size', 'zipcode']

const SUGGESTIONS = {
  species:   ['DOG', 'CAT'],
  size:      ['small', 'medium', 'large', 'extra_large'],
  zipcode:   [],
}

const TAG_COLORS = {
  species:   { bg: '#EEF6F4', border: '#7FB5A8', text: '#3D8578', dot: '#7FB5A8' },
  size:      { bg: '#E8F3F1', border: '#5A9A8C', text: '#2E6B61', dot: '#5A9A8C' },
  zipcode:   { bg: '#F0F7F6', border: '#9ECAC2', text: '#3D7A72', dot: '#9ECAC2' },
}

function parseInput(raw) {
  const match = raw.match(/^(\w+)\s*:\s*(.+)$/)
  if (!match) return null
  const key = match[1].trim().toLowerCase()
  const val = match[2].trim()
  
  const keyMap = { zip: 'zipcode' }
  const normalized = keyMap[key] ?? key
  if (!FILTER_KEYS.includes(normalized)) return null
  return { key: normalized, value: val }
}

export default function AnimalSearch({ onSearchActive }) {
  const [tags, setTags]             = useState([])
  const [inputValue, setInputValue] = useState('')
  const [focused, setFocused]       = useState(false)
  const [animals, setAnimals]       = useState([])
  const [loading, setLoading]       = useState(false)
  const [searched, setSearched]     = useState(false)
  const [error, setError]           = useState(null)

  const inputRef = useRef(null)
  const boxRef   = useRef(null)

  const parsed            = parseInput(inputValue)
  const suggestionKey     = parsed?.key
  const suggestionOptions =
    suggestionKey && SUGGESTIONS[suggestionKey]?.length > 0
      ? SUGGESTIONS[suggestionKey].filter(
          (s) => !tags.find((t) => t.key === suggestionKey) &&
                 s.toLowerCase().includes((parsed.value || '').toLowerCase())
        )
      : []
  const keywordHints = !inputValue.includes(':')
    ? FILTER_KEYS.filter((k) => !tags.find((t) => t.key === k) && k.toLowerCase().includes(inputValue.toLowerCase()))
    : []
  const showDropdown = focused && (suggestionOptions.length > 0 || keywordHints.length > 0)

  const addTag = useCallback((key, value) => {
    if (!key || !value) return
    setTags((prev) =>
      prev.find((t) => t.key === key)
        ? prev.map((t) => (t.key === key ? { key, value } : t))
        : [...prev, { key, value }]
    )
    setInputValue('')
  }, [])

  const removeTag = (key) => setTags((prev) => prev.filter((t) => t.key !== key))

  const handleClear = () => {
    setTags([])
    setInputValue('')
    setSearched(false)
    setAnimals([])
    setError(null)
    onSearchActive?.(false)
  }

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault()
      const p = parseInput(inputValue.trim())
      if (p) addTag(p.key, p.value)
    }
    if (e.key === 'Backspace' && !inputValue && tags.length) {
      setTags((prev) => prev.slice(0, -1))
    }
  }

  const handleSearch = useCallback(async (activeTags) => {
    const tagsToUse = activeTags ?? tags
    setLoading(true)
    setError(null)
    setSearched(true)
    try {
      const filters = tagsToUse.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {})
      const res = await searchAnimals(filters)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setAnimals(data)
      onSearchActive?.(tagsToUse.length > 0)
    } catch {
      setError('Could not connect to the server.')
      setAnimals([])
      onSearchActive?.(false)
    } finally {
      setLoading(false)
    }
  }, [tags, onSearchActive])

  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true)
      try {
        const res = await searchAnimals({})
        if (!res.ok) throw new Error()
        setAnimals(await res.json())
      } catch {
        setError('Could not connect to the server.')
      } finally {
        setLoading(false)
        setSearched(false)
        onSearchActive?.(false)
      }
    }
    fetchInitial()
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setFocused(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="search-section">

      <div
        ref={boxRef}
        className={`search-box${focused ? ' search-box--focused' : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map(({ key, value }) => (
          <span key={key} className="search-tag"
            style={{ background: TAG_COLORS[key].bg, border: `1.5px solid ${TAG_COLORS[key].border}`, color: TAG_COLORS[key].text }}
          >
            <span className="search-tag__key">{key}</span>
            <span className="search-tag__sep">:</span>
            <span className="search-tag__val">{value}</span>
            <button className="search-tag__remove" style={{ color: TAG_COLORS[key].text }}
              onClick={(e) => { e.stopPropagation(); removeTag(key) }}>
              <BiX size={14} />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          className="search-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          placeholder={tags.length === 0 ? 'Filter by species, size, zipcode…' : 'Add another filter…'}
        />

        {tags.length > 0 && (
          <button className="search-clear-btn" onClick={handleClear}>
            <BiX size={16} /><span>Clear</span>
          </button>
        )}
        <button className="search-btn" onClick={() => handleSearch(tags)}>
          <BiSearch size={18} /><span>Search</span>
        </button>

        {showDropdown && (
          <div className="search-dropdown">
            {keywordHints.length > 0 && (
              <>
                <div className="search-dropdown__label">Available filters</div>
                {keywordHints.map((k) => (
                  <div key={k} className="search-dropdown__item"
                    onMouseDown={(e) => { e.preventDefault(); setInputValue(`${k}: `); inputRef.current?.focus() }}>
                    <span className="search-dropdown__dot" style={{ background: TAG_COLORS[k]?.dot }} />{k}:
                  </div>
                ))}
              </>
            )}
            {suggestionOptions.length > 0 && (
              <>
                <div className="search-dropdown__label">Suggested values</div>
                {suggestionOptions.map((opt) => (
                  <div key={opt} className="search-dropdown__item"
                    onMouseDown={(e) => { e.preventDefault(); addTag(suggestionKey, opt) }}>
                    {opt}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      <div className="search-hints">
        <span className="search-hints__label">Try:</span>
        {['species: DOG', 'size: small', 'zipcode: 06600'].map((hint) => {
          const p = parseInput(hint)
          if (!p || tags.find((t) => t.key === p.key)) return null
          return (
            <button key={hint} className="search-hint-chip"
              onClick={() => { setInputValue(`${p.key}: `); inputRef.current?.focus() }}>
              {hint}
            </button>
          )
        })}
      </div>

      {error && <p className="pf-message pf-message-error">{error}</p>}
      {!loading && searched && !error && (
        <p className="search-results-count">
          {animals.length === 0
            ? 'No results found.'
            : `${animals.length} ${animals.length === 1 ? 'animal found' : 'animals found'}`}
        </p>
      )}

      {tags.length > 0 && (
        <div className="pf-grid">
          {loading
            ? <p className="pf-message">Loading...</p>
            : animals.map((animal) => (
                <PostCard
                  key={animal.idAnimal}
                  post={{
                    idPost:             animal.idAnimal,
                    animalName:         animal.animalName,
                    species:            animal.species,
                    size:               animal.size,
                    description:        animal.description,
                    animalDescription:  animal.description,
                    dateOfBirth:        animal.dateOfBirth,
                    animalZipcode:      animal.animalZipcode,
                    createdAt:          animal.publishedAt,
                    photos:             animal.photos,
                    publisherUsername:  animal.publisherUsername,
                    publisherFirstname: animal.publisherFirstname,
                    publisherLastname:  animal.publisherLastname,
                  }}
                />
              ))}
        </div>
      )}

    </div>
  )
}