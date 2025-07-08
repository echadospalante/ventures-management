Feature: Login

  Scenario:  Login with valid credentials
    Given I am a registered user
    When I login with my Google account
    Then  I should get a 200 status code, and redirected to the dashboard