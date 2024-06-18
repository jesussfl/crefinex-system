import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
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

export const usePostStore = create(
  persist<PostStore>(
    (set, get) => ({
      ...defaultInitState,
      handleMonthChange: (value: string) =>
        set((state) => {
          const currentMonth = new Date(get().currentMonth)
          return {
            currentMonth: new Date(currentMonth.setMonth(parseInt(value))),
          }
        }),

      handleYearChange: (value: string) =>
        set((state) => {
          const newYear = parseInt(value)
          const currentMonth = new Date(get().currentMonth)

          return {
            selectedYear: newYear,
            currentMonth: new Date(currentMonth.setFullYear(parseInt(value))),
          }
        }),
      // handleMonthChange: (value: string)  => set((state)=> {

      // const newMonth = new Date(get().currentMonth.setMonth(parseInt(value)))
      // set({ currentMonth: newMonth })
      // }),

      // handleYearChange: (value: string) => {
      //   const newYear = parseInt(value)
      //   set({ selectedYear: newYear })

      //   const newMonth = new Date(get().currentMonth.setFullYear(newYear))
      //   set({ currentMonth: newMonth })
      // },
    }),
    {
      name: 'posts-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
)
