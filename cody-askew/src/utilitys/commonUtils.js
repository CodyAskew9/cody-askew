import Home from "../components/Home/Home";
import Resume from "../components/Resume/Resume";
import ContactMe from "../components/ContactMe/ContactMe";

export const TOTAL_SCREENS = [
    {
        screen_name:"Home",
        component: Home,
    },
    {
        screen_name:"Resume",
        component: Resume,
    },
  {
    screen_name: "ContactMe",
    component: ContactMe,
  },
]
export const GET_SCREEN_INDEX = (screen_name) => {
    if (!screen_name) return-1
    for (let i = 0; i < TOTAL_SCREENS.length; i++){
    if (TOTAL_SCREENS[i].screen_name === screen_name) return i
    }
    return -1
}