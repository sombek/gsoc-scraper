"use client"

import { useState, useEffect } from "react"
import { getFavorites, addToFavorites, removeFromFavorites, isInFavorites } from "./utils"

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    setFavorites(getFavorites())

    // Add event listener to update favorites when storage changes
    const handleStorageChange = () => {
      setFavorites(getFavorites())
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const toggleFavorite = (projectId: string,orgName:string) => {
    if (isInFavorites(projectId+"-"+orgName)) {
      removeFromFavorites(projectId+"-"+orgName)
    } else {
      addToFavorites(projectId+"-"+orgName)
    }

    setFavorites(getFavorites())
  }

  return { favorites, toggleFavorite, isFavorite: (id: string) => favorites.includes(id) }
}

