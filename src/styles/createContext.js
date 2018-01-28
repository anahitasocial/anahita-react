import { create } from 'jss'
import preset from 'jss-preset-default'
import { SheetsRegistry } from 'react-jss/lib/jss'
import { createMuiTheme } from 'material-ui/styles'
import createGenerateClassName from 'material-ui/styles/createGenerateClassName'
import { blue, red } from 'material-ui/colors'

const theme = createMuiTheme({
  palette: {
    primary: blue,
    error: red,
  }
})

const jss = create(preset());
jss.options.createGenerateClassName = createGenerateClassName;

export const sheetsManager: Map<*, *> = new Map()

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
