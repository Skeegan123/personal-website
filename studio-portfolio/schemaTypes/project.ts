import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'media', title: 'Media'},
    {name: 'links', title: 'Links'},
    {name: 'meta', title: 'Meta'},
  ],
  fields: [
    // ── Content ──────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'A short one-liner shown on project cards and the hero section.',
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'content',
      description: 'Rich long-form write-up of the project. Supports headings, lists, links, images, and code blocks.',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
              {title: 'Code', value: 'code'},
              {title: 'Underline', value: 'underline'},
              {title: 'Strikethrough', value: 'strike-through'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {name: 'href', type: 'url', title: 'URL'},
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: true,
                  },
                ],
              },
            ],
          },
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
        },
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt text',
              description: 'Describe this image for accessibility.',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
        {
          name: 'codeBlock',
          title: 'Code Block',
          type: 'object',
          fields: [
            {
              name: 'language',
              title: 'Language',
              type: 'string',
              options: {
                list: [
                  {title: 'JavaScript', value: 'javascript'},
                  {title: 'TypeScript', value: 'typescript'},
                  {title: 'Python', value: 'python'},
                  {title: 'Swift', value: 'swift'},
                  {title: 'Ruby', value: 'ruby'},
                  {title: 'HTML', value: 'html'},
                  {title: 'CSS', value: 'css'},
                  {title: 'JSON', value: 'json'},
                  {title: 'Bash', value: 'bash'},
                  {title: 'SQL', value: 'sql'},
                  {title: 'Other', value: 'text'},
                ],
              },
            },
            {
              name: 'code',
              title: 'Code',
              type: 'text',
              rows: 10,
            },
            {
              name: 'filename',
              title: 'Filename',
              type: 'string',
              description: 'Optional filename to display above the code block.',
            },
          ],
          preview: {
            select: {title: 'filename', subtitle: 'language'},
            prepare({title, subtitle}) {
              return {
                title: title || 'Code Block',
                subtitle: subtitle || 'code',
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      group: 'content',
      description: 'Your role on this project, e.g. "Lead Developer", "Backend Engineer".',
    }),
    defineField({
      name: 'stack',
      title: 'Tech Stack',
      type: 'array',
      group: 'content',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      description: 'Technologies used. Type and press Enter to add.',
    }),
    defineField({
      name: 'challenges',
      title: 'Challenges',
      type: 'array',
      group: 'content',
      of: [{type: 'string'}],
      description: 'Key challenges encountered during the project.',
    }),
    defineField({
      name: 'learnings',
      title: 'Learnings',
      type: 'array',
      group: 'content',
      of: [{type: 'string'}],
      description: 'Key things learned from the project.',
    }),

    // ── Media ────────────────────────────────────────────────
    defineField({
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
        },
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'media',
      description: 'Additional screenshots or images to showcase the project.',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
    }),

    // ── Links ────────────────────────────────────────────────
    defineField({
      name: 'repoUrl',
      title: 'Repository URL',
      type: 'url',
      group: 'links',
    }),
    defineField({
      name: 'liveUrl',
      title: 'Live URL',
      type: 'url',
      group: 'links',
    }),
    defineField({
      name: 'figmaUrl',
      title: 'Figma URL',
      type: 'url',
      group: 'links',
    }),
    defineField({
      name: 'devpostUrl',
      title: 'Devpost URL',
      type: 'url',
      group: 'links',
    }),

    // ── Meta ─────────────────────────────────────────────────
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
      description: 'Show this project on the homepage.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'date',
      group: 'meta',
      options: {dateFormat: 'YYYY-MM'},
      description: 'When the project was completed or published.',
    }),
  ],
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Title',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'summary',
      media: 'image',
    },
  },
})
