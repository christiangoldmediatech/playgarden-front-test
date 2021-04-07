export default {
  allSongsWithCurriculumType (state) {
    const songs = []
    state.musicLibraries.forEach((curriculumType) => {
      if (curriculumType.musicLibrary.length > 0) {
        curriculumType.musicLibrary.forEach(song => songs.push({
          curriculumTypeId: curriculumType.id,
          ...song
        }))
      }
    })
    return songs
  }
}
