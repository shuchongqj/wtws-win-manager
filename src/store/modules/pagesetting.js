import {
  getThemeColor,
  setThemeColor,
  getPageStyle,
  setPageStyle,
  getNavigationMode,
  setNavigationMode
} from "@/utils/auth"
import { PageSetting } from "@/config"

const pagesetting = {
  state: {
    themecolor: getThemeColor() || PageSetting.primaryColor,
    pagestyle: getPageStyle() || PageSetting.pageStyle,
    navigationmode: getNavigationMode() || PageSetting.NavigationMode
  },

  mutations: {
    SET_THEMECOLOR: (state, themecolor) => {
      state.themecolor = themecolor
      setThemeColor(themecolor)
    },
    SET_PAGESTYLE: (state, pagestyle) => {
      state.pagestyle = pagestyle
      setPageStyle(pagestyle)
    },
    SET_NAVIGATIONMODE: (state, navigationmode) => {
      state.navigationmode = navigationmode
      setNavigationMode(navigationmode)
    }
  },

  actions: {
    ToggleThemeColor({ commit }, themecolor) {
      commit("SET_THEMECOLOR", themecolor)
    },
    TogglePageStyle({ commit }, pagestyle) {
      commit("SET_PAGESTYLE", pagestyle)
    },
    ToggleNavigationMode({ commit }, navigationmode) {
      commit("SET_NAVIGATIONMODE", navigationmode)
    }
  }
}

export default pagesetting
