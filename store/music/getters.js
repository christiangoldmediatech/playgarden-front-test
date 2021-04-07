export default {
  musicLibrariesByCurriculumType (state) {
    return state.musicLibraries.map((curriculumType) => {
      return {
        curriculumTypeId: curriculumType.id,
        musicLibrary: curriculumType.musicLibrary
      }
    }).filter((library) => {
      return library.musicLibrary.length > 0
    })
  }
}
