export enum TAG_MANAGER_EVENTS {
  // VIDEO
  VIDEO_EVENT = 'video',
  // DASHBOARD
  DASHBOARD_VIDEO_LESSON_CLICKED = 'videoLessonClicked',
  DASHBOARD_VIDEO_LESSON_VIDEO_CLICKED = 'videoLessonVideoClicked',
  DASHBOARD_ACTIVITY_CLICKED = 'activitiesClicked',
  DASHBOARD_ACTIVITY_VIDEO_CLICKED = 'activitiesVideoClicked',
  DASHBOARD_ONLINE_WORKSHEET_CLICKED = 'onlineWorksheetClicked',
  DASHBOARD_ONLINE_WORKSHEET_COMPLETED = 'onlineWorksheetCompleted',
  DASHBOARD_WORKSHEET_VIDEOS_CLICKED = 'workSheetVideosClicked',
  DASHBOARD_WORKSHEET_DOWNLOAD = 'workSheetDownload',
  DASHBOARD_WORKSHEET_UPLOAD = 'workSheetUpload',
  // LIVE CLASSES
  LIVE_CLASSES_ITEM_CLICKED = 'liveClassesItemClicked',
  LIVE_CLASSES_ITEM_ZOOM_LINK_CLICKED = 'liveClassesItemZoomLinkClicked',
  LIVE_CLASSES_WATCH_RECORDED_VIDEO = 'watchRecordedClassClicked',
  // ACCOUNT
  ACCOUNT_SYNC_FACEBOOK = 'accountSyncFacebook',
  ACCOUNT_SYNC_GOOGLE = 'accountSyncGoogle',
  ACCOUNT_ADD_CAREGIVER = 'addCareGiver',
  // PLAYDATES
  PLAYDATE_INVITE_FRIEND = 'inviteFriendToPlaydate',
  PLAYDATE_JOIN = 'joinPlaydate',
  PLAYDATE_OPEN_ZOOM = 'openZoomPlaydate',
  PLAYDATE_DELETE = 'deletePlaydate',
  // MUSIC
  MUSIC_ITEM_CLICKED = 'musicItemClicked',
  MUSIC_ITEM_ADD_TO_FAVORITES = 'musicItemAddToFavorites',
  // LIBRARY
  LIBRARY_VIDEO_CLICKED = 'libraryVideoClicked',
  LIBRARY_ADD_VIDEO_TO_FAVORITES = 'libraryItemAddToFavorites'
}
