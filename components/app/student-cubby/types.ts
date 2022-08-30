
export type StudentChubbyItemText = 'PUZZLE' | 'PATCHES' | 'CURRICULUM' | 'PORTFOLIO' | 'PROGRESS REPORT'
export interface StudentCubbyItem {
  routeName: string
  imgName: string
  imageHeight: string
  text: StudentChubbyItemText
  title: string
  blockedPlanIds: number[]
  description: string | ((childName: string | undefined) => string)
}

export interface StudentCubbyItemHeaderProps {
  studentCubbyItem: StudentCubbyItem | undefined
  isHeaderAlwaysVisible?: boolean
}
