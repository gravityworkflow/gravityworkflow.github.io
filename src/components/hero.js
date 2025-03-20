class HeroComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = this.getTemplate();
  }

  getTemplate() {
    return `
        <section id="hero" class="hero">
          <div class="hero-container">
            <rotating-image src="images/moon.jpg"></rotating-image>
          </div>
        </section>
      `;
  }
}

customElements.define('hero-component', HeroComponent);
