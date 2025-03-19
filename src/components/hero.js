class HeroComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = this.getTemplate();
  }

  getTemplate() {
    return `
        <section id="hero" class="hero">
          <div class="hero-container">
            <!--<img src="asteroid.png"></img>-->
            <rotating-image src="moon.jpg"></rotating-image>
          </div>
        </section>
      `;
  }
}

customElements.define('hero-component', HeroComponent);
