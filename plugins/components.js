import Vue from 'vue'

import Page from '@/components/cms/page/Page.vue'
import CircularCard from '@/components/ui/cards/CircularCard.vue'
import SquaredCard from '@/components/ui/cards/SquaredCard.vue'
import FlatCard from '@/components/ui/cards/FlatCard.vue'
import CmsSectionTitle from '@/components/cms/titles/CmsSectionTitle.vue'
import CmsHeader from '@/components/cms/header/CmsHeader.vue'
import CmsButton from '@/components/cms/buttons/CmsButton.vue'
import CmsContainer from '@/components/cms/containers/CmsContainer.vue'
import CmsForumList from '@/components/cms/forum/CmsForumList.vue'
import GenericCarousel from '@/components/cms/carousel/GenericCarousel.vue'
import CmsVideoCard from '@/components/cms/cards/CmsVideoCard.vue'
import CmsMaterials from '@/components/cms/forum/CmsMaterials.vue'
import CmsTitleModule from '@/components/ui/titles/CmsTitleModule.vue'
import CmsActivityCard from '@/components/cms/cards/CmsActivityCard.vue'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'

Vue.component('page', Page)
Vue.component('circular-card', CircularCard)
Vue.component('squared-card', SquaredCard)
Vue.component('generic-carousel', GenericCarousel)
Vue.component('cms-video-card', CmsVideoCard)
Vue.component('cms-section-title', CmsSectionTitle)
Vue.component('cms-container', CmsContainer)
Vue.component('cms-header', CmsHeader)
Vue.component('cms-button', CmsButton)
Vue.component('cms-forum-list', CmsForumList)
Vue.component('cms-materials', CmsMaterials)
Vue.component('cms-activity-card', CmsActivityCard)
Vue.component('flat-card', FlatCard)
Vue.component('CmsTitleModule', CmsTitleModule)
Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker)
