const fs = require('fs');

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const site = 'https://cuferrous.github.io/Ferrous';
const data = JSON.parse(fs.readFileSync('data/journal.json', 'utf8'));

const items = data.entries.map(e => {
  const link = e.link && e.link !== '#' ? e.link : `${site}/journal.html`;
  const parsed = new Date(e.date);
  const pubDate = isNaN(parsed) ? new Date().toUTCString() : parsed.toUTCString();

  return `
    <item>
      <title>${escapeXml(e.title)}</title>
      <description><![CDATA[${e.description}]]></description>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${pubDate}</pubDate>
    </item>`;
}).join('');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Ferrous Journal</title>
    <link>${site}/journal.html</link>
    <description>Journal entries from Ferrous</description>
${items}
  </channel>
</rss>
`;

fs.writeFileSync('feed.xml', xml);
console.log('feed.xml generated');
