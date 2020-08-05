<template>
  <span>
    <span class="v-label theme--light">{{ label }}</span>

    <tiptap-vuetify
      v-model="input"
      v-bind="$attrs"
      class="elevation-1 mb-6 mt-3"
      :extensions="extensions"
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
    label: {
      type: String,
      default: ''
    },

    value: {
      type: [String, Number, Object],
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
