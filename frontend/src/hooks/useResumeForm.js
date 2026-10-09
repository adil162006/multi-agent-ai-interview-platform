import { useCallback, useState } from 'react'
import { INITIAL_RESUME, SECTION_FIELDS, createEntry } from '../constants/resume'

export const useResumeForm = () => {
  const [data, setData] = useState(INITIAL_RESUME)

  const setPersonalField = useCallback((name, value) => {
    setData((prev) => ({ ...prev, personal: { ...prev.personal, [name]: value } }))
  }, [])

  const setValue = useCallback((key, value) => {
    setData((prev) => ({ ...prev, [key]: value }))
  }, [])

  const addEntry = useCallback((section) => {
    setData((prev) => ({
      ...prev,
      [section]: [...prev[section], createEntry(SECTION_FIELDS[section])],
    }))
  }, [])

  const updateEntry = useCallback((section, id, name, value) => {
    setData((prev) => ({
      ...prev,
      [section]: prev[section].map((entry) =>
        entry.id === id ? { ...entry, [name]: value } : entry
      ),
    }))
  }, [])

  const removeEntry = useCallback((section, id) => {
    setData((prev) => ({
      ...prev,
      [section]: prev[section].filter((entry) => entry.id !== id),
    }))
  }, [])

  return { data, setPersonalField, setValue, addEntry, updateEntry, removeEntry }
}