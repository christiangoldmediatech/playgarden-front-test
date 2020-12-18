import Vue from 'vue'

// Videoplayers
import PgVideoJsPlayer from '@/components/pg-video-js-player/PgVideoJsPlayer.vue'
import PgInlineVideoPlayer from '@/components/pg-video-js-player/PgInlineVideoPlayer.vue'
import PgOnboardingVideoPlayer from '@/components/pg-video-js-player/PgOnboardingVideoPlayer.vue'
import VideoPlayerDialog from '@/components/pg-video-js-player/VideoPlayerDialog.vue'

// Global PG Components
import PgCircleLetterDay from '@/components/pg/components/PgCircleLetterDay.vue'
import PgLoading from '@/components/pg/components/PgLoading.vue'
// import PgPagination from '@/components/pg/components/PgPagination.vue'
import PgSocialButtons from '@/components/pg/components/PgSocialButtons.vue'

// Pg Admin Table
import PgAdminDataTable from '@/components/pg/components/data-table/PgAdminDataTable.vue'

// PG Form Input Controls
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

// Other global components
import FileUploader from './file-uploader/FileUploader'
import NotifyEvent from './NotifyEvent'
import PromptDialog from './PromptDialog'
import UnderlinedTitle from './UnderlinedTitle'

Vue.component(FileUploader.name, FileUploader)
Vue.component(NotifyEvent.name, NotifyEvent)
Vue.component(PromptDialog.name, PromptDialog)
Vue.component(UnderlinedTitle.name, UnderlinedTitle)

Vue.component(PgVideoJsPlayer.name, PgVideoJsPlayer)
Vue.component(PgInlineVideoPlayer.name, PgInlineVideoPlayer)
Vue.component(PgOnboardingVideoPlayer.name, PgOnboardingVideoPlayer)
Vue.component(VideoPlayerDialog.name, VideoPlayerDialog)

Vue.component(PgCircleLetterDay.name, PgCircleLetterDay)
Vue.component(PgLoading.name, PgLoading)
// Vue.component(PgPagination.name, PgPagination)
Vue.component(PgSocialButtons.name, PgSocialButtons)

Vue.component(PgAdminDataTable.name, PgAdminDataTable)

Vue.component(PgFileInput.name, PgFileInput)
Vue.component(PgPasswordField.name, PgPasswordField)
Vue.component(PgSelect.name, PgSelect)
Vue.component(PgTextarea.name, PgTextarea)
Vue.component(PgTextField.name, PgTextField)
Vue.component(PgTiptapField.name, PgTiptapField)

Vue.component(PgDataFooter.name, PgDataFooter)
Vue.component(PgDataIterator.name, PgDataIterator)
Vue.component(PgDataTable.name, PgDataTable)
