import { createContext, useContext } from 'react'

export const SidebarContext = createContext({
  isCollapsed: false,
  isMobile: false,
  isOpen: false,
  toggleCollapse: () => {},
  toggleOpen: () => {},
})

export const useSidebar = () => useContext(SidebarContext)
