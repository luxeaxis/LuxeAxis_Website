// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";
var config_default = defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "posters",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        name: "journal",
        label: "Journal & Architectural Guides",
        path: "content/journal",
        format: "md",
        ui: {
          router: ({ document }) => {
            return `/journal/${document._sys.filename}`;
          }
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Article Title",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "slug",
            label: "URL Slug",
            required: true
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            options: [
              "Vastu Engineering",
              "Material Science",
              "Pricing Transparency",
              "NRI Remote",
              "Spatial Design",
              "Chennai Living"
            ],
            required: true
          },
          {
            type: "datetime",
            name: "date",
            label: "Publication Date",
            ui: {
              dateFormat: "MMM YYYY"
            }
          },
          {
            type: "string",
            name: "readTime",
            label: "Reading Time (e.g. 6 min read)"
          },
          {
            type: "string",
            name: "excerpt",
            label: "Summary / Excerpt",
            ui: {
              component: "textarea"
            },
            required: true
          },
          {
            type: "image",
            name: "image",
            label: "Cover Image"
          },
          {
            type: "boolean",
            name: "featured",
            label: "Featured Spotlight Article"
          },
          {
            type: "object",
            name: "author",
            label: "Author Details",
            fields: [
              {
                type: "string",
                name: "name",
                label: "Author Name"
              },
              {
                type: "string",
                name: "role",
                label: "Role / Designation"
              }
            ]
          },
          {
            type: "rich-text",
            name: "body",
            label: "Article Body",
            isBody: true
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
