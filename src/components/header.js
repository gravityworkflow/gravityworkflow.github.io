class HeaderComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
              <header class="header">
                <a href="./index.html" class="logo">
                    <img src="/gravity_workflow_logo.png" alt="logo"/>
                </a>
                <hamburger-component></hamburger-component>
            </header>
          `;
  }
}
customElements.define('header-component', HeaderComponent);
