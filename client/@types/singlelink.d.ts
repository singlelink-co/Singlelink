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

interface Addon {
  id: string,
  userId: string,
  resourceId: string,
  type: AddonType,
  description: string,
  author: string,
  tags: string[],
  featuredSorting: number,
  price: number,
  paymentFrequency: string,
  global: boolean,
  version: string,
  createdOn: string,
  lastUpdated: string
}

type AddonType = 'theme' | 'preset' | 'plugin';

interface AddonInstall {
  id: string,
  profileId: string,
  addonId: string,
  createdOn: string
}
© 2021 GitHub, Inc.