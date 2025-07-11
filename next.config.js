module.exports = {
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
