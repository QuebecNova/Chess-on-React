module.exports = {
    async headers() {
        return [
            {
                // matching all API routes
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Credentials', value: 'true' },
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: 'http://hamchess.localhost',
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET,DELETE,PATCH,POST,PUT',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
                    },
                ],
            },
        ]
    },
    webpack(config, options) {
        const { isServer } = options
        config.module.rules.push(
            {
                test: /\.(ogg|mp3|wav|mpe?g)$/i,
                exclude: config.exclude,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            publicPath: `/_next/static/sounds/`,
                            outputPath: `${isServer ? '../' : ''}static/sounds/`,
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            }
        )
        return config
    },
}
