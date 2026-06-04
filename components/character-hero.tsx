"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Character } from "@/lib/types"

interface CharacterHeroProps {
  active: Character | null
  companions: Character[]
  onSelect: (id: number) => void
}

export default function CharacterHero({ active, companions, onSelect }: CharacterHeroProps) {
  if (!active) {
    return (
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 text-center text-sm text-gray-500 min-h-[220px] flex items-center justify-center">
        Pick a companion to get started.
      </div>
    )
  }
  return (
    <div className="rounded-2xl border border-gray-800 bg-gradient-to-b from-purple-950/30 to-gray-900 p-5 flex flex-col items-center text-center relative min-h-[220px]">
      <Avatar className="w-28 h-28 ring-2 ring-purple-500/40">
        <AvatarImage src={active.avatar} />
        <AvatarFallback className="text-3xl">{active.name[0]}</AvatarFallback>
      </Avatar>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-lg font-bold text-white">{active.name}</span>
        <Badge variant="outline" className="text-[10px] px-1 py-0">L{active.level}</Badge>
      </div>
      <p className="text-[11px] text-gray-400">Bond {Math.floor(active.bondLevel)}/{active.maxBond}</p>
      {active.lastMessage && (
        <p className="text-xs text-gray-400 italic mt-2 line-clamp-2 max-w-xs">"{active.lastMessage}"</p>
      )}

      {companions.length > 1 && (
        <div className="flex gap-2 mt-4">
          {companions.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`rounded-full ${c.id === active.id ? "ring-2 ring-purple-500" : "opacity-60 hover:opacity-100"}`}
              aria-label={`Switch to ${c.name}`}
            >
              <Avatar className="w-9 h-9"><AvatarImage src={c.avatar} /><AvatarFallback>{c.name[0]}</AvatarFallback></Avatar>
            </button>
          ))}
        </div>
      )}

      <div className="absolute bottom-2 left-2 right-2 text-[9px] text-gray-600 border border-dashed border-gray-700 rounded py-1">
        live animation coming soon
      </div>
    </div>
  )
}
