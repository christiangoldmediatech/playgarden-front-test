import Vue from 'vue'

// Videoplayers
import PgVideoJsPlayer from '@/components/pg-video-js-player/PgVideoJsPlayer.vue'
import PgInlineVideoPlayer from '@/components/pg-video-js-player/PgInlineVideoPlayer.vue'
import VideoPlayerDialog from '@/components/pg-video-js-player/VideoPlayerDialog.vue'

// New video player
import PgVideoPlayer from '@gold-media-tech/pg-video-player'

// Audio Players
import PgAudioPlayer from '@/components/pg-audio-player/PgAudioPlayer.vue'

// Global PG Components
import PgCircleLetterDay from '@/components/pg/components/PgCircleLetterDay.vue'
import PgFileUploader from '@/components/pg/components/file-uploader/PgFileUploader.vue'
import PgIcsCalendar from '@/components/pg/components/PgIcsCalendar.vue'
import PgLoading from '@/components/pg/components/PgLoading.vue'
import PgSocialButtons from '@/components/pg/components/PgSocialButtons.vue'

// Pg Admin Table
import PgAdminDataTable from '@/components/pg/components/data-table/PgAdminDataTable.vue'

// PG Form Input Controls
import PgAutocomplete from '@/components/pg/components/form-inputs-controls/PgAutocomplete.vue'
import PgFileInput from '@/components/pg/components/form-inputs-controls/PgFileInput.vue'
import PgPasswordField from '@/components/pg/components/form-inputs-controls/PgPasswordField.vue'
import PgSelect from '@/components/pg/components/form-inputs-controls/PgSelect.vue'
import PgTextarea from '@/components/pg/components/form-inputs-controls/PgTextarea.vue'
import PgTextField from '@/components/pg/components/form-inputs-controls/PgTextField.vue'
import PgTiptapField from '@/components/pg/components/form-inputs-controls/PgTiptapField'

// PG Tables
import PgDataFooter from '@/components/pg/components/tables/PgDataFooter.vue'
import PgDataIterator from '@/components/pg/components/tables/PgDataIterator.vue'
import PgDataTable from '@/components/pg/components/tables/PgDataTable.vue'

// Pg Dialogs
import PgDialog from '@/components/pg/components/dialogs/PgDialog.vue'
import PgVideoDialog from '@/components/pg/components/dialogs/PgVideoDialog.vue'

// Other global components
import FileUploader from './file-uploader/FileUploader'
import SelectDropboxFile from './file-uploader/SelectDropboxFile.vue'
import NotifyEvent from './NotifyEvent'
import PromptDialog from './PromptDialog'
import UnderlinedTitle from './UnderlinedTitle'

Vue.component(FileUploader.name, FileUploader)
Vue.component(SelectDropboxFile.name, SelectDropboxFile)
Vue.component(NotifyEvent.name, NotifyEvent)
Vue.component(PromptDialog.name, PromptDialog)
Vue.component(UnderlinedTitle.name, UnderlinedTitle)

Vue.component(PgVideoPlayer.name, PgVideoPlayer)

Vue.component(PgVideoJsPlayer.name, PgVideoJsPlayer)
Vue.component(PgInlineVideoPlayer.name, PgInlineVideoPlayer)
Vue.component(VideoPlayerDialog.name, VideoPlayerDialog)

Vue.component(PgAudioPlayer.name, PgAudioPlayer)

Vue.component(PgCircleLetterDay.name, PgCircleLetterDay)
Vue.component(PgFileUploader.name, PgFileUploader)
Vue.component(PgIcsCalendar.name, PgIcsCalendar)
Vue.component(PgLoading.name, PgLoading)
Vue.component(PgSocialButtons.name, PgSocialButtons)

Vue.component(PgAdminDataTable.name, PgAdminDataTable)

// PG Form Input Controls
Vue.component(PgAutocomplete.name, PgAutocomplete)
Vue.component(PgFileInput.name, PgFileInput)
Vue.component(PgPasswordField.name, PgPasswordField)
Vue.component(PgSelect.name, PgSelect)
Vue.component(PgTextarea.name, PgTextarea)
Vue.component(PgTextField.name, PgTextField)
Vue.component(PgTiptapField.name, PgTiptapField)

// PG Dialogs
Vue.component(PgDialog.name, PgDialog)
Vue.component(PgVideoDialog.name, PgVideoDialog)

// PG Tables
Vue.component(PgDataFooter.name, PgDataFooter)
Vue.component(PgDataIterator.name, PgDataIterator)
Vue.component(PgDataTable.name, PgDataTable)
