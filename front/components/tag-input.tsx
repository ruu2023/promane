"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { XIcon, CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface TagInputProps {
  label?: string
  placeholder?: string
  suggestions?: string[]
  value: string[]
  onChange: (tags: string[]) => void
}

export function TagInput({
  label = "Tags",
  placeholder = "Add tags",
  suggestions = [],
  value,
  onChange,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter suggestions based on input and exclude already selected tags
  const filteredSuggestions = suggestions.filter(
    (suggestion) => suggestion.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(suggestion),
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag])
      setInputValue("")
      setIsOpen(false)
      setHighlightedIndex(0)
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (isOpen && filteredSuggestions.length > 0) {
        addTag(filteredSuggestions[highlightedIndex])
      } else if (inputValue.trim()) {
        addTag(inputValue)
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev + 1) % filteredSuggestions.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length)
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setIsOpen(newValue.length > 0)
    setHighlightedIndex(0)
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor="tag-input" className="text-xs text-muted-foreground">
          {label}
        </Label>
      )}

      <div className="relative">
        <Input
          ref={inputRef}
          id="tag-input"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full"
        />

        {/* Dropdown with suggestions */}
        {isOpen && filteredSuggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addTag(suggestion)}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center justify-between",
                  index === highlightedIndex && "bg-muted",
                )}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <span>{suggestion}</span>
                {index === highlightedIndex && <CheckIcon className="h-4 w-4 text-[var(--forest-accent)]" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tag Pills */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--forest-light)] text-[var(--forest-accent)] text-xs font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:opacity-70 transition-opacity"
                aria-label={`Remove ${tag}`}
              >
                <XIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
