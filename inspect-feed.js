/**
 * Script para inspeccionar el contenido RAW de un feed RSS
 * y ver qué metadatos de imagen están disponibles
 */

const RSSParser = require('rss-parser');

async function inspectFeed() {
    try {
        const parser = new RSSParser({
            customFields: {
                item: [
                    ['media:content', 'mediaContent'],
                    ['media:thumbnail', 'mediaThumbnail'],
                    ['enclosure', 'enclosure'],
                    ['content:encoded', 'contentEncoded']
                ]
            }
        });

        console.log('🔍 Inspeccionando feed de Forbes...\n');

        const feed = await parser.parseURL('https://www.forbes.com/business/feed/');

        console.log(`📰 Feed: ${feed.title}`);
        console.log(`📊 Total de items: ${feed.items.length}\n`);

        // Inspeccionar los primeros 2 items
        for (let i = 0; i < Math.min(2, feed.items.length); i++) {
            const item = feed.items[i];
            console.log('='.repeat(80));
            console.log(`ARTÍCULO ${i + 1}:`);
            console.log(`Título: ${item.title}`);
            console.log(`Link: ${item.link}\n`);

            console.log('CAMPOS DISPONIBLES:');
            console.log(JSON.stringify(Object.keys(item), null, 2));

            console.log('\nMETADATOS DE IMAGEN:');
            console.log('  media:content:', item.mediaContent);
            console.log('  media:thumbnail:', item.mediaThumbnail);
            console.log('  enclosure:', item.enclosure);

            console.log('\nCONTENIDO (primeros 500 caracteres):');
            const content = item.content || item.contentEncoded || item['content:encoded'] || item.contentSnippet || '';
            console.log(content.substring(0, 500));
            console.log('\n');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

inspectFeed();
