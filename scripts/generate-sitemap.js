const fs = require('fs');
const { create } = require('xmlbuilder2');

const baseUrl = 'https://www.ethseer.io'; // Replace with your website URL
const pages = ['/', '/epochs', '/slots', '/validators', '/entities']; // Add your website's pages here

const root = create({ version: '1.0' }).ele('urlset', {
  xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
});

pages.forEach((page) => {
  root.ele('url').ele('loc').txt(baseUrl + page);
});

const xml = root.end({ prettyPrint: true });

fs.writeFileSync('public/sitemap.xml', xml);
