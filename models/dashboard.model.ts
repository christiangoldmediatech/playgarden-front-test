export interface Metrics {
    averageLessonsVideoPerDay: number
    averageStartedVideoPerDay: number
    avgTimeToComplete: number
    avgTimeToCompleteAll: number
    numberCompletedLessons: number
    averageAsistantsLiveClassesPerDay: number
    averageTimeByCurriculumType: any
}

export interface TopVideo {
    videoId: number
    views: number
    name: string
    description: string
    thumbnail: string
}

export interface lineStack {
    xAxis: string[]
    legend: string[]
    data: any[]
}
