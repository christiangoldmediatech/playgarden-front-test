<template>
  <span>
    <span class="v-label theme--light">{{ label }}</span>

    <tiptap-vuetify
      v-model="input"
      v-bind="$attrs"
      class="mb-6 mt-3"
      :class="{ 'elevation-1': !flat, flat }"
      :editor-properties="{ ...editorProperties, editable: !readonly }"
      :extensions="readonly ? [] : extensions"
      v-on="$listeners"
    />
  </span>
</template>

<script>
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  CodeBlock,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
  Blockquote,
  HardBreak,
  HorizontalRule,
  History,
  Link,
  Image,
  TodoList,
  TodoItem,
  Table,
  TableCell,
  TableHeader,
  TableRow
} from 'tiptap-vuetify'

export default {
  name: 'TiptapField',

  components: {
    TiptapVuetify
  },

  props: {
    editorProperties: {
      type: Object,
      default: () => ({})
    },

    flat: {
      type: [Boolean, Number, String],
      default: false
    },

    label: {
      type: String,
      default: ''
    },

    readonly: {
      type: [Boolean, Number, String],
      default: false
    },

    value: {
      type: [Number, Object, String],
      default: ''
    }
  },

  data: () => ({
    extensions: [
      History,

      // Font mods
      Blockquote,
      Link,
      Underline,
      Strike,
      Italic,
      Bold,
      [
        Heading,
        {
          options: {
            levels: [1, 2, 3, 4, 5, 6]
          }
        }
      ],
      Code,
      CodeBlock,

      // Lists
      ListItem,
      BulletList,
      OrderedList,
      TodoList,
      TodoItem,

      // Others
      Image,
      Table,
      TableCell,
      TableHeader,
      TableRow,
      Paragraph,
      HorizontalRule,
      HardBreak
    ]
  }),

  computed: {
    input: {
      get () {
        return this.value
      },
      set (input) {
        this.$emit('input', input)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.flat ::v-deep {
  .v-card {
    box-shadow: none;
  }
}
</style>
