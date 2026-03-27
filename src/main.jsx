import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import cssText from './App.css?inline'

class LuscherTest extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return

    const shadow = this.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = cssText
    shadow.appendChild(style)

    // React mount point
    const container = document.createElement('div')
    container.className = 'luscher-root'
    shadow.appendChild(container)

    createRoot(container).render(
      <StrictMode>
        <App />
      </StrictMode>
    )
  }
}

customElements.define('luscher-test', LuscherTest)
