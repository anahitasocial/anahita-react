import { create } from 'jss'
import preset from 'jss-preset-default'
import { SheetsRegistry } from 'react-jss/lib/jss'
import { createMuiTheme } from '@material-ui/core/styles'
import createGenerateClassName from '@material-ui/core/styles/createGenerateClassName'
import { red } from '@material-ui/core/colors'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: '#098ED1',
    },
    error: red,
  }
})

const jss = create(preset());
jss.options.createGenerateClassName = createGenerateClassName;

export const sheetsManager: Map<*, *> = new Map();

export default function createContext() {
  return {
    jss,
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager,
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry()
  }
}
