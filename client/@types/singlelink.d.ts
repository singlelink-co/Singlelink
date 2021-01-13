interface Link {
  id: string,
  sortOrder: number,
  label: string,
  subtitle: string,
  customCss: string,
  url: string,
  useDeepLink: boolean
}

interface Theme {
  id: string,
  label: string,
  global: boolean,
  colors: {
    fill: {
      primary: string,
      secondary: string
    },
    text: {
      primary: string,
      secondary: string
    }
  },
  customHtml: string | undefined,
  customCss: string | undefined
}

interface Profile {
  themeId: string,
  customHtml: string,
  customCss: string,
  imageUrl: string,
  headline: string,
  handle: string,
  subtitle: string,
  visibility: string,
  showWatermark: boolean
}

interface LinkVisit {
  link: any,
  views: any
}
