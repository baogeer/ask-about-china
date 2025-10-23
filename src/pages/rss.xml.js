import rss from '@astrojs/rss'
import {getCollection} from 'astro:content'

export async function GET(context) {
    const blog = await getCollection('blog')
    return rss({
        title: 'Ask China',
        description:
            "Questions about China? Go to Ask China. Discover a real China with Ask China, a global Q&A community connecting you with the experts on China.",
        site: context.site,
        items: blog.map((post) => ({
            title: post.data.title,
            pubDate: post.data.pubDate,
            description: post.data.description,
            link: `/ask-china/${post.id.replace('.md', '')}/`,
        })),
    })
}
