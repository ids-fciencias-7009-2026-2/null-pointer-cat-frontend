import { useState, useEffect, useRef, useCallback } from 'react'
import { BiSearch, BiX } from 'react-icons/bi'
import { searchAnimals } from '../services/api'
import '../styles/AnimalSearch.css'

const FILTER_KEYS = ['species', 'size', 'zipcode', 'breedName']

const SUGGESTIONS = {
  species:   ['DOG', 'CAT'],
  size:      ['small', 'medium', 'large', 'extra_large'],
  zipcode:   [],
  breedName: [],
}

const TAG_COLORS = {
  species:   { bg: '#EEF6F4', border: '#7FB5A8', text: '#3D8578', dot: '#7FB5A8' },
  size:      { bg: '#E8F3F1', border: '#5A9A8C', text: '#2E6B61', dot: '#5A9A8C' },
  zipcode:   { bg: '#F0F7F6', border: '#9ECAC2', text: '#3D7A72', dot: '#9ECAC2' },
  breedName: { bg: '#E4F0EE', border: '#4D8F84', text: '#2A6B62', dot: '#4D8F84' },
}

const SIZE_LABELS = {
  small: 'Small', medium: 'Medium', large: 'Large', extra_large: 'Extra Large',
}

const SPECIES_EMOJI = { DOG: '🐶', CAT: '🐱' }

function parseInput(raw) {
  const match = raw.match(/^(\w+)\s*:\s*(.+)$/)
  if (!match) return null
  const key = match[1].trim().toLowerCase()
  const val = match[2].trim()
  const keyMap = { breed: 'breedName', zip: 'zipcode' }
  const normalized = keyMap[key] ?? key
  if (!FILTER_KEYS.includes(normalized)) return null
  return { key: normalized, value: val }
}

function AnimalCard({ animal }) {
  const [interestLoading, setInterestLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleInterest = async (e) => {
    e.stopPropagation()
    setInterestLoading(true)
    try {
      const token = sessionStorage.getItem('token')
      const res = await fetch(`http://localhost:8080/favorites/${animal.idAnimal}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) setDone(true)
    } catch (err) {
    } catch (err) {
tDone(true)
: `Bearer ${token}` }
avorites/${animal.idAni}
  }

  const photo = animal.photos?.[0]

  return (
    <article className="pf-card">
      <div className="pf-carousel" style={{ aspectRatio: '1/1', background: '#F5EBE0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {photo
          ? <img src={photo} alt={animal.animalName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: '3rem' }}>{SPECIES_EMOJI[animal.species] ?? '🐾'}</span>}
      </div>

      <div className="pf-card-body">
        <h3 className="pf-animal-name">{animal.animalName}</h3>

        {animal.description && <p className="pf-description">{animal.description}</p>}

        {animal.size && (
          <div className="pf-info-row">
            <span className="pf-info-label">Size</span>
            <            <           value">{SIZE_LABELS[animal.size] ?? animal.size}</span>
          </div>
        )}

        {animal.animalZipcode && (
          <div className="pf-info-row">
            <span className="pf-info-label">Zipcode</span>
            <span className="pf-info-value">📍 {animal.animalZipcode}</span>
          </div>
        )}

        <div className="pf-card-footer">
          <span className="pf-species-tag">
            {SPECIES_EMOJI[animal.species] ?? '🐾'} {animal.species}
          </span>
          <button
            onClick={handleInterest}
            disabled={interestLoading || done}
            style={{
              padding: '7px 18px', borderRadius: '999px', border: 'none',
              background: done ? '#88b2a6' : '#1d423f', color: 'white',
              fontWeight: 700, fontSize: '0.78rem',
              cursor: done ? 'default' : 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {done ? '¡Interés enviado! 🐾' : interestLoading ? '...' : 'Me interesa'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default function AnimalSearch() {
  const [tags, setTags]             = useState([])
  const [inputValue, setInputValue] = useState('')
  const [focused, setFocused]       = useState(false)
  const [animals, setAnimals]       = useState([])
  const [loading, setLoading]       = useState(false)
  const [searched, setSearche  const [searched, setSearche  const [searched, setSearche  consseState(null)

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

  const handleSearch = async () => {
    setLoading(true); setError(null); setSearched(true)
    try {
      const filters = tags.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {})
      const res = await searchAnimals(filters)
      if (!res.ok) throw new Error()
      setAnimals(await res.json())
    } catch {
      setError('Could not connect to the server.')
      setAnimals([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { handleSearch() }, []) // eslint-disable-line

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
                                focused ? ' search-box--focused' : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map(({ key, value }) => (
          <span key={key} className="search-tag"
            style={{ background: TAG_COLORS[key].bg, border: `1.5px solid ${TAG_COLORS[key].border}`, color: TAG_COLORS[key].text }}
          >
            <span className="search-tag__key">{key}</span>
            <span className="search-tag__sep">:</span>
            <span className="search-tag__val">{value}</span>
            <button className="search-tag__remove" style={{ color: TAG_            <button className="search-tag__remove" se.stopPropagation(); removeTag(key) }}>
              <BiX size              <BiX size              <BiX size              <BiX si  <input
          ref={inputRef}
          className="search-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          placeholder={tags.length === 0 ? 'Filter by species, size, zipcode, breedName…' : 'Add another filter…'}
        />
        <button className="search-btn" onClick={handleSearch}>
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
                                          && (
              <>
                <div className="  arch-dropdown__label">Suggested values</d                <div className="  arch-dropdown__label">Suggested values</d                <div classNah-dropdown__item"
                    onMouseDown={(e) => { e.preventDefault(); addTag(suggestionKey, opt) }}>
                    {opt}
                  </div 
                ))}
                              )}
          </div>
        )}
      </div>
      <div className="search-hints      <div className="search-hints      <dlabel">Try:</span>
        {['species: DOG', 'size: small', 'breedName: golden', 'zipcode: 06600'].map((hint) => {
          const p = parseInput(          const p = parseInput(          const p = parseInput(          const p = parseInput(           <button key={hint} className="search-hint-chip"
              onClick={() => { setInputValue(`${p.key}: `); inputRef.current?.focus() }}>
              {hint}
            </button>
          )
        })}
      </div>
      {error && <p className="pf-message pf-me      {error && <p className="pf-message pf-me      {error && <p className="pf-message pf-me      {error && <p className="pf-message pf-me      {error && <p classNamesults found.'
            : `${animals.length} ${animals.length === 1 ? 'animal found' : 'animals found'}`}
        </p>
      )}
      <div classNam      <div clas      {loading
          ? <p           ? <p          oading...</p>
          : animals.map((animal) => (
              <AnimalCard key={animal.idAnimal} animal={animal} />
            ))}
      </div>
    </div>
  )
}
