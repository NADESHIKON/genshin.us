module.exports = {
    swcMinify: true,
    images: {
        domains: ['asset.genshin.us', 'assets.genshin.us'],
        loader: 'custom',
        path: 'https://asset.genshin.us/'
    },
    experimental: {
        nftTracing: true
    }
}