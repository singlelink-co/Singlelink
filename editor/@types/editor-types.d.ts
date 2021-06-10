type ModalIntent = "create" | "edit";

interface LinkVisit {
  link: any,
  views: any
}

type EditorProfile = Partial<Profile> & {
  themeId: string,
  customHtml: string,
  customCss: string,
  imageUrl: string,
  headline: string,
  handle: string,
  subtitle: string,
  visibility: string,
  showWatermark: boolean
};

type EditorTheme = Partial<Theme> & {
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
};

type EditorLink = Partial<Link> & {
  id: string,
  sortOrder: number,
  label: string,
  subtitle: string,
  customCss: string,
  url: string,
  useDeepLink: boolean
};
