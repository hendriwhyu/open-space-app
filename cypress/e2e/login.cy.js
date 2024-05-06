/**
 * - Login spec
 *   - should display login page correctly
 *   - should display alert when username is empty
 *   - should display alert when password is empty
 *   - should display alert when username and password are wrong
 *   - should display homepage when username and password are correct
 */

describe('Login spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
  });
  it('should display login page correctly', () => {
    // verified element showed on login page
    cy.get('input[placeholder="Username"]').should('be.visible');
    cy.get('input[placeholder="Password"]').should('be.visible');
    cy.get('button')
      .contains(/^Login$/)
      .should('be.visible');
  });
  it('should display alert when username is empty', () => {
    // click login button without typing username
    cy.get('button')
      .contains(/^Login$/)
      .click();

    // verified window alert for show message from API
    cy.on('window:alert', (str) => {
      expect(str).to.equal('"id" is not allowed to be empty');
    });
  });
  it('should display alert when password is empty', () => {
    // fill username
    cy.get('input[placeholder="Username"]').type('testuser');

    // click button login without password
    cy.get('button')
      .contains(/^Login$/)
      .click();

    // verified window alert for show message from API
    cy.on('window:alert', (str) => {
      expect(str).to.equal('"password" is not allowed to be empty');
    });
  });
  it('should display alert when username and password are wrong', () => {
    // fill username
    cy.get('input[placeholder="Username"]').type('testuser');

    // fill wrong password
    cy.get('input[placeholder="Password"]').type('wrong_password');

    // click button login
    cy.get('button')
      .contains(/^Login$/)
      .click();

    // verified window alert for show message from API
    cy.on('window:alert', (str) => {
      expect(str).to.equal('User Id or password is wrong');
    });
  });
  it('should display homepage when username and password are correct', () => {
    // fill username
    cy.get('input[placeholder="Username"]').type('testuser');

    // fill password
    cy.get('input[placeholder="Password"]').type('test123456');

    // click button login
    cy.get('button').contains(/^Login$/).click();

    // verified element should be on homepage
    cy.get('nav').contains(/^Home$/).should('be.visible');
    cy.get('button').contains('Sign out').should('be.visible');
  });
});
