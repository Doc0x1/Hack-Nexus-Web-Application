import { Rubik, Inter, Merriweather, JetBrains_Mono, Open_Sans, Source_Code_Pro } from 'next/font/google';

const rubik = Rubik({
    subsets: ['latin'],
    variable: '--font-rubik'
});

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    weight: ['400', '700']
});

const merriweather = Merriweather({
    subsets: ['latin'],
    variable: '--font-merriweather',
    weight: ['400', '700']
});

const jetBrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains-mono'
});

const openSans = Open_Sans({
    subsets: ['latin'],
    variable: '--font-open-sans',
    display: 'swap'
});

const sourceCodePro = Source_Code_Pro({
    subsets: ['latin'],
    variable: '--font-source-code-pro'
});

export const fonts = {
    rubik,
    inter,
    merriweather,
    jetBrainsMono,
    openSans,
    sourceCodePro
};
