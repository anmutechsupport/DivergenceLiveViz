import _ from 'lodash';
import {
  colors,
  createMuiTheme,
  responsiveFontSizes
} from '@material-ui/core';
// import { Theme as MuiTheme } from '@material-ui/core/styles/createMuiTheme'; // this is typescript stuff, look into this
// import { Shadows as MuiShadows } from '@material-ui/core/styles/shadows';
// import {
//   Palette as MuiPalette,
//   PaletteColor,
//   TypeBackground as MuiTypeBackground
// } from '@material-ui/core/styles/createPalette';
import { THEMES } from '../constants';
import { softShadows, strongShadows } from './shadows';
import typography from './typography';

// interface TypeBackground extends MuiTypeBackground {
//   dark: string;
//   black: string;
//   select: string;
//   secondary: string;
// }

// interface Palette extends MuiPalette {
//   background: TypeBackground;
//   default: PaletteColor;
// }

// export interface Theme extends MuiTheme {
//   name: string;
//   palette: Palette;
// }

// type Direction = 'ltr' | 'rtl';

// interface ThemeConfig {
//   direction?: Direction;
//   responsiveFontSizes?: boolean;
//   theme?: string;
// }

// interface ThemeOptions {
//   name?: string;
//   direction?: Direction;
//   typography?: Record<string, any>;
//   overrides?: Record<string, any>;
//   palette?: Record<string, any>;
//   shadows?: MuiShadows;
// }

const baseOptions = {
  direction: 'ltr',
  typography,
  overrides: {
    MuiLinearProgress: {
      root: {
        borderRadius: 3,
        overflow: 'hidden'
      }
    },
    MuiListItemIcon: {
      root: {
        minWidth: 32
      }
    },
    MuiChip: {
      root: {
        backgroundColor: 'rgba(0,0,0,0.075)'
      }
    }
  }
};

const themesOptions = [
  {
    name: THEMES.LIGHT,
    overrides: {
      MuiInputBase: {
        input: {
          '&::placeholder': {
            opacity: 1,
            color: colors.blueGrey[600]
          }
        }
      }
    },
    palette: {
      type: 'light',
      action: {
        active: colors.blueGrey[600]
      },
      background: {
        default: colors.common.white,
        secondary: '#EDF0F2',
        dark: '#f4f6f8',
        paper: colors.common.white,
        black: '#000000',
        select: '#F8F1FF',
      },
      default: {
        main: '#000000',
      },
      primary: {
        main: '#773DFF',
      },
      secondary: {
        main: '#773DFF'
      },
      text: {
        primary: colors.blueGrey[900],
        secondary: colors.blueGrey[600]
      }
    },
    shadows: softShadows
  },
  {
    name: THEMES.ONE_DARK,
    palette: {
      type: 'dark',
      action: {
        active: 'rgba(255, 255, 255, 0.54)',
        hover: 'rgba(255, 255, 255, 0.04)',
        selected: 'rgba(255, 255, 255, 0.08)',
        disabled: 'rgba(255, 255, 255, 0.26)',
        disabledBackground: 'rgba(255, 255, 255, 0.12)',
        focus: 'rgba(255, 255, 255, 0.12)'
      },
      background: {
        default: '#282C34',
        secondary: '#212534',
        dark: '#1c2025',
        paper: '#282C34',
        select: '#080100'
      },
      default: {
        main: '#FFFFFF',
      },
      primary: {
        main: '#8a85ff'
      },
      secondary: {
        main: '#8a85ff'
      },
      text: {
        primary: '#e6e5e8',
        secondary: '#adb0bb'
      }
    },
    shadows: strongShadows
  },
  {
    name: THEMES.UNICORN,
    palette: {
      type: 'dark',
      action: {
        active: 'rgba(255, 255, 255, 0.54)',
        hover: 'rgba(255, 255, 255, 0.04)',
        selected: 'rgba(255, 255, 255, 0.08)',
        disabled: 'rgba(255, 255, 255, 0.26)',
        disabledBackground: 'rgba(255, 255, 255, 0.12)',
        focus: 'rgba(255, 255, 255, 0.12)'
      },
      background: {
        default: '#2a2d3d',
        dark: '#222431',
        paper: '#2a2d3d',
        select: '#282122'
      },
      default: {
        main: '#FFFFFF',
      },
      primary: {
        main: '#a67dff'
      },
      secondary: {
        main: '#a67dff'
      },
      text: {
        primary: '#f6f5f8',
        secondary: '#9699a4'
      }
    },
    shadows: strongShadows
  }
];

export const createTheme = (config = {}) => { // dont think config is supposed to be an empty dict
  let themeOptions = themesOptions.find((theme) => theme.name === config.theme);

  if (!themeOptions) {
    console.warn(new Error(`The theme ${config.theme} is not valid`));
    [themeOptions] = themesOptions;
  }

  let theme = createMuiTheme(
    _.merge(
      {},
      baseOptions,
      themeOptions,
      { direction: config.direction },
    )
  );

  if (config.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
}
