import { Entity } from '.'

export interface ReportCardType extends Entity {
    name: string
    description: string
    icon: string,
    descriptionProgress: any
}
