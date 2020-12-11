interface Link {
  id: string,
  sortOrder: number,
  label: string,
  subtitle: string,
  customCss: string,
  url: string,
  useDeepLink: boolean
}

interface Profile {
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
