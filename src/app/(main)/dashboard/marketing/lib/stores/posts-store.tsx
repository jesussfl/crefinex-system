import { createStore } from 'zustand/vanilla'

export type PostState = {
  currentMonth: Date
  selectedYear: number
}

export type PostActions = {
  handleMonthChange: (value: string) => void
  handleYearChange: (value: string) => void
}

export type PostStore = PostState & PostActions

export const defaultInitState: PostState = {
  currentMonth: new Date(),
  selectedYear: new Date().getFullYear(),
}

export const createPostStore = (initState: PostState = defaultInitState) => {
  return createStore<PostStore>()((set) => ({
    ...initState,
    handleMonthChange: (value: string) => {
      const newMonth = new Date(
        initState.currentMonth.setMonth(parseInt(value))
      )
      set({ currentMonth: newMonth })
    },

    handleYearChange: (value: string) => {
      const newYear = parseInt(value)
      set({ selectedYear: newYear })

      const newMonth = new Date(initState.currentMonth.setFullYear(newYear))
      set({ currentMonth: newMonth })
    },
  }))
}
