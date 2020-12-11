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
  subtitle: string,
  visibility: string
}

interface LinkVisit {
  link: any,
  views: any
}
