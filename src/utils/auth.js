import storage from "store"

const prefix = "52Tyre-Admin-"

const TokenKey = `${prefix}Token`

const ThemeColorKey = `${prefix}ThemeColor`

const PageStyleKey = `${prefix}PageStyle`

const NavigationModeKey = `${prefix}NavigationMode`

const FirstLoginKey = `${prefix}FirstLogin`

export function getToken() {
  return storage.get(TokenKey)
}

export function setToken(token) {
  storage.set(TokenKey, token)
}

export function removeToken() {
  return storage.remove(TokenKey)
}

export function getThemeColor() {
  return storage.get(ThemeColorKey)
}

export function setThemeColor(themecolor) {
  storage.set(ThemeColorKey, themecolor)
}

export function removeThemeColor() {
  return storage.remove(ThemeColorKey)
}

export function getPageStyle() {
  return storage.get(PageStyleKey)
}

export function setPageStyle(pagestyle) {
  storage.set(PageStyleKey, pagestyle)
}

export function removePageStyle() {
  return storage.remove(PageStyleKey)
}

export function getNavigationMode() {
  return storage.get(NavigationModeKey)
}

export function setNavigationMode(navigationmode) {
  storage.set(NavigationModeKey, navigationmode)
}

export function removeNavigationMode() {
  return storage.remove(NavigationModeKey)
}

export function getFirstLogin() {
  return storage.get(FirstLoginKey)
}

export function setFirstLogin(firstlogin) {
  storage.set(FirstLoginKey, firstlogin)
}

export function removeFirstLogin() {
  return storage.remove(FirstLoginKey)
}
