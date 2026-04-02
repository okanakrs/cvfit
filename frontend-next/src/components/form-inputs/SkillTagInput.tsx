'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Skill } from '@/types/cv'

interface SkillTagInputProps {
  skills: Skill[]
  onSkillsChange: (skills: Skill[]) => void
  skillLevels: Skill['level'][]
  skillLevelLabels: Record<Skill['level'], string>
  maxSkills?: number
  locale?: string
}

export function SkillTagInput({
  skills,
  onSkillsChange,
  skillLevels,
  skillLevelLabels,
  maxSkills = 20,
  locale = 'tr',
}: SkillTagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState<string>('')

  const addSkill = (skillName: string) => {
    const trimmedName = skillName.trim()
    
    if (!trimmedName) {
      setError('Beceri adı boş olamaz')
      return
    }

    // Check for duplicates
    const isDuplicate = skills.some(
      s => s.name.toLowerCase().trim() === trimmedName.toLowerCase()
    )
    if (isDuplicate) {
      setError('Bu beceri zaten eklenmiş')
      return
    }

    // Check max skills
    if (skills.length >= maxSkills) {
      setError(`Maksimum ${maxSkills} beceri ekleyebilirsiniz`)
      return
    }

    // Add new skill
    const newSkill: Skill = {
      id: crypto.randomUUID(),
      name: trimmedName,
      level: 'Orta' as const,
    }

    onSkillsChange([...skills, newSkill])
    setInputValue('')
    setError('')
  }

  const removeSkill = (id: string) => {
    onSkillsChange(skills.filter(s => s.id !== id))
    setError('')
  }

  const updateSkillLevel = (id: string, level: Skill['level']) => {
    onSkillsChange(
      skills.map(s => (s.id === id ? { ...s, level } : s))
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && skills.length > 0) {
      removeSkill(skills[skills.length - 1].id)
    }
  }

  const handleInputBlur = () => {
    if (inputValue.trim()) {
      addSkill(inputValue)
    }
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setError('')
          }}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          placeholder="Beceri adı yazın ve Enter tuşuna basın"
          disabled={skills.length >= maxSkills}
          className={cn(error && 'border-destructive focus-visible:ring-destructive')}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {skills.length}/{maxSkills}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-destructive bg-destructive/10 rounded px-2 py-1">
          <AlertCircle className="size-3.5 shrink-0" />
          {error}
        </div>
      )}

      {skills.length > 0 && (
        <div className="space-y-2 pt-2">
          {skills.map(skill => (
            <div
              key={skill.id}
              className="flex flex-col gap-2 sm:flex-row sm:items-center p-2 rounded-lg border border-border hover:border-border/80 transition-colors"
            >
              <div className="flex-1 flex items-center justify-between gap-2 sm:justify-start">
                <span className="text-sm font-medium truncate flex-1">{skill.name}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  className="p-1 hover:bg-destructive/10 rounded text-destructive transition-colors shrink-0"
                  title="Sil"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              <select
                value={skill.level}
                onChange={(e) => updateSkillLevel(skill.id, e.target.value as Skill['level'])}
                className={cn(
                  'px-2 py-1 rounded text-xs border border-border bg-background',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
                  'cursor-pointer'
                )}
              >
                {skillLevels.map(level => (
                  <option key={level} value={level}>
                    {skillLevelLabels[level] || level}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Beceri adı yazıp Enter tuşuna basın veya virgül kullanın.
      </p>
    </div>
  )
}
