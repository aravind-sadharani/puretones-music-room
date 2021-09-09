const path = require('path');
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `Mdx`) {
    const slug = createFilePath({ node, getNode })
    createNodeField({
      node,
      name: `slug`,
      value: `/learn${slug}`,
    })
  }
}

exports.createPages = async ({ graphql, actions, reporter }) => {
    const {createPage} = actions
    const result = await graphql(`
        query PostQuery {
            allMdx(
                filter: {fileAbsolutePath: {regex: "/posts/"}}
                sort: { fields: [frontmatter___date, frontmatter___title], order: [ASC, ASC] }
            ) {
                tags: group(field: frontmatter___tags) {
                    totalCount
                    fieldValue
                }
                categories: group(field: frontmatter___category) {
                    totalCount
                    fieldValue
                }
                edges {
                    node {
                        fileAbsolutePath
                        frontmatter {
                            title
                        }
                        fields {
                            slug
                        }
                    }
                }
            }
        }      
    `)

    if (result.errors) {
        reporter.panicOnBuild('ERROR: Loading PostQuery for createPages')
    }

    let posts = result.data.allMdx.edges
    posts.forEach(({ node }, index) => {
        let prev, next = null
        prev = index === 0 ? null: posts[index-1].node
        next = index === posts.length - 1 ? null: posts[index+1].node
        createPage({
            path: node.fields.slug,
            component: path.resolve(`./src/layouts/post-layout.js`),
            context: {
                slug: node.fields.slug,
                prev,
                next,
            },
        })
    })

    let postsPerPage = 6
    let numPages = Math.ceil(posts.length/postsPerPage)
    Array.from({length: numPages}).forEach((_, index) => {
        createPage({
            path: index === 0 ? `/learn/` : `/learn/${index+1}`,
            component: path.resolve(`./src/layouts/index-layout.js`),
            context: {
                limit: postsPerPage,
                skip: index*postsPerPage,
                numPages,
                currentPage: index+1,
            },
        })
    })

    let categories = result.data.allMdx.categories
    createPage({
        path: `/learn/categories/`,
        component: path.resolve(`./src/layouts/category-index-layout.js`),
        context: {
            categories: categories,
        }
    })
    categories.forEach((category) => {
        const {fieldValue} = category
        const categoryPath = fieldValue.replace(/ /g, '_').replace(/\//g,'by')
        createPage({
            path: `/learn/categories/${categoryPath}`,
            component: path.resolve(`./src/layouts/category-layout.js`),
            context: {
                category: fieldValue,
            }
        })
    })

    let tags = result.data.allMdx.tags
    createPage({
        path: `/learn/tags/`,
        component: path.resolve(`./src/layouts/tag-index-layout.js`),
        context: {
            tags: tags,
        }
    })
    tags.forEach((tag) => {
        const {fieldValue} = tag
        const tagPath = fieldValue.replace(/ /g, '_').replace(/\//g,'by')
        createPage({
            path: `/learn/tags/${tagPath}`,
            component: path.resolve(`./src/layouts/tag-layout.js`),
            context: {
                tag: fieldValue,
            }
        })
    })
}

exports.onCreateWebpackConfig = ({ actions }) => {
    actions.setWebpackConfig({
        resolve: {
            modules: [path.resolve(__dirname, "src"), "node_modules"],
        },
        module: {
            rules: [
                { test: /\.dsp$/, use: 'raw-loader' },
                { test: /\.prt$/, use: 'raw-loader' },
                { test: /\.pkb$/, use: 'raw-loader' },
            ],
        }
    })
}