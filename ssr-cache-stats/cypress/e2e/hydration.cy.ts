import "cypress-localstorage-commands";

describe("hydration success", () => {
  let spyError: ReturnType<Cypress.Chainable["spy"]>;
  let spyWarn: ReturnType<Cypress.Chainable["spy"]>;

  beforeEach(() => {
    spyError = cy.spy(window.console, "error");
    spyWarn = cy.spy(window.console, "warn");
  });

  afterEach(() => {
    expect(spyError).not.to.be.called;
    expect(spyWarn).not.to.be.called;
  });

  it("no react hydration errors", () => {
    cy.visit("http://localhost:8080");

    const links = [
      { url: "http://localhost:8080/", testId: "reload-index" },
      { url: "http://localhost:8080/overfetch", testId: "reload-overfetch" },
      { url: "http://localhost:8080/underfetch", testId: "reload-underfetch" },
      { url: "http://localhost:8080/", testId: "next-index" },
      { url: "http://localhost:8080/overfetch", testId: "next-overfetch" },
      { url: "http://localhost:8080/underfetch", testId: "next-underfetch" },
    ];

    for (let ii = 0; ii < links.length; ii++) {
      const { url: url1, testId: testId1 } = links[ii];
      for (let jj = ii; jj < links.length; jj++) {
        const { url: url2, testId: testId2 } = links[jj];
        cy.wait(750); // if we don't wait, the clicks cancel previous loads
        cy.get(`[data-testid=${testId1}]`).click();
        cy.url().should("equal", url1);

        cy.wait(750);
        cy.get(`[data-testid=${testId2}]`).click();
        cy.url().should("equal", url2);
      }

      cy.wait(750);
      cy.get(`[data-testid=${testId1}]`).click();
      cy.url().should("equal", url1);
    }
  });

  it("no client side loading impressions", () => {
    cy.visit("http://localhost:8080");
    cy.get("[data-testid=loading-impressions]").contains(/^0 /);
    cy.get("[data-testid=cache-misses]").contains(/^0 /);

    cy.get("[data-testid=next-underfetch").click();
    cy.wait(750);
    cy.get("[data-testid=loading-impressions]").contains(/^0 /);
    cy.get("[data-testid=cache-misses]").contains(/^0 /);

    cy.visit("http://localhost:8080/underfetch");
    cy.wait(750);
    cy.get("[data-testid=next-index").click();
    cy.wait(750);
    cy.get("[data-testid=loading-impressions]").contains(/^0 /);
    cy.get("[data-testid=cache-misses]").contains(/^0 /);
    cy.get("[data-testid=next-underfetch").click();
    cy.wait(750);
    cy.get("[data-testid=loading-impressions]").contains(/^0 /);
    cy.get("[data-testid=cache-misses]").contains(/^0 /);

    // test SSR with each page type doesn't cause a hydration error
    cy.visit("http://localhost:8080/pagetypes?defaultPageType=SSR");
    cy.visit("http://localhost:8080/pagetypes?defaultPageType=CSR");
    cy.visit("http://localhost:8080/pagetypes?defaultPageType=SSG");
  });

  it("no hydration errors", () => {
    cy.visit("http://localhost:8080/pagetypes?defaultPageType=SSR");
    cy.visit("http://localhost:8080/pagetypes?defaultPageType=CSR");
    cy.visit("http://localhost:8080/pagetypes?defaultPageType=SSG");
  });
});

describe("test disabled local storage", () => {
  let spyError: ReturnType<Cypress.Chainable["spy"]>;
  let spyWarn: ReturnType<Cypress.Chainable["spy"]>;

  beforeEach(() => {
    spyError = cy.spy(window.console, "error");
    spyWarn = cy.spy(window.console, "warn");
    cy.disableLocalStorage();
  });

  afterEach(() => {
    expect(spyError).not.to.be.called;
    expect(spyWarn).not.to.be.called;
  });

  it("no errors", () => {
    cy.visit("http://localhost:8080");
    cy.visit("http://localhost:8080/overfetch");
    cy.visit("http://localhost:8080/underfetch");
  });
});
