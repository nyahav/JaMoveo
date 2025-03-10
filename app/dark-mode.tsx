// "use client"

// import * as React from "react"
// import { Moon, Sun } from "lucide-react"
// import { useTheme } from "next-themes"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// export function ModeToggle() {
//   const [mounted, setMounted] = React.useState(false)
//   const { theme, setTheme, systemTheme } = useTheme()

//   React.useEffect(() => {
//     setMounted(true)
//     // Debug theme state
//     console.log({
//       theme,
//       systemTheme,
//       isDark: document.documentElement.classList.contains('dark')
//     })
//   }, [theme, systemTheme])

//   if (!mounted) {
//     return null
//   }

//   const currentTheme = theme === 'system' ? systemTheme : theme

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline" size="icon">
//           {currentTheme === "dark" ? (
//             <Moon className="h-5 w-5" />
//           ) : (
//             <Sun className="h-5 w-5" />
//           )}
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuItem onClick={() => setTheme("light")}>
//           Light
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("dark")}>
//           Dark
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("system")}>
//           System
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }